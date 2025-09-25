import dbConnect from "@/lib/dbConnect";
import Tenant from "@/models/Tenant.model";
import User from "@/models/User.model";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import envConfig from "@/lib/envConfig";

export async function POST(request, { params }) {
    const {slug} = await params;

    if(!slug){
        return NextResponse.json(
            { 
                success: false,
                message: "Slug is required"
            },
            { status: 400 }
        )
    }

    const {email} = await request.json();

    if(!email) {
        return NextResponse.json(
            { 
                success: false,
                message: "Email is required"
            },
            { status: 404 }
        )
    }

    try {
        await dbConnect();

        const tenant = await Tenant.findOne({slug});
    
        if(!tenant) {
            return NextResponse.json(
                { 
                    success: false,
                    message: "Tenant not found"
                },
                { status: 404 }
            )
        }

        const token = request.cookies.get("accessToken").value;
        
        const decoded = jwt.verify(token, envConfig.tokenSecret);
        
        const isTenantSame = decoded.tenantId === String(tenant._id);

        if(!isTenantSame) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You're not a part of this Tenant"
                },
                { status: 403 }
            ) 
        }

        const isAdmin = decoded.role === "admin";

        if(!isAdmin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You're not authorized to invite a user"
                },
                { status: 403 }
            )
        }

        const existingUser = await User.findOne({email});

        if(existingUser) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: "User with this email already exists in the tenant" 
                },
                { status: 409 }
              );
        }

        const hashedPassword = await bcrypt.hash("password", 10);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            role: "member",
            tenantId: tenant._id
        })

        return NextResponse.json(
            { 
                success: true,
                message: "User invited successfully",
                user: {
                    email: newUser.email,
                    role: newUser.role,
                    tenantId: newUser.tenantId,
                }
            },
            { status: 200 }
        )

    } catch (error) {
        console.log("something went wrong", error);

        return NextResponse.json(
            { 
                success: false,
                message: "Something went wrong"
            },
            { status: 500 }
        )
    }
}