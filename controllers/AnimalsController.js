import Animals from "../models/Animals.js";
import { check, validationResult } from 'express-validator';
import path from 'path';

const getAnimals = async (req, res) => {
    try {
        let animals = '';
        animals = await Animals.findAll({ where: { id_user: req.user.id } });
        return res.status(200).json({
            status: 200,
            animals
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Lo sentimos, hubo un error'
        })
    }
}


const createAnimal = async (req, res) => {
    const __dirname = path.resolve();
    await check('Nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('Sexo').notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('Raza').isEmail().withMessage('La raza es obligatoria').run(req);
    await check('Color').notEmpty().withMessage('El color es obligatorio').run(req);
    await check('Fecha de nacimineto').notEmpty().withMessage('La fecha de nacimiento es obligatoria').run(req);
    await check('Nacionalidad').isLength({ min: 5, max: 5 }).withMessage('La nacionalidad es obligatoria').run(req);

    let image = '';
    let nameImage = '';

    let result = validationResult(req);
    let errors = {};
    result.array().map(resulState => {
        const { param, msg } = resulState;
        if (param == 'name') {
            errors = { ...errors, clee: msg };
        }
        if (param == 'sex') {
            errors = { ...errors, name: msg };
        }
        if (param == 'spice') {
            errors = { ...errors, email: msg };
        }
        if (param == 'race') {
            errors = { ...errors, street: msg };
        }
        if (param == 'color') {
            errors = { ...errors, colony: msg };
        }
        if (param == 'born') {
            errors = { ...errors, code_postal: msg };
        }
        if (param == 'nationality') {
            errors = { ...errors, location: msg };
        }
        if (param == 'prop') {
            errors = { ...errors, phone_number: msg };
        }
    });
    if (!result.isEmpty()) {
        return res.status(400).json({
            status: 400,
            errors
        })
    }

    const { nombre, sexo, especie, raza, color, fecha_nac, nacionalidad, id_user } = req.body;

    const existAnimals = await Animals.findOne({ where: { clee } })
    if (existAnimals) {
        return res.status(403).json({
            status: 403,
            msg: 'La veterinaria seleccionada ya está registrada'
        });
    }

    const { id } = req.user;
    const animal = await Animals.create({
        name: nombre,
        sex: sexo,
        spice: especie,
        race: raza,
        color: color,
        born: fecha_nac,
        nationality: nacionalidad,
        prop: id_user
    })

    if (req.files) {
        image = req.files.imgUrl;
        console.log(image);
        nameImage = Date.now().toString(32) + Math.random().toString(32).substring(2);
        image.mv(`./imgVeterinaries/${nameImage}.jpg`, err => {
            if (err) {
                return res.status(500).json({ msg: 'Hubo error con la imagen' })
            }
            console.log('Imagen Subida Correctamente');
        })
    }

    return res.status(201).json({
        status: 201,
        msg: "¡Mascota Registrada Correctamente"
    })
}

const editAnimal = async (req, res) => {
    const { id } = req.params;

    const numberId = parseInt(id);
    if (isNaN(numberId)) {
        return res.status(403).json({
            status: 403,
            msg: 'El id de la mascota es inválido'
        });
    }

    const animal = await Animals.findOne({ where: { id } });

    if (!animal) {
        return res.status(404).json({
            status: 404,
            msg: 'La Mascota no fue encontrada'
        })
    }

    await check('email').isEmail().withMessage('El email es requerido').run(req);
    await check('phone_number').isLength({ max: 10, min: 10 }).withMessage('El teléfono es obligatorio').run(req);
    if (req.body.no_ext !== '') {
        await check('no_ext').isNumeric().withMessage('El no ext es inválido').run(req);
    }
    if (req.body.website !== '') {
        await check('website').isURL().withMessage('No es un url válido').run(req);
    }

    let result = validationResult(req);
    let errors = {};
    result.array().map(resulState => {
        const { param, msg } = resulState;
        if (param == 'email') {
            errors = { ...errors, email: msg };
        }
        if (param == 'phone_number') {
            errors = { ...errors, phone_number: msg };
        }
        if (param == 'no_ext') {
            errors = { ...errors, no_ext: msg };
        }
        if (param == 'website') {
            errors = { ...errors, website: msg };
        }
    });

    if (!result.isEmpty()) {
        return res.status(400).json({
            status: 400,
            errors
        })
    }

    veterinary.email = req.body.email || veterinary.email;
    veterinary.no_ext = req.body.no_ext || veterinary.no_ext;
    veterinary.phone_number = req.body.phone_number || veterinary.phone_number;
    veterinary.website = req.body.website || veterinary.website;
    veterinary.store_number = req.body.store_number || veterinary.store_number;
    // veterinary.imgUrl = req.files.imgUrl || veterinary.imgUrl;

    try {
        const animalUpdate = await animal.save();
        return res.status(200).json({
            status: 200,
            msg: 'Mascota Editada Correctamente',
            animalUpdate
        });
    } catch (error) {
        return res.json({
            msg: 'Hubo un error'
        })
    }

};

const deleteAnimal = async (req, res) => {
    const { id } = req.params;
    const animal = await Animals.findOne({ where: { id } });
    if (!animal) {
        return res.status(404).json({
            status: 404,
            msg: 'Mascota no encontrada'
        });
    }

    try {
        await Animals.destroy({ where: { id } });
        return res.status(200).json({
            status: 200,
            msg: 'Mascota eliminado correctamente'
        })
    } catch (error) {
        return res.json({
            msg: 'Lo sentimos, hubo un error'
        })
    }
}

export { getAnimals,createAnimal, editAnimal, deleteAnimal };