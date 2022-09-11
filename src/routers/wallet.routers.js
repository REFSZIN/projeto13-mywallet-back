import express from 'express';
import {exit,entry,wallets,editWallet,deleteWallet} from '../controllers/walletController.js';

const router = express.Router();

router.post('/exit', exit );
router.post('/entry', entry );
router.get('/wallet', wallets );
router.put('/edit/wallet/:ID', editWallet );
router.delete('/del/wallet/:ID', deleteWallet );

export default router;