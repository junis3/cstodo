import { getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/cstodoMode';
import { webClient } from '../../index';

const bulletEmoji = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"];

const onCstodoFormat = async (event: any) => {
    const text : string = event.text;
    const tokens = text.split(' ').map((token) => token.trim());

    const cstodo = await getCstodos();
    const maxPage = Math.ceil(cstodo.length / bulletEmoji.length - 0.001);
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
    await webClient.chat.postMessage({
      text: fmtText,
      channel: event.channel,
      icon_emoji: emoji('default'),
    });
    return;
}

export default onCstodoFormat;