import type { PipeFunction } from "@neztjs";

export function Pipe(pipe: PipeFunction): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const stateKey = `route-${String(propertyKey)}`;
    const { httpRepository, url, method } = Reflect.get(target, stateKey);
    httpRepository.addPipe(url, method, pipe);
    return descriptor;
  };
}
