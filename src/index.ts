import { createEventAdapter } from "@slack/events-api";
import { WebClient } from "@slack/web-api";
import express from "express";
import { accessToken, cstodoTestChannel, isTesting, logWebhook, mongodbUri, port, signingSecret } from "./config";
import onMessage from './module/onMessage';
import onTest from './module/onTest';
import axios from "axios";
import mongoose from 'mongoose';
import { initiateAlarms } from './database/alarm';

if (logWebhook) {
    const consoleToSlack = require('console-to-slack');
    const options = {
      name: 'cstodo_log'
    }
    consoleToSlack.init(logWebhook, 2, options);
    consoleToSlack.init(logWebhook, 3, options);
}

mongoose.connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(res => {
  console.log(`Successfully connected to mongodb on ${mongoose.connection.host}`);
}).catch(err => {
  console.error(`Failed to connect to ${mongoose.connection.host}`);
  throw err;
});

export const slackEvents = createEventAdapter(signingSecret);
export const webClient = new WebClient(accessToken);

(async () => {
  const response = await axios.get('http://ip-api.com/json');
  const data = response.data;

  const date = new Date();

  await webClient.chat.postMessage({
    text: `[${date.toString()}] IP ${data.query} (${data.regionName}) 에서 cstodo가 실행됩니다!`,
    channel: cstodoTestChannel,
  });
})();

slackEvents.on('message', onMessage);

initiateAlarms();

// 테스트 모드가 켜져있으면 끄라고 #cstodo-test에 알림을 보냅니다.
if (isTesting) onTest();

const app = express();

app.use('/cstodo', slackEvents.requestListener());
app.listen(port, () => console.log(`Running slackbot on port ${port}.`));
