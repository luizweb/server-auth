import express from 'express';
import uploadImg from '../config/cloudinary.config.js';


const uploadRoute = express.Router();

uploadRoute.post("/upload", uploadImg.single("picture"), (req,res) => {

    // req.file --> aqui está a informação da foto carregada
    
    // confirmar que a imagem foi carregada corretamente
    if (!req.file){
        return res.status(400).json({msg: "Upload Fail"});
    }

    return res.status(201).json({url: req.file.path});
});

export default uploadRoute;