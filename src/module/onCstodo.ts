import { cstodoMode, setCstodoMode, emoji, message } from '../etc/cstodoMode';
import { webClient } from '../index';
import { addCstodo, CstodoType, getCstodos, removeCstodo, shuffleCstodo } from '../database/cstodo';

const bulletEmoji = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"];
const helpText = (mode: string = cstodoMode) => {
  const cs = emoji('cs', mode);
  return `:god: ${cs} cstodo봇 ${cs} :god:
\`cstodo\`: ${cs}의 할 일 목록을 볼 수 있습니다.
\`cstodo blob\` 또는 \`cstodo weeb\`: cstodo의 프로필을 바꿀 수 있습니다.
\`cstodo format (페이지번호)\`: ${cs}의 할 일 목록을 보다 예쁘게 볼 수 있습니다.
\`cstodo size\`: ${cs}의 할 일의 개수를 볼 수 있습니다.
\`cstodo search\`: ${cs}의 할 일에 들어있는 항목을 정규표현식으로 검색할 수 있습니다.
\`cstodo add [내용]\`: ${cs}의 할 일 목록에 새로운 항목을 넣을 수 있습니다.
\`cstodo remove [내용]\`: ${cs}의 할 일 목록에 항목을 뺄 수 있습니다.
\`cstodo pop\`: ${cs}의 마지막 할 일을 뺍니다.
\`cstodo shuffle\`: ${cs}의 할 일을 무작위로 섞습니다.`
}

const onCstodo = async (event: any) => {
  const text : string = event.text;
  const tokens = text.split(' ').map((token) => token.trim());
  const date = new Date(event.ts * 1000);

  if (tokens.length === 0 || tokens[0] !== 'cstodo') return;

  if (text.split('').filter((chr) => ['\n', '`', '\u202e', '\u202d'].find((x) => x === chr)).length > 0 || text.length > 500) {
    webClient.chat.postMessage({
      text: emoji('fuck'),
      channel: event.channel,
      icon_emoji: emoji('fuck'),
    });
    return;
  }

  let cstodo = await getCstodos();

  // cstodo help
  if (tokens[1] === 'help') {
    await webClient.chat.postMessage({
      text: helpText(),
      channel: event.channel,
      icon_emoji: emoji('help'),
      username: 'cs71107',
    });
    return;
  }

  // cstodo weeb | blob
  if (tokens[1] === 'blob' || tokens[1] === 'weeb') {
    setCstodoMode(tokens[1]);
    webClient.chat.postMessage({
      text: `cstodo의 프로필이 ${cstodoMode} 모드로 바뀌었습니다.`,
      channel: event.channel,
      icon_emoji: emoji('default'),
      usename: `cstodo(${cstodoMode})`,
    });
    return;
  }

  // cstodo fuck
  if (tokens[1] === 'fuck' || tokens[1] === 'fu') {
    await webClient.chat.postMessage({
      text: emoji('fuck').repeat(23),
      channel: event.channel,
      icon_emoji: emoji('fuck'),
    });
    await webClient.chat.postMessage({
      text: '나감 ㅅㄱ',
      channel: event.channel,
      icon_emoji: emoji('fuck'),
    });
    webClient.conversations.leave({
      channel: event.channel,
    });
    return;
  }

  // cstodo length 또는 cstodo size
  if (tokens[1] === 'length' || tokens[1] === 'size') {
    await webClient.chat.postMessage({
      text: `와... cs님의 할 일은 총 ${cstodo.length} 개가 있어요... ${emoji('cs')}`,
      channel: event.channel,
      icon_emoji: emoji('default'),
    });
    return;
  }

  // cstodo search
  if (tokens[1] === 'search') {
    let query = tokens.slice(2).join(' ').trim();

    
    let result = await new Promise<CstodoType[] | null>(async (resolve, reject) => {
      setTimeout(() => {
        resolve(null);
      }, 3000);

      getCstodos().then((cstodo) => {
        const result = cstodo.filter((todo) => {
          return todo.content.search(new RegExp(String.raw`${query}`)) !== -1;
        });
        resolve(result);
      });
    });

    let message: string;
    let icon_emoji = emoji('default');
    let username = 'cstodo';

    console.log(result);
    if (result === null) {
      message = '무슨 검색어를 넣었길래 이렇게 오래 걸려요?;;;';
      icon_emoji = emoji('ddokddul');
      username = '똑떨한 cstodo'
    } else if (result.length === 0) {
      message = `${emoji('cs')}님의 할 일에 찾으시는 ${query}가 없습니다..ㅠㅠ`;
    } else {

      message = `${emoji('cs')}님의 할 일에서 ${query}를 검색한 결과입니다:`;
      message += result.map((value) => `\n- ${value.content}`);  
    }

    
    await webClient.chat.postMessage({
      text: message,
      channel: event.channel,
      icon_emoji,
      username,
    })
    return;
  }

  // cstodo shuffle
  if (tokens[1] === 'shuffle') {
    await shuffleCstodo();

    await webClient.chat.postMessage({
      text: `cs님의 할 일들을 모두 섞어두었어요!`,
      icon_emoji: emoji('hug'),
      channel: event.channel,
    });

    cstodo = await getCstodos();
  }

  // cstodo add
  if (tokens[1] === 'add' || tokens[1] === 'push' || tokens[1] === 'append') {
    
    let query = tokens.slice(2).join(' ').trim();

    if(query === '') {
      await webClient.chat.postMessage({
        text: `add를 하면서 추가할 일을 안 주면 똑떨이에요... ${emoji('ddokddul')}`,
        channel: event.channel,
        icon_emoji: emoji('ddokddul'),
        username: "똑떨한 cstodo",
      });
      return;
    } 

    await Promise.all(query.split(',').map(async (nowQuery) => {
      nowQuery = nowQuery.trim();
      
      if (cstodo.find((item) => item.content === nowQuery)) {
        await webClient.chat.postMessage({
          text: `이미 할 일에 있는 ${nowQuery}를 다시 추가하면 똑떨이에요... ${emoji('ddokddul')}`,
          channel: event.channel,
          icon_emoji: emoji('ddokddul'),
          username: "똑떨한 cstodo",
        });
        return;
      } else {
        await addCstodo({ content: nowQuery });
        await webClient.chat.postMessage({
          text: `cs님의 할 일에 '${nowQuery}'를 추가했어요!`,
          icon_emoji: emoji('add'),
          channel: event.channel,
        });
      }
    }));

    cstodo = await getCstodos();
  }

  // cstodo remove
  if (tokens[1] === 'remove' || tokens[1] === 'delete') {
    let query = tokens.slice(2).join(' ').trim();
    
    if (query === '') {
      webClient.chat.postMessage({
        text: "빈 remove 쿼리는 똑떨이에요... " + emoji('ddokddul'),
        channel: event.channel,
        icon_emoji: emoji('ddokddul'),
        username: "똑떨한 cstodo",
      });
      return;
    } 

    await Promise.all(query.split(',').map(async (nowQuery) => {
      nowQuery = nowQuery.trim();
      
      if (!cstodo.find((item) => item.content === nowQuery)) {
        await webClient.chat.postMessage({
          text: `할 일에 없는 '${nowQuery}'를 빼면 똑떨이에요... ` + emoji('ddokddul'),
          channel: event.channel,
          icon_emoji: emoji('ddokddul'),
          username: "똑떨한 cstodo",
        });
      } else {
        await removeCstodo(nowQuery);
        await webClient.chat.postMessage({
          text: `cs님의 할 일에서 '${nowQuery}'를 제거했어요!`,
          icon_emoji: emoji('remove'),
          channel: event.channel,
        });
      }
    }));

    cstodo = await getCstodos();
  }
  
  // cstodo pop
  if (tokens.length === 2 && tokens[1] === 'pop') {
    if (cstodo.length === 1) {
      await webClient.chat.postMessage({
        text: `할 일이 없는데 제거하면 똑떨이에요... ${emoji('ddokddul')}`,
        channel: event.channel,
        icon_emoji: emoji('ddokddul'),
        username: '똑떨한 cstodo',
      });
      return;
    }

    let nowQuery = cstodo[cstodo.length-1].content;
    
    await removeCstodo(nowQuery);

    await webClient.chat.postMessage({
      text: `cs님의 할 일에서 '${nowQuery}'를 제거했어요!`,
      icon_emoji: emoji('remove'),
      channel: event.channel,
    });

    cstodo = await getCstodos();
  }

  // cstodo format
  if (tokens[1] === 'format') {
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
      fmtText += bulletEmoji[i] + ' ' + cstodo[page_offset + i].content + '\n';
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


  let maxLen = Math.max(...cstodo.map((item) => item.content.length));
  let sumLen = cstodo.map((item) => item.content.length).reduce((x, y) => x + y, 0);

  while (cstodo.length > 25 || sumLen > 300) {
    while (true) {
      let i = Math.floor(Math.random() * cstodo.length);

      if (Math.random() < cstodo[i].content.length / maxLen) {
        let query = cstodo[i].content;

        await removeCstodo(query);

        await webClient.chat.postMessage({
          text: `cs님의 할 일이 너무 많습니다.. cs님의 할 일에서 무작위로 '${query}'를 골라서 제거했으니 수고하십시오..`,
          icon_emoji: emoji('communism'),
          channel: event.channel,
          username: 'Влади́мир Пу́тин',
        });

        cstodo = await getCstodos();
        sumLen -= query.length;

        break;
      }
    }
  }
  
  let fmtText = `:god: ${emoji('cs')} 할 일 목록 :god: (Request time: ${date.getHours()}시 ${date.getMinutes()}분 ${date.getSeconds()}초)\n` + cstodo.map((todo) => todo.content).join(', ');

  await webClient.chat.postMessage({
    text: fmtText,
    channel: event.channel,
    icon_emoji: emoji('default'),
  });
}

export default onCstodo;