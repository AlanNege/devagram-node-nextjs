import mongoose, {Schema} from "mongoose";

const SeguidorSchema = new Schema ({
    usuarioId: {type:String, require:true}, //id do usuario logado, quem segue
    usuarioSeguidoId: {type:String, require:true},   //id do usuario seguido
})

export const SeguidorModel = (mongoose.models.seguidores || mongoose.model('seguidores', SeguidorSchema));
    