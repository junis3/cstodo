import { createEventAdapter } from "@slack/events-api";
import { WebClient } from "@slack/web-api";
import express from "express";
import schedule from 'node-schedule';
import { accessToken, cstodoTestChannel, isTesting, logWebhook, mongodbUri, port, signingSecret } from "./config";
import onMessage from './module/onMessage';
import onDailyProblem from './module/onDailyProblem';
import onTest from './module/onTest';
import axios from "axios";
import mongoose from 'mongoose';
import {chooseProblem, validateProblem} from './module/onDailyGreenGold';

if (logWebhook) {
    const consoleToSlack = require('console-to-slack');
    consoleToSlack.init(logWebhook, 2);
    consoleToSlack.init(logWebhook, 3);
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

// 자정에 울리는 '오늘 CS님이 푼 문제 목록'
schedule.scheduleJob('0 0 0 * * *', onDailyProblem);

schedule.scheduleJob('0 10 12 * * *', chooseProblem);
schedule.scheduleJob('0 * * * * *', validateProblem);

// 테스트 모드가 켜져있으면 끄라고 #cstodo-test에 알림을 보냅니다.
if (isTesting) onTest();

const app = express();

app.use('/cstodo', slackEvents.requestListener());
app.listen(port, () => console.log(`Running slackbot on port ${port}.`));
