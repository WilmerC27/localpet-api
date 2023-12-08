import Animal_vacunas from "../models/Animal_Vacuna.js";
import Animals from "../models/Animals.js";
import { check, validationResult } from 'express-validator';
import Vacunas from "../models/Vacunas.js";
import { Op } from "sequelize";

const getAnimals = async (req, res) => {
    try {
        let animals =  await Animals.findAll({ where: { id_user: req.user.id }});
        
        for(let animal of animals ){
            const animals_vacunas = await Animal_vacunas.findAll({where: {id_animal: animal.id}});
            const ids_vacunas = [];
            await animals_vacunas.forEach(vacunas => {
                ids_vacunas.push(vacunas.id_vacuna);
            });

            const vacunas = await Vacunas.findAll({where: {id: {[Op.in]: ids_vacunas}}});
            
            animal.dataValues['vacunas'] = vacunas;
        }


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

const getAnimal = async (req, res) => {
    try {
        const { id } = req.params;

        const numberId = parseInt(id);
        if (isNaN(numberId)) {
            return res.status(400).json({
                status: 400,
                msg: 'El id de la mascota es inválido'
            });
        }
        const animal = await Animals.findOne({ where: { id } });
    
        if (!animal) {
            return res.status(404).json({
                status: 404,
                msg: 'La mascota seleccionada no existe'
            })
        }
    
        return res.status(200).json({
            status: 200,
            animal
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Lo sentimos, hubo un error'
        })
    }
}


const createAnimal = async (req, res) => {
    try {
        await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
        await check('genero').notEmpty().withMessage('El género es obligatorio').run(req);
        await check('raza').notEmpty().withMessage('La raza es obligatoria').run(req);
        await check('color').notEmpty().withMessage('El color es obligatorio').run(req);
        await check('fecha_nac').notEmpty().withMessage('La fecha de nacimiento es obligatoria').run(req);
        await check('especie').notEmpty().withMessage('La especie es obligatoria').run(req);

        let result = validationResult(req);
        let errors = {};
        result.array().map(resulState => {
            const { param, msg } = resulState;
            if (param == 'nombre') {
                errors = { ...errors, nombre: msg };
            }
            if (param == 'genero') {
                errors = { ...errors, genero: msg };
            }
            if (param == 'raza') {
                errors = { ...errors, raza: msg };
            }
            if (param == 'color') {
                errors = { ...errors, color: msg };
            }
            if (param == 'fecha_nac') {
                errors = { ...errors, fecha_nac: msg };
            }
            if (param == 'especie') {
                errors = { ...errors, especie: msg };
            }
        });
        if (!result.isEmpty()) {
            return res.status(400).json({
                status: 400,
                errors
            });
        }

        const { nombre, genero, raza, color, fecha_nac, especie, nacionalidad } = req.body;
        const { id: id_user } = req.user;


        const animal = await Animals.create({
            nombre: nombre,
            sexo: genero,
            especie: especie,
            raza: raza,
            color: color,
            fecha_nac: fecha_nac,
            nacionalidad: nacionalidad,
            id_user: id_user
        });

        return res.status(201).json({
            status: 201,
            msg: "¡Mascota Registrada Correctamente"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Ocurrió un error'
        })
    }
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

    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('genero').notEmpty().withMessage('El género es obligatorio').run(req);
    await check('raza').notEmpty().withMessage('La raza es obligatoria').run(req);
    await check('color').notEmpty().withMessage('El color es obligatorio').run(req);
    await check('fecha_nac').notEmpty().withMessage('La fecha de nacimiento es obligatoria').run(req);
    await check('especie').notEmpty().withMessage('La especie es obligatoria').run(req);


    let result = validationResult(req);
    let errors = {};
    result.array().map(resulState => {
        const { param, msg } = resulState;
        if (param == 'nombre') {
            errors = { ...errors, nombre: msg };
        }
        if (param == 'genero') {
            errors = { ...errors, genero: msg };
        }
        if (param == 'raza') {
            errors = { ...errors, raza: msg };
        }
        if (param == 'color') {
            errors = { ...errors, color: msg };
        }
        if (param == 'fecha_nac') {
            errors = { ...errors, fecha_nac: msg };
        }
        if (param == 'especie') {
            errors = { ...errors, especie: msg };
        }
    });
    if (!result.isEmpty()) {
        return res.status(400).json({
            status: 400,
            errors
        });
    }

    animal.nombre = req.body.nombre || animal.nombre;
    animal.sexo = req.body.genero || animal.sexo;
    animal.raza = req.body.raza || animal.raza;
    animal.color = req.body.color || animal.color;
    animal.fecha_nac = req.body.fecha_nac || animal.fecha_nac;
    animal.especie = req.body.especie || animal.especie;
    animal.nacionalidad = req.body.nacionalidad || animal.nacionalidad;

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

export { getAnimals, createAnimal, editAnimal, deleteAnimal, getAnimal };