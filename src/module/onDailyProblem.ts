import { getHistory, setHistory } from '../etc/filesystem';
import getCurrentHistory from '../etc/getCurrentHistory';
import { webClient } from '../index';
import getProblemInfo from '../etc/getProblemInfo';
import { cstodoChannel } from '../config';

const dailyProblem = async () => {
    const history = await getHistory();
    const currentHistory = await getCurrentHistory();

    setHistory(currentHistory);

    const today = (await Promise.all(currentHistory.filter((value) => !history.find((item) => item === value)).map(async (id) => await getProblemInfo(Number.parseInt(id))))).filter((item) => !!item);

    const diamonds = today.filter((item) => item.level.includes('dia'));
    const rubys = today.filter((item) => item.level.includes('ruby'));

    webClient.chat.postMessage({
        text: '오늘 :god: :시신: :god:님이 푼 문제들: ' + today.map((problem) => `<http://icpc.me/${problem.id}|:${problem.level}:${problem.title}>`).join(', '),
        channel: cstodoChannel,
        icon_emoji: ':시신:',
    });

    if (diamonds.length === 0 && rubys.length === 0) {
        webClient.chat.postMessage({
            text: '히잉.... cs님이 오늘 다이아를 안 푸셔서 슬랙봇 마음이 너무 아파요... 내일은 꼭 다이아 풀어주시는 거죠? :blobcry: :blobhug: :시신:',
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
}

export default dailyProblem;