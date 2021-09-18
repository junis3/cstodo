import { BarType } from "../../database/bar";
import { emoji } from '../../etc/theme';
import { isThemeType, UserType } from '../../database/user';

export const formatBar = (bar: BarType, user: UserType) => {
    let goal = bar.goal;
    let progress = bar.progress;
    if(goal === 0) {
        console.log(`bar: division by zero. owner: ${bar.owner}, content: ${bar.content}`);
        goal = 100;
    }      
    if(progress < 0 || progress > goal) {
        console.log(`bar: progress (=${progress}) violates the range [0, ${goal}]. owner: ${bar.owner}, content: ${bar.content}`);
        progress = 0;
    }
    let dones = Math.floor(10 * progress / goal);
    let wips = (10 * progress % goal === 0 ? 0 : 1);
    let readies = 10 - dones - wips;
    let emos = emoji('bar_done', user.theme).repeat(dones) + 
               emoji('bar_wip', user.theme).repeat(wips) +
               emoji('bar_ready', user.theme).repeat(readies);
    return `${emos} (${progress}/${goal})`;
}
