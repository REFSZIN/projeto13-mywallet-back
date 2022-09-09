import express, {json} from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import dayjs from "dayjs";
import joi from "joi";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

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
  db = mongoClient.db(process.env.DB_NAME)
);

promise.catch(err =>
  console.log("Não foi possível se conectar", err)
);

app.post('/auth/sing-up', async (req, res) => {
  const { name, email, password, password_confirmation } = req.body;

  const newUser = {name,email,password,password_confirmation};

  const Schema = joi.object({
    name: joi.string().min(3).trim().required(),
    email: joi.string().email().trim().required(),
    password: joi.string().min(3).max(25).trim().required(),
    password_confirmation: joi.any().valid(joi.ref('password')).trim().required().options({ language: { any: { allowOnly: 'Senhas não Conrrespondente' } } })
  });

  const valid = Schema.validate(newUser, {abortEarly: false});

  if(valid.errorMessage){
    const erros = validation.error.details.map((err) => err.message);
    res.status(422).send(
      `Todos os campos são obrigatórios! : ${erros}`
      ); 
    return
  };
  
  const passwordHash = bcrypt.hashSync(newUser.password, 10);
  const passwordConfirmHash = bcrypt.hashSync(newUser.password_confirmation, 10);

  try {
    const verificaUser = await db.collection('users').findOne({email: email})
    if(verificaUser) {
      return res.status(409).send(
        `Email existente : ${email}`)
    };
    await db.collection("users").insertOne(
      {...newUser, password: passwordHash ,password_confirmation: passwordConfirmHash}
    );
    res.status(201).send(`Criado com sucesso`);
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
  const { email, password } = req.body;
  const userLogin = { email, password };

  const Schema = joi.object({
    email: joi.string().email().trim().required(),
    password: joi.string().min(3).max(25).trim().required(),
  });

  const valid = Schema.validate(userLogin, {abortEarly: false});

  if(valid.errorMessage){
    const erros = validation.error.details.map((err) => err.message);
    res.status(422).send(
      `Todos os campos são obrigatórios! : ${erros}`
      ); 
    return
  };

  try {
    const user = await db.collection('users').findOne({email});
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if(user && passwordIsValid) {
        const token = uuid();
        await db.collection("sessions").insertOne({
          userId: user._id,
          token
        })
        res.send(token);
    } else {
      res.status(422).send(
        `Usuário não encontrado (email ou senha incorretos)`
        ); 
    }
    res.status(201).send(`Logado com sucesso: ${user.name}`);
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
  const { valor , description } = req.body;
  const token = req.headers.authorization?.replace('Bearer ', '');
  const postExit = {valor, description};

  const Schema = joi.object({ 
    valor : joi.number().min(1).trim().required(),
    description: joi.string().min(3).trim().required()
  });

  const valid = Schema.validate(postExit, {abortEarly: false});

  if(valid.errorMessage){
    const erros = validation.error.details.map((err) => err.message);
    res.status(422).send(
      `Todos os campos são obrigatórios! : ${erros}`
      ); 
    return
  };
  
  try {
    const session = await db.collection('sessions').findOne({
      token,
    })
    if (!session) {
      return res.send(401);
    }

    const user = await db.collection('users').findOne({
      _id: session.userId,
    })

    if(!user) {
      return res.status(409).send(
        `ID de User não existente`)
    };
    const day = dayjs(Date.now()).format("D:M");

    await db.collection('wallets').insertOne({...postExit , date: day})

    res.status(201).send(`Saida criado com sucesso: ${description}} com o valor: ${valor}`);
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
  const { valor , description } = req.body;
  const token = req.headers.authorization?.replace('Bearer ', '');
  const postEntry = {valor, description};

  const Schema = joi.object({ 
    valor : joi.number().min(1).required(),
    description: joi.string().min(3).required()
  });

  const valid = Schema.validate(postEntry, {abortEarly: false});

  if(valid.errorMessage){
    const erros = validation.error.details.map((err) => err.message);
    res.status(422).send(
      `Todos os campos são obrigatórios! : ${erros}`
      ); 
    return
  };
  
  try {
    const session = await db.collection('sessions').findOne({
      token,
    })
    if (!session) {
      return res.send(401);
    }

    const user = await db.collection('users').findOne({
      _id: session.userId,
    })

    if(!user) {
      return res.status(409).send(
        `ID de User não existente`)
    };
    const day = dayjs(Date.now()).format("D:M");

    await db.collection('wallets').insertOne({...postEntry , date: day})

    res.status(201).send(`Entrada criada com sucesso: ${description}} com o valor: ${valor}`);
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
  const token = req.headers.authorization?.replace('Bearer ', '');
  try {
    const session = await db.collection('sessions').findOne({
      token,
    })
    if (!session) {
      return res.send(401);
    }

    const user = await db.collection('users').findOne({
      _id: session.userId,
    })

    if(!user) {
      return res.status(409).send(
        `ID de User não existente`)
    };

    await db.collection("wallets").find().toArray().then(wallet => {
    res.status(200).send(
      wallet
    ); 
      return
    }
    );
    } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
);
app.put('/edit/wallet/:ID', async (req, res) => {
  const { ID } = req.params;
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { valor , description } = req.body;

  const Scheme = joi.object(
    {
      valor: joi.number().trim().required(),
      description: joi.string().trim().required(),
    }
  )
  const { error } = Scheme.validate(req.body);

  if(error){
    res.status(422).send(error.details.map(detail => detail.message));
  }
  try {
    const session = await db.collection('sessions').findOne({
      token,
  })
    if (!session) {
      return res.send(401);
    }

    const user = await db.collection('users').findOne({
      _id: session.userId,
    })

    if(!user) {
      return res.status(409).send(
        `ID de User não existente`)
    };
    const message = await db.collection('wallets').findOne({_id: ObjectId(`${ID}`)});
    
    if(!message){
      return res.sendStatus(404);
    }
    
    await db.collection('mensagems').updateOne({_id: new ObjectId(ID_DA_MENSAGEM)},
    {$set: 
      {
        valor,
        description
      }
    });
    res.status(201).send("Wallet atualizada com sucesso!");

    } catch(e) {
      res.status(500).send({errorMessage: `Não foi possível Editar! Causa: ${e}`});
    }
}
);
app.delete('/del/wallet/:ID', async (req, res) => {
  const { ID } = req.params;
  const token = req.headers.authorization?.replace('Bearer ', '');
  try {
    const session = await db.collection('sessions').findOne({
      token,
  })
    if (!session) {
      return res.send(401);
    }

    const user = await db.collection('users').findOne({
      _id: session.userId,
    })

    if(!user) {
      return res.status(409).send(
        `ID de User não existente`)
    };
    const message = await db.collection('wallets').findOne({_id: ObjectId(`${ID}`)});
    
    if(!message){
      return res.sendStatus(404);
    }

    await db.collection('mensagems').deleteOne({_id: ObjectId(`${ID_DA_MENSAGEM}`)});
    res.sendStatus(200);
    } catch(e) {
      res.status(500).send({errorMessage: `Não foi possível deletar! Causa: ${e}`});
    }
}
);

app.listen(PORT, () => { console.log(chalk.green.bold(`Rodando ${NOME} Lisu na Porta: ${PORT}`))});
