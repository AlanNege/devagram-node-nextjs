import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { politicaCORS } from "../../middlewares/politicaCORS";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import type { respostaPadraoMsg } from "../../types/respostaPadraoMsg";
import { PublicacaoModel } from "../../models/PublicacaoModel";
import { UsuarioModel } from "../../models/UsuarioModel";


const likeEndpoint
 = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) =>{

    try{
        if(req.method === 'PUT'){
            
            const {id} = req?.query;
            const publicacao = await PublicacaoModel.findById(id);
            if(!publicacao){
                res.status(400).json({erro:'Publicacao nao encontrada'});
            }

            //id do usuario que ta cutindo a publicacao
            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);
            if(!usuario){
              return res.status(400).json({erro:'Usuario nao encontrado'});
           }

           const indexDoUsuarioNoLike = publicacao.likes.findIndex((e: any) => e.toString() === usuario._id.toString());
           
           // se o index for > -1 sinal que ele ja curte a foto
           if(indexDoUsuarioNoLike != -1){
               publicacao.likes.splice(indexDoUsuarioNoLike, 1);
               await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao);
               return res.status(200).json({msg:'Publicacao descurtida com sucesso'});
           }else{
              //se o index for -1 sinal que ele nao curte a foto
              publicacao.likes.push(usuario._id);
              await PublicacaoModel.findByIdAndUpdate({_id:publicacao._id}, publicacao);
              return res.status(200).json({msg:'Publicacao curtida com sucesso'}); 
           }

        }

        return res.status(405).json({erro:'Metodo informado nao e valido'});
    }catch(e){
        console.log(e);
        return res.status(500).json({erro:'Ocorreu erro ao curtir/descurtir essa publicacao'});
    }

}

export default politicaCORS(validarTokenJWT(conectarMongoDB(likeEndpoint)));