import { NextRequest, NextResponse } from 'next/server';

import { authMiddleware } from './auth.middleware';

const chainMiddlewares = (
  middlewares: Array<
    (request: NextRequest) => Promise<NextResponse> | NextResponse
  >,
) => {
  return async (request: NextRequest) => {
    for (const middleware of middlewares) {
      const result = await middleware(request);

      // If middleware returns redirect or rewrite, stop the chain
      if (
        result.status !== undefined ||
        result.headers.has('x-middleware-rewrite')
      ) {
        return result;
      }
    }

    // If all middlewares are successful, continue
    return NextResponse.next();
  };
};

export { authMiddleware, chainMiddlewares };
