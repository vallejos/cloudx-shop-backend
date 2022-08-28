import { formatPolicyResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { AccessDeniedError, MissingParametersError } from '../../errors';

const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent) => {
  console.log(`basicAuthorizer event`, event)

  const APIGATEWAY_AUTHORIZER_TYPE = 'TOKEN'
  const { type, methodArn, authorizationToken } = event
  const token = authorizationToken?.replace('Basic ', '')

  try {
    if (type !== APIGATEWAY_AUTHORIZER_TYPE) {
      console.log('Invalid type', type)
      throw new MissingParametersError('Invalid authorization type.')
    }

    if (!token) {
      console.log('No token')
      throw new MissingParametersError('Missing authorization token.')
    }

    const buffer = Buffer.from(token, 'base64')
    const [ username, password ] = buffer.toString('utf-8').split(':')

    if (!username || !password) {
      console.log('Missing username or password')
      throw new MissingParametersError('Missing parameters.')
    }

    const envPassword = process.env[username]
    if (!envPassword) {
      console.log('Missing env configuration')
      throw new Error('Missing .env.password configuration.')
    }

    if (envPassword !== password) {
      console.log('No authorized')
      throw new AccessDeniedError('Unauthorized.')
    }

    return formatPolicyResponse(methodArn, token, 'Allow')
  } catch (error) {
    console.error(`basicAuthorizer error`, error)
    return formatPolicyResponse(methodArn, token, 'Deny', error)
  }
}

export const main = middyfy(basicAuthorizer)
