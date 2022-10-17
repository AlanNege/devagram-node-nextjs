import type { NextApiRequest, NextApiResponse } from "next";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";

const usuarioEndpoint = (req : NextApiRequest, res : NextApiResponde) => {
    return res.status(200).json('usuario autenticado com sucesso');
}

export default validarTokenJWT(usuarioEndpoint);