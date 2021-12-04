import recommendProblem from '../etc/recommendProblem';
import {postMessage} from '../etc/postMessage';
import { history2Href } from '../database/history';
import { addGreenGold, getLatestGreenGold } from '../database/greengold';
import getCurrentHistory from '../etc/getCurrentHistory';
import getProblemInfo from '../etc/getProblemInfo';
import { getUser } from '../database/user';


export const chooseProblem = async (todoCommand = "greentodo") => {
    const problem = await recommendProblem(todoCommand);
    const user = await getUser(todoCommand);
    if(!user) return;    
    addGreenGold(user.command, {id: problem.id, title: problem.title});

    const href = history2Href(problem);

    const username = user.name;
    const home = user.home!!
    console.log(username, home);
    await postMessage({
        text: `${username}님, 오늘의 문제는 ${href}입니다!`,
        channel: home,
        icon_emoji: ':green55:',
        username: 'GreenGold',
    });
}

export const validateProblem = async (todoCommand = "greentodo") => {
    const user = await getUser(todoCommand);
    if(!user) return;
    const $ = await getLatestGreenGold(user.command);
    const home = user.home!!
    if($ === null || $[0] === undefined) {
        await postMessage({
            text: `똑바로 안 만들어? 추천된 문제가 없대요...`,
            channel: home,
            icon_emoji: `:blobfudouble:`,
            username: 'GreenGold',
        });
        return;
    }
    const problem = $[0];

    const currentHistory = await getCurrentHistory(user.bojHandle!!);
    const href = history2Href(await getProblemInfo(problem.id!!));

    
    if(currentHistory.find((id) => id === problem.id)) {
        await postMessage({
            text: `${href} : `,
            channel: home,
            icon_emoji: `:blobgreenorz:`,
            username: 'GreenGold',
        });
        await postMessage({
            text: `:dhk2:`,
            channel: home,
            icon_emoji: `:blobgreenorz:`,
            username: 'GreenGold',
        });
        await postMessage({
            text: `*역사상 최고, ${user.name.toUpperCase()}*`,
            channel: home,
            icon_emoji: `:blobgreenorz:`,
            username: 'GreenGold',
        });
    }else{
        await postMessage({
            text: `${href} : `,
            channel: home,
            icon_emoji: `:blobgreensad:`,
            username: 'GreenGold',
        });
        await postMessage({
            text: `:blobghostnotlikethis:`,
            channel: home,
            icon_emoji: `:blobgreensad:`,
            username: 'GreenGold',
        });
        await postMessage({
            text: `너무해`,
            channel: home,
            icon_emoji: `:blobgreensad:`,
            username: 'GreenGold',
        });
        await postMessage({
            text: `:blobghostnotlikethis:`,
            channel: home,
            icon_emoji: `:blobgreensad:`,
            username: 'GreenGold',
        });
        await postMessage({
            text: `어떻게 숙제를 안할 수가 있어`,
            channel: home,
            icon_emoji: `:blobgreensad:`,
            username: 'GreenGold',
        });
    }
    return
}
