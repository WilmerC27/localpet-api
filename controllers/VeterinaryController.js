import { check, validationResult } from 'express-validator';
import Veterinary from "../models/Veterinary.js";
import path from 'path';

const createVeterinary = async (req, res) => {
    const __dirname = path.resolve();
    await check('clee').notEmpty().withMessage('El clee es obligatorio').run(req);
    await check('name').notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('email').notEmpty().withMessage('El email no es válido').run(req);
    await check('street').notEmpty().withMessage('La calle es obligatoria').run(req);
    await check('colony').notEmpty().withMessage('La colonia es obligatoria').run(req);
    await check('code_postal').isLength({ min: 5, max: 5 }).withMessage('El código postal debe ser igual a 5 digitos').run(req);
    await check('location').notEmpty().withMessage('La ubicación es obligatoria').run(req);
    await check('phone_number').isLength({ min: 10 }).withMessage('El número telefonico debe ser igual a 10 dígitos').run(req);
    await check('longitude').notEmpty().withMessage('La longitud es obligatoria').run(req);
    await check('latitude').notEmpty().withMessage('La latitud es obligatoria').run(req);

    let image = '';
    let nameImage = '';

    let result = validationResult(req);
    let errors = {};
    result.array().map(resulState => {
        const { param, msg } = resulState;
        if (param == 'clee') {
            errors = { ...errors, clee: msg };
        }
        if (param == 'name') {
            errors = { ...errors, name: msg };
        }
        if (param == 'email') {
            errors = { ...errors, email: msg };
        }
        if (param == 'street') {
            errors = { ...errors, street: msg };
        }
        if (param == 'colony') {
            errors = { ...errors, colony: msg };
        }
        if (param == 'code_postal') {
            errors = { ...errors, code_postal: msg };
        }
        if (param == 'location') {
            errors = { ...errors, location: msg };
        }
        if (param == 'phone_number') {
            errors = { ...errors, phone_number: msg };
        }
        if (param == 'longitude') {
            errors = { ...errors, longitude: msg };
        }
        if (param == 'latitude') {
            errors = { ...errors, latitude: msg };
        }
        if (req.files == 'imgUrl') {
            errors = { ...errors, imgUrl: msg };

        }
    });
    if (!result.isEmpty()) {
        return res.status(400).json({
            status: 400,
            errors
        })
    }

    const { clee, name, business_name, class_activity, email, street, no_ext, no_int, colony, code_postal, location, phone_number, website, longitude, latitude, store_number } = req.body;

    const existVeterinary = await Veterinary.findOne({ where: { clee } })
    if (existVeterinary) {
        return res.status(403).json({
            status: 403,
            msg: 'La veterinaria seleccionada ya está registrada'
        });
    }

    const { id } = req.user;
    const veterinary = await Veterinary.create({
        clee: clee,
        name: name,
        business_name: business_name,
        class_activity: class_activity,
        email: email,
        street: street,
        no_ext: no_ext,
        no_int: no_int,
        colony: colony,
        code_postal: code_postal,
        ubication: location,
        phone_number: phone_number,
        website: website,
        longitude: longitude,
        latitude: latitude,
        store_number: store_number,
        imgUrl: `${__dirname}/${nameImage}.jpg`,
        idUser: id
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
        msg: "¡Veterinaria Registrada Correctamente"
    })
}

const findAllVeterinaries = async (req, res) => {
    try {
        const veterinaries = await Veterinary.findAll();
        
        return res.status(200).json({
            status: 200,
            veterinaries
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            msg: 'Ha ocurrido un error, inténtelo más tarde'
        });
    }


}

const findVeterinary = async (req, res) => {
    const { id } = req.params;

    const numberId = parseInt(id);
    if (isNaN(numberId)) {
        return res.status(400).json({
            status: 400,
            msg: 'El id de la veterinaria es inválido'
        });
    }
    const veterinary = await Veterinary.findOne({ where: { id } });

    if (!veterinary) {
        return res.status(404).json({
            status: 404,
            msg: 'La veterinaria seleccionada no existe'
        })
    }

    return res.status(200).json({
        status: 200,
        veterinary
    });
}

const editVeterinary = async (req, res) => {
    const { id } = req.params;

    const numberId = parseInt(id);
    if (isNaN(numberId)) {
        return res.status(403).json({
            status: 403,
            msg: 'El id de la veterinaria es inválido'
        });
    }

    const veterinary = await Veterinary.findOne({ where: { id } });

    if (!veterinary) {
        return res.status(404).json({
            status: 404,
            msg: 'La veterinaria no encontrada'
        })
    }

    await check('email').isEmail().withMessage('El email es requerido').run(req);
    await check('phone_number').isLength({ max: 10, min: 10 }).withMessage('El teléfono es obligatorio').run(req);
    if(req.body.no_ext !== ''){
        await check('no_ext').isNumeric().withMessage('El no ext es inválido').run(req);
    }
    if(req.body.website !== ''){
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
        const veterinaryUpdate = await veterinary.save();
        return res.status(200).json({
            status: 200,
            msg: 'Veterinaria Editada Correctamente',
            veterinaryUpdate
        });
    } catch (error) {
        return res.json({
            msg: 'Hubo un error'
        })
    }

};

const deleteVeterinary = async (req, res) => {
    const { id } = req.params;
    const veterinary = await Veterinary.findOne({ where: { id } });
    if (!veterinary) {
        return res.status(404).json({
            status: 404,
            msg: 'Veterinaria no encontrada'
        });
    }

    try {
        await Veterinary.destroy({ where: { id } });
        return res.status(200).json({
            status: 200,
            msg: 'Veterinaria eliminada correctamente'
        })
    } catch (error) {
        return res.json({
            msg: 'Lo sentimos, hubo un error'
        })
    }
}

export { createVeterinary, findVeterinary, editVeterinary, deleteVeterinary, findAllVeterinaries };