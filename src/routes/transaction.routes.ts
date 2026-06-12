import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const transactionController = new TransactionController();

router.use(authMiddleware);

router.post('/', transactionController.create);
router.get('/', transactionController.findAll);
// Rota de balance usando o id do usuário (passado na URL conforme requisitado pelo usuário)
router.get('/balance/:userId', transactionController.getBalance);
router.put('/:id', transactionController.update);
router.delete('/:id', transactionController.delete);

export default router;
