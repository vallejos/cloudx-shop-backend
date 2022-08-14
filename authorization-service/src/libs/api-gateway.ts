import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";
import { AuthenticationError, AccessDeniedError } from "../errors";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}

export const formatErrorResponse = (error: Error) => {
  return {
    statusCode: getStatusCode(error),
    body: JSON.stringify({
      error: error.message
    })
  }
}

const getStatusCode = (error: Error): number => {
  if (error instanceof AuthenticationError) {
    return 401
  }

  if (error instanceof AccessDeniedError) {
    return 403
  }

  return 500
}
