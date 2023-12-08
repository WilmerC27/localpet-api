import express from 'express';
import Users from '../models/Users.js';
const router = express.Router();

router.get('/home', async (req, res) => {
    const { id } = req.user;

    const user = await Users.findOne({where: {id}});

    res.status(200).json({
        status: 200,
        user: {
            id: user.id,
            name: user.name,
            last_name: user.last_name,
            verified: user.verified,
            email: user.email,
            rol:user.idRol
        }
    })
})

export default router;