import express from 'express';
import {singIn, singUp} from '../controllers/authController.js';

const router = express.Router();

router.post('/auth/sing-up', singUp);
router.post('/auth/sing-in', singIn);

export default router;