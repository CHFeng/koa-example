import KoaRouter from 'koa-router';
import account from '../controllers/account.js';
import verifyToken from '../middleware/verify-token.js';
import tradeRouter from './trade.js';

const router = new KoaRouter();

router.post('/sing-in', account.singIn);
router.post('/sing-up', account.singUp);
// these routers must be authenticated
router.get('/account-balance', verifyToken, account.getBalanceById);
router.use('/trade', tradeRouter.routes(), tradeRouter.allowedMethods());

export default router;
