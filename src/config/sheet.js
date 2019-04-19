const excel = require("excel4node");
const path = require("path");
const dateFormat = require("dateformat");

class Sheet {
  async createSheet(school, teacher, students) {
    const workbook = new excel.Workbook();

    var options = {
      sheetFormat: {
        defaultColWidth: 30
      }
    };

    // Add Worksheets to the workbook
    const worksheet = workbook.addWorksheet("Inscrição", options);

    // Create a reusable style
    const titleStyle = workbook.createStyle({
      font: {
        color: "#000000",
        size: 12,
        bold: true
      },
      numberFormat: "$#,##0.00; ($#,##0.00); -"
    });

    const defaultStyle = workbook.createStyle({
      font: {
        color: "#000000",
        size: 12,
        bold: false
      },
      numberFormat: "$#,##0.00; ($#,##0.00); -"
    });

    // Titulo dos campos de escola
    worksheet
      .cell(1, 1)
      .string("NOME")
      .style(titleStyle);
    worksheet
      .cell(1, 2)
      .string("CNPJ")
      .style(titleStyle);
    worksheet
      .cell(1, 3)
      .string("QUANTIDADE")
      .style(titleStyle);
    worksheet
      .cell(1, 4)
      .string("DATA")
      .style(titleStyle);

    // Titulo dos campos de professor
    worksheet
      .cell(4, 1)
      .string("NOME")
      .style(titleStyle);
    worksheet
      .cell(4, 2)
      .string("CPF")
      .style(titleStyle);
    worksheet
      .cell(4, 3)
      .string("E-MAIL")
      .style(titleStyle);
    worksheet
      .cell(4, 4)
      .string("TELEFONE")
      .style(titleStyle);
    worksheet
      .cell(4, 5)
      .string("RG")
      .style(titleStyle);

    var initialLine = 5;

    for (var i = 0; i < teacher.length; i++) {
      const actualLine = initialLine + i;
      const actualTeacher = teacher[i];
      worksheet
        .cell(actualLine, 1)
        .string(actualTeacher.name)
        .style(defaultStyle);
      worksheet
        .cell(actualLine, 2)
        .string(actualTeacher.cpf)
        .style(defaultStyle);
      worksheet
        .cell(actualLine, 3)
        .string(actualTeacher.email)
        .style(defaultStyle);
      worksheet
        .cell(actualLine, 4)
        .string(actualTeacher.cellphone)
        .style(defaultStyle);
      worksheet
        .cell(actualLine, 5)
        .string(actualTeacher.rg)
        .style(defaultStyle);
    }

    var initialLine = 5 + 1 + teacher.length;
    // Titulo dos campos de alunos
    worksheet
      .cell(initialLine, 1)
      .string("NOME")
      .style(titleStyle);
    worksheet
      .cell(initialLine, 2)
      .string("CPF")
      .style(titleStyle);
    worksheet
      .cell(initialLine, 4)
      .string("TELEFONE")
      .style(titleStyle);
    worksheet
      .cell(initialLine, 3)
      .string("E-MAIL")
      .style(titleStyle);
    worksheet
      .cell(initialLine, 5)
      .string("SÉRIE")
      .style(titleStyle);

    // Insere informacoes escola
    const now = new Date();
    const sanitizedDate = dateFormat(now, "dd/mm/yyyy - h:MM:ss TT");
    worksheet
      .cell(2, 1)
      .string(school.name)
      .style(defaultStyle);
    worksheet
      .cell(2, 2)
      .string(school.cnpj)
      .style(defaultStyle);
    worksheet
      .cell(2, 3)
      .string(school.students.toString())
      .style(defaultStyle);
    worksheet
      .cell(2, 4)
      .string(sanitizedDate)
      .style(defaultStyle);

    // Insere informacoes aluno

    initialLine++;
    for (var i = 0; i < students.length; i++) {
      const actualLine = initialLine + i;
      const actualStudent = students[i];
      worksheet
        .cell(actualLine, 1)
        .string(actualStudent.name)
        .style(defaultStyle);
      worksheet
        .cell(actualLine, 2)
        .string(actualStudent.cpf)
        .style(defaultStyle);
      worksheet
        .cell(actualLine, 4)
        .string(actualStudent.cellphone)
        .style(defaultStyle);
      worksheet
        .cell(actualLine, 3)
        .string(actualStudent.email)
        .style(defaultStyle);
      worksheet
        .cell(actualLine, 5)
        .string(actualStudent.year)
        .style(defaultStyle);
    }

    const pathToWrite = path.resolve(
      __dirname,
      "..",
      "..",
      "tmp",
      "sheets",
      `${school.cnpj}-${school.name}.xls`
    );
    workbook.write(pathToWrite);

    return pathToWrite;
  }
}

module.exports = new Sheet();
