import { lambda } from "@lib/lambda";

import type { RouteData } from "@lib";

export interface IInterceptorMixin {
  applyInterceptors(request: Request, route: RouteData): void;
}

export class InterceptorMixin implements IInterceptorMixin {
  public applyInterceptors(request: Request, route: RouteData): void {
    route.interceptors?.map(lambda.apply(request));
  }
}

export const interceptorMixin: IInterceptorMixin = new InterceptorMixin();
