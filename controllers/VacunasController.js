import Animal_vacunas from "../models/Animal_Vacuna.js";
import Vacunas from "../models/Vacunas.js";
import { check, validationResult } from "express-validator";

const getVacunas = async (req, res) => {
  try {
    const vacunas = await Vacunas.findAll();

    return res.status(200).json(vacunas);
  } catch (error) {
    return res.status(500).json({
      msg: "Ha ocurrido un error",
    });
  }
};

/**---------------------------------------------------------- **/
const createVacuna = async (req, res) => {
  try {
    await check("id_animal")
      .notEmpty()
      .withMessage("La animal es obligatori")
      .run(req);
    await check("id_vacuna")
      .notEmpty()
      .withMessage("La vacuna es obligatoria")
      .run(req);

    await check("date_vacuna")
      .notEmpty()
      .withMessage("La fecha de la vacuna es obligatoria")
      .run(req);

    let result = validationResult(req);
    let errors = {};
    result.array().map((resulState) => {
      const { param, msg } = resulState;
      if (param == "id_animal") {
        errors = { ...errors, id_animal: msg };
      }
      if (param == "id_vacuna") {
        errors = { ...errors, id_vacuna: msg };
      }
      if (param == "date_vacuna") {
        errors = { ...errors, date_vacuna: msg };
      }
    });
    if (!result.isEmpty()) {
      return res.status(400).json({
        status: 400,
        errors,
      });
    }

    const {id_animal, id_vacuna, date_vacuna} = req.body;

    await Animal_vacunas.create({
        id_animal: id_animal,
        id_vacuna: id_vacuna,
        date_vacuna: date_vacuna,
    });

    return res.status(201).json({
        status: 201,
        msg: 'Vacuna agregada correctamente',
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Ha ocurrido un error",
    });
  }
};

export { getVacunas, createVacuna };
