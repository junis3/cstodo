import { getCstodo, setCstodo } from '../etc/filesystem';
import { cstodoMode, setCstodoMode, emoji, message } from '../etc/cstodoMode';
import { webClient } from '../index';

const bulletEmoji = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"];
const helpText = (mode: string = cstodoMode) => {
  const cs = emoji('cs', mode);
  return `:god: ${cs} cstodo봇 ${cs} :god:
\`cstodo\`: ${cs}의 할 일 목록을 볼 수 있습니다.
\`cstodo blob|weeb\`: cstodo의 프로필을 바꿀 수 있습니다.
\`cstodo format (페이지번호)\`: ${cs}의 할 일 목록을 보다 예쁘게 볼 수 있습니다.
\`cstodo size\` 또는 \`cstodo length\`: ${cs}의 할 일의 개수를 볼 수 있습니다.
\`cstodo add [내용]\`: ${cs}의 할 일 목록에 새로운 항목을 넣을 수 있습니다.
\`cstodo remove [내용]\`: ${cs}의 할 일 목록에 항목을 뺄 수 있습니다.
\`cstodo pop\`: ${cs}의 마지막 할 일을 뺍니다.`
}

const onCstodo = async (event: any) => {
  const text : string = event.text;
  const tokens = text.split(' ').map((token) => token.trim());
  const date = new Date(event.ts * 1000);

  if (text.split('').filter((chr) => ['\n', '`', '\u202e', '\u202d'].find((x) => x === chr)).length > 0 || text.length > 2000) {
    webClient.chat.postMessage({
      text: `${emoji('fuck')}`,
      channel: event.channel,
      icon_emoji: emoji('fuck'),
    });
    return;
  }

  let cstodo = await getCstodo();

  // cstodo help 커맨드
  if (tokens.length === 2 && tokens[1] === 'help') {
    webClient.chat.postMessage({
      text: helpText(),
      channel: event.channel,
      icon_emoji: emoji('help'),
      username: 'cs71107',
    });
  }

  //cstodo weeb | blob
  else if( tokens.length === 2 && (tokens[1] === 'blob' || tokens[1] === 'weeb')){
    setCstodoMode(tokens[1]);
    webClient.chat.postMessage({
      text: `cstodo의 프로필이 ${cstodoMode} 모드로 바뀌었습니다.`,
      channel: event.channel,
      icon_emoji: emoji('default'),
      usename: `cstodo(${cstodoMode})`,
    });
    return;
  }

  else if (tokens.length === 2 && tokens[1] === 'fuck') {
    await webClient.chat.postMessage({
      text: message('fuck'),
      channel: event.channel,
      icon_emoji: emoji('fuck'),
    });
    await webClient.chat.postMessage({
      text: 'ㅂㅇ',
      channel: event.channel,
      icon_emoji: emoji('fuck'),
    });
    webClient.conversations.leave({
      channel: event.channel,
    });
    return;
  }

  // cstodo length 또는 cstodo size 커맨드
  if (tokens.length === 2 && (tokens[1] === 'length' || tokens[1] === 'size')) {
    webClient.chat.postMessage({
      text: `와... cs님의 할 일은 총 ${cstodo.length} 개가 있어요... ${emoji('cs')}`,
      channel: event.channel,
      icon_emoji: emoji('default'),
    });
    return;
  }

  // cstodo add 커맨드
  else if (tokens[1] === 'add') {
    if(tokens.length === 2) {
      webClient.chat.postMessage({
        text: `add를 하면서 추가할 일을 안 주면 똑떨이에요... ${emoji('ddokddul')}`,
        channel: event.channel,
        icon_emoji: emoji('ddokddul'),
        username: "똑떨한 cstodo",
      });
      return;
    } 
    
    let query = tokens.slice(2).join(' ').trim();

    

    await Promise.all(query.split(',').map(async (nowQuery) => {
      nowQuery = nowQuery.trim();
      
      if (cstodo.find((item) => item === nowQuery)) {
        await webClient.chat.postMessage({
          text: `이미 할 일에 있는 ${nowQuery}를 다시 추가하면 똑떨이에요... ${emoji('ddokddul')}`,
          channel: event.channel,
          icon_emoji: emoji('ddokddul'),
          username: "똑떨한 cstodo",
        });
        return;
      } else {
        cstodo.push(nowQuery);
        await setCstodo(cstodo);  
        await webClient.chat.postMessage({
          text: `cs님의 할 일에 '${nowQuery}'를 추가했어요!`,
          icon_emoji: emoji('add'),
          channel: event.channel,
        });
      }
    }));
  }

  // cstodo remove 커맨드
  else if (tokens[1] === 'remove') {
    if (tokens.length === 2) {
      webClient.chat.postMessage({
        text: "빈 remove 쿼리는 똑떨이에요... " + emoji('ddokddul'),
        channel: event.channel,
        icon_emoji: emoji('ddokddul'),
        username: "똑떨한 cstodo",
      });
      return;
    } 

    let query = tokens.slice(2).join(' ').trim();
    
    await Promise.all(query.split(',').map(async (nowQuery) => {
      nowQuery = nowQuery.trim();
      
      if (!cstodo.find((item) => item === nowQuery)) {
        await webClient.chat.postMessage({
          text: `할 일에 없는 '${nowQuery}'를 빼면 똑떨이에요... ` + emoji('ddokddul'),
          channel: event.channel,
          icon_emoji: emoji('ddokddul'),
          username: "똑떨한 cstodo",
        });
      } else {
        cstodo = cstodo.filter((value) => value !== nowQuery);

        await setCstodo(cstodo);  
        await webClient.chat.postMessage({
          text: `cs님의 할 일에서 '${nowQuery}'를 제거했어요!`,
          icon_emoji: emoji('remove'),
          channel: event.channel,
        });
      }
    }));
  }
  
  // cstodo pop
  else if (tokens.length === 2 && tokens[1] === 'pop') {
    let query = cstodo[cstodo.length-1];
    cstodo = cstodo.slice(0, cstodo.length-1);
    setCstodo(cstodo);

    await webClient.chat.postMessage({
      text: `cs님의 할 일에서 '${query}'를 제거했어요!`,
      icon_emoji: emoji('remove'),
      channel: event.channel,
    });
  }

  // cstodo format
  else if (tokens[1] === 'format') {
    let maxPage = Math.ceil(cstodo.length / bulletEmoji.length - 0.001);
    let page_offset = 0;
    let page = 1;
    let fmtText = '';

    if(tokens.length >= 3) {
      try {
        page = Number.parseInt(tokens[2].match(/[0-9]/g)!.join(''));
      } catch (e) {
        page = 1;
      }

      if (page < 1) page = 1;
      if (page > maxPage) page = maxPage;

      page_offset = (page - 1) * bulletEmoji.length;
    }

    let numListedTodos = 0;
    for (let i = 0; i < bulletEmoji.length && page_offset + i < cstodo.length; i++) {
      fmtText += bulletEmoji[i] + ' ' + cstodo[page_offset + i] + '\n';
      numListedTodos += 1;
    }
    for (let i = 0, j = 0; i < cstodo.length; i += bulletEmoji.length, j++) {
      fmtText += '| ';
      if (i == page_offset) fmtText += `*${j+1}*`;
      else fmtText += `${j+1}`;
      fmtText += ' ';
    }
    fmtText += '|\n';
    if (cstodo.length > numListedTodos) {
      fmtText += `*이밖에도 할 일이 ${cstodo.length - numListedTodos}개나 더 있어요...* ${emoji('add')}\n`
    }
    webClient.chat.postMessage({
      text: fmtText,
      channel: event.channel,
      icon_emoji: emoji('default'),
    });
    return;
  }

  let maxLen = Math.max(...cstodo.map((str) => str.length));
  let sumLen = cstodo.map((str) => str.length).reduce((x, y) => x + y);

  while (cstodo.length > 200 || sumLen > 2000) {
    while (true) {
      let i = Math.floor(Math.random() * cstodo.length);

      if (Math.random() < cstodo[i].length / maxLen) {
        let query = cstodo[i];

        cstodo = cstodo.filter((val, idx) => idx != i);
        await setCstodo(cstodo);
        await webClient.chat.postMessage({
          text: `cs님의 할 일이 너무 많습니다.. cs님의 할 일에서 무작위로 '${query}'를 골라서 제거했으니까 수고하십시오..`,
          icon_emoji: emoji('communism'),
          channel: event.channel,
        });
        sumLen -= query.length;

        break;
      }
    }
  }
  
  let fmtText = `:god: ${emoji('cs')} 할 일 목록 :god: (Request time: ${date.getHours()}시 ${date.getMinutes()}분 ${date.getSeconds()}초)\n` + cstodo.join(', ');

  await webClient.chat.postMessage({
    text: fmtText,
    channel: event.channel,
    icon_emoji: emoji('default'),
  });

}

export default onCstodo;