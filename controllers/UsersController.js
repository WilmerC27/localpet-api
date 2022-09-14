// SE IMPORTA EL MODELO
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import Users from "../models/Users.js";
import { generateToken, generateJWT } from '../helpers/tokens.js';
import { emailRegister, emailForgotPassword } from '../helpers/emails.js';

const authenticate = async (req, res) => {
    await check('email').isEmail().withMessage('El email introducido no es válido').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe ser mayor a 6 carácteres').run(req);

    let result = validationResult(req);
    let errors = {};
    result.array().map(resulState => {
        const { param, msg } = resulState;
        if (param == 'email') {
            errors = { ...errors, email: msg };
        }
        if (param == 'password') {
            errors = { ...errors, password: msg };
        }
    });
    if (!result.isEmpty()) {
        return res.status(400).json({
            status: 400,
            errors: errors
        });
    }
    const { email, password } = req.body;
    const user = await Users.findOne({ where: { email } })

    if (!user) {
        return res.status(404).json({
            status: 404,
            msg: 'El email no está asociado a una cuenta'
        });
    }

    if (user.verified === 0) {
        return res.status(403).json({
            status: 403,
            msg: 'Tu cuenta no ha sido confirmada'
        })
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({
            status: 400,
            errors: {
                password: 'Contraseña incorrecta'
            }
        });
    }

    const token = generateJWT({ id: user.id, name: user.name });

    res.status(200).header('authorization', token).json({
        status: 200,
        id: user.id,
        name: user.name,
        email: user.email,
        token: token
    });
}

const register = async (req, res) => {
    await check('name').notEmpty().withMessage('El nombre el obligatorio').run(req);
    await check('last_name').notEmpty().withMessage('El apellido es obligatorio').run(req);
    await check('email').isEmail().withMessage('No es un email valido').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe de ser al menos 6 carácteres').run(req);
    await check('confirm_password').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req);
    
    let result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({
            status: 400,
            errors: result.array()
        });
    }

    const { name, last_name, email, password } = req.body;

    const existUser = await Users.findOne({ where: { email } });

    if (existUser) {
        return res.status(403).json({
            status: 403,
            msg: 'El email ingresado ya está asociado a una cuenta'
        })
    }

    const user = await Users.create({
        name,
        last_name,
        email,
        password,
        token: generateToken()
    });

    emailRegister({
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        token: user.token
    })

    res.status(200).json({
        status: 201,
        msg: '¡Cuenta Creada Correctamente!',
        user: user.dataValues
    });
}

const confirmAccount = async (req, res) => {
    const { token } = req.params;

    const user = await Users.findOne({ where: { token } });

    if (!user) {
        return res.status(400).json({
            status: 400,
            msg: 'Error al confirmar la cuenta'
        })
    }
    user.token = null;
    user.verified = true;
    await user.save();

    res.status(200).json({
        status: 200,
        msg: 'Cuenta Confirmada Correctamente'
    })
}

const forgotPassword = async (req, res) => {
    await check('email').isEmail().withMessage('El email introducido no es válido').run(req);

    let result = validationResult(req);
    let errors = {};
    result.array().map(resulState => {
        const { param, msg } = resulState;
        if (param == 'email') {
            errors = { ...errors, email: msg };
        }
    });
    if (!result.isEmpty()) {
        return res.status(400).json({
            status: 400,
            errors: errors
        });
    }

    const { email } = req.body;
    const user = await Users.findOne({ where: { email } });

    if (!user) {
        return res.status(404).json({
            status: 404,
            msg: 'El email no está asociado a ninguna cuenta',
        })
    }

    user.token = generateToken();
    await user.save();

    emailForgotPassword({
        email: user.email,
        name: user.name,
        token: user.token
    });

    res.status(200).json({
        status: 200,
        title: 'Solicitud enviada',
        msg: 'Hemos enviado un email con las instrucciones para recuperar tu contraseña'
    });
}

const checkPassword = async (req, res) => {
    const { token } = req.params;
    const user = await Users.findOne({ where: { token } });

    if (!user) {
        return res.status(400).json({
            status: 400,
            msg: 'Lo sentimos, el token ingresado no es válido'
        });
    }

    res.status(200).json({
        status: 200,
        msg: '¡Solicitud confirmada!'
    });
}

const resetPassword = async (req, res) => {
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe ser de al menos 6 carácteres').run(req);

    let result = validationResult(req);
    let errors = {};
    result.array().map(resulState => {
        const { param, msg } = resulState;
        if (param == 'password') {
            errors = { ...errors, password: msg };
        }
    });
    if (!result.isEmpty()) {
        return res.status(400).json({
            status: 400,
            errors: errors
        })
    }

    const { token } = req.params;
    const { password } = req.body;

    const user = await Users.findOne({ where: { token } });

    if(!user){
        return res.status(403).json({
            status: 403,
            msg: 'Lo sentimos, el token ingresado no es válido'
        });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.token = null;

    await user.save();

    res.status(200).json({
        status: 200,
        msg: 'Contraseña cambiada correctamente'
    })
}

export { authenticate, register, confirmAccount, forgotPassword, checkPassword, resetPassword };