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
  db = mongoClient.db('process.env.DB_NAME')
);

promise.catch(err =>
  console.log("Não foi possível se conectar", err)
);

app.post('/auth/sing-up', async (req, res) => {
  const { name } = req.body;
  const Schema = joi.object({ name: joi.string().min(3).required()});
  const valid = Schema.validate(name, {abortEarly: false});

  if(name === null){
    res.status(422).send(
      `Name user is Null`
      ); 
    return
  }
  if(valid.errorMessage){
    const erros = validation.error.details.map((err) => err.message);
    res.status(422).send(
      `Todos os campos são obrigatórios! : ${erros}`
      ); 
    return
  };

  try {

    const newUser = await db.collection('participantes').findOne({name: name})

    if(newUser) {
      return res.status(409).send(
        `Apelido existente : ${newUser}`)
    };

    const lastStatus = Date.now();

    await db.collection("participantes").insertOne(
      {name, lastStatus}
    );

    await db.collection("mensagems").insertOne(
      {from: name, to: 'Todos', text: `entra na sala...`, type: 'status', time: dayjs(Date.now()).format("HH:mm:ss")}
    );

    res.status(201).send(`Criado com sucesso: ${name} as ${lastStatus}`);
    return
  }
  catch (err) {
    console.error(err);
    res.sendStatus(500);
    return
  };
  }
);
app.post('/auth/sing-in', async (req, res) => {
  const { name } = req.body;
  const Schema = joi.object({ name: joi.string().min(3).required()});
  const valid = Schema.validate(name, {abortEarly: false});

  if(name === null){
    res.status(422).send(
      `Name user is Null`
      ); 
    return
  }
  if(valid.errorMessage){
    const erros = validation.error.details.map((err) => err.message);
    res.status(422).send(
      `Todos os campos são obrigatórios! : ${erros}`
      ); 
    return
  };

  try {

    const newUser = await db.collection('participantes').findOne({name: name})

    if(newUser) {
      return res.status(409).send(
        `Apelido existente : ${newUser}`)
    };

    const lastStatus = Date.now();

    await db.collection("participantes").insertOne(
      {name, lastStatus}
    );

    await db.collection("mensagems").insertOne(
      {from: name, to: 'Todos', text: `entra na sala...`, type: 'status', time: dayjs(Date.now()).format("HH:mm:ss")}
    );

    res.status(201).send(`Criado com sucesso: ${name} as ${lastStatus}`);
    return
  }
  catch (err) {
    console.error(err);
    res.sendStatus(500);
    return
  };
  }
);
app.post('/exit', async (req, res) => {
  const { name } = req.body;
  const Schema = joi.object({ name: joi.string().min(3).required()});
  const valid = Schema.validate(name, {abortEarly: false});

  if(name === null){
    res.status(422).send(
      `Name user is Null`
      ); 
    return
  }
  if(valid.errorMessage){
    const erros = validation.error.details.map((err) => err.message);
    res.status(422).send(
      `Todos os campos são obrigatórios! : ${erros}`
      ); 
    return
  };

  try {

    const newUser = await db.collection('participantes').findOne({name: name})

    if(newUser) {
      return res.status(409).send(
        `Apelido existente : ${newUser}`)
    };

    const lastStatus = Date.now();

    await db.collection("participantes").insertOne(
      {name, lastStatus}
    );

    await db.collection("mensagems").insertOne(
      {from: name, to: 'Todos', text: `entra na sala...`, type: 'status', time: dayjs(Date.now()).format("HH:mm:ss")}
    );

    res.status(201).send(`Criado com sucesso: ${name} as ${lastStatus}`);
    return
  }
  catch (err) {
    console.error(err);
    res.sendStatus(500);
    return
  };
  }
);
app.post('/entry', async (req, res) => {
  const { name } = req.body;
  const Schema = joi.object({ name: joi.string().min(3).required()});
  const valid = Schema.validate(name, {abortEarly: false});

  if(name === null){
    res.status(422).send(
      `Name user is Null`
      ); 
    return
  }
  if(valid.errorMessage){
    const erros = validation.error.details.map((err) => err.message);
    res.status(422).send(
      `Todos os campos são obrigatórios! : ${erros}`
      ); 
    return
  };

  try {

    const newUser = await db.collection('participantes').findOne({name: name})

    if(newUser) {
      return res.status(409).send(
        `Apelido existente : ${newUser}`)
    };

    const lastStatus = Date.now();

    await db.collection("participantes").insertOne(
      {name, lastStatus}
    );

    await db.collection("mensagems").insertOne(
      {from: name, to: 'Todos', text: `entra na sala...`, type: 'status', time: dayjs(Date.now()).format("HH:mm:ss")}
    );

    res.status(201).send(`Criado com sucesso: ${name} as ${lastStatus}`);
    return
  }
  catch (err) {
    console.error(err);
    res.sendStatus(500);
    return
  };
  }
);
app.get('/wallet', async (req, res) => {
  const { name } = req.body;
  const Schema = joi.object({ name: joi.string().min(3).required()});
  const valid = Schema.validate(name, {abortEarly: false});

  if(name === null){
    res.status(422).send(
      `Name user is Null`
      ); 
    return
  }
  if(valid.errorMessage){
    const erros = validation.error.details.map((err) => err.message);
    res.status(422).send(
      `Todos os campos são obrigatórios! : ${erros}`
      ); 
    return
  };

  try {

    const newUser = await db.collection('participantes').findOne({name: name})

    if(newUser) {
      return res.status(409).send(
        `Apelido existente : ${newUser}`)
    };

    const lastStatus = Date.now();

    await db.collection("participantes").insertOne(
      {name, lastStatus}
    );

    await db.collection("mensagems").insertOne(
      {from: name, to: 'Todos', text: `entra na sala...`, type: 'status', time: dayjs(Date.now()).format("HH:mm:ss")}
    );

    res.status(201).send(`Criado com sucesso: ${name} as ${lastStatus}`);
    return
  }
  catch (err) {
    console.error(err);
    res.sendStatus(500);
    return
  };
  }
);
app.put('/edit/wallet/:id', async (req, res) => {
  const { name } = req.body;
  const Schema = joi.object({ name: joi.string().min(3).required()});
  const valid = Schema.validate(name, {abortEarly: false});

  if(name === null){
    res.status(422).send(
      `Name user is Null`
      ); 
    return
  }
  if(valid.errorMessage){
    const erros = validation.error.details.map((err) => err.message);
    res.status(422).send(
      `Todos os campos são obrigatórios! : ${erros}`
      ); 
    return
  };

  try {

    const newUser = await db.collection('participantes').findOne({name: name})

    if(newUser) {
      return res.status(409).send(
        `Apelido existente : ${newUser}`)
    };

    const lastStatus = Date.now();

    await db.collection("participantes").insertOne(
      {name, lastStatus}
    );

    await db.collection("mensagems").insertOne(
      {from: name, to: 'Todos', text: `entra na sala...`, type: 'status', time: dayjs(Date.now()).format("HH:mm:ss")}
    );

    res.status(201).send(`Criado com sucesso: ${name} as ${lastStatus}`);
    return
  }
  catch (err) {
    console.error(err);
    res.sendStatus(500);
    return
  };
  }
);
app.delete('/del/wallet/:id', async (req, res) => {
  const { name } = req.body;
  const Schema = joi.object({ name: joi.string().min(3).required()});
  const valid = Schema.validate(name, {abortEarly: false});

  if(name === null){
    res.status(422).send(
      `Name user is Null`
      ); 
    return
  }
  if(valid.errorMessage){
    const erros = validation.error.details.map((err) => err.message);
    res.status(422).send(
      `Todos os campos são obrigatórios! : ${erros}`
      ); 
    return
  };

  try {

    const newUser = await db.collection('participantes').findOne({name: name})

    if(newUser) {
      return res.status(409).send(
        `Apelido existente : ${newUser}`)
    };

    const lastStatus = Date.now();

    await db.collection("participantes").insertOne(
      {name, lastStatus}
    );

    await db.collection("mensagems").insertOne(
      {from: name, to: 'Todos', text: `entra na sala...`, type: 'status', time: dayjs(Date.now()).format("HH:mm:ss")}
    );

    res.status(201).send(`Criado com sucesso: ${name} as ${lastStatus}`);
    return
  }
  catch (err) {
    console.error(err);
    res.sendStatus(500);
    return
  };
  }
);

app.listen(PORT, () => { console.log(chalk.green.bold(`Rodando ${NOME} Lisu na Porta: ${PORT}`))});
