import { Method } from "@neztjs/constants";

import type { IHttpLib } from "@neztjs";

export function Route(
  httpLib: IHttpLib,
  url: string,
  method: Method
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const stateKey = `route-${String(propertyKey)}`;
    Reflect.set(target, stateKey, { httpRepository: httpLib, url, method });
    httpLib.registerRoute(url, method, descriptor.value);
    return descriptor;
  };
}
