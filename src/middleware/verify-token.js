import jwt from 'jsonwebtoken';
import config from '../config.js';
import utils from '../utils/index.js';

/**
 *  verify token in header
 * @param {object} ctx
 * @param {function} next
 */
const verifyToken = async (ctx, next) => {
  const { token } = ctx.header;

  if (!token) {
    utils.httpResponse(ctx, 401, { message: 'It should be authenticated' });
  } else {
    try {
      const payload = jwt.verify(token, config.JWT_SECRET_KEY);
      ctx.userId = payload;
      await next();
    } catch (err) {
      utils.httpResponse(ctx, 401, { message: err.message });
    }
  }
};

export default verifyToken;
