import type { ExceptionFilterFunction } from "@lib";

export function ExceptionFilter(
  exceptionFilter: ExceptionFilterFunction
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const stateKey = `route-${String(propertyKey)}`;
    const { httpRepository, url, method } = Reflect.get(target, stateKey);
    httpRepository.addExceptionFilter(url, method, exceptionFilter);
    return descriptor;
  };
}
