import KoaRouter from 'koa-router';
import controller from '../controllers/trade.js';
import verifyToken from '../middleware/verify-token.js';

const router = new KoaRouter();

router.use(verifyToken);

router.post('/deposit', controller.deposit);
router.post('/withdraw', controller.withdraw);
router.post('/transfer', controller.transfer);

export default router;
