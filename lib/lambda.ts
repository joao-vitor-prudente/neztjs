export namespace lambda {
  export function apply<TParameter, TResult>(
    parameter: TParameter
  ): (func: (parameter: TParameter) => TResult) => TResult {
    return function (func: (parameter: TParameter) => TResult): TResult {
      return func(parameter);
    };
  }

  export function bind<TParameter, TReturn>(
    func: (parameter: TParameter) => TReturn,
    value: TParameter
  ): () => TReturn {
    return () => func(value);
  }

  export function compose<TParameterInner, TReturnOuter, TReturnInner>(
    outer: (parameter: TReturnInner) => TReturnOuter,
    inner: (parameter: TParameterInner) => TReturnInner
  ): (parameter: TParameterInner) => TReturnOuter {
    return function (parameter: TParameterInner): TReturnOuter {
      return outer(inner(parameter));
    };
  }

  export function tryCatch<TReturn>(
    tryFunction: () => TReturn,
    catchFunction: (error: Error) => TReturn
  ): () => TReturn {
    return function (): TReturn {
      try {
        return tryFunction();
      } catch (e) {
        const error = e as Error;
        return catchFunction(error);
      }
    };
  }

  export namespace operators {
    export function and(a: boolean, b: boolean): boolean {
      return a && b;
    }

    export function or(a: boolean, b: boolean): boolean {
      return a || b;
    }
  }

}