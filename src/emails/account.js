const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    console.log(`mail de bienvenue envoyé à ${name}`);
    sgMail

        .send({
        to: email,
        from: "ferraina.matthias@gmail.com",
        subject: "Bienvenue dans notre communauté ;)",
        text: `Bonjour ${name}, Toutes nos féliitations. Ton compte a bien été créé`
    })
}

const sendCancelationEmail = (email, name) => {
    console.log(`mail d'aurevoir  envoyé à ${name}`);
    sgMail
        .send({
            to: email,
            from: "ferraina.matthias@gmail.com",
            subject: "Mais non il ne faut pas partir !",
            text: `Bha alors ${name}? Pourquoi nous quitte tu ? :( . On compte sur toi pour nous dire tout ce qui n'a pas été, on alors ce sur quoi on peut s'améliorer.`
        })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}