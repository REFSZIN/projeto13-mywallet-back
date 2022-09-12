import joi from "joi";
import dayjs from "dayjs";
import mongo from "../db/db.js";
import {ObjectId} from "mongodb";

let db = await mongo();

const exit =  async (req, res) => {
  const { valor , description } = req.body;
  const token = req.headers.authorization?.replace('Bearer ', '');
  const postExit = {valor, description};

  const Schema = joi.object({ 
    valor : joi.number().min(1).required(),
    description: joi.string().min(3).required()
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
    const day = dayjs(Date.now()).format("D/M");

    await db.collection('wallets').insertOne({...postExit , date: day, author: session.userId,  false: false})

    res.status(201).send(`Saida criado com sucesso: ${description} com o valor: ${valor}`);
    return
  }
  catch (err) {
    console.error(err);
    res.sendStatus(500);
    return
  };
}
const entry = async (req, res) => {
  const { valor , description } = req.body;
  const token = req.headers.authorization?.replace('Bearer ', '');
  const postEntry = {valor, description};

  const Schema = joi.object({ 
    valor : joi.number().required(),
    description: joi.string().required()
  });

  const valid = Schema.validate({valor, description}, {abortEarly: false});

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
      return res.sendStatus(401);
    }

    const user = await db.collection('users').findOne({
      _id: session.userId,
    })

    if(!user) {
      return res.status(409).send(
        `ID de User não existente`)
    };
    const day = dayjs(Date.now()).format("D/M");

    await db.collection('wallets').insertOne({...postEntry , date: day, author: session.userId, true :true})

    res.status(201).send(`Entrada criada com sucesso: ${description} com o valor: ${valor}`);
    return
  }
  catch (err) {
    console.error(err);
    res.sendStatus(500);
    return
  };
}
const wallets = async (req, res) => {
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

    await db.collection("wallets").find({ author: session.userId}).toArray().then(wallet => {
    res.status(200).send(wallet);
    });
    return;
    } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
const editWallet = async (req, res) => {
  const { ID } = req.params;
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { valor , description } = req.body;

  const Scheme = joi.object(
    {
      valor: joi.number().required(),
      description: joi.string().required(),
    }
  )
  const { error } = Scheme.validate({ valor , description });

  if(error){
    res.status(422).send(error.details.map(detail => detail.message));
  }
  try {
    const session = await db.collection('sessions').findOne({
      token,
  })
    if (!session) {
      return res.sendStatus(401);
    }

    const user = await db.collection('users').findOne({
      _id: session.userId,
    })

    if(!user) {
      return res.status(409).send(
        `ID de User não existente`)
    };
    const message = await db.collection('wallets').findOne({"_id" :  ObjectId(`${ID}`)});

    if(!message){
      return res.sendStatus(404);
    }

    const day = dayjs(Date.now()).format("D/M");
    await db.collection('wallets').updateOne({"_id": ObjectId(`${ID}`)},
    {$set: 
      {
        "valor": valor,
        "description": description,
        "date": day
      }
    });
    res.status(201).send("Wallet atualizada com sucesso!");

    } catch(e) {
      res.status(500).send({errorMessage: `Não foi possível Editar! Causa: ${e}`});
    }
}
const deleteWallet = async (req, res) => {
  const { ID } = req.params;
  const token = req.headers.authorization?.replace('Bearer ', '');
  try {
    const session = await db.collection('sessions').findOne({
      token
  })
    if (!session) {
      return res.sendStatus(401);
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

    await db.collection('wallets').deleteOne({_id: ObjectId(`${ID}`)});
    res.sendStatus(200);
    } catch(e) {
      res.status(500).send({errorMessage: `Não foi possível deletar! Causa: ${e}`});
    }
}

export {exit,entry,wallets,editWallet,deleteWallet};