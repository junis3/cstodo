import { getCstodos } from '../database/cstodo';
import { getAllUsers } from '../database/user';
import { postMessage } from './postMessage';
import timeToString from './timeToString';

const minute = 60000;

async function checkAllTodoAlarms(date: Date) {
  const users = await getAllUsers();
  const time = date.getTime();

  users.forEach(async (user) => {
    if (!user.home) return;
    if (user.useAlarm === 'always') {
      const todos = await getCstodos(user.command);

      todos.forEach(async (todo) => {
        if (Math.floor(todo.due / minute) === Math.floor(time / minute)) {
          await postMessage({
            text: `${user.name}님의 할 일 알림입니다!\n*${todo.content}*\n마감 일시: ${timeToString(todo.due)}`,
            channel: user.home || '',
            username: `${user.name}님의 똑똑한 비서`,
          });
        }
      });
    }
  });
}

export default checkAllTodoAlarms;
