import type { AWS } from '@serverless/typescript';
import getProductsById from '@functions/getProductsById';
import getProductsList from '@functions/getProductsList';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    region: "us-east-1",
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      DATABASE_URL: process.env.DATABASE_URL,
      DATABASE_USERNAME: process.env.DATABASE_USERNAME,
      DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
      DATABASE_DBNAME: process.env.DATABASE_DBNAME,
      DATABASE_PORT: process.env.DATABASE_PORT,
      CATALOG_ITEMS_TOPIC_ARN: process.env.CATALOG_ITEMS_TOPIC_ARN,
      SUBSCRIPTION_EMAIL: process.env.SUBSCRIPTION_EMAIL,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: [
          {
            'Fn::GetAtt': [
              'SQSQueue',
              'Arn',
            ],
          },
        ],
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: [
          {
            Ref: 'SNSTopic',
          },
        ],
      },
    ],
  },
  // import the function via paths
  functions: { getProductsById, getProductsList, createProduct, catalogBatchProcess },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk', 'pg-native'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties:{
          QueueName: 'catalogItemsQueue',
        }
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties:{
          TopicName: 'createProductTopic',
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'fabian_vallejos+1@epam.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic',
          }
        }
      },
      SNSFilteredSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'fabian_vallejos+2@epam.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic',
          },
          FilterPolicy: {
            count: [
              { numeric: [ '=', 0 ] }
            ]
          }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
