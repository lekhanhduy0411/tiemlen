import { Router } from 'express';
import { getChatHistory, getConversations, sendMessage } from '../controllers/chatController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/conversations', authenticate, getConversations);
router.get('/history/:userId', authenticate, getChatHistory);
router.post('/send', authenticate, sendMessage);

export default router;
