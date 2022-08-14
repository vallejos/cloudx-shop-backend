import { formatErrorResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { AccessDeniedError, AuthenticationError } from '../../errors';

const basicAuthorizer = async (event) => {
  try {
    const token = event?.headers?.Authorization;

    if (!token) {
      throw new AuthenticationError('Missing authorization header.')
    }

    const encodedCredentials = token.split(' ')[1]
    const buffer = Buffer.from(encodedCredentials, 'base64')
    const [ username, password ] = buffer.toString('utf-8').split(':')

    if (!username || !password) {
      throw new AccessDeniedError('Unauthorized.')
    }

    const envPassword = process.env[username]
    if (!envPassword || envPassword !== password) {
      throw new AccessDeniedError('Unauthorized.')
    }
    // const effect = envPassword && envPassword === password ? 'Allow' : 'Deny'
    // const policy = {
    //   principalId: encodedCredentials,
    //   policyDocument: {
    //     Version: '2012-10-17',
    //     Statement: {
    //       Action: 'execute-api:Invoke',
    //       Effect: effect,
    //       Resource: event.methodArn,
    //     },
    //   }
    // }
    // return policy
  } catch (error) {
    return formatErrorResponse(error)
  }
}

export const main = middyfy(basicAuthorizer)
