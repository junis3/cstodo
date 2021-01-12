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

const bulletEmoji = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"];
const helpText = `:god: :시신: cstodo봇 :시신: :god:
cstodo: :시신:의 할 일 목록을 볼 수 있습니다.
cstodo add [내용]: :시신:의 할 일 목록에 새로운 항목을 넣을 수 있습니다.
cstodo remove [내용]: :시신:의 할 일 목록에 항목을 뺄 수 있습니다.`;

slackEvents.on('message', async (event) => {
  console.log(event);

  const text : string = event.text;
  const tokens = text.split(' ');

  if (tokens[0] === 'cstodo') {

    // cstodo help 커맨드
    if (tokens.length === 2 && tokens[1] === 'help') {
      webClient.chat.postMessage({
        text: helpText,
        channel: event.channel,
      });
      return;
    }

    let cstodo = await getCstodo();
    let post_todolist = true; //list 전체를 보여주는가?

    // cstodo length 또는 cstodo size 커맨드
    if (tokens.length === 2 && (tokens[1] === 'length' || tokens[1] === 'size')) {
      webClient.chat.postMessage({
        text: '와... cs님의 할 일은 총 ' + String(cstodo.length) + ' 개가 있어요... :시신:',
        channel: event.channel,
      });
      post_todolist = false;
    }
    if (tokens[1] === 'add') {
      if(tokens.length < 3){ //empty query string
        webClient.chat.postMessage({
          text: "nothing is added :blobnomouth:",
          channel: event.channel,
        });
        post_todolist = false;
      } else{ //tokens.length >= 3
        let query = tokens.slice(2).join(' ');
        if(query.indexOf(",") != -1) {
          webClient.chat.postMessage({
            text: "add 쿼리에 comma가 들어가면 똑떨이에요... :blobddokddulsad:",
            channel: event.channel,
          });
          post_todolist = false;
        }else{
          cstodo.push(query);
          setCstodo(cstodo);
          webClient.chat.postMessage({
            text: `cs님의 할 일에 '${query}'를 추가했어요!`,
            channel: event.channel,
          });
        }
      }
    }

    if (tokens[1] === 'remove') {
      if(tokens.length < 3){ //empty query string
        webClient.chat.postMessage({
          text: "빈 remove 쿼리는 똑떨이에요... :blobcry:",
          channel: event.channel,
        });
        post_todolist = false;
      } else{ //tokens.length >= 3
        let query = tokens.slice(2).join(' ');
        cstodo = cstodo.filter((value) => value !== query);
        setCstodo(cstodo);
        webClient.chat.postMessage({
          text: `cs님의 할 일에서 '${query}'를 제거했어요!`,
          channel: event.channel,
        });
      }
    }

    let fmtText = ':god: :시신: 할 일 목록 :god: : \n';
    if (tokens[1] === 'format') {
      for(var i = 0; i < bulletEmoji.length && i < cstodo.length; i++) {
        fmtText += bulletEmoji[i] + ' ' + cstodo[i] + '\n';
      }
      var remainingTodos = String(Math.max(0, cstodo.length - bulletEmoji.length));
      if(cstodo.length > bulletEmoji.length) {
        fmtText += '아직도 할 일이 ' + remainingTodos + '개나 더 있어요... :blobaww:\n'
      }
    } else {
      fmtText += cstodo.join(', ');
    }
    if(post_todolist) {
      webClient.chat.postMessage({
        text: fmtText,
        channel: event.channel,
      });
    }
  }
});

// 자정에 울리는 '오늘 CS님이 푼 문제 목록'
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