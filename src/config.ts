import dotenv from 'dotenv';

dotenv.config();

export const signingSecret = process.env.SIGNING_SECRET || 'cs71107';
export const accessToken = process.env.ACCESS_TOKEN || 'cs71107';
export const logWebhook = process.env.LOG_WEBHOOK || '';
export const mongodbUri = process.env.MONGODB_URI || '';
export const port = Number.parseInt(process.env.PORT || '3000');

export const isTesting = !process.env.IS_PRODUCTION;

export const csGod = 'UV78YL6TW';
export const cstodoTestChannel = process.env.CSTODO_TEST_CHANNEL || 'C01JER4T7AN';
export const cstodoChannel = isTesting ? cstodoTestChannel : 'C01H4RY69CL';

// export const green55 = '';
// export const green55Channel = cstodoTestChannel;

export const defaultBarOwner = 'testbar';