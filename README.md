# Task 7

Task 7.1
1. Created authorization-service
2. Created basicAuthorizer lambda function
3. Added env variable with test password. Added decoding of token and verification against local .env credentials. Added .env to .gitignore file.
4. Added error handling

Task 7.2
1. Added lambda authorization to `/import` import service endpoint.
2. Used `basicAuthorizer` as lambda authorizer.

# Task 6

Task 6.1
- Created catalogBatchProcess lambda function to create products using the createProduct lambda function.
- Created catalogItemsQueue SQS queue.
- Configured batchSize for lambda trigger.

Task 6.2
- Updated importFileParser lambda function.
- Removed log entries from readable stream.

Task 6.3
- Created createProductTopic SNS topic.
- Created email subscription.
- Updated catalogBatchProcess to send event.

# Task 5

Task 5.1
- Added import-service
- Created and configured S3 bucket.

Task 5.2
- Created importProductsFile lambda function triggered by GET method on `import/` URL.
- Function returns signed URL.
- Updated FE API.

Task 5.3
- Created importFileParser lambda function triggered by S3 events fired on the `uploaded` S3 folder.
- Implemented readable stream to read file content, parse it with `csv-parser`, and log the contents to CloudWatch.

# Task 4

Task 4.1 
- Added `util/db-scripts.sql` with SQL to create tables and add basic test data to tables.

Task 4.2
- Added serverless configuration for environment variables to connect to RDS
- Added pg package to handle Postgres
- Added pg.ts service to connect to PostgreSQL database
- Updated services to query DB and return data from DB instead of mocks
- Added DBError class to handle DB errors

Task 4.3
- Added createProduct lambda under serverless configuration to add new products to DB
