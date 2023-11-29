import type { GuardFunction } from "@neztjs";

export function Guard(guard: GuardFunction): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const stateKey = `route-${String(propertyKey)}`;
    const { httpRepository, url, method } = Reflect.get(target, stateKey);
    httpRepository.addGuard(url, method, guard);
    return descriptor;
  };
}
