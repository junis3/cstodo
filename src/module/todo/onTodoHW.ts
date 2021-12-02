import { UserType } from '../../database/user';
import { getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/theme';
import { replyDdokddul, replySuccess } from '../../etc/postMessage';
import { QueryType } from '../../etc/parseQuery';
import { getLatestGreenGold, greenGoldToHrefNoLevel } from '../../database/greengold';

  
const onTodoHW = async (query: QueryType, event: any, user: UserType) => {
    const $ = await getLatestGreenGold(user.id);
    if($ === null || $[0] === undefined) {
        await replyDdokddul(event, user, `${user.name}님은 숙제를 받은 적이 없어서 똑떨이에요...`);
        return;
    }
    const problem = $[0];
    const href = greenGoldToHrefNoLevel(problem);
    await replySuccess(event, user, `${user.name}님의 최근 숙제는 ${href}입니다!`, 'hw');
    return;
}

export default onTodoHW;