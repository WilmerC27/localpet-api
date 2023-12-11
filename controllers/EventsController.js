import Events from "../models/Events.js";
import { check, validationResult } from "express-validator";
import path from "path";

const getEvents = async (req, res) => {
  try {
    let events = "";
    events = await Events.findAll({order: [['fecha', 'ASC']]});
    return res.status(200).json({
      status: 200,
      events,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Lo sentimos, hubo un error",
    });
  }
};

const getEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const numberId = parseInt(id);
    if (isNaN(numberId)) {
        return res.status(400).json({
            status: 400,
            msg: 'El id es inválido'
        });
    }

    let event = await Events.findOne({where: {id}});
    return res.status(200).json({
      status: 200,
      event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Lo sentimos, hubo un error",
    });
  }
};

const createEvents = async (req, res) => {
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

    await check("descripcion")
      .notEmpty()
      .withMessage("La descripción es obligatoria")
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
      if (param == "descripcion") {
        errors = { ...errors, descripcion: msg };
      }
    });
    if (!result.isEmpty()) {
      return res.status(400).json({
        status: 400,
        errors,
      });
    }

    const { nombre, fecha, hora, descripcion } = req.body;

    await Events.create({
      nombre: nombre,
      fecha: fecha,
      hora: hora,
      descripcion: descripcion,
      id_user: req.user.id
    });

    return res.status(201).json({
      status: 201,
      msg: "Evento agregado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Ha ocurrido un error",
    });
  }
};

const editEvents = async (req, res) => {
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

    await check("descripcion")
      .notEmpty()
      .withMessage("La descripción es obligatoria")
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
      if (param == "descripcion") {
        errors = { ...errors, descripcion: msg };
      }
    });
    if (!result.isEmpty()) {
      return res.status(400).json({
        status: 400,
        errors,
      });
    }

    const {id} = req.params;

    const event = await Events.findOne({where: {id}});

    if(!event) {
      return res.status(404).json({
        msg: 'Evento no encontrado'
      })
    }


    const { nombre, fecha, hora, descripcion } = req.body;

    event.nombre = nombre || event.nombre,
    event.fecha = fecha || event.fecha,
    event.hora = hora || event.hora,
    event.descripcion = descripcion || event.descripcion,

    await event.save();

    return res.status(200).json({
      status: 200,
      msg: "Evento editado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Ha ocurrido un error",
    });
  }
};

const deleteEvents = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    if (!id) {
      return res.status(400).json({
        msg: "El id es obligatorio",
      });
    }

    const event = await Events.findOne({ where: { id } });

    if (!event) {
      return res.status(404).json({
        msg: "Evento no existente",
      });
    }

    await Events.destroy({ where: { id } });

    return res.status(200).json({
      msg: "Evento eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Ha ocurrido un error",
    });
  }
};
export { getEvents, editEvents, createEvents, deleteEvents, getEvent };
