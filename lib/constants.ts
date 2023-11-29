export enum Code {
  Ok = 200,
  InvalidRequest = 400,
  Forbidden = 403,
  NotFound = 404,
  Timeout = 408,
  InternalServerError = 500,
}

export enum Method {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Delete = "Delete",
}

export const JSON_HEADERS = { "Content-Type": "application/json" };
