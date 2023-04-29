export interface Arg {
  key: string;
  value: string | null;
}

export interface QueryType {
  command: string[];
  args: Arg[];
  rawArgString: string;
}

// Argument set with key : the key
// Argument set without key: empty string
// Argument not set: null
export const getArg = (flags: string[], args: Arg[]) => {
  const existNames = flags.filter(
    (name) => args.find((arg) => arg.key === name) !== undefined
  );

  if (existNames.length === 0) return null;
  if (existNames.length > 1)
    return new Error(`같은 인자들 ${flags}들이 여러 개 동시에 주어졌습니다.`);

  const name = existNames[0];

  const matchedArgs = args.filter(
    (arg) => flags.find((name) => name === arg.key) !== undefined
  );
  if (matchedArgs.length > 1)
    return new Error(`인자 ${name}이 중복되어 주어졌습니다.`);

  return args.find((arg) => arg.key === name)!.value || '';
};

const findFlagFromRawArgString = (flag: string, rawArgString: string) => {
  const idx = rawArgString.indexOf(flag);

  if (idx === -1) return undefined;

  const nextIdx = rawArgString.indexOf(' ', idx + flag.length);

  if (nextIdx === -1) return null;

  const getNextQuoteOpener = (nextIdx: number) => {
    const results = ['"', '“', "'"].map((x) =>
      rawArgString.indexOf(x, nextIdx)
    );

    return results.find((x) => x !== -1) ?? -1;
  };

  const getNextQuoteCloser = (nextIdx: number) => {
    const results = ['"', '”', "'"].map((x) =>
      rawArgString.indexOf(x, nextIdx)
    );

    return results.find((x) => x !== -1) ?? -1;
  };

  const nextQuoteOpener = getNextQuoteOpener(nextIdx);

  if (
    nextQuoteOpener !== -1 &&
    rawArgString.slice(nextIdx, nextQuoteOpener).trim() === ''
  ) {
    const nextQuoteCloser = getNextQuoteCloser(nextIdx + 2);
    if (nextQuoteCloser === -1) return null;
    return rawArgString.slice(nextQuoteOpener + 1, nextQuoteCloser);
  }

  const nextSpaceIdx = rawArgString.indexOf(' ', nextIdx + 1);
  if (nextSpaceIdx === -1) return rawArgString.slice(nextIdx + 1);
  const value = rawArgString.slice(nextIdx + 1, nextSpaceIdx).trim();

  if (value.startsWith('-')) {
    return '';
  }
  return value;
};

export const getArgFromRawArgString = (
  flags: string[],
  rawArgString: string
) => {
  const flagsWithoutDuplicates = flags.filter(
    (name, idx) => flags.indexOf(name) === idx
  );
  const argsMatched = flagsWithoutDuplicates
    .map((flag) => findFlagFromRawArgString(flag, rawArgString))
    .filter((arg) => arg !== undefined);
  if (argsMatched.length === 1) {
    return argsMatched[0];
  }
  if (argsMatched.length > 1) {
    return new Error('중복되는 인자가 있습니다.');
  }
  return new Error('요청한 인자가 없습니다.');
};

const parseQuery = (rawCommand: string) => {
  const arr = rawCommand.split(' -');

  const command = arr[0].split(' ');
  const args: Arg[] = arr.slice(1).map((str) => {
    const idx = str.indexOf(' ');

    if (idx === -1) {
      return {
        key: `-${str}`,
        value: null,
      };
    }

    return {
      key: `-${str.slice(0, idx)}`,
      value: str.slice(idx + 1).trim(),
    };
  });
  const rawArgString = `-${arr.slice(1).join(' -')}`;

  return {
    command,
    args,
    rawArgString,
  } as QueryType;
};

export default parseQuery;
