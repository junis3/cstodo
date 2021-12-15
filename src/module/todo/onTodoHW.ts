import { UserType } from '../../database/user';
import { getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/theme';
import { replyDdokddul, replySuccess } from '../../etc/postMessage';
import { QueryType } from '../../etc/parseQuery';
import { getLatestGreenGolds, greenGoldToHrefNoLevel, GreenGoldType } from '../../database/greengold';
import { SlackMessageEvent } from '../../slack/event';
import { TodoRouter } from '../router';

  
const onTodoHW: TodoRouter = async ({ event, user }) => {
    const numProblems = user.numProbsPerCycle || 1;
    console.log(user.numProbsPerCycle, numProblems);
    const problems = await getLatestGreenGolds(user.command, numProblems);
    if(problems === null || !problems.every((problem) => problem !== undefined) || problems.length < numProblems) {
        await replyDdokddul(event, user, `${user.name}님은 숙제를 받은 적이 없어요... 관리자에게 다음 정보를 주시면 생성해드릴 거예요...\n- 숙제를 받고 싶은 주기와 시점\n- 숙제를 뽑는 solved.ac 쿼리\n- 한번에 받을 숙제 개수\n관리자가 귀찮아하면 지연될 수 있어요...`);
        return [];
    }
    const hrefs = await Promise.all(
        problems.map(
            (problem: GreenGoldType) => greenGoldToHrefNoLevel(problem)
        )
    );
    const href = hrefs.join(", ");
    const josa = hrefs.length > 1 ? '들은' : '는';
    await replySuccess(event, user, `${user.name}님의 최근 숙제${josa} ${href}입니다!`, 'hw');
    return [];
}

export default onTodoHW;