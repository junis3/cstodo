import { getArg, Arg } from './parseQuery';

const globalFlags : Arg[] = [
  { key: '-a', value: null },
  { key: '-b', value: 'asdf' },
  { key: '-c', value: 'vc1' },
  { key: '-c', value: 'vc2' },
];

test('single argument', () => {
  const arg = getArg(['-a'], globalFlags);
  expect(arg).toBe('');
});

test('nonexistent argument', () => {
  const arg = getArg(['--nowhere'], globalFlags);
  expect(arg).toBe(null);
});

test('multiple argument with 1 match', () => {
  const arg = getArg(['-b', '--aliasOfB'], globalFlags);
  expect(arg).toBe('asdf');
});

test('multiple arguments', () => {
  const arg = getArg(['-a', '-b'], globalFlags);
  expect(typeof arg).toBe('object');
  if (typeof arg === 'object') {
    expect(arg!.message).toBe(`같은 인자들 ${['-a', '-b']}들이 여러 개 동시에 주어졌습니다.`);
  }
});

test('duplicate argument', () => {
  const arg = getArg(['-c'], globalFlags);
  expect(typeof arg).toBe('object');
  if (typeof arg === 'object') {
    expect(arg!.message).toBe(`인자 ${'-c'}이 중복되어 주어졌습니다.`);
  }
});
