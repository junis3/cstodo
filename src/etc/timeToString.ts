

const weekdayString = (date: Date) => {
    return ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][date.getDay()];
}

const timeToString = (timestamp: number) => {
    let time = new Date(timestamp), now = new Date();

    let dateResult = (() => {
        let timeDay = Math.floor(time.getTime() / (24*60*60*1000) - now.getTimezoneOffset() / 24 / 60 + 1e-11);
        let nowDay = Math.floor(now.getTime() / (24*60*60*1000) - now.getTimezoneOffset() / 24 / 60 + 1e-11);

        if (timeDay === nowDay - 2) return '그저께';
        if (timeDay === nowDay - 1) return '어제';
        if (timeDay === nowDay) return '오늘';
        if (timeDay === nowDay + 1) return '내일';
        if (timeDay === nowDay + 2) return '모레';
        if (nowDay <= timeDay && timeDay < nowDay + 7) return weekdayString(time);
        if (time.getFullYear() === now.getFullYear()) {
            if (time.getMonth() === now.getMonth()) return `이번 달 ${time.getDate()}일`;
            else return `올해 ${time.getMonth()+1}월 ${time.getDate()}일`;
        }
        return `${time.getFullYear()}년 ${time.getMonth()+1}월 ${time.getDate()}일`;
    })();

    let timeResult = (() => {
        let hourToString = (x: number) => {
            if (x == 0 || x == 24) return '오전 12';
            if (x < 12) return `오전 ${x}`;
            if (x == 12) return '오후 12';
            if (x < 24) return `오후 ${x-12}`;
            throw new Error(`${x}시에 어떻게 일을 끝내요 ㅋㅋㅋ`);
        }
        let format = (x: number) => {
            if (x < 0 || x > 100) throw new Error('분/초에 음수나 100 이상이 들어왔어요!!');
            if (x < 10) return `0${x}`;
            else return `${x}`;
        }

        if (time.getSeconds() === 0) {
            if (time.getMinutes() === 0) {
                if (time.getHours() === 0) return '자정';
                if (time.getHours() === 12) return '정오';
                return `${hourToString(time.getHours())}시`;
            }
            else return `${hourToString(time.getHours())}:${format(time.getMinutes())}`;
        } else return `${hourToString(time.getHours())}:${format(time.getMinutes())}:${format(time.getSeconds())}`
    })();

    if (dateResult === '오늘' && timeResult === '자정') {
        dateResult = '지난';
    }

    if (dateResult === '내일' && timeResult === '자정') {
        dateResult = '다가오는';
    }

    if (dateResult === '모레' && timeResult === '자정') {
        dateResult = weekdayString(time);
    }

    return `${dateResult} ${timeResult}`;
}

export default timeToString;