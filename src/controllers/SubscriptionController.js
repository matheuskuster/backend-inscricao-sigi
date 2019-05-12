const School = require("../models/School");
const Teacher = require("../models/Teacher");
const Sheet = require("../config/sheet");
const mailController = require("../config/sendmail");

class SubscriptionController {
  async createSchool(req, res) {
    console.log(req.body);
    const school = await School.create({
      name: req.body.name,
      cnpj: req.body.cnpj,
      students: req.body.studentsNumber
    });

    return res.json(school);
  }

  async createAndSetTeacher(req, res) {
    const school = await School.findOne({ cnpj: req.params.cnpj });
    const teachers = req.body.teachers;

    console.log(req.body);

    for (var i = 0; i < teachers.length; i++) {
      const teacher = await Teacher.create({
        name: teachers[i].name,
        cpf: teachers[i].cpf,
        rg: teachers[i].rg,
        email: teachers[i].email,
        cellphone: teachers[i].cellphone
      });

      school.teacher.push(teacher);
    }

    await school.save();

    return res.json({ status: "OK" });
  }

  async showSchool(req, res) {
    const school = await School.findOne({ cnpj: req.params.cnpj }).populate(
      "teacher"
    );

    return res.json(school);
  }

  async createSheet(req, res) {
    const school = await School.findOne({ cnpj: req.body.cnpj }).populate(
      "teacher"
    );
    const teacher = school.teacher;
    const students = req.body.students;

    const sheetPath = await Sheet.createSheet(school, teacher, students);
    if (school.paths.length < 2) {
      school.paths.push(sheetPath);
      await school.save();
      return res.json({ status: "Sheet created" });
    }

    return res.json({ status: "Sheet not created" });
  }

  async uploadTerm(req, res) {
    const school = await School.findOne({ cnpj: req.params.cnpj });

    if (school.paths.length <= 2) {
      school.paths.push(req.file.path);
      await school.save();
      return res.json({ status: "File uploaded" });
    }

    return res.json({ status: "File not uploaded" });
  }

  async notificationToEmail(req, res) {
    const school = await School.findOne({ cnpj: req.params.cnpj }).populate(
      "teacher"
    );
    const teacher = school.teacher;

    await mailController.sendMail(
      school,
      teacher,
      process.env.SIGI_EMAIL,
      school.paths
    );

    return res.json({ status: "E-mail enviado" });
  }
}

module.exports = new SubscriptionController();
