import type { ValidatorFunction } from "@lib";

export function Validator(validator: ValidatorFunction): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const stateKey = `route-${String(propertyKey)}`;
    const { httpRepository, url, method } = Reflect.get(target, stateKey);
    httpRepository.addValidator(url, method, validator);
    return descriptor;
  };
}
