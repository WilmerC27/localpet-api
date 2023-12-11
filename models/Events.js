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
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_user: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    }
    // img_url: {
    //     type: DataTypes.STRING,
    //     allowNull: true
    // },
    // datos_url: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // }
});

export default Events;