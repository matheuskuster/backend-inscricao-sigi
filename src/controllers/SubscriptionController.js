const School = require("../models/School");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Sheet = require("../config/sheet");
const mailController = require("../config/sendmail");
const path = require("path");
const moment = require("moment");
moment.locale("pt-br");

class SubscriptionController {
  async show(req, res) {
    console.log("Returning schools");
    const schools = await School.find();

    return res.json(schools);
  }

  async showSchool(req, res) {
    console.log(req.params.cnpj);

    const schools = await School.find({ cnpj: req.params.cnpj });

    return res.json(schools);
  }

  async fixSchool(req, res) {
    const schools = await School.find({ cnpj: req.params.cnpj }).populate([
      "teacher",
      "students"
    ]);

    if (schools.length >= 2) {
      console.log(
        `Found ${schools.length} schools registered with the same CNPJ: ${
          req.params.cnpj
        }. Fixing it...`
      );

      const mainReference = schools[0];
      const idsToDelete = [];
      console.log(
        `Main Reference School: ${mainReference.name} / ${mainReference._id}`
      );

      schools.shift();
      schools.map(school => {
        school.students.map(student => {
          console.log(`Pushing ${student.name} into main reference...`);
          mainReference.students.push(student);
        });
        console.log("Pushed all students.");

        if (school.teacher.length > mainReference.teacher.length) {
          console.log(`New teachers array: ${school.teacher}`);
          mainReference.teacher = school.teacher;
        }

        idsToDelete.push(school._id);
      });

      mainReference.studentsNumber = mainReference.students.length;
      console.log(
        "Saving MainReference School in database with all the changes..."
      );

      await mainReference.save();
      console.log("Saved!");

      idsToDelete.map(async id => {
        console.log(`Deleting school referenced by _id: ${id}...`);
        await School.findOneAndDelete({ _id: id });
        console.log("Deleted!");
      });

      console.log("All fixed!");

      return res.json(mainReference);
    }

    return res.status(200).json({
      status: "Nothing to fix. Only 1 school registered with this CNPJ"
    });
  }

  async createSheet(req, res) {
    const school = await School.findOne({ cnpj: req.params.cnpj }).populate([
      "teacher",
      "students"
    ]);

    Sheet.createSheet(school, school.teacher, school.students).then(
      async sheetPath => {
        mailController.sendMail(
          school,
          school.teacher,
          process.env.SIGI_EMAIL || "matheuskuster@hotmail.com",
          [sheetPath]
        );

        return res.json(sheetPath);
      }
    );
  }

  async uploadTerm(req, res) {
    const school = await School.findById(req.params.id).populate("teacher");

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
    console.log("OI");
    let createdSchool;

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
      createdSchool = savedSchool;
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }

    return res.status(200).json({
      status: "Subscription proccess was sucessfully",
      id: createdSchool._id
    });
  }

  async adminIndex(req, res) {
    const schools = await School.find().sort('createdAt');
    var totalStudents = 0;
    var totalSchools = 0;

    schools.map(s => {
      totalStudents += s.students.length;
      totalSchools += 1;
      s.date = moment(s.createdAt).format("DD/MM/YYYY");
    });

    return res.render("admin", { schools, totalSchools, totalStudents });
  }

  async createSheetForAdmin(req, res) {
    const school = await School.findById(req.params.id).populate([
      "teacher",
      "students"
    ]);

    const sheetPath = await Sheet.createSheet(
      school,
      school.teacher,
      school.students
    );

    const response = `${school.cnpj}-${school.name}.xls`;
    return res.json(response);
  }

  async fileDownload(req, res) {
    const { file } = req.params;

    const filePath = path.resolve(__dirname, "..", "..", "tmp", "sheets", file);
    return res.sendFile(filePath);
  }

  async addStudents(req, res) {
    const { id } = req.params;
    const { students } = req.body;

    const school = await School.findById(id);

    console.log(school);

    students.map(async s => {
      let newStudent = await Student.create({
        name: s.name,
        cpf: s.cpf,
        email: s.email,
        cellphone: s.cellphone,
        class: s.year,
        necessity: s.necessity
      });

      school.students.push(newStudent);
    });

    school.studentsNumber = school.students.length;
    await school.save();

    return res.json(school);
  }
}

module.exports = new SubscriptionController();
