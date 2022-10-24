import Veterinary from "../models/Veterinary.js";
import jwt from 'jsonwebtoken';

const getVeterinaries = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    try {
        let veterinaries = '';
        if(verified.id == 1){
            veterinaries = await Veterinary.findAll();
        }else{
            veterinaries = await Veterinary.findAll({where: {idUser: verified.id}});
        }
        return res.status(200).json({
            status: 200,
            veterinaries
        })
    } catch (error) {
        return res.json({
            msg: 'Lo sentimos, hubo un error'
        })
    }
}

export { getVeterinaries };