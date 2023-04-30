import { createEventAdapter } from '@slack/events-api';
import express from 'express';
import axios from 'axios';
import mongoose from 'mongoose';
import {
  cstodoTestChannel,
  isTesting,
  logWebhook,
  mongodbUri,
  port,
  signingSecret,
} from './config';
import onMessage from './module/onMessage';
import onTest from './module/onTest';
import { initiateAlarms } from './database/alarm';
import { webClient } from './command';
import { SlackMessageEvent } from './command/event';

if (logWebhook) {
  // eslint-disable-next-line global-require
  const consoleToSlack = require('console-to-slack');
  consoleToSlack.init(logWebhook, 2);
  consoleToSlack.init(logWebhook, 3);
}

mongoose
  .connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log(`Successfully connected to mongodb on ${mongoose.connection.host}`);
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(`[CSTODO] Uri: ${mongodbUri}`);
    console.error(`[CSTODO] Failed to connect to ${mongoose.connection.host}`);
    throw err;
  });

// eslint-disable-next-line import/prefer-default-export
export const slackEvents = createEventAdapter(signingSecret);

(async () => {
  const response = await axios.get('http://ip-api.com/json');
  const { data } = response;

  const date = new Date();

  await webClient.chat.postMessage({
    text: `[${date.toString()}] IP ${data.query} (${data.regionName}) 에서 cstodo가 실행됩니다!`,
    channel: cstodoTestChannel,
    username: 'cstodo_boot',
  });
})();

slackEvents.on('message', (event: SlackMessageEvent) => {
  Promise.resolve(onMessage({ event })).then((command) => {
    command.exec();
  });
});

initiateAlarms();

// 테스트 모드가 켜져있으면 끄라고 #cstodo-test에 알림을 보냅니다.
if (isTesting) onTest();

const app = express();

app.use('/cstodo', slackEvents.requestListener());
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`[CSTODO] Running slackbot on port ${port}.`));
