
type TimeToken = 'year' | 'month' | 'date' | 'hour' | 'minute' | 'second';

interface MatchInfo {
    re: RegExp;
    args: TimeToken[];
}

const matchInfo: MatchInfo[] = [{
        re: /([0-9]{1,4})년/,
        args: ['year']
    }, {
        re: /([0-9]{1,2})월/,
        args: ['month']
    }, {
        re: /([0-9]{1,2})일/,
        args: ['date']
    }, {
        re: /([0-9]{1,2})시/,
        args: ['hour']
    }, {
        re: /([0-9]{1,2})분/,
        args: ['minute']
    }, {
        re: /([0-9]{1,2})초/,
        args: ['second']
    }, {
        re: /([0-9]{1,2}):([0-9]{1,2})/,
        args: ['hour', 'minute']
    }, {
        re: /([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})/,
        args: ['hour', 'minute', 'second']
    }, {
        re: /([0-9]{1,2})\.([0-9]{1,2})\./,
        args: ['month', 'date'],
    }, {
        re: /([0-9]{1,2})\.([0-9]{1,2})/,
        args: ['month', 'date'],
    }, {
        re: /([0-9]{1,2})\/([0-9]{1,2})/,
        args: ['month', 'date'],
    }, {
        re: /([0-9]{4})\.([0-9]{1,2})\.([0-9]{1,2})\./,
        args: ['year', 'month', 'date'],
    }, {
        re: /([0-9]{4})\.([0-9]{1,2})\.([0-9]{1,2})/,
        args: ['year', 'month', 'date'],
    }, {
        re: /([0-9]{4})\/([0-9]{1,2})\/([0-9]{1,2})/,
        args: ['year', 'month', 'date'],
}]

const stringToTime = (str: string) => {
    let now = new Date();
    let year = now.getFullYear(), month = now.getMonth(), date = 1, hour = 0, minute = 0, second = 0;
    let isAfternoon: boolean | undefined = undefined;

    str.split(' ').forEach((token) => {
        if (token === '그제' || token === '그저께') date = now.getDate() - 2;
        else if (token === '어제' || token.toLowerCase() === 'yesterday') date = now.getDate() - 1;
        else if (token === '오늘' || token.toLowerCase() === 'today') date = now.getDate();
        else if (token === '내일' || token.toLowerCase() === 'tomorrow') date = now.getDate() + 1;
        else if (token === '모레') date = now.getDate() + 2;
        else if (token === '오후') isAfternoon = true;
        else if (token === '오전') isAfternoon = false;

        matchInfo.forEach(({re, args}) => {
            const result = re.exec(token);
            if (!result || result[0] !== token) return;

            console.log(re, args, result);

            args.map((arg, k) => {
                const value = Number.parseInt(result[k+1]);

                if (arg === 'year') year = value >= 1000 ? value : 2000 + value;
                else if (arg === 'month') month = value-1;
                else if (arg === 'date') date = value;
                else if (arg === 'hour') hour = value;
                else if (arg === 'minute') minute = value;
                else second = value;
            });
        });
    });

    if (year < 1900 || year > 2100 || month < 1 || month > 12 || date < -1 || date > 33 || hour < 0 || hour > 24 || minute < 0 || minute > 60 || second < 0 || second > 60) {
        return undefined;
    }

    if (isAfternoon !== undefined) {
        if (isAfternoon) {
            if (hour == 12) hour = 12;
            else hour = 12 + hour % 12;
        } else {
            if (hour == 12) hour = 0;
            else hour = hour % 12;
        }
    }

    return new Date(year, month, date, hour, minute, second).getTime();
}

export default stringToTime;