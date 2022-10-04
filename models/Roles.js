import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Roles = db.define('roles', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Roles;