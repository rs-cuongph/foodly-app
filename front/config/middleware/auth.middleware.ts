import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

import { siteConfig } from '../site';

import { apiClient } from '@/plugins/axios';

const getCookieLocale = (request: NextRequest) => {
  const cookie = request.cookies.get('NEXT_LOCALE');

  return cookie?.value || 'en';
};

const cookieName = process.env.NEXTAUTH_URL?.startsWith('https://')
  ? '__Secure-next-auth.session-token'
  : 'next-auth.session-token';

// Define public routes that don't require authentication
const isPublicRoute = (pathname: string, lang: string): boolean => {
  // Add all your public routes here
  const publicPaths = [
    '', // Home page is public
    '/home', // Home page is public
  ].map((path) => `/${lang}${path}`);

  // Check if the path is in the public routes list
  for (const publicPath of publicPaths) {
    if (pathname.includes(publicPath)) {
      return true;
    }
  }

  return false;
};

const getUserInfo = async (accessToken: string) => {
  // console.log('accessToken', accessToken);

  try {
    // Fix: apiClient.get instead of post, and headers should be separate parameter
    const response = await apiClient.get(siteConfig.apps.apiRoutes.my_info, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // console.log('response', response);

    return response.data;
  } catch {
    // Silent failure to avoid exposing details in middleware
    return null;
  }
};

export const authMiddleware = async (request: NextRequest) => {
  // get session
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const accessToken = session?.access_token as string;
  const pathname = request.nextUrl.pathname;
  const lang = getCookieLocale(request);

  const nextPath = `/`;

  // Redirect to home page if pathname is empty
  // if (pathname === '/') {
  //   return NextResponse.redirect(new URL(`/${lang}`, request.url));
  // }

  // Skip auth check for public routes
  if (isPublicRoute(pathname, lang)) {
    return NextResponse.next();
  }

  if (!session) {
    const response = NextResponse.redirect(new URL(nextPath, request.url));

    response.cookies.delete(cookieName);

    return response;
  }

  if (accessToken) {
    const userInfo = await getUserInfo(accessToken);

    if (!userInfo) {
      const response = NextResponse.redirect(new URL(nextPath, request.url));

      response.cookies.delete(cookieName);

      return response;
    }
  }

  return NextResponse.next();
};
