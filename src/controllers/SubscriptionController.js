const School = require('../models/School');
const Teacher = require('../models/Teacher');
const Sheet = require('../config/sheet');
const mailController = require('../config/sendmail');

class SubscriptionController {

    async createSchool(req, res) {
        const school = await School.create({
            name: req.body.name,
            cnpj: req.body.cnpj,
            students: req.body.studentsNumber
        });

        return res.json(school);
    }

    async createAndSetTeacher(req, res) {
        const school = await School.findOne({ cnpj: req.params.cnpj });

        const teacher = await Teacher.create({
            name: req.body.name,
            cpf: req.body.cpf,
            rg: req.body.rg,
            email: req.body.email,
            cellphone: req.body.cellphone
        });

        school.teacher = teacher;

        await school.save();

        return res.json(teacher);
    }

    async showSchool(req, res) {
        const school = await School.findOne({ cnpj: req.params.cnpj }).populate('teacher');

        return res.json(school);
    }

    async createSheet(req, res) {
        const school = await School.findOne({ cnpj: req.body.cnpj }).populate('teacher');
        const teacher = school.teacher;
        const students = req.body.students;

        const sheetPath = await Sheet.createSheet(school, teacher, students);
        if (school.paths.length <= 2) {
            school.paths.push(sheetPath);
            await school.save();
            return res.json({ "status": "Sheet created" });
        }

        return res.json({ "status": "Sheet not created" });
    }

    async uploadTerm(req, res) {
        const school = await School.findOne({ cnpj: req.params.cnpj });

        if (school.paths.length <= 2) {
            school.paths.push(req.file.path);
            await school.save();
            return res.json({ 'status': 'File uploaded' });
        }
        
        return res.json({ 'status': 'File not uploaded' });
        
    }

    async notificationToEmail(req, res) {
        const school = await School.findOne({ cnpj: req.params.cnpj }).populate('teacher');
        const teacher = school.teacher;

        await mailController.sendMail(school, teacher, process.env.SIGI_EMAIL, school.paths);
        return res.json({ "status": "E-mail enviado" });

    }

}

module.exports = new SubscriptionController();