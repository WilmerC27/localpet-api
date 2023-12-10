import Events from "../models/Events.js";
import { check, validationResult } from 'express-validator';
import path from 'path';

const getEvents = async (req, res) => {
    try {
        let events = '';
        events = await Events.findAll();
        return res.status(200).json({
            status: 200,
            events
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Lo sentimos, hubo un error'
        })
    }
}

const createEvents= async (req, res) => {
    try {
      await check("nombre")
        .notEmpty()
        .withMessage("La animal es obligatorio")
        .run(req);
      await check("fecha")
        .notEmpty()
        .withMessage("La vacuna es obligatoria")
        .run(req);
  
      await check("hora")
        .notEmpty()
        .withMessage("La fecha de la vacuna es obligatoria")
        .run(req);
  
      let result = validationResult(req);
      let errors = {};
      result.array().map((resulState) => {
        const { param, msg } = resulState;
        if (param == "nombre") {
          errors = { ...errors, nombre: msg };
        }
        if (param == "fecha") {
          errors = { ...errors, fecha: msg };
        }
        if (param == "hora") {
          errors = { ...errors, hora: msg };
        }
      });
      if (!result.isEmpty()) {
        return res.status(400).json({
          status: 400,
          errors,
        });
      }
  
      const {nombre, fecha, hora} = req.body;
  
      await Animal_vacunas.create({
          nombre: nombre,
          fecha: fecha,
          hora: hora,
      });
  
      return res.status(201).json({
          status: 201,
          msg: 'Evento agregado correctamente',
      });
  
    } catch (error) {
      return res.status(500).json({
        msg: "Ha ocurrido un error",
      });
    }
  };

const editEvents = async (req, res) => {
    try {
        
    } catch (error) {

    }
}

const deleteEvents = async (req, res) => {
    try {
        
    } catch (error) {

    }
}
export {getEvents, editEvents, createEvents, deleteEvents};