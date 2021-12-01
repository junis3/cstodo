
export interface Arg {
    key: string,
    value: string | null,
}

export interface QueryType {
    command: string[],
    args: Arg[],    
}

// Argument set with key : the key
// Argument set without key: empty string
// Argument not set: null
export const getArg = (flags: string[], args: Arg[]) => {
    const existNames = flags.filter((name) => args.find((arg) => arg.key === name) !== undefined);

    if (existNames.length === 0) return null;
    if (existNames.length > 1) return new Error(`같은 인자들 ${flags}들이 여러 개 동시에 주어졌습니다.`);
    
    const name = existNames[0];

    const matchedArgs = args.filter((arg) => flags.find((name) => name === arg.key) !== undefined);
    if (matchedArgs.length > 1) return new Error(`인자 ${name}이 중복되어 주어졌습니다.`);
        
    return args.find((arg) => arg.key === name)!.value || '';
}

const parseQuery = (rawCommand: string) => {
    const arr = rawCommand.split(' -')

    const command = arr[0].split(' ');
    const args: Arg[] = arr.slice(1).map((str) => {
        const idx = str.indexOf(' ');

        if (idx === -1) return {
            key: '-' + str,
            value: null,
        }

        else return {
            key: '-' + str.slice(0, idx),
            value: str.slice(idx+1).trim(),
        }
    })

    return {
        command,
        args,
    } as QueryType;
}

export default parseQuery;