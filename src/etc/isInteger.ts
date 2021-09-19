export const isInteger = (s: string) => {
    for (let c of s.split('')) {
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].find((x) => x === c) === undefined) return false;
    }
    return true;
}