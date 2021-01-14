import { createEventAdapter } from "@slack/events-api";
import { WebClient } from "@slack/web-api";
import express from "express";
import schedule from 'node-schedule';
import { accessToken, cstodoTestChannel, isTesting, logWebhook, signingSecret } from "./config";
import onMessage from './module/onMessage';
import onDailyProblem from './module/onDailyProblem';
import onTest from './module/onTest';
import axios from "axios";

if (logWebhook) {
    const consoleToSlack = require('console-to-slack');
    consoleToSlack.init(logWebhook, 4);
}

(async () => {
    const response = await axios.get('http://ip-api.com/json');
    const data = response.data;

    console.log(`${data.country} ${data.regionName}(${data.city})의 IP ${data.query} (위도 ${data.lat}, 경도 ${data.lon})에서 슬랙봇을 실행하고 있습니다.`);
})();

const port = 3000;

export const slackEvents = createEventAdapter(signingSecret);
export const webClient = new WebClient(accessToken);

slackEvents.on('message', onMessage);

// 자정에 울리는 '오늘 CS님이 푼 문제 목록'
schedule.scheduleJob('0 0 0 * * *', onDailyProblem);

// 테스트 모드가 켜져있으면 끄라고 #cstodo-test에 알림을 보냅니다.
if (isTesting) onTest();

const app = express();

app.use('/cstodo', slackEvents.requestListener());
app.listen(port, () => { console.log(`Running slackbot on port ${port}.`); });
