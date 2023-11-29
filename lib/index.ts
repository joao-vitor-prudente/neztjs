import { pipeMixin } from "@lib/mixins/Pipe";
import { guardMixin } from "@lib/mixins/Guard";
import { validatorMixin } from "@lib/mixins/Validator";
import { interceptorMixin } from "@lib/mixins/Interceptor";
import { exceptionFilterMixin } from "@lib/mixins/ExceptionFilter";
import { Method, Code, JSON_HEADERS } from "@lib/constants";

import type { IPipeMixin } from "@lib/mixins/Pipe";
import type { IGuardMixin } from "@lib/mixins/Guard";
import type { IValidatorMixin } from "@lib/mixins/Validator";
import type { IInterceptorMixin } from "@lib/mixins/Interceptor";
import type { IExceptionFilterMixin } from "@lib/mixins/ExceptionFilter";

export * from "@lib/constants";
export * from "@lib/decorators/Pipe";
export * from "@lib/decorators/Route";
export * from "@lib/decorators/Guard";
export * from "@lib/decorators/Validator";
export * from "@lib/decorators/Interceptor";
export * from "@lib/decorators/ExceptionFilter";

export type GuardFunction = (request: Request) => boolean;
export type PipeFunction = (request: Request) => Request;
export type ValidatorFunction = (request: Request) => string | null;
export type ExceptionFilterFunction = (error: Error) => Response;
export type InterceptorFunction = (request: Request) => void;
export type HandlerFunction = (request: Request) => Response;

type Middlewares = {
  pipes?: PipeFunction[];
  interceptors?: InterceptorFunction[];
  validators?: ValidatorFunction[];
  guards?: GuardFunction[];
  exceptionFilter?: ExceptionFilterFunction;
};

export type RouteData = {
  url: string;
  method: Method;
  handler: HandlerFunction;
} & Middlewares;

export interface IHttpLib {
  registerRoute(url: string, method: Method, handler: HandlerFunction): void;
  addPipe(url: string, method: string, pipe: PipeFunction): void;
  addInterceptor(
    url: string,
    method: string,
    interceptor: InterceptorFunction
  ): void;
  addValidator(url: string, method: string, validator: ValidatorFunction): void;
  addGuard(url: string, method: string, guard: GuardFunction): void;
  addExceptionFilter(
    url: string,
    method: string,
    exceptionFilter: ExceptionFilterFunction
  ): void;
  serve(): void;
}

export class HttpLib implements IHttpLib {
  private pipeMixin: IPipeMixin = pipeMixin;
  private guardMixin: IGuardMixin = guardMixin;
  private validatorMixin: IValidatorMixin = validatorMixin;
  private interceptorMixin: IInterceptorMixin = interceptorMixin;
  private exceptionFilterMixin: IExceptionFilterMixin = exceptionFilterMixin;

  private routes: RouteData[] = [];
  private port: number;

  public constructor(port: number) {
    this.port = port;
  }

  public registerRoute(
    url: string,
    method: Method,
    handler: HandlerFunction
  ): void {
    const route = this.getRoute(url, method);
    if (route) throw new Error(`Url duplicada: ${method} ${url}`);
    this.routes.push({ url, method, handler });
  }

  public addPipe(url: string, method: string, pipe: PipeFunction): void {
    const route = this.getRoute(url, method);
    if (!route) throw new Error(`Url não encontrada: ${method} ${url}`);
    this.routes[route.index].pipes
      ? this.routes[route.index].pipes?.push(pipe)
      : (this.routes[route.index].pipes = [pipe]);
  }

  public addInterceptor(
    url: string,
    method: string,
    interceptor: InterceptorFunction
  ): void {
    const route = this.getRoute(url, method);
    if (!route) throw new Error(`Url não encontrada: ${method} ${url}`);
    this.routes[route.index].interceptors
      ? this.routes[route.index].interceptors?.push(interceptor)
      : (this.routes[route.index].interceptors = [interceptor]);
  }

  public addValidator(
    url: string,
    method: string,
    validator: ValidatorFunction
  ): void {
    const route = this.getRoute(url, method);
    if (!route) throw new Error(`Url não encontrada: ${method} ${url}`);
    this.routes[route.index].validators
      ? this.routes[route.index].validators?.push(validator)
      : (this.routes[route.index].validators = [validator]);
  }

  public addGuard(url: string, method: string, guard: GuardFunction): void {
    const route = this.getRoute(url, method);
    if (!route) throw new Error(`Url não encontrada: ${method} ${url}`);
    this.routes[route.index].guards
      ? this.routes[route.index].guards?.push(guard)
      : (this.routes[route.index].guards = [guard]);
  }

  public addExceptionFilter(
    url: string,
    method: string,
    exceptionFilter: ExceptionFilterFunction
  ): void {
    const route = this.getRoute(url, method);
    if (!route) throw new Error(`Url não encontrada: ${method} ${url}`);
    this.routes[route.index].exceptionFilter = exceptionFilter;
  }

  public serve(): void {
    Bun.serve({
      fetch: (request) => this.pipeline(request),
      port: this.port,
    });
  }

  private pipeline(request: Request): Response {
    const route = this.getRouteFromRequest(request);
    if (!route) return new Response(null, { status: Code.NotFound });

    request = this.pipeMixin.applyPipes(request, route);

    this.interceptorMixin.applyInterceptors(request, route);

    const validations = this.validatorMixin.applyValidators(request, route);

    if (!validations.isValid) {
      const data = JSON.stringify({ errors: validations.messages });
      const opts = { status: Code.InvalidRequest, headers: JSON_HEADERS };
      return new Response(data, opts);
    }

    const isAllowed = this.guardMixin.applyGuards(request, route);
    if (!isAllowed) return new Response(null, { status: Code.Forbidden });

    const handler = this.exceptionFilterMixin.applyExceptionFilter(
      request,
      route
    );
    return handler(request);
  }

  private getRoute(url: string, method: string): GetRouteResult {
    const isRoute = (route: RouteData): boolean =>
      route.url === url && route.method === method;

    const route = this.routes.find(isRoute);
    const index = this.routes.findIndex(isRoute);

    if (!route) return;
    return { route, index };
  }

  private getRouteFromRequest(request: Request): RouteData | undefined {
    const withoutProtocol = request.url.split("//").at(-1);
    const withoutDomain = "/" + withoutProtocol?.split("/").slice(1).join("/");
    const isRoute = (route: RouteData): boolean =>
      route.url === withoutDomain && route.method === request.method;
    return this.routes.find(isRoute);
  }
}

type GetRouteResult = { route: RouteData; index: number } | undefined;
