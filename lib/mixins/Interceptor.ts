import { lambda } from "@neztjs/lambda";

import type { RouteData } from "@neztjs";

export interface IInterceptorMixin {
  applyInterceptors(request: Request, route: RouteData): void;
}

export class InterceptorMixin implements IInterceptorMixin {
  public applyInterceptors(request: Request, route: RouteData): void {
    route.interceptors?.map(lambda.apply(request));
  }
}

export const interceptorMixin: IInterceptorMixin = new InterceptorMixin();
