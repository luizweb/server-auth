import express from "express";
import userModel from "../models/user.model.js";

import bcrypt from "bcrypt";
import generateToken from "../config/jwt.config.js";

import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";


const userRoute = express.Router();

const SALT_ROUNDS = 10;

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

    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

// LOGIN
userRoute.post("/login", async (req, res) => {
  try {
    
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ msg: "E-mail ou senha invalidos" });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      delete user._doc.passwordHash;
      
      const token = generateToken(user);

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
