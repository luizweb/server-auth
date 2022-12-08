import express from "express";
import userModel from "../models/user.model.js";
import LogModel from "../models/log.model.js";

import bcrypt from "bcrypt";
import generateToken from "../config/jwt.config.js";

import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";

import nodemailer from 'nodemailer';

const userRoute = express.Router();

const SALT_ROUNDS = 10;


// nodemailer
const transporter = nodemailer.createTransport({
  service: "Outlook",
  auth: {
    secure: false,
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});


//SIGN-UP - create new user
userRoute.post("/signup", async (req, res) => {
  try {
    const { password } = req.body;

    if (
      !password || !password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#!])[0-9a-zA-Z$*&@#!]{8,}$/)
    ) {
      return res.status(400).json({ msg: "E-mail ou senha invalidos" });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS); 
   
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({...req.body, passwordHash: hashedPassword});

    delete newUser._doc.passwordHash;

    //configuraçãpo do corpo do email
    const mailOptions = {
      from: "luiz.agsimoes@outlook.com", //nosso email
      to: newUser.email, //email do usuário destinatário
      subject: "Ativação de Conta",
      html: `
        <h1>Bem vindo ao nosso site</h1>
        <p>Confime seu e-mail clicando no link abaixo</p>
        <a href=http://localhost:8080/user/activate-account/${newUser._id}>ATIVE SUA CONTA</a>
      `
    }
    //envio de email
    await transporter.sendMail(mailOptions);

    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

// ativação/confirmação do email
userRoute.get("/activate-account/:idUser", async (req,res)=> {
  try {
    const {idUser} = req.params;
    const user = await userModel.findByIdAndUpdate(idUser, {confirmEmail: true});
    return res.send(`Sua conta foi ativada com sucesso, <b>${user.name}</b>`);

  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }})



// LOGIN
userRoute.post("/login", async (req, res) => {
  try {

    


    
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email });

    //checar se o email está confirmado
    if (user.confirmEmail === false) {
      return res.status(401).json({ msg: "Usuário não confirmado. Por favor validar email." });
    }

    if (!user) {
      return res.status(401).json({ msg: "E-mail ou senha invalidos" });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      delete user._doc.passwordHash;
      
      const token = generateToken(user);


      //LOG
      await LogModel.create({
        user: user._id,
        status: "novo login",
      });


      return res.status(200).json({
        user: user,
        token: token,
      });
    } else {
        return res.status(401).json({ msg: "E-mail ou senha invalidos" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

// PROFILE
userRoute.get("/profile", isAuth, attachCurrentUser, async (req, res) => {
  try {
    return res.status(200).json(req.currentUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

// ADMIN - check if user is admin - get all users
userRoute.get("/admin", isAuth, isAdmin, attachCurrentUser, async (req, res) => {
  try {    
    const users = await userModel.find({}, { passwordHash: 0 });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

export default userRoute;
