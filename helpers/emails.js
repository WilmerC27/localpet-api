import nodemailer from 'nodemailer';

const emailRegister = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { name, last_name, email, token } = data;

    //Enviar email
    await transport.sendMail({
        from: 'localpet@localpet.online',
        to: email,
        subject: 'Confirma tu cuenta 🐶',
        text: 'Confirma tu cuenta 🐶',
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirma de Cuenta</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet">
        </head>
        <body style="background-color: #F5ABBC; font-family: 'Montserrat', sans-serif;">
            <div style="background-color: #FFFFFF; border-radius: 10px; padding: 20px; width: 70%; margin: 100px auto;">
                <div style="margin: -80px auto 0 auto; background-color: #FC8D47; border-radius: 50%; height: 100px; width: 100px;">
                    <img src="https://localpet.online/assets/email.png" alt="logo localpet" loaging="lazy" width="90"/>
                </div>
                <div style="text-align: center">
                    <h1 style="font-size: 18px; font-weight: bold; text-transform: uppercase;">Confirma tu cuenta</h1>
                </div>
                <p style="text-align: center">Hola ${name} ${last_name}, Gracias por elegir localpet para buscar tus veterinarias más cercanar y asi cumplir tus necesidades😊</p>
                <p style="text-align: center"><span style="color: #FC8D47; font-weight: bold; margin: 20px auto;">¡Tu cuenta ya está lista!🎉</span>, solo debes confirmarla en el siguiente enlace: </p>
                <br />
                <div style="text-align: center;">
                    <a style="text-decoration: none; background-color: #FC8D47; color: white; padding: 8px 20px; border-radius: 5px; box-shadow: 0px 0px 5px #ccc;" href="${process.env.FRONTEND_URL}/#/confirm/${token}">Confirmar Cuenta</a>
                </div>
                <br />
                <p>Si el botón no funciona puedes entrar a través de este enlace: </p>
                <div style="margin-bottom: 20px;">
                    <a style="text-decoration: none;" href="${process.env.FRONTEND_URL}/#/confirm/${token}">${process.env.FRONTEND_URL}/#/confirm/${token}</a>
                </div>
            </div>
        </body>
        </html>
        `
    })
}

const emailForgotPassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos;

    //Enviar email
    await transport.sendMail({
        from: 'localpet@localpet.online',
        to: email,
        subject: '¡Reestablece tu contraseña 👀!',
        text: '¡Reestablece tu contraseña 👀!',
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirma de Cuenta</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet">
        </head>
        <body style="background-color: #F5ABBC; font-family: 'Montserrat', sans-serif;">
            <div style="background-color: #FFFFFF; border-radius: 10px; padding: 20px; width: 70%; margin: 100px auto;">
                <div style="margin: -80px auto 0 auto; background-color: #FC8D47; border-radius: 50%; height: 100px; width: 100px;">
                    <img src="https://localpet.online/assets/email.png" alt="logo localpet" loaging="lazy" width="90"/>
                </div>
                <div style="text-align: center">
                    <h1 style="font-size: 18px; font-weight: bold; text-transform: uppercase;">Recupera tu contraseña</h1>
                </div>
                <p style="text-align: center">Hola ${nombre} ${last_name}, hemos detectado que olvidaste tu contraseña 😢 </p>
                <p style="text-align: center"><span style="color: #FC8D47; font-weight: bold; margin: 20px auto;">Reestablece tu contraseña con un simple ¡CLIC!</span>, solo debes confirmarla en el siguiente enlace: </p>
                <br />
                <div style="text-align: center;">
                    <a style="text-decoration: none; background-color: #FC8D47; color: white; padding: 8px 20px; border-radius: 5px; box-shadow: 0px 0px 5px #ccc;" href="${process.env.FRONTEND_URL}/#/forgot-password/${token}">Reestablecer Contraseña</a>
                </div>
                <br />
                <p>Si el botón no funciona puedes entrar a través de este enlace: </p>
                <div style="margin-bottom: 20px;">
                    <a style="text-decoration: none;" href="${process.env.FRONTEND_URL}/#/forgot-password/${token}">${process.env.FRONTEND_URL}/#/forgot-password/${token}</a>
                </div>
            </div>
        </body>
        </html>
        `
    })

}

export { emailRegister, emailForgotPassword }