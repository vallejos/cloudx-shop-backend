import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

const headers = {
  'Access-Control-Allow-Headers' : '*',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Credentials': true,
};

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(response)
  }
}

export const formatErrorResponse = (error: Error) => {
  return {
    statusCode: 500,
    headers,
    body: JSON.stringify(error.message)
  }
}
