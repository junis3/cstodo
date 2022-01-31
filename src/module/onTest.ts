import schedule from 'node-schedule';

const onTest = () => {
  const alertTest = async () => {
    // eslint-disable-next-line no-console
    console.log('지금 cstodo 슬랙봇이 테스트 모드로 켜져 있어요. 테스트 모드 중에서는 평소와 다르게 동작할 수 있으니, 의도한 게 아니라면 테스트 모드를 끄고 실행해주세요!');
  };

  alertTest();
  schedule.scheduleJob('0 0 * * * *', alertTest);
  schedule.scheduleJob('0 30 * * * *', alertTest);
};

export default onTest;
