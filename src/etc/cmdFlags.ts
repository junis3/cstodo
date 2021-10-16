interface StringListMap {
    [key: string]: string[];
}

const FlagMap : StringListMap = {
    due: ['--due', '-d', '--time', '-t'],
    content: ['--content', '-c'],
    progress: ['--progress', '--prog', '-p'],
    goal: ['--goal', '-g'],
    help: ['--help', '-h']
}

const getFlags = (name : string) => {
    return FlagMap[name];
}

export default getFlags;