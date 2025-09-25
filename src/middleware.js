import { NextResponse } from "next/server";
import jwt, { decode } from "jsonwebtoken";
import envConfig from "./lib/envConfig";

export async function middleware(request) {
    const token = request.cookies.get("accessToken")?.value;
    
    if(!token) {
        return NextResponse.json(
            {
                success: false,
                message: "Unauthorized"
            },
            { status: 401 }
        )
    }

    return NextResponse.next();

    // return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
    matcher: [
        '/api/tenants/:path*',
    ]
  }