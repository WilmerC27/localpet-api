import { DataTypes} from "sequelize";
import db from "../config/db.js";

const Events = db.define('events', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hora: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    }
    ,
    img_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    datos_url: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export default Events;