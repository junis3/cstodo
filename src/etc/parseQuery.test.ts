import parseQuery, { QueryType } from './parseQuery';

test('argument with single chars', () => {
  const pq: QueryType = parseQuery('cmd subcmd -a va -b vb -c');
  expect(pq.command).toStrictEqual(['cmd', 'subcmd']);
  expect(pq.args).toHaveLength(3);
  expect(pq.args.find((arg) => arg.key === '-a')!.value).toBe('va');
  expect(pq.args.find((arg) => arg.key === '-b')!.value).toBe('vb');
  expect(pq.args.find((arg) => arg.key === '-c')!.value).toBe(null);
  expect(pq.args.find((arg) => arg.key === '-strange')).toBe(undefined);
});

test('no cmd', () => {
  const pq: QueryType = parseQuery('-a va');
  expect(pq.command).toStrictEqual(['-a', 'va']);
  expect(pq.args).toHaveLength(0);
});

test('multiple boolean flags', () => {
  const pq: QueryType = parseQuery('cmd -a -b');
  expect(pq.command).toStrictEqual(['cmd']);
  expect(pq.args).toHaveLength(2);
  expect(pq.args.find((arg) => arg.key === '-a')!.value).toBe(null);
  expect(pq.args.find((arg) => arg.key === '-b')!.value).toBe(null);
});
