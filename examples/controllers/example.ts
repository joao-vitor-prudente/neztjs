import {
  Pipe,
  Route,
  Guard,
  Method,
  Validator,
  Interceptor,
  ExceptionFilter,
} from "@neztjs";

import { httpClient } from "../index";

export class ExampleController {
  // modify the request
  @Pipe((request) => request)
  // make an effect on the request without modifying it
  @Interceptor(console.log)
  // check if the request data is valid and if not return 400
  @Validator((request) => null)
  // check if the request can be made and if not return 403
  @Guard((request) => true)
  // fallback to when an error is thrown by the handler
  @ExceptionFilter((error) => new Response("error"))
  // register the handler in the client
  @Route(httpClient, "/example", Method.Get)
  public getExample(request: Request) {
    return new Response("success");
  }
}
