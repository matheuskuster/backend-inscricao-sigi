const mongoose = require("mongoose");

const Student = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    cpf: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    cellphone: {
      type: String,
      required: true
    },
    class: {
      type: String,
      required: true
    },
    necessity: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Student", Student);
