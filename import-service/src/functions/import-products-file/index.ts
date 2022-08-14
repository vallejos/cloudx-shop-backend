import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
        authorizer: {
          name: 'basicAuthorizer',
          arn: {
            'Fn::GetAtt': [ 'BasicAuthorizerLambdaFunction', 'Arn' ],
          },
          identitySource: 'method.request.header.Authorization',
          type: 'request',
        },
      },
    },
  ],
};
