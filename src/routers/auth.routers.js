import express from 'express';
import {singIn, singUp} from '../controllers/authController.js';

const router = express.Router();

router.post('/auth/sign-up', singUp);
router.post('/auth/sign-in', singIn);

export default router;