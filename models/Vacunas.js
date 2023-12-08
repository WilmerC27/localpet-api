import { DataTypes} from "sequelize";
import db from "../config/db.js";

const Vacunas = db.define('vacunas', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

export default Vacunas;