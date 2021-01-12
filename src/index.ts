import { createEventAdapter } from "@slack/events-api";
import { WebClient } from "@slack/web-api";
import express from "express";
import getCurrentHistory from "./getCurrentHistory";
import schedule from 'node-schedule';
import { getCstodo, setCstodo, getHistory, setHistory } from "./file";
import { accessToken, signingSecret } from "./config";
import { getProblemInfo } from "./getProblemInfo";

const app = express();

const isTesting = false;

const csGod = 'UV78YL6TW';
const cstodoTestChannel = 'C01JER4T7AN';
const cstodoChannel = isTesting ? cstodoTestChannel : 'C01H4RY69CL';

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
  console.log(event.ts)
  const date : Date = new Date(event.ts * 1000);
  const tokens = text.split(' ');

  if (tokens[0] === 'cstodo') {
    let cstodo = await getCstodo();

    // cstodo help 커맨드
    if (tokens.length === 2 && tokens[1] === 'help') {
      webClient.chat.postMessage({
        text: helpText,
        channel: event.channel,
      });
      return;
    }

    // cstodo length 또는 cstodo size 커맨드
    if (tokens.length === 2 && (tokens[1] === 'length' || tokens[1] === 'size')) {
      webClient.chat.postMessage({
        text: '와... cs님의 할 일은 총 ' + String(cstodo.length) + ' 개가 있어요... :시신:',
        channel: event.channel,
      });
      return;
    }
    if (tokens[1] === 'add') {
      if(tokens.length < 3){ //empty query string
        webClient.chat.postMessage({
          text: "nothing is added :blobnomouth:",
          channel: event.channel,
        });
        return;
      } else{ //tokens.length >= 3
        let query = tokens.slice(2).join(' ');
        if(query.indexOf(",") != -1) {
          webClient.chat.postMessage({
            text: "add 쿼리에 comma가 들어가면 똑떨이에요... :blobddokddulsad:",
            channel: event.channel,
          });
          return;
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
        return;
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
    
    let fmtText = `:god: :시신: 할 일 목록 :god: (Request Time: ${date.getHours()}시 ${date.getMinutes()}분 ${date.getSeconds()}초)\n`;
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
    webClient.chat.postMessage({
      text: fmtText,
      channel: event.channel,
    });
  } else if ( Math.random() < 0.005) {
    webClient.chat.postMessage({
      text: `역시 <@${event.user}>님이에요... :blobaww:`,
      channel: event.channel,
    })
  }
});

// 자정에 울리는 '오늘 CS님이 푼 문제 목록'
schedule.scheduleJob('0 0 0 * * *', async () => {
  const history = await getHistory();
  const currentHistory = await getCurrentHistory();

  setHistory(currentHistory);

  const today = await Promise.all(currentHistory.filter((value) => !history.find((item) => item === value)).map(async (id) => await getProblemInfo(Number.parseInt(id))));

  const diamonds = today.filter((item) => item.level.includes('dia'));
  const rubys = today.filter((item) => item.level.includes('ruby'));

  webClient.chat.postMessage({
    text: '오늘 :god: :시신: :god:님이 푼 문제들: ' + today.map((problem) => `<http://icpc.me/${problem.id}|:${problem.level}:${problem.title}>`).join(', '),
    channel: cstodoChannel,
  });

  if (diamonds.length === 0 && rubys.length === 0) {
    webClient.chat.postMessage({
      text: '히잉.... cs님이 오늘 다이아를 안 푸셔서 슬랙봇 마음이 너무 아파요... 내일은 꼭 다이아 풀어주시는 거죠? :blobcry: :blobhug: :시신:',
      channel: cstodoChannel,
    });
  }

  rubys.forEach((problem) => {
    webClient.chat.postMessage({
      text: `:tada: cs신님께 새로 학살당한 루비! <http://icpc.me/${problem.id}|:${problem.level}:${problem.title}> 입니다! :시신: :tada:`,
      channel: cstodoChannel,
    });
  });
});

// 테스트 모드가 켜져있으면 끄라고 #cstodo-test에 알림을 보냅니다.
if (isTesting) {
  const alertTest = () => webClient.chat.postMessage({
    text: '지금 cstodo 슬랙봇이 테스트 모드로 켜져 있어요. 의도한 게 아니라면 테스트 모드를 끄고 실행해 주세요!',
    channel: cstodoTestChannel,
  });

  alertTest();
  schedule.scheduleJob('0 0 * * * *', alertTest);
  schedule.scheduleJob('0 30 * * * *', alertTest);
}

app.use('/cstodo', slackEvents.requestListener());

// express 웹 서버 실행
app.listen(3000, () => {
  console.log('Running slackbot..');
});