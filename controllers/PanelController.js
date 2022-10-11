import Veterinary from "../models/Veterinary.js";

const getVeterinaries = async (req, res) => {
    try {
        const veterinaries = await Veterinary.findAll();
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