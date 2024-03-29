import { formatJSONResponse, formatErrorResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import csv from 'csv-parser';
import * as services from './services';

const BUCKET = 'cloudx-task5-import-service-data';

const importFileParser = async (event: any) => {
  let statusCode = 202;
  console.log('[importFileParser] Starting...', JSON.stringify(event))

  try {
    const s3 = new S3Client({ region: 'us-east-1' });

    for (const record of event.Records) {
      const getObjCmd = new GetObjectCommand({
        Bucket: BUCKET,
        Key: record.s3.object.key,
      });

      const s3Data = await s3.send(getObjCmd);

      await processS3Data(s3, s3Data.Body, record.s3.object.key);

      console.log('All Done!');

      return formatJSONResponse({
        message: 'All Done',
      });    
    }
  } catch (error) {
    console.error(error);
    statusCode = error.statusCode || 500;
    return formatErrorResponse(error);
  }
}

const processS3Data = (s3, s3Data, objKey) => {
  return new Promise((resolve, reject) => {
    try {
      s3Data
        .pipe(csv())
        .on('error', (error) => {
          console.error(error);
          throw error;
        })
        .on('data', (row) => {
          const { name, price, description, count } = row;
          console.log('Sending data to SQS', JSON.stringify(row))
          services.importProduct(name, price, description, count);
        })
        .on('end', async () => {
          console.log(`[importFileParser] Done reading data. Copying...`);
          const copyObjCmd = new CopyObjectCommand({
            Bucket: BUCKET,
            CopySource: `${BUCKET}/${objKey}`,
            Key: objKey.replace('uploaded/', 'parsed/'),
          });
          await s3.send(copyObjCmd);

          console.log(`Copied: ${objKey}`)
          console.log('Deleting...')

          const delObjCmd = new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: objKey,
          });
          await s3.send(delObjCmd);

          console.log(`Deleted: ${objKey}`);

          resolve(null);
        });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

export const main = middyfy(importFileParser);
