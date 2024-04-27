import model from '../models/account.js';
import utils from '../utils/index.js';

/**
 *  deposit money to an account
 * @param {object} ctx
 */
const deposit = async (ctx) => {
  const { value } = ctx.request.body;

  if (!value) {
    utils.httpResponse(ctx, 400, { message: 'Missing field' });
  } else if (value <= 0) {
    utils.httpResponse(ctx, 400, { message: 'The value that to deposit must be positive' });
  } else {
    const balance = await model.depositById(ctx.userId, value);

    utils.httpResponse(ctx, 200, { balance });
  }
};

/**
 *  withdraw money from an account
 * @param {object} ctx
 */
const withdraw = async (ctx) => {
  const { value } = ctx.request.body;
  const { balance: prevBalance } = await model.getById(ctx.userId);

  if (!value) {
    utils.httpResponse(ctx, 400, { message: 'Missing field' });
  } else if (prevBalance < value) {
    utils.httpResponse(ctx, 400, { message: 'The value that to withdraw must greater than the balance' });
  } else {
    const balance = await model.withdrawById(ctx.userId, value);
    utils.httpResponse(ctx, 200, { balance });
  }
};

/**
 *  transfer money from one account to another account
 * @param {object} ctx
 */
const transfer = async (ctx) => {
  const { toAccountId, value } = ctx.request.body;
  const { balance: prevBalance } = await model.getById(ctx.userId);

  if (!value || !toAccountId) {
    utils.httpResponse(ctx, 400, { message: 'Missing field' });
  } else if (toAccountId === ctx.userId) {
    utils.httpResponse(ctx, 400, { message: 'It can not be transfer to yourself' });
  } else if (prevBalance < value) {
    utils.httpResponse(ctx, 400, { message: `The value that to transfer from id:${ctx.userId} must greater than the balance` });
  } else {
    const result = await model.transfer(ctx.userId, toAccountId, value);

    utils.httpResponse(ctx, 200, result);
  }
};

export default {
  deposit,
  withdraw,
  transfer,
};
