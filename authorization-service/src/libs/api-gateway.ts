import type { APIGatewayAuthorizerResult, APIGatewayProxyEvent, APIGatewayProxyResult, Handler, PolicyDocument } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";
import { AuthenticationError, AccessDeniedError, MissingParametersError } from "../errors";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

const getStatusCode = (error?: Error): number => {
  if (!error) {
    return 200
  }

  if (error instanceof MissingParametersError) {
    return 401
  }

  if (error instanceof AccessDeniedError) {
    return 403
  }

  return 500
}

export const formatPolicyResponse = (resource: string, principalId: string, effect: string, error?: Error) => {
  const policy = {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: [resource],
      }],
    },
    context: {
      statusCode: getStatusCode(error)
    },
  }
  console.log('policy', JSON.stringify(policy))
  return policy
}
