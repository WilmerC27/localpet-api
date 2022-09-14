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

    const {name, last_name, email, token} = data;

    //Enviar email
    await transport.sendMail({
        from: 'localpet@gmail.com',
        to: email,
        subject: 'Confirma tu cuenta en localpetcancun.com',
        text: 'Confirma tu cuenta en localpetcancun.com',
        html: `
            <p>Hola ${name} ${last_name}, comprueba tu cuenta en localpetcancun.com</p>
            <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace: 
                <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirmar Cuenta</a>
            </p>
            <p>Si tu no creaste está cuenta, puedes ignorar el mensaje</p>

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
    
    const {email, nombre, token} = datos;

    //Enviar email
    await transport.sendMail({
        from: 'localpet@gmail.com',
        to: email,
        subject: 'Reestablece tu contraseña en localpetcancun.com',
        text: 'Reestablece tu contraseña en localpetcancun.com',
        html: `
            <p>Hola ${nombre}, has solicitado reestablecer tu contraseña en localpetcancun.com</p>

            <p>Sigue el siguiente enlace para generar una contraseña nueva: 
                <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Reestablecer Contraseña</a>
            </p>
            <p>Si tu no creaste el cambio de contraseña, puedes ignorar el mensaje</p>
        `
    })

}

export { emailRegister, emailForgotPassword }