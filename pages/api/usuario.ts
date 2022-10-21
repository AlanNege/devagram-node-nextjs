import type { NextApiRequest, NextApiResponse } from "next";
import type {respostaPadraoMsg} from '../../types/respostaPadraoMsg';
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import {conectarMongoDB}  from '../../middlewares/conectarMongoDB';
import { usuarioModel } from "../../models/usuarioModel";


const usuarioEndpoint = async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg | any>) => {
    // Como eu pego os dados do usuario logado?
    //id do usuario

    try{
        // como eu busco todos os dados do meu usuario?
        const {userId} = req?.query;
        const usuario= await usuarioModel.findById(userId);
        usuario.senha= null;
        return res.status(200).json(usuario);
    }catch(e){
        console.log(e);
    }

    return res.status(400).json({erro:'Nao foi possivel obter dados do usuario'});

}

export default validarTokenJWT(conectarMongoDB(usuarioEndpoint));