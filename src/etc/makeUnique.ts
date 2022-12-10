export default function makeUnique<T>(arr: T[]) {
  return Array.from(new Set<T>(arr));
}
