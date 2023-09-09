import serverlessExpress from '@vendia/serverless-express';
import { createConnection } from 'typeorm';

import app from './app';

let serverlessExpressInstance: any;

async function setup(event: any, context: any) {
  await createConnection();
  serverlessExpressInstance = serverlessExpress({ app });
  return serverlessExpressInstance(event, context);
}

function handler(event: any, context: any) {
  if (serverlessExpressInstance) return serverlessExpressInstance(event, context);

  return setup(event, context);
}

exports.handler = handler;
