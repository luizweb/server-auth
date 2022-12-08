import userModel from "../models/user.model.js";

async function attachCurrentUser(req, res, next) {
  try {
    const userData = req.auth;

    const user = await userModel.findById(userData._id, { passwordHash: 0 });

    if (!user) {
      return res.status(401).json({ msg: "Usuário não encontrado" });
    }

    //checar se o usuário tem o emnail confirmado
    if (user.confirmEmail === false) {
      return res.status(401).json({ msg: "Usuário não confirmado. Por favor validar email" });
    }

    req.currentUser = user;

    next();

  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
}

export default attachCurrentUser;

