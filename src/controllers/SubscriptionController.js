const School = require("../models/School");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Sheet = require("../config/sheet");
const mailController = require("../config/sendmail");

class SubscriptionController {
  async showSchool(req, res) {
    const school = await School.findOne({ cnpj: req.params.cnpj }).populate([
      "teacher",
      "students"
    ]);

    return res.json(school);
  }

  async uploadTerm(req, res) {
    const school = await School.findOne({ cnpj: req.params.cnpj }).populate(
      "teacher"
    );

    const teacher = school.teacher;

    try {
      school.paths.push(req.file.path);
      await school.save();

      await mailController.sendMail(
        school,
        teacher,
        process.env.SIGI_EMAIL || "matheuskuster@hotmail.com",
        school.paths
      );

      return res.status(200).json({ status: "File uploaded and e-mail sent" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: "File not uploaded" });
    }
  }

  async handleSubscription(req, res) {
    try {
      const { school, teachers, students } = req.body;

      // Create and store SCHOOL in database
      const savedSchool = await School.create({
        name: school.name,
        cnpj: school.cnpj,
        studentsNumber: school.studentsNumber
      });

      // Create and store TEACHERS in database
      for (var i = 0; i < teachers.length; i++) {
        const teacher = await Teacher.create({
          name: teachers[i].name,
          cpf: teachers[i].cpf,
          rg: teachers[i].rg,
          email: teachers[i].email,
          cellphone: teachers[i].cellphone
        });

        savedSchool.teacher.push(teacher);
      }

      // Create and store STUDENTS in database
      for (var i = 0; i < students.length; i++) {
        const newStudent = await Student.create({
          name: students[i].name,
          cpf: students[i].cpf,
          email: students[i].email,
          cellphone: students[i].cellphone,
          class: students[i].year,
          necessity: students[i].necessity
        });

        savedSchool.students.push(newStudent);
      }

      // Create SHEET
      const sheetPath = await Sheet.createSheet(
        savedSchool,
        savedSchool.teacher,
        savedSchool.students
      );
      savedSchool.paths.push(sheetPath);

      // Store TERM
      // savedSchool.paths.push(file.path);

      // Save changes in DATABASE
      await savedSchool.save();
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }

    return res
      .status(200)
      .json({ status: "Subscription process was sucessfully" });
  }
}

module.exports = new SubscriptionController();
