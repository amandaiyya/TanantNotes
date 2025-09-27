import User from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { NextResponse } from "next/server";
import envConfig from "@/lib/envConfig";
import Tenant from "@/models/Tenant.model";

export async function POST(req) {
    const {email, password} = await req.json()

    if(!email || !password) {
        return NextResponse.json(
            {
                success: false,
                message: "Credentials are required"
            },
            { status: 400 }
        )
    }

    try {
        await dbConnect();

        const user = await User.findOne({email});

        if(!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            )
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Incorrect Password"
                },
                { status: 400 }
            )
        }

        const tenant = await Tenant.findById(user.tenantId);

        if(!tenant) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Tenant not found"
                },
                { status: 404 }
            )
        }

        const accessToken = jwt.sign(
            {
                _id: user._id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId
            },
            envConfig.tokenSecret,
            { expiresIn: envConfig.tokenExpiry || "1h" }
        )

        const cookieStore = await cookies();

        cookieStore.set("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60
        })

        return NextResponse.json(
            {
                success: true,
                message: "User logged in successfully",
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role
                },
                tenant: {
                    id: tenant._id,
                    name: tenant.name,
                    plan: tenant.plan,
                    slug: tenant.slug
                }
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("Failed logging in user",error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed logging in user"
            },
            { status: 500 }
        )
    }
}