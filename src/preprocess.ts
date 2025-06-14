import mongoose from 'mongoose';
import getCurrentHistory from './etc/getCurrentHistory';
import { addHistory } from './database/history';
import { mongodbUri } from './config';

export const preprocess = async () => {
  const history = await getCurrentHistory();

  // Intentionally made it synchronous: MongoDB Atlas has a rate limit
  for (const id of history) {
    console.log(`Trying adding problem ${id} to history DB....`);

    const success = await addHistory({ id });

    if (success) console.log(`Successfully added problem ${id} to history DB.`);
    else console.log(`Failed adding problem ${id} to history DB.`);
  }
};

mongoose
  .connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Successfully connected to mongodb on ${mongoose.connection.host}`);
    preprocess();
  })
  .catch((err) => {
    console.error(`Failed to connect to ${mongoose.connection.host}`);
    throw err;
  });
