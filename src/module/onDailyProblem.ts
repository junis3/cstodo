import getCurrentHistory from '../etc/getCurrentHistory';
import getProblemInfo from '../etc/getProblemInfo';
import { csGod, cstodoChannel } from '../config';
import { emoji } from '../etc/theme';
import { addHistory, getHistories, removeHistory } from '../database/history';
import { postMessage } from '../etc/postMessage';

const diamondEmptyMessages = () => [
  `히잉.... <@${csGod}>님이 오늘 다이아를 안 푸셔서 슬랙봇 마음이 너무 아파요... 내일은 꼭 다이아 풀어주시는 거죠? ${emoji('sob')} ${emoji('sob')} ${emoji('sob')} ${emoji('cry')} ${emoji('hug')} ${emoji('cs')}`,
  `<@${csGod}>님은 유모차세요? 어쩜 오늘도 다이아를 안 풀어서 저를 이렇게 '애타게' 만드세요..`,
  `<@${csGod}>님의 PS실력을 구경하다가 여름이 가버렸어요... '더 위'가 없어서...... 코로나가 끝날 때쯤이면 cs님의 루비 학살을 볼 수 있겠죠..?`,
  `헉.. 대박.... <@${csGod}>님이 저번에 MBTI 검사했을 때 RUBY 나오셨다면서요???? 얼마 안 있어 cs님의 루비 학살쇼를 볼 수 있겠죠???????`,
];

const emptyMessages = () => [
  emoji(`<@${csGod}>`).repeat(23),
  `없었습니다!!!! :tada: :tada: :tada: 오늘 <@${csGod}>님은 BOJ에서 문제를 풀지 않으셨습니다!!!! :tada: :tada: :tada:`,
  `저 오늘 우체국 가서 싸우고 왔어요... <@${csGod}>님의 PS 실력을 박스에 담아서 부치려고 했더니 그렇게 큰 박스는 없다는 거 있죠....... 내일은 실력 보여주실 수 있으시죠? ${emoji('cry')} ${emoji('hug')} ${emoji('cs')}`,
].concat(...diamondEmptyMessages());

function randomChoice<Type>(array: Type[]) {
  return array[Math.floor(Math.random() * array.length)];
}

const dailyProblem = async () => {
  const history = await getHistories();
  const currentHistory = await getCurrentHistory();

  const todayRemove = history.filter((history) => !currentHistory.find((id) => history.id === id));
  const todayAdd = await Promise.all(
    currentHistory
      .filter((id) => !history.find((history) => history.id === id))
      .map((id) => getProblemInfo(id)),
  );

  await Promise.all(todayRemove.map(async (history) => removeHistory(history.id)));
  await Promise.all(todayAdd.map(async (history) => addHistory({
    id: history.id,
    title: history.title,
    source: history.source,
  })));

  const diamonds = todayAdd.filter((item) => item.level!.includes('dia'));
  const rubys = todayAdd.filter((item) => item.level!.includes('ruby'));

  const postResult = async () => {
    if (todayAdd.length > 0) {
      if (todayAdd.length > 100) {
        await postMessage({
          text: `오늘 ${emoji('cs')}님이 푸신 문제가 ${todayAdd.length}개나 된다고 해요... 이걸 다 말하다가는 채널이 망할 것 같아요 ${emoji('ddokddul')}`,
          channel: cstodoChannel,
          icon_emoji: emoji('ddokddul'),
        });
        return;
      }
      await postMessage({
        text: `오늘 :god: ${emoji('cs')} :god:님이 푼 문제들입니다!\n${todayAdd.map((problem) => `<http://icpc.me/${problem.id}|:${problem.level}:${problem.title}>`).join(', ')}`,
        channel: cstodoChannel,
        icon_emoji: emoji('default'),
      });
    }

    if (todayAdd.length === 0) {
      await postMessage({
        text: randomChoice(emptyMessages().concat(diamondEmptyMessages())),
        channel: cstodoChannel,
        icon_emoji: emoji('sob'),
      });
    } else if (diamonds.length === 0 && rubys.length === 0) {
      await postMessage({
        text: randomChoice(diamondEmptyMessages()),
        channel: cstodoChannel,
        icon_emoji: emoji('sob'),
      });
    }

    await Promise.all(rubys.map(async (problem) => {
      await postMessage({
        text: `:tada: cs신님께 새로 학살당한 루비! <http://icpc.me/${problem.id}|:${problem.level}:${problem.title}> 입니다! ${emoji('cs')} :tada:`,
        channel: cstodoChannel,
        icon_emoji: `:${problem.level}:`,
      });
    }));
  };

  if (Math.random() < 0.15 || (diamonds.length === 0 && rubys.length === 0) || rubys.length > 0) {
    await postMessage({
      text: '오늘 cs님은 몇 문제를 풀었을까요..? 60초 후에 공개합니다!!!',
      channel: cstodoChannel,
      icon_emoji: emoji('default'),
    });

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        postResult();
        resolve();
      }, 60000);
    });
  } else {
    postResult();
  }
};

export default dailyProblem;
