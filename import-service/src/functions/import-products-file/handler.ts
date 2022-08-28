import { formatErrorResponse } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const importProductsFile = async (event) => {
  const BUCKET = 'cloudx-task5-import-service-data';
  const name = event.queryStringParameters.name;
  console.log('[importProductsFile]', { name });

  const s3 = new S3Client({region: 'us-east-1'});

  try {
    const params = {
      Bucket: BUCKET,
      Key: `uploaded/${name}`,
      ContentType: 'text/csv',
    };
    console.log('[importProductsFile]', { params });
    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    console.log('[importProductsFile]', JSON.stringify(signedUrl));

    return formatJSONResponse({
      signedUrl,
    });
  } catch (error) {
    console.error(error);
    return formatErrorResponse(error);
  }
}

export const main = middyfy(importProductsFile);
