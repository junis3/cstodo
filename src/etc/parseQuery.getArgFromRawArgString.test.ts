import parseQuery, { getArg, getArgFromRawArgString, QueryType } from './parseQuery';

test('quoted solved.ac query', () => {
  const pq: QueryType = parseQuery('cstodo hw set -q "tier:d5..r1 -solved_by:cs71107"');
  expect(pq.command).toStrictEqual(['cstodo', 'hw', 'set']);
  expect(pq.rawArgString).toBe('-q "tier:d5..r1 -solved_by:cs71107"');
  expect(getArgFromRawArgString(['-q'], pq.rawArgString)).toBe('tier:d5..r1 -solved_by:cs71107');
});

test('normal query', () => {
  const pq: QueryType = parseQuery('cstodo hw set -n 10 -f -q "tier:d5..r1 -solved_by:cs71107"');
  expect(pq.command).toStrictEqual(['cstodo', 'hw', 'set']);
  expect(getArgFromRawArgString(['-n'], pq.rawArgString)).toBe('10');
  expect(getArgFromRawArgString(['-f'], pq.rawArgString)).toBe('');
  expect(getArgFromRawArgString(['-q'], pq.rawArgString)).toBe('tier:d5..r1 -solved_by:cs71107');
  const nullArg = getArgFromRawArgString(['--nowhere'], pq.rawArgString);
  expect(typeof nullArg).toBe('object');
  if (typeof nullArg === 'object') {
    expect(nullArg!.message).toBe('요청한 인자가 없습니다.');
  }
});
