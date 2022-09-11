import express, {json} from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import authRouter from "./routers/auth.routers.js";
import walletRouter from "./routers/wallet.routers.js";

const app = express();
app.use(cors());
app.use(json());
dotenv.config();

app.use(authRouter);
app.use(walletRouter);

app.listen(process.env.PORTA, () => { console.log(chalk.green.bold(`Rodando ${process.env.NOMEE} Lisu na Porta: ${process.env.PORTA}`))});
