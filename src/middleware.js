import { NextResponse } from "next/server";
import jwt, { decode } from "jsonwebtoken";
import envConfig from "./lib/envConfig";

export async function middleware(request) {
    const res = NextResponse.next();
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
    
    if(request.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 200,
            headers: res.headers,
        })
    }

    const url = request.nextUrl.pathname;

    if(url === '/api/login' || url === '/api/health') return res;

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

    return res;
}

export const config = {
    matcher: [
        '/api/:path*'
    ]
  }