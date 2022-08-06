import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import schema from './schema';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const BUCKET = 'cloudx-task5-import-service-data';
  const name = event.queryStringParameters.name;
  console.log('[importProductsFile]', { name });

  const s3 = new S3Client({region: 'us-east-1'});
  let statusCode = 200;
  let body = {};
  let headers = {};
  let signedUrl = '';

  try {
    const params = {
      Bucket: BUCKET,
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: 'text/csv',
    };
    const command = new GetObjectCommand(params);
    signedUrl = await getSignedUrl(s3, command);

    body = {
      signedUrl,
    }
  } catch (error) {
    console.error(error);
    statusCode = error.statusCode || 500;
    body = JSON.stringify(error);
  }

  headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

  return formatJSONResponse({
    statusCode,
    body,
    headers,
  });
}

export const main = middyfy(importProductsFile);
