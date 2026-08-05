import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./lib/supabase/env";

/**
 * Runs on every request: keeps the admin's session fresh, and sends anyone
 * who is not signed in away from the admin area to the login page.
 *
 * Draupnir Capital has no Supabase project yet, so there is no session to
 * check. Skip the auth call entirely in that case (it would otherwise fetch
 * a placeholder URL on every single page load) and just keep the admin area
 * gated behind the login page.
 */
export async function middleware(request: NextRequest) {
  const isAdminArea = request.nextUrl.pathname.startsWith("/admin");

  if (!isSupabaseConfigured) {
    if (isAdminArea) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isAdminArea) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
