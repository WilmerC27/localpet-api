import { DataTypes} from "sequelize";
import db from "../config/db.js";

const Animal_vacunas = db.define('animal_vacuna', {

    id_animal: {
        type: DataTypes.INTEGER,
        references: {
            model: 'animals',
            key: 'id'
        }
    },
    id_vacuna: {
        type: DataTypes.INTEGER,
        references: {
            model: 'vacunas',
            key: 'id'
        }
    },
    date_vacuna: {
        type: DataTypes.DATE,
        allowNull: false,
    }
});

export default Animal_vacunas;