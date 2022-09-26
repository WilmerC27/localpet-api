import express from 'express';
import usersRoutes from './routes/usersRoutes.js';
import veterinaryRoutes from './routes/veterinaryRoutes.js';
import db from './config/db.js';
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

try {
    await db.authenticate();
    db.sync();
    console.log('Conexion correcta');
} catch (error) {
    console.log(error);
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
app.use('/api', usersRoutes);
app.use('/api', veterinaryRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
})