import express from 'express';
import usersRoutes from './routes/usersRoutes.js';
import db from './config/db.js';

const app = express();

app.use(express.urlencoded({extended: true}));

try {
    await db.authenticate();
    db.sync();
    console.log('Conexion correcta');
} catch (error) {
    console.log(error);
}

app.use(express.json());

app.use('/api', usersRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
})