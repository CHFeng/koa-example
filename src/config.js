import dotenv from 'dotenv';

dotenv.config();
const config = {
  port: 3000,
  database: {
    user: 'postgres',
    host: 'localhost',
    password: 'postgres',
    port: 5432,
  },
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  PBKDF2_SALT: process.env.PBKDF2_SALT,
};

export default config;
