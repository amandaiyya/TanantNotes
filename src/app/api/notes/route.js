import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import envConfig from "@/lib/envConfig";
import dbConnect from "@/lib/dbConnect";
import Note from "@/models/Note.model";
import Tenant from "@/models/Tenant.model";

export async function POST(request) {
    const {title, content} = await request.json();

    if(!title?.trim() || !content?.trim()) {
        return NextResponse.json(
            {
                success: false,
                message: "Title and Content is required"
            },
            { status: 400 }
        )
    }

    try {
        await dbConnect();

        const token = await request.cookies.get("accessToken").value;
        
        const decoded = jwt.verify(token, envConfig.tokenSecret);

        const tenant = await Tenant.findById(decoded.tenantId);

        if(!tenant) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Tenant not found"
                },
                { status: 404 }
            )
        }

        const isTenantUpgraded = tenant.plan === "pro";

        if(!isTenantUpgraded) {
            const noteCount = await Note.countDocuments({tenantId: tenant._id})

            if(noteCount >= 3) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Free plan limit reached, Upgrade to Pro to add more notes"
                    },
                    { status: 403 }
                )
            }
        }

        const newNote = await Note.create({
            title,
            content,
            owner: decoded._id,
            tenantId: decoded.tenantId
        })

        return NextResponse.json(
            {
                success: true,
                message: "Note added successfully",
                newNote
            },
            { status: 201 }
        )

    } catch (error) {
        console.log("Failed adding note", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed adding note"
            },
            { status: 500 }
        )
    }
}

export async function GET(request) {
    try {
        await dbConnect();

        const token = await request.cookies.get("accessToken").value;
        
        const decoded = jwt.verify(token, envConfig.tokenSecret);

        const notes = await Note.find({
            tenantId: decoded.tenantId
        }).sort({ createdAt: -1 })
        
        if(!notes || !notes.length) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Notes not found for the current tenant"
                },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Notes fetched successfully",
                data: notes
            },
            { status: 200 }
        )

    } catch (error) {
        console.log("Failed fetching all notes", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed fetching all notes"
            },
            { status: 500 }
        )
    }
}