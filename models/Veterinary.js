import { DataTypes } from "sequelize";
import db from '../config/db.js';

const Veterinary = db.define('veterinary', {
    clee: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    business_name: {
        type: DataTypes.STRING,
    },
    class_activity: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    street: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    no_ext: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    no_int: {
        type: DataTypes.STRING,
    },
    colony: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code_postal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ubication: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    website: {
        type: DataTypes.STRING
    },
    longitude: {
        type: DataTypes.STRING,
        allowNull: false
    },
    latitude: {
        type: DataTypes.STRING,
        allowNull: false
    },
    store_number: {
        type: DataTypes.STRING,
    },
    idUser: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    }
})

export default Veterinary;