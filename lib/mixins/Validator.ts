import { lambda } from "@neztjs/lambda";

import type { RouteData } from "@neztjs";

type Validation = { isValid: boolean; messages: string[] };

export interface IValidatorMixin {
  applyValidators(request: Request, route: RouteData): Validation;
}

export class ValidatorMixin implements IValidatorMixin {
  public applyValidators(request: Request, route: RouteData): Validation {
    const messages = route.validators
      ?.map(lambda.apply(request))
      .filter((request): request is string => !!request);

    const isValid = messages === undefined || messages?.length === 0;
    return { isValid, messages: messages ?? [] };
  }
}

export const validatorMixin: IValidatorMixin = new ValidatorMixin();
