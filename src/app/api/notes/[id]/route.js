import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Note from "@/models/Note.model";
import envConfig from "@/lib/envConfig";

export async function GET(request, {params}) {
    const { id } = await params;

    if(!id) {
        return NextResponse.json(
            {
                success: false,
                message: "Note ID is required"
            },
            { status: 400 }
        )
    }

    try {
        await dbConnect();

        const note = await Note.findById(id);

        if(!note) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Note not found"
                },
                { status: 404 }
            )
        }

        const token = await request.cookies.get("accessToken").value;
        
        const decoded = jwt.verify(token, envConfig.tokenSecret);

        const isTenantValid = decoded.tenantId === String(note.tenantId);

        if(!isTenantValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You're not a part of this note's tenant",
                },
                { status: 403 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Note fetched successfully",
                data: note
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("Failed fetching note", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed fetching note"
            },
            { status: 500 }
        )
    }
}

export async function PUT(request, {params}) {
    const { id } = await params;

    if(!id) {
        return NextResponse.json(
            {
                success: false,
                message: "Note ID is required"
            },
            { status: 400 }
        )
    }

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

        const note = await Note.findById(id);

        if(!note) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Note not found"
                },
                { status: 404 }
            )
        }

        const token = await request.cookies.get("accessToken").value;
        
        const decoded = jwt.verify(token, envConfig.tokenSecret);

        const isTenantValid = decoded.tenantId === String(note.tenantId);

        if(!isTenantValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You're not a part of this note's tenant",
                },
                { status: 403 }
            )
        }

        const isTitleChanged = note.title !== title;
        const isContentChanged = note.content !== content;

        if(isTitleChanged) note.title = title;

        if(isContentChanged) note.content = content;

        if(isTitleChanged || isContentChanged){
            await note.save();

            return NextResponse.json(
                {
                    success: true,
                    message: "Note updated successfully",
                },
                { status: 200 }
            )
        }

        return NextResponse.json(
            {
                success: false,
                message: "No Changes detected",
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("Failed updating note", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed updating note"
            },
            { status: 500 }
        )
    }
}

export async function  DELETE(request, {params}) {
    const { id } = await params;

    if(!id) {
        return NextResponse.json(
            {
                success: false,
                message: "Note ID is required"
            },
            { status: 400 }
        )
    }

    try {
        await dbConnect();

        const note = await Note.findById(id);

        if(!note) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Note not found"
                },
                { status: 404 }
            )
        }

        const token = await request.cookies.get("accessToken").value;
        
        const decoded = jwt.verify(token, envConfig.tokenSecret);

        const isTenantValid = decoded.tenantId === String(note.tenantId);

        if(!isTenantValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You're not a part of this note's tenant",
                },
                { status: 403 }
            )
        }

        await note.deleteOne();

        return NextResponse.json(
            {
                success: true,
                message: "Note deleted successfully",
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("Failed deleting note", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed deleting note"
            },
            { status: 500 }
        )
    }
}