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
