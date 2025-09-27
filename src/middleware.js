import { NextResponse } from "next/server";

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

    const token = request.cookies.get("accessToken")?.value;

    const url = request.nextUrl;

    if(url.pathname === '/api/login' || url.pathname === '/api/health') return res;

    if(url.pathname === '/') {
        if(token){
            return NextResponse.redirect(new URL('/notes', url.origin))
        } else {   
            return NextResponse.redirect(new URL('/login', url.origin));
        }
    }

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
        '/api/:path*',
        '/'
    ]
  }