import { webClient } from '..';
import { cstodoTestChannel } from '../config';
import schedule from 'node-schedule';

const onTest = () => {
  const alertTest = () => webClient.chat.postMessage({
    text: '지금 cstodo 슬랙봇이 테스트 모드로 켜져 있어요. 의도한 게 아니라면 테스트 모드를 끄고 실행해 주세요!',
    channel: cstodoTestChannel,
  });

  alertTest();
  schedule.scheduleJob('0 0 * * * *', alertTest);
  schedule.scheduleJob('0 30 * * * *', alertTest);
}

export default onTest;