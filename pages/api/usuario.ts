import type { NextApiRequest, NextApiResponse } from "next";
import type {respostaPadraoMsg} from '../../types/respostaPadraoMsg';
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import {conectarMongoDB}  from '../../middlewares/conectarMongoDB';
import { usuarioModel } from "../../models/usuarioModel";
import nc from 'next-connect';
import {upload, uploadImagemCosmic} from '../../services/uploadImagemCosmic';
import { politicaCORS } from "../../middlewares/politicaCORS";

const handler = nc()
    .use(upload.single('file'))
    .put(async(req:any, res: NextApiResponse <respostaPadraoMsg>) =>{
        try{
            // se eu quero alterar o usuario preciso pegar ele no DB
            const {userId}=req?.query;
            const usuario = await usuarioModel.findById(userId);
            // se  o usuario retornou algo e pq ele xiste se nao retornou
            // ele nao exsite
            if(!usuario){
                return res.status(400).json({erro:'Usuario nao encotrado'})
            }
            
            const {nome} = req.body;
            if(nome && nome.length >2){
                usuario.nome = nome;
            }

            const {file} = req;
            if (file && file.originalname){
                const image = await uploadImagemCosmic(req);
                if(image&&image.media.url){
                    usuario.avatar=image.media.url;
                }
            }

            await usuarioModel
                .findByIdAndUpdate({_id:usuario._id}, usuario);
            return res.status(200).json({msg:'Usuario alterado com sucesso'});

        }catch(e){
            console.log(e);
            return res.status(440).json({erro: 'Nao foi possivel atualizado o usuario:'+ e});

        }
    })
    .get(async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg | any>) => {
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
    });

    export const config = {
        api : {
            bodyParser:false
        }
    }

export default politicaCORS(validarTokenJWT(conectarMongoDB(handler)));