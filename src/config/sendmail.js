const nodemailer = require('nodemailer');

class mailController {

    sendMail(school, teacher, sigiEmail, paths) {

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'sigi.inscricao@gmail.com',
              pass: 'inscricao.sigi1742'
            }
        });

        const options = {
            from: 'sigi.inscricao@gmail.com',
            to: [teacher.email, sigiEmail, 'sigi.inscricao@gmail.com'],
            subject: `Confirmação de inscrição na SiGI`,
            text: `${teacher.name}, a inscrição da instituição ${school.name} na SiGI foi confirmada!\n
                Muito obrigado, sua participação conta muito para nós!\n Segue em anexo a planilha de inscrição e seu termo de compromisso.\n\n
                Att.\nEquipe de inscrição da SiGI.\nEste é um e-mail automático. Não responda-o.`,
            attachments: [
               {
                name: `${school.name} INSCRICAO.xls`,
                content: paths[0]
               },
               {
                name: `${school.name} TERMO DE COMPROMISSO`,
                path: paths[1]
              }
            ]
        };

        transporter.sendMail(options, (error, info) =>{
            if(error) {
                console.log('E-mail não enviado.')
                throw error;
            } else {
                console.log('E-mail enviado');
            }
        });

    }

}

module.exports = new mailController()