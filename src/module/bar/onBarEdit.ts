import { UserType } from '../../database/user';
import { replyDdokddul, replyFail, replySuccess } from '../../etc/postMessage';
import { getArg, QueryType } from '../../etc/parseQuery';
import { isInteger } from '../../etc/isInteger';
import preprocessContent from '../../etc/preprocessContent';
import { BarType, editBar, getBars } from '../../database/bar';
import { validateBar } from '../../etc/validateBar';
import getFlags from '../../etc/cmdFlags';


const onBarEdit = async ({ command, args }: QueryType, event: any, user: UserType) => {
    let bars = await getBars(user.id);

    const progArg = getArg(getFlags('progress'), args);
    const goalArg = getArg(getFlags('goal'), args);

    let newProg: number | undefined;
    if(progArg) {
    if(typeof progArg === 'string') {
        if(!isInteger(progArg)) {
        await replyDdokddul(event, user, `제가 너무 똑떨이라 말씀하신 진행 상태를 잘 이해를 못했어요... 죄송합니다...`);
        return;
        }
        newProg = Number.parseInt(progArg);
    }else{
        await replyDdokddul(event, user, `이런 이유로 저는 똑떨이에요... ${progArg.message}`);
        return;
    }
    }else{
        newProg = undefined;
    }

    let newGoal: number | undefined;
    if(goalArg) {
    if(typeof goalArg === 'string') {
        if(!isInteger(goalArg)) {
        await replyDdokddul(event, user, `제가 너무 똑떨이라 말씀하신 목표를 잘 이해를 못했어요... 죄송합니다...`);
        return;
        }
        newGoal = Number.parseInt(goalArg);
    }else{
        await replyDdokddul(event, user, `이런 이유로 저는 똑떨이에요... ${goalArg.message}`);
        return;
    }
    }else{
        newGoal = undefined;
    }

  const contentArg = getArg(getFlags('content'), args);

  let newContent : string | undefined;

  if (!contentArg) {
    newContent = undefined;
  } else if (typeof contentArg === 'string') {
    newContent = preprocessContent(contentArg);
  } else {
    await replyDdokddul(event, user, `이런 이유로 저는 똑떨이에요...\n${contentArg.message}`)
    return;
  }

  const change: Partial<BarType> = {
      progress: newProg,
      goal: newGoal,
      content: newContent,
  };

  if (newProg === undefined) delete change.progress;
  if (newGoal === undefined) delete change.goal;
  if (!newContent) delete change.content;

  let changeString = '';

  if (newProg !== undefined) changeString += `진행도를 ${newProg}로, `;
  if (newGoal !== undefined) changeString += `목표치를 ${newGoal}로, `;
  if (newContent) changeString += `내용을 *${newContent}* 로, `;

  if (changeString.length === 0) {
    await replyDdokddul(event, user, `바꿀 게 없어서 똑떨이에요...`);
    return;
  }

  changeString = changeString.slice(0, changeString.length - 2);

  if (command.length === 1) {
    await replyDdokddul(event, user, `edit 쿼리에 인자가 없으면 똑떨이에요...`)
    return;
  } 


  let contents = new Set<string>();

  for (let s of command.slice(1).join(' ').split(',')) {
    let content = s.trim();

    if (!isInteger(content)) {
      if (!bars.find((item) => item.content === content)) {
        await replyDdokddul(event, user, `할 일에 없는 *${content}* 를 바꾸면 똑떨이에요...`)
        return;
      }
    } else {
      let x = Number.parseInt(content);

      if (x <= 0 || x > bars.length) {
        await replyDdokddul(event, user, `할 일이 ${bars.length}개인데 여기서 ${x}번째 할일을 바꾸면 똑떨이에요...`)
        return;
      }
      
      const prog = (newProg !== undefined ? newProg : bars[x-1].progress);
      const goal = (newGoal !== undefined ? newGoal : bars[x-1].goal);
      let validateFailMsg = validateBar(prog, goal);
      if(validateFailMsg !== undefined) {
        await replyDdokddul(event, user, validateFailMsg);
        return;
      }
      content = bars[x-1].content;
    }
    contents.add(content);
  }

  for(let content of Array.from(contents)) {
    if (await editBar(content, change)) {
      await replySuccess(event, user, `${user.name}님의 할 일에서 *${content}* 의 ${changeString} 바꾸었어요!`, 'edit', {forceUnmute: true});
    } else {
      await replyFail(event, user, `${user.name}님의 할 일에서 *${content}* 을 바꾸는 데 실패했어요...`);
    }
  }
}

export default onBarEdit;