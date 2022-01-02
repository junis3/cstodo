import { isInteger } from './isInteger';

test('normal case', () => {
  expect(isInteger('420')).toBe(true);
});

test('non-negative only', () => {
  expect(isInteger('-8')).toBe(false);
});

test('exceptional char', () => {
  expect(isInteger('asdf')).toBe(false);
});

test('fixme: empty string is integer', () => {
  expect(isInteger('')).toBe(true);
});
