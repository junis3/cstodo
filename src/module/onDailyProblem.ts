import getCurrentHistory from '../etc/getCurrentHistory';
import { webClient } from '../index';
import getProblemInfo from '../etc/getProblemInfo';
import { cstodoChannel } from '../config';
import { emoji } from '../etc/cstodoMode';
import { addHistory, getHistories, removeHistory } from '../database/history';

const emptyMessage = () => [
    emoji('sob').repeat(23),
    `없었습니다!!!! :tada: :tada: :tada: 오늘 cs님은 BOJ에서 문제를 풀지 않으셨습니다!!!! :tada: :tada: :tada:`,
    `저 오늘 우체국 가서 싸우고 왔어요... cs님의 PS 실력을 박스에 담아서 부치려고 했더니 그렇게 큰 박스는 없다는 거 있죠....... 내일은 실력 보여주실 수 있으시죠? ${emoji('cry')} ${emoji('hug')} ${emoji('cs')}`,
//    `Hello, I am @realPrseidentTrmup. Today's BOJ record is a fraud. I know CS has solved 520 diamonds today. THEY STOLE THE RECORD. CS WON THE ELECTION!!`,
]

const diamondEmptyMessage = () => [
    `히잉.... cs님이 오늘 다이아를 안 푸셔서 슬랙봇 마음이 너무 아파요... 내일은 꼭 다이아 풀어주시는 거죠? ${emoji('sob')} ${emoji('sob')} ${emoji('sob')} ${emoji('cry')} ${emoji('hug')} ${emoji('cs')}`,
    `cs님은 유모차세요? 어쩜 오늘도 다이아를 안 풀어서 저를 이렇게 '애타게' 만드세요..`,
    `cs님의 PS실력을 구경하다가 여름이 가버렸어요... '더 위'가 없어서...... 코로나가 끝날 때쯤이면 cs님의 루비 학살을 볼 수 있겠죠..?`,
//    `헉.. 대박.... cs님이 저번에 MBTI 검사했을 때 RUBY 나오셨다면서요???? 얼마 안 있어 cs님의 루비 학살쇼를 볼 수 있겠죠???????`,
];

function randomChoice<Type>(array: Type[]) {
    return array[Math.floor(Math.random() * array.length)];
}

const dailyProblem = async () => {
    const history = await getHistories();
    const currentHistory = await getCurrentHistory();

    const todayRemove = history.filter((history) => !currentHistory.find((id) => history.id === id));
    const todayAdd = await Promise.all(currentHistory.filter((id) => !history.find((history) => history.id === id)).map((id) => getProblemInfo(id)));

    await Promise.all(todayRemove.map(async (history) => await removeHistory(history.id)));
    await Promise.all(todayAdd.map(async (history) => await addHistory({
        id: history.id,
        title: history.title,
        source: history.source,
    })));

    const diamonds = todayAdd.filter((item) => item.level!.includes('dia'));
    const rubys = todayAdd.filter((item) => item.level!.includes('ruby'));
    
    const postResult = async () => {
        if (todayAdd.length > 0) {
            await webClient.chat.postMessage({
                text: `오늘 :god: ${emoji('cs')} :god:님이 푼 문제들입니다!\n` + todayAdd.map((problem) => `<http://icpc.me/${problem.id}|:${problem.level}:${problem.title}>`).join(', '),
                channel: cstodoChannel,
                icon_emoji: emoji('default'),
            });
        }
        
        if (todayAdd.length === 0) {
            await webClient.chat.postMessage({
                text: randomChoice(emptyMessage().concat(diamondEmptyMessage())),
                channel: cstodoChannel,
                icon_emoji: emoji('sob'),
            });
        } else if (diamonds.length === 0 && rubys.length === 0) {
            await webClient.chat.postMessage({
                text: randomChoice(diamondEmptyMessage()),
                channel: cstodoChannel,
                icon_emoji: emoji('sob'),
            });
        }

        await Promise.all(rubys.map(async (problem) => {
            await webClient.chat.postMessage({
                text: `:tada: cs신님께 새로 학살당한 루비! <http://icpc.me/${problem.id}|:${problem.level}:${problem.title}> 입니다! ${emoji('cs')} :tada:`,
                channel: cstodoChannel,
                icon_emoji: `:${problem.level}:`,
            });
        }));
    };

    if (Math.random() < 0.15 || (diamonds.length === 0 && rubys.length === 0) || rubys.length > 0) {
        webClient.chat.postMessage({
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

    // Remove manually after the shot
    await webClient.chat.postMessage({
        text: '그런데, 오늘 cs님이 토끼귀 실사 착용 인증샷은 올렸을까요??????',
        channel: cstodoChannel,
    })
}

export default dailyProblem;