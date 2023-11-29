import { lambda } from "@lib/lambda";

import type { RouteData } from "@lib";

export interface IGuardMixin {
  applyGuards(request: Request, route: RouteData): boolean;
}

export class GuardMixin implements IGuardMixin {
  public applyGuards(request: Request, route: RouteData): boolean {
    return !!route.guards
      ?.map(lambda.apply(request))
      .reduce(lambda.operators.and, true);
  }
}

export const guardMixin: IGuardMixin = new GuardMixin();
