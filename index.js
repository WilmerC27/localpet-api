import express from 'express';
import usersRoutes from './routes/usersRoutes.js';
import veterinaryRoutes from './routes/veterinaryRoutes.js';
import panelRoutes from './routes/panelRoutes.js';
import db from './config/db.js';
import fileUpload from 'express-fileupload';
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
    res.header('Access-Control-Allow-Origin', `${process.env.FRONTEND_URL}`);
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './imgVeterinaries'
}));

app.use('/api', usersRoutes);
app.use('/api', veterinaryRoutes);
app.use('/api/panel', panelRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
})