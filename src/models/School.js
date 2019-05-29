const mongoose = require("mongoose");

const School = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    cnpj: {
      type: String,
      required: true
    },
    studentsNumber: {
      type: Number,
      required: true
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    paths: [{ type: String }],
    teacher: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("School", School);
