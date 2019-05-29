const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

class mailController {
  async sendMail(school, teacher, sigiEmail, paths) {
    const pathToView = path.resolve(__dirname, "..", "views", "email.html");
    const html = fs.readFileSync(pathToView, "utf8");

    const template = handlebars.compile(html);
    const replacements = {
      teacher_name: teacher[0].name,
      school_name: school.name
    };
    const htmlToSend = template(replacements);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "sigi.inscricao@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "inscricao.sigi1742"
      }
    });

    const options = {
      from: "sigi.inscricao@gmail.com",
      to: [teacher[0].email, sigiEmail, "sigi.inscricao@gmail.com"],
      subject: `Confirmação de inscrição na SiGI`,
      html: htmlToSend,
      attachments: [
        {
          name: `${school.name} INSCRICAO.xls`,
          path: paths[0]
        },
        {
          name: `${school.name} TERMO DE COMPROMISSO`,
          path: paths[1]
        }
      ]
    };

    transporter.sendMail(options, (error, info) => {
      if (error) {
        //console.log('E-mail não enviado.')
        throw error;
      } else {
        //console.log('E-mail enviado');
      }
    });
  }
}

module.exports = new mailController();
