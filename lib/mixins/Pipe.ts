import type { PipeFunction, RouteData } from "@neztjs";

export interface IPipeMixin {
  applyPipes(request: Request, route: RouteData): Request;
}

export class PipeMixin implements IPipeMixin {
  public applyPipes(request: Request, route: RouteData): Request {
    const pipe = (piped: Request, pipe: PipeFunction): Request => pipe(piped);
    return route.pipes?.reduce(pipe, request) ?? request;
  }
}

export const pipeMixin: IPipeMixin = new PipeMixin();
