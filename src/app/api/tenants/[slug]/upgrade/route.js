import dbConnect from "@/lib/dbConnect";
import Tenant from "@/models/Tenant.model";
import { NextResponse } from "next/server";
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

        if(tenant.plan === "pro") {
            return NextResponse.json(
                {
                    success: true,
                    message: "Tenant is already on the Pro plan"
                },
                { status: 200 }
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
                    message: "You're not authorized to upgrade subscription"
                },
                { status: 403 }
            )
        }

        tenant.plan = "pro";
        
        await tenant.save();

        return NextResponse.json(
            { 
                success: true,
                message: "Tenant subscription upgraded successfully"
            },
            { status: 200 }
        )

    } catch (error) {
        console.log("Failed upgrading tenant subscription", error);

        return NextResponse.json(
            { 
                success: false,
                message: "Failed upgrading tenant subscription"
            },
            { status: 500 }
        )
    }
}