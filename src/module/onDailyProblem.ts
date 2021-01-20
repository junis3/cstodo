import { getHistory, setHistory } from '../etc/filesystem';
import getCurrentHistory from '../etc/getCurrentHistory';
import { webClient } from '../index';
import getProblemInfo from '../etc/getProblemInfo';
import { cstodoChannel } from '../config';

const emptyMessage = [
    ':blobsob: '.repeat(23),
    '없었습니다!!!! :tada: :tada: :tada: 오늘 cs님은 BOJ에서 문제를 풀지 않으셨습니다!!!! :tada: :tada: :tada:',
    '저 오늘 우체국 가서 싸우고 왔어요... cs님의 PS 실력을 박스에 담아서 부치려고 했더니 그렇게 큰 박스는 없다는 거 있죠....... 내일은 실력 보여주실 수 있으시죠? :blobcry: :blobhug: :시신:',
    'Hello, I am @realPrseidentTrmup. Today\'s BOJ record is a fraud. I know CS has solved 520 diamond today. THEY STOLE THE RECORD. CS WON THE ELECTION!!',
    'cs님의 PS실력을 구경하다가 여름이 가버렸어요... \'더 위\'가 없어서...... 코로나가 끝날 때쯤이면 cs님의 루비 학살을 볼 수 있겠죠..?',
    '헉대박 .... cs님이 저번에 MBTI 검사했을 때 RUBY 나오셨다면서요???? 얼마 안 있어 cs님의 루비 학살쇼를 볼 수 있겠죠???????',
    '-_-;;;; cs님...... cs님이 다이아 문제 풀 때까지 숨 참을거야....',
]

const diamondEmptyMessage = [
    '히잉.... cs님이 오늘 다이아를 안 푸셔서 슬랙봇 마음이 너무 아파요... 내일은 꼭 다이아 풀어주시는 거죠? :blobsob: :blobsob: :blobsob: :blobcry: :blobhug: :시신:',
];

const dailyProblem = async () => {
    const history = await getHistory();
    const currentHistory = await getCurrentHistory();

    setHistory(currentHistory);

    const today = (await Promise.all(currentHistory.filter((value) => !history.find((item) => item === value)).map(async (id) => await getProblemInfo(Number.parseInt(id))))).filter((item) => !!item);

    const diamonds = today.filter((item) => item.level.includes('dia'));
    const rubys = today.filter((item) => item.level.includes('ruby'));

    const postResult = () => {
        if (today.length > 0) {
            webClient.chat.postMessage({
                text: '오늘 :god: :시신: :god:님이 푼 문제들입니다!\n' + today.map((problem) => `<http://icpc.me/${problem.id}|:${problem.level}:${problem.title}>`).join(', '),
                channel: cstodoChannel,
                icon_emoji: ':시신:',
            });
        }
        
        if (today.length === 0) {
            webClient.chat.postMessage({
                text: emptyMessage[Math.floor(Math.random()*emptyMessage.length)],
                channel: cstodoChannel,
                icon_emoji: ':blobsob:'
            });
        } else if (diamonds.length === 0 && rubys.length === 0) {
            webClient.chat.postMessage({
                text: diamondEmptyMessage[Math.floor(Math.random()*diamondEmptyMessage.length)],
                channel: cstodoChannel,
                icon_emoji: ':blobsob:'
            });
        }

        rubys.forEach((problem) => {
            webClient.chat.postMessage({
                text: `:tada: cs신님께 새로 학살당한 루비! <http://icpc.me/${problem.id}|:${problem.level}:${problem.title}> 입니다! :시신: :tada:`,
                channel: cstodoChannel,
                icon_emoji: ':시신:',
            });
        });
    };

    if (Math.random() < 0.15 || (diamonds.length === 0 && rubys.length === 0) || rubys.length > 0) {
        webClient.chat.postMessage({
            text: '오늘 cs님은 몇 문제를 풀었을까요..? 60초 후에 공개합니다!!!',
            channel: cstodoChannel,
            icon_emoji: ':시신:',
        });

        setTimeout(postResult, 60000);
    } else {
        postResult();
    }
}

export default dailyProblem;