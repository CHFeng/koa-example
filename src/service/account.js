import pbkdf2 from 'pbkdf2';
import jwt from 'jsonwebtoken';

import account from '../models/account.js';
import config from '../config.js';

/**
 *  sing in an account
 * @param {string} id
 * @param {string} password
 */
const singIn = async (id, password) => {
  const result = await account.getById(id);
  let message;

  const encrypted = pbkdf2.pbkdf2Sync(password, config.PBKDF2_SALT, 1, 32, 'sha512').toString('base64');
  if (encrypted === result.password) {
    const token = jwt.sign(id, config.JWT_SECRET_KEY);
    message = token;
  } else {
    message = 'The password is wrong';
  }

  return message;
};
/**
 *  sing up an account
 * @param {string} id
 * @param {string} name
 * @param {string} password
 * @param {string} secondPassword
 */
const singUp = async (id, name, password, secondPassword) => {
  let message;

  if (!id || !name || !password || !secondPassword) {
    message = 'It should be have id, name, password, secondPassword';
  } else if (password !== secondPassword) {
    message = 'The password and secondPassword should be same';
  } else {
    const encrypted = pbkdf2.pbkdf2Sync(password, config.PBKDF2_SALT, 1, 32, 'sha512').toString('base64');
    await account.create(id, name, encrypted);
    message = 'create account success';
  }

  return message;
};

export default {
  singIn,
  singUp,
};
