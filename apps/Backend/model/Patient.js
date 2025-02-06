const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const patientSchema = new mongoose.Schema({
  pat_email: {
    type: String,
    required: true,
    unique: true,
  },
  pat_name: {
    type: String,
    required: true,
  },
  pat_pass: {
    type: String,
    required: true,
  },
  pat_phone: {
    type: String,
    required: true,
  },
  pat_profilepic: {
    type: String,
    default: "",
  },
  pat_gender: {
    type: String,
    required: true,
  },
  pat_add: {
    type: String,
    required: true,
  },
  ppermission_granted: {
    type: [String],
    default: [],
  },
  ppermission_pending: {
    type: [String],
    default: [],
  },
  pat_history: [
    {
      fileName: { type: String, required: true }, // Name provided by user for the file
      fileDetails: {
        filename: { type: String, required: true }, // Unique filename
        fileUrl: { type: String, required: true }, // Path to the uploaded file
        fileType: { type: String, required: true }, // MIME type of the uploaded file
        uploadedAt: { type: Date, default: Date.now }, // Timestamp of when the file was uploaded
      },
    },
  ],  
});