import dotenv from 'dotenv';

dotenv.config();

// Status
export const status = process.env.STATUS;

// Persistence
export const persistence = process.env.PERSISTENCE;

// Port
export const port = process.env.PORT;

// Mongo conection
export const mongoUri = process.env.MONGO_URI;

// Session
export const sessionSecret = process.env.SESSION_SECRET;
export const sessionName = process.env.SESSION_NAME;

// JWT
export const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
export const jwtCookieName = process.env.JWT_COOKIE_NAME;

// Admin user
export const adminEmail = process.env.ADMIN_EMAIL;
export const adminPassword = process.env.ADMIN_PASSWORD;

// Github session
// GitHub
export const githubAppName = process.env.APP_NAME;
export const githubHomePageUrl = process.env.HOMEPAGE_URL;
export const githubCallBackUrl = process.env.CALLBACK_URL;
// About
export const githubOwnedBy = process.env.OWNED_BY;
export const githubAppId = process.env.APP_ID;
export const githubClientId = process.env.CLIENT_ID;
export const githubClientSecret = process.env.CLIENT_SECRET;

// Nodemailer
export const emailNodeMailer = process.env.EMAIL_NODEMAILER;
export const passwordNodeMailer = process.env.PASSWORD_NODEMAILER;
