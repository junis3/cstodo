import schedule from 'node-schedule';

const onTest = () => {
  const alertTest = async () => { };

  alertTest();
  schedule.scheduleJob('0 0 * * * *', alertTest);
  schedule.scheduleJob('0 30 * * * *', alertTest);
};

export default onTest;
