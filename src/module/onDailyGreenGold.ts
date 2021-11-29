import recommendProblem from '../etc/recommendProblem';
import {postMessage} from '../etc/postMessage';
import { green55, green55Channel } from '../config';
import { HistoryType } from '../database/history';
import { addGreenGold, getLatestGreenGold } from '../database/greengold';
import getCurrentHistory from '../etc/getCurrentHistory';
import getProblemInfo from '../etc/getProblemInfo';

const history2Href = (problem: HistoryType) => {
    return `<http://icpc.me/${problem.id}|:${problem.level}:${problem.title}>`;
}
export const chooseProblem = async () => {
    const problem = await recommendProblem();
    const username = 'Green55';
    addGreenGold(username, {id: problem.id, title: problem.title});

    const href = history2Href(problem);

    console.log(`<@${green55}> 오늘의 문제는 ${href}입니다!`);
    postMessage({
        text: `${username}님, 오늘의 문제는 ${href}입니다!`,
        channel: green55Channel,
        icon_emoji: ':green55:',
        username: 'GreenGold',
    });
}

export const validateProblem = async () => {
    const username = 'Green55';
    const $ = await getLatestGreenGold(username);
    if($ === null) {
        postMessage({
            text: `똑바로 안 만들어? 추천된 문제가 없대요...`,
            channel: green55Channel,
            icon_emoji: `:blobfudouble:`,
            username: 'GreenGold',
        });
        return;
    }
    const problem = $[0];
//    console.log(problem);

    const currentHistory = await getCurrentHistory(username);
    const href = history2Href(await getProblemInfo(problem.id!!));

    
    if(currentHistory.find((id) => id === problem.id)) {
        await postMessage({
            text: `${href} : `,
            channel: green55Channel,
            icon_emoji: `:blobgreenorz:`,
            username: 'GreenGold',
        });
        await postMessage({
            text: `:dhk2:`,
            channel: green55Channel,
            icon_emoji: `:blobgreenorz:`,
            username: 'GreenGold',
        });
        await postMessage({
            text: `*역사상 최고, GREEN55*`,
            channel: green55Channel,
            icon_emoji: `:blobgreenorz:`,
            username: 'GreenGold',
        });
    }else{
        await postMessage({
            text: `${href} : `,
            channel: green55Channel,
            icon_emoji: `:blobgreensad:`,
            username: 'GreenGold',
        });
        await postMessage({
            text: `:dk:`,
            channel: green55Channel,
            icon_emoji: `:blobgreensad:`,
            username: 'GreenGold',
        });
        await postMessage({
            text: `나 그린한테 미움받았어...`,
            channel: green55Channel,
            icon_emoji: `:blobgreensad:`,
            username: 'GreenGold',
        });
    }
    return
}
