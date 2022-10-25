// SE IMPORTA EL MODELO
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import Roles from '../models/Roles.js';
import Users from "../models/Users.js";
import { generateToken, generateJWT } from '../helpers/tokens.js';
import { emailRegister, emailForgotPassword } from '../helpers/emails.js';

const authenticate = async (req, res) => {
    await check('email').notEmpty().withMessage('El email introducido no es válido').run(req);
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

    if (user.verified === null || user.verified === undefined) {
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

    return res.status(200).header('authorization', token).json({
        status: 200,
        user: user
    });
}

/** BACKEND **/
// Función que se ejecuta al hacer una petición al endpoint
// "http://localhost:4000/register"
// Especificamos que la función sea asíncrona  
const register = async (req, res) => {
    // Se valida que los campos nombre, apellido, email, contraseña y repetir contraseña
    // no estén vacios o no cumplan con las condiciones de dicho campo.

    // Se válida el nombre del usuario
    await check('name').notEmpty().withMessage('El nombre el obligatorio').run(req);
    // Se válida el apellido del usuario
    await check('last_name').notEmpty().withMessage('El apellido es obligatorio').run(req);
    // Se válida el email del usuario
    await check('email').isEmail().withMessage('No es un email válido').run(req);
    // Se válida la contraseña del usuario y que sea mínimo 6 carácteres
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe de ser al menos 6 carácteres').run(req);
    // Se válida que la contraseña sea igual a la que se usó anteriormente
    await check('confirm_password').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req);
    
    // Se almacenan los errores de los campos que no cumplen las condiciones.
    let result = validationResult(req);
    // Se crea una variable que contrendrá los errores
    let errors = {};
    // Se recorre el arreglo de errores para poder crear un nuevo arreglo pero como nombre la propiedad del error 
    result.array().map(resulState => {
        // Se hace la destructuración de la variable temporal resultState
        const { param, msg } = resulState;
        // Se verifica si hay un objeto con el parametro de "name"
        // Si es verdadero se hace una copia del arreglo "errors" y
        // se le agrega la propiedad "name".
        if (param == 'name') {
            errors = { ...errors, name: msg };
        }
        if (param == 'last_name') {
            errors = { ...errors, last_name: msg };
        }
        if (param == 'email') {
            errors = { ...errors, email: msg };
        }
        if (param == 'password') {
            errors = { ...errors, password: msg };
        }
        if (param == 'confirm_password') {
            errors = { ...errors, confirm_password: msg };
        }
    });

    // Se verica si el arreglo "result" no está vacio
    // En caso de que no lo esté arroje el error 400 con
    // con el arreglo de errores
    if (!result.isEmpty()) {
        // Se retorna una respuesta con el estatus 400 (Bad Request)
        // y los errores de los campos vacios
        return res.status(400).json({
            status: 400,
            errors: errors
        });
    }

    // Se hace la destructuración de los datos enviados por el usuario
    const { name, last_name, email, password } = req.body;

    // Se hace la consulta para saber si el usuario existe en la base
    // de datos con respecto al email.
    const existUser = await Users.findOne({ where: { email } });

    // Si la variable usuario contiene algún dato,
    // devuelve el error diciendo que ya hay un usuario existente
    if (existUser) {
        // Se retorna la respuesta con el estatus 403 (Forbidden)
        // y se manda un mensaje que el email ya está registrado
        return res.status(403).json({
            status: 403,
            msg: 'El email ingresado ya está asociado a una cuenta'
        })
    }

    // Si todas las validaciones pasan correctamente
    // se crea el usuario con los datos enviados por el usuario
    const user = await Users.create({
        name,
        last_name,
        email,
        password,
        idRol: 2,
        token: generateToken()
    });

    // Se manda un email con el correo electrónico introducido
    emailRegister({
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        token: user.token
    })

    // Si todo sale correcto, se manda un mensaje diciendo 
    // que todo se creo correctamente 
    return res.status(201).json({
        status: 201,
        msg: '¡Cuenta Creada Correctamente!'
    });
}

const confirmAccount = async (req, res) => {
    const { token } = req.params;

    const user = await Users.findOne({ where: { token } });
    console.log(user);
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

    return res.status(200).json({
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

    return res.status(200).json({
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

    return res.status(200).json({
        status: 200,
        msg: 'Contraseña cambiada correctamente'
    })
}

const getRoles = async (req, res) => {
    const roles = await Roles.findAll();

    return res.status(200).json({
        status: 200,
        roles
    })
}

const createRol = async (req, res) => {
    await check('name').notEmpty().withMessage('El nombre del Rol es requerido').run(req);
    let result = validationResult(req);
    let errors = {};
    result.array().map(resultState => {
        const {param, msg} = resultState;
        if(param == 'name'){
            errors = {...errors, name: msg}
        }
    });
    if (!result.isEmpty()) {
        return res.status(400).json({
            status: 400,
            errors: errors
        });
    }
    const { name } = req.body;
    try {
        const rol = await Roles.create({ name });
        return res.status(201).json({
            status: 201,
            msg: '¡Rol Creado Correctamente!',
            rol
        })
    } catch (error) {
        return res.json({
            msg: 'Hubo un error'
        })
    }
}

export { authenticate, register, confirmAccount, forgotPassword, checkPassword, resetPassword, getRoles, createRol };