import { lambda } from "@neztjs/lambda";

import type { HandlerFunction, RouteData } from "@neztjs";

export interface IExceptionFilterMixin {
  applyExceptionFilter(request: Request, route: RouteData): HandlerFunction;
}

export class ExceptionFilterMixin implements IExceptionFilterMixin {
  public applyExceptionFilter(
    request: Request,
    route: RouteData
  ): HandlerFunction {
    if (!route.exceptionFilter) return route.handler;
    return lambda.tryCatch(
      lambda.bind(route.handler, request),
      route.exceptionFilter
    );
  }
}

export const exceptionFilterMixin: IExceptionFilterMixin =
  new ExceptionFilterMixin();
