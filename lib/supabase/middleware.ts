import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // Just pass through - let client-side auth handle everything
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  })
}
