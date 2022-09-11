import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import joi from "joi";
import mongo from "../db/db.js";

let db = await mongo()

const singUp = async (req, res) => {
  const { name, email, password, password_confirmation } = req.body;

  const newUser = {name,email,password,password_confirmation};

  const Schema = joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().email().required(),
    password: joi.string().min(3).max(25).required(),
    password_confirmation: joi.any().valid(joi.ref('password')).required()
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

  try {
    const verificaUser = await db.collection('users').findOne({email: email})
    if(verificaUser) {
      return res.status(409).send(
        `Email existente : ${email}`)
    };
    await db.collection("users").insertOne(
      {name, email, password: passwordHash}
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
const singIn = async (req, res) => {
  const { email, password } = req.body;
  const userLogin = { email, password };

  const Schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(3).max(25).required(),
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
        res.status(201).send(token);
        return
    } else {
      res.status(422).send(
        `Usuário não encontrado (email ou senha incorretos)`
        ); 
    }
  }
  catch (err) {
    console.error(err);
    res.sendStatus(500);
    return
  };
}

export {singIn, singUp};