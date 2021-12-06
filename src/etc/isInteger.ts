export function isInteger(s: string): boolean {
  return /^[0-9]*$/.test(s);
}