import { Block } from '@slack/types/dist/index';
import { getBars } from '../../database/bar';
import { isThemeType, UserType } from '../../database/user';
import { QueryType } from '../../etc/parseQuery';
import { formatBar } from './barFormatter';
import { replyMessage, replySuccess } from '../../etc/postMessage';
import { emoji } from '../../etc/theme';
import { SlackMessageEvent } from '../../command/event';

const bulletEmoji = [
  ':one:',
  ':two:',
  ':three:',
  ':four:',
  ':five:',
  ':six:',
  ':seven:',
  ':eight:',
  ':nine:',
  ':keycap_ten:',
];

const onBarDefault = async (query: QueryType, event: SlackMessageEvent, user: UserType) => {
  const allBars = await getBars(user.id);
  const bars = allBars;

  if (bars.length > 0) {
    const blocks = bars.map((bar, k) => ({
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*${k + 1}. ${bar.content}*` },
        { type: 'mrkdwn', text: `${formatBar(bar, user)}` },
      ],
    }));
    if (bars.length < allBars.length) {
      blocks.push({
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `이밖에도 ${user.name}님의 진행중인 일이 ${
              allBars.length - bars.length
            }개나 있어요... ${emoji('add', user.theme)}`,
          },
        ],
      });
    }
    await replyMessage(event, user, {
      text: '',
      attachments: [
        {
          blocks,
          color: 'good',
        },
      ],
      channel: event.channel,
      icon_emoji: emoji('aww', user.theme),
      username: `${user.name}님의 비서`,
    });
  } else {
    await replySuccess(event, user, `${user.name}님의 진행중인 일이 없습니다!`, 'add');
  }
};

export default onBarDefault;
