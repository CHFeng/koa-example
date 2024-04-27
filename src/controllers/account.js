import model from '../models/account.js';
import service from '../service/account.js';
import utils from '../utils/index.js';

/**
 *  get all accounts
 * @param {object} ctx
 */
const getAll = async (ctx) => {
  const result = await model.getAll();

  ctx.body = { data: result };
};
/**
 *  get an account by id
 * @param {object} ctx
 */
const getById = async (ctx) => {
  const result = await model.getById(ctx.userId);

  ctx.body = { data: result };
};
/**
 *  get an balance of account by id
 * @param {object} ctx
 */
const getBalanceById = async (ctx) => {
  const result = await model.getById(ctx.userId);

  utils.httpResponse(ctx, 200, { balance: result.balance });
};
/**
 *  sing in account
 * @param {object} ctx
 */
const singIn = async (ctx) => {
  const { id, password } = ctx.request.body;
  const account = await model.getById(id);

  if (!password || !id) {
    utils.httpResponse(ctx, 400, { message: 'It should be have id, password' });
  } else if (!account) {
    utils.httpResponse(ctx, 400, { message: 'The account does not exist' });
  } else {
    const message = await service.singIn(id, password);
    if (message.includes('password')) {
      utils.httpResponse(ctx, 401, { message });
    } else {
      utils.httpResponse(ctx, 200, { token: message });
    }
  }
};
/**
 *  sing up new account
 * @param {object} ctx
 */
const singUp = async (ctx) => {
  const {
    id, name, password, secondPassword,
  } = ctx.request.body;

  if (!id || !name || !password || !secondPassword) {
    utils.httpResponse(ctx, 400, { message: 'It should be have id, name, password, secondPassword' });
  } else if (password !== secondPassword) {
    utils.httpResponse(ctx, 400, { message: 'The password and secondPassword should be same' });
  } else {
    const original = await model.getById(id);
    if (original) {
      utils.httpResponse(ctx, 400, { message: 'This account has already existed' });
    } else {
      const message = await service.singUp(id, name, password, secondPassword);
      utils.httpResponse(ctx, 200, { message });
    }
  }
};

export default {
  getAll,
  getById,
  getBalanceById,
  singIn,
  singUp,
};
