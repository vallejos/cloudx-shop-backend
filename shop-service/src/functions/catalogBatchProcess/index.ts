import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      event: 'SQS',
      queue: 'catalogItemsQueue',
      batchSize: 5,
      batchWait: 10,
    },
  ],
};
