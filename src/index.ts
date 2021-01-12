import { createEventAdapter } from "@slack/events-api";
import { WebClient } from "@slack/web-api";
import express from "express";
import getCurrentHistory from "./getCurrentHistory";
import schedule from 'node-schedule';
import { getCstodo, setCstodo, getHistory, setHistory } from "./file";
import { accessToken, signingSecret } from "./config";
import { getProblemInfo } from "./getProblemInfo";

const app = express();

const cstodoChannel = 'C01H4RY69CL';
const cstodoTestChannel = 'C01JER4T7AN';

const slackEvents = createEventAdapter(signingSecret);
const webClient = new WebClient(accessToken);

slackEvents.on('message', async (event) => {
  console.log(event);

  const text : string = event.text;
  const tokens = text.split(' ');

  if (tokens[0] === 'cstodo') {
    let cstodo = await getCstodo();

    if (tokens[1] === 'add' && tokens.length >= 3) {
      let query = tokens.slice(2).join(' ');
      cstodo.push(query);
      setCstodo(cstodo);
    }

    if (tokens[1] === 'remove' && tokens.length >= 3) {
      let query = tokens.slice(2).join(' ');
      cstodo = cstodo.filter((value) => value !== query);
      setCstodo(cstodo);
    }

    webClient.chat.postMessage({
      text: ':god: :시신: 할 일 목록 :god: : ' + cstodo.join(', '),
      channel: event.channel,
    });
  }
});

schedule.scheduleJob('0 0 0 * * *', async () => {
  const history = await getHistory();
  const currentHistory = await getCurrentHistory();

  setHistory(currentHistory);

  const today = await Promise.all(currentHistory.filter((value) => !history.find((item) => item === value)).map(async (id) => await getProblemInfo(Number.parseInt(id))));

  webClient.chat.postMessage({
    text: '오늘 :god: :시신: :god:님이 푼 문제들: ' + today.map((problem) => `<http://icpc.me/${problem.id}|:${problem.level}:${problem.title}>`).join(', '),
    channel: cstodoChannel,
  })
});

app.use('/cstodo', slackEvents.requestListener());

// express 웹 서버 실행
app.listen(3000, () => {
  console.log('Running slackbot..');
});