export const validateBar = (prog: number, goal: number) => { // isInteger에서 이미 음수는 걸러짐
    if(goal <= 0) {
      return "목표치가 0이면 똑떨이에요...";
    }
    if(prog > goal) {
      return "진행도가 목표치보다 높으면 똑떨이에요...";
    }
    return undefined;
}