import mongoose from "mongoose"; //Importing necessary modules

// Defining the User Schema
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true, //required field
    },
    lastName: {
      type: String,
      required: true, //required field
    },
    email: {
      type: String,
      required: true, //required field
      max: 100, // Maximum length of the email address
    },
  },
  { timestamps: true } // Adding timestamps option to track document creation and modification
);
// Creating the User model
const User = mongoose.model("User", UserSchema);
// Exporting the User model for use in server.js
export default User;
