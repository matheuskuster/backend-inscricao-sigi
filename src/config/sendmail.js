const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const mg = require("nodemailer-mailgun-transport");

class mailController {
  async sendMail(school, teacher, sigiEmail, paths) {
    try {
      const pathToView = path.resolve(__dirname, "..", "views", "email.html");
      const html = fs.readFileSync(pathToView, "utf8");

      const template = handlebars.compile(html);
      const replacements = {
        teacher_name: teacher[0].name,
        school_name: school.name
      };

      const htmlToSend = template(replacements);

      const auth = {
        auth: {
          api_key: process.env.MAILGUN_APIKEY,
          domain: process.env.MAILGUN_DOMAIN
        }
      };

      const nodemailerMailgun = nodemailer.createTransport(mg(auth));
      const attachments = [];

      attachments.push({
        filename: `${school.name} INSCRICAO.xls`,
        path: paths[0]
      });

      if (paths.length == 2) {
        attachments.push({
          filename: `${school.name} TERMO DE COMPROMISSO.${path.extname(
            paths[1]
          )}`,
          path: paths[1]
        });
      }

      nodemailerMailgun.sendMail(
        {
          from: "sigi.inscricao@gmail.com",
          to: [
            "sigi.inscricao@gmail.com",
            "matheuskuster@hotmail.com",
            sigiEmail
          ],
          subject: "Confirmação de inscrição na VII SiGI",
          html: htmlToSend,
          attachments: attachments
        },
        function(err, info) {
          if (err) {
            console.log("Error: " + err);
          } else {
            console.log("Response: " + info);
          }
        }
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = new mailController();
