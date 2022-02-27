import dotenv from 'dotenv';

dotenv.config();

export const signingSecret = process.env.SIGNING_SECRET || 'cs71107';
export const accessToken = process.env.ACCESS_TOKEN || 'cs71107';
export const logWebhook = process.env.LOG_WEBHOOK || '';
export const mongodbUri = process.env.MONGODB_URI || '';
export const port = Number.parseInt(process.env.PORT || '3000', 10);

export const isTesting = !process.env.IS_PRODUCTION;

export const csGod = 'UV78YL6TW';
export const cstodoTestChannel = process.env.CSTODO_TEST_CHANNEL || 'C01JER4T7AN';
export const cstodoChannel = isTesting ? cstodoTestChannel : (process.env.CSTODO_CHANNEL || 'C01H4RY69CL');
const admin_str = process.env.CSTODO_ADMINS || (isTesting ? 'UV6HYQD3J:UV8DYMMV5' : 'U02QVE5EDE0');
export const admins = admin_str.split(':');

export const defaultBarOwner = 'testbar';
