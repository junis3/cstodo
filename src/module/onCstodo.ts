import { getCstodo, setCstodo } from '../etc/filesystem';
import { webClient } from '../index';

const bulletEmoji = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"];
const helpText = `:god: :시신: cstodo봇 :시신: :god:
\`cstodo\`: :시신:의 할 일 목록을 볼 수 있습니다.
\`cstodo format\`: :시신:의 할 일 목록을 보다 예쁘게 볼 수 있습니다.
\`cstodo size\` 또는 \`cstodo length\`: :시신:의 할 일의 개수를 볼 수 있습니다.
\`cstodo add [내용]\`: :시신:의 할 일 목록에 새로운 항목을 넣을 수 있습니다.
\`cstodo remove [내용]\`: :시신:의 할 일 목록에 항목을 뺄 수 있습니다.`;

const onCstodo = async (event: any) => {
  const text : string = event.text;
  const tokens = text.split(' ');
  const date : Date = new Date(event.ts * 1000);
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
    if(tokens.length < 3) { //empty query string
      webClient.chat.postMessage({
        text: "빈 add 쿼리는 똑떨이에요... :blobcry:",
        channel: event.channel,
      });
      return;
    } else { //tokens.length >= 3
      let query = tokens.slice(2).join(' ');
      if (cstodo.find((item) => item === query)) {
        webClient.chat.postMessage({
          text: "이미 할 일에 있는 걸 다시 추가하면 똑떨이에요... :blobddokddulsad:",
          channel: event.channel,
        });
        return;
      }
      if(query.indexOf(",") != -1) {
        webClient.chat.postMessage({
          text: "add 쿼리에 comma가 들어가면 똑떨이에요... :blobddokddulsad:",
          channel: event.channel,
        });
        return;
      } else {
        cstodo.push(query);
        await setCstodo(cstodo);
        webClient.chat.postMessage({
          text: `cs님의 할 일에 '${query}'를 추가했어요!`,
          channel: event.channel,
        });
      }
    }
  }

  if (tokens[1] === 'remove') {
    let query = tokens.slice(2).join(' ');
    if(tokens.length < 3) { //empty query string
      webClient.chat.postMessage({
        text: "빈 remove 쿼리는 똑떨이에요... :blobcry:",
        channel: event.channel,
      });
      return;
    } else if (!cstodo.find((item) => item === query)) {
      webClient.chat.postMessage({
        text: "할 일에 있지 않은 걸 빼면 똑떨이에요... :blobddokddulsad:",
        channel: event.channel,
      });
      return;
    } else { //tokens.length >= 3
      cstodo = cstodo.filter((value) => value !== query);
      
      setCstodo(cstodo);
      webClient.chat.postMessage({
        text: `cs님의 할 일에서 '${query}'를 제거했어요!`,
        channel: event.channel,
      });
    }
  }
  
  let fmtText = `:god: :시신: 할 일 목록 :god: (Request time: ${date.getHours()}시 ${date.getMinutes()}분 ${date.getSeconds()}초)\n`;
  if (tokens[1] === 'format') {
    for (let i = 0; i < bulletEmoji.length && i < cstodo.length; i++) {
      fmtText += bulletEmoji[i] + ' ' + cstodo[i] + '\n';
    }
    const remainingTodos = String(Math.max(0, cstodo.length - bulletEmoji.length));
    if (cstodo.length > bulletEmoji.length) {
      fmtText += '*아직도 할 일이 ' + remainingTodos + '개나 더 있어요...* :blobaww:\n'
    }
  } else {
    fmtText += cstodo.join(', ');
  }

  webClient.chat.postMessage({
    text: fmtText,
    channel: event.channel,
  });
}

export default onCstodo;