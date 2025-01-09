const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const doctorSchema = new mongoose.Schema({
  doc_email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilepic: {
    type: String,
    default: "",
    // required: true
  },
  doc_name: {
    type: String,
    required: true,
  },
  doc_phone: {
    type: String,
    required: true,
  },
  clinic_name: {
    type: String,
    required: true,
  },
  clinic_add: {
    type: String,
    required: true,
  },
  clinic_phone: {
    type: String,
    required: true,
  },
  doc_dob: {
    type: Date,
    required: true,
  },
  doc_gender: {
    type: String,
    required: true,
  },
  doc_spec: {
    type: String,
    required: true,
  },
  doc_degree: {
    type: String,
    required: true,
  },
  doc_rem: {
    type: [
      {
        date: { type: String, required: true }, // Date of the remainder
        reminders: { type: [String], default: [] }, // Multiple remainders for the same date
      },
    ],
    default: [],
  },
  doc_exp: {
    type: Number,
    required: true,
  },
  clinic_time: {
    type: String,
    required: true,
  },
  emp_list: {
    type: [
      {
        staff_email: { type: String, required: true },
        designation: { type: String, required: true },
      },
    ],
    default: [],
  },
});

mongoose.model("Doctor", doctorSchema);
