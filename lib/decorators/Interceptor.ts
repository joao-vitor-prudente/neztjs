import type { InterceptorFunction } from "@neztjs";

export function Interceptor(interceptor: InterceptorFunction): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const stateKey = `route-${String(propertyKey)}`;
    const { httpRepository, url, method } = Reflect.get(target, stateKey);
    httpRepository.addInterceptor(url, method, interceptor);
    return descriptor;
  };
}
