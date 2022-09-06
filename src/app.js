import express, {json} from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import dayjs from "dayjs";
import joi from "joi";

const app = express();
app.use(cors());
app.use(json());
dotenv.config();
const PORT = process.env.PORTA;
const NOME = process.env.NOMEE;
let db ;

const mongoClient = new MongoClient(process.env.MONGO_URI);
const promise = mongoClient.connect();

promise.then(() => 
  db = mongoClient.db('UOL__DB')
);
promise.catch(err =>
  console.log("Não foi possível se conectar", err)
);


app.listen(PORT, () => { console.log(chalk.green.bold(`Rodando ${NOME} Lisu na Porta: ${PORT}`))});
