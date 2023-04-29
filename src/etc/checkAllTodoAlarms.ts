import { SlackMessageEvent } from '../command/event';
import { PostEphemeralCommand } from '../command/PostEphemeralCommand';
import { PostMessageCommand } from '../command/PostMessageCommand';
import { getCstodos } from '../database/cstodo';
import { getAllUsers } from '../database/user';
import { postMessage } from './postMessage';
import { emoji } from './theme';
import timeToString from './timeToString';

const minute = 60000;
const minutes_per_day = 1440;

async function checkAllTodoAlarms(date: Date) {
  const users = await getAllUsers();
  const time = date.getTime();

  users.forEach(async (user) => {
    if (!user.home || !user.owner) return;
    if (user.useAlarm === 'always' || user.useAlarm === 'mention') {
      const todos = await getCstodos(user.id);

      todos.forEach(async (todo) => {
        if (
          !todo.due ||
          !todo.content ||
          todo.due > time + (minutes_per_day + 1) * minute
        ) {
          return;
        }
        const todo_minute = Math.floor(todo.due / minute) % minutes_per_day;
        const now_minute = Math.floor(time / minute) % minutes_per_day;
        if (todo_minute === now_minute) {
          const text = `${user.name}님의 할 일 알림입니다!\n*${
            todo.content
          }*\n마감 일시: ${timeToString(todo.due)}`;
          const channel = user.home!!;
          const username = `${user.name}님의 똑똑한 비서`;

          if (user.useAlarm === 'mention') {
            const mentionText = `<@${user.owner}>님, ${text}`;
            const mentionChannel = user.muted ? user.owner!! : channel;
            await new PostMessageCommand({
              channel: mentionChannel,
              text: mentionText,
              username,
              icon_emoji: emoji('remove', user.theme),
            }).exec();
          } else {
            // user.useAlarm === 'always'
            if (user.muted) {
              await new PostEphemeralCommand({
                channel,
                text,
                user: user.owner!!,
              }).exec();
            } else {
              await new PostMessageCommand({
                channel,
                text,
                username,
                icon_emoji: emoji('remove', user.theme),
              }).exec();
            }
          }
        }
      });
    }
  });
}

export default checkAllTodoAlarms;
