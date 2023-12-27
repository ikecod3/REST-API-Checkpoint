// import required modules
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";

// importing the User model
import User from "./models/User.js";

// Load environment variables from the specified file path
dotenv.config({ path: "./config/.env" });

// Create an instance of Express
const app = express();

// Middleware to parse JSON in the request body
app.use(express.json());
// MongoDB connection URI loaded from environment variables
const uri = process.env.MONGO_URI;

// connect to database
const connectToDatabase = async () => {
  try {
    // establish a connection to the  MongoDB database
    await mongoose.connect(uri);
    // Log a success message for me if the connection is established
    console.log("Connection successful");
  } catch (error) {
    // Log an error message  for me if there's an issue with the connection
    console.error(
      "❌❌ An error occurred while connecting to the database. Please try again",
      error
    );
  }
};
// Call the async function to connect to the database
connectToDatabase();

// *****************************************************************

// GET endpoint to retrieve all users
app.get("/api/v1/", async (req, res) => {
  try {
    // retrieve all users from the database using model.find()
    const users = await User.find();
    // Return a JSON response with a success message and the list of users
    res.json({ message: "Your request was successful", users });
  } catch (error) {
    // Handle errors by returning a 500 status and an error message
    res.status(500).json({ error: "An error occured in the server" });
  }
});

// POST endpoint to add a new user(s) to the database
app.post("/api/v1/users", async (req, res) => {
  // Extract new user data from the request body
  const newUsers = req.body;

  try {
    // Insert the new users into the database using insertMany
    const insertUsersToDatabase = await User.insertMany(newUsers);
    // Return a 201 status and a success message along with the inserted users
    res.status(201).json({
      message: "New users added successfully",
      users: insertUsersToDatabase,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error adding new users to the database:", error);
    // Return a 500 status and an error message in case of an internal server error
    res.status(500).json({
      error: "An error occured on the server while performing your operation",
    });
  }
});

// PUT endpoint to edit user information by ID
app.put("/api/v1/users/:id", async (req, res) => {
  // Extract user ID from request parameters
  const userId = req.params.id;
  // Extract updated user information from request body
  const { firstName, lastName, email } = req.body;
  try {
    // Attempt to find and update the user by ID
    const editedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: { firstName, lastName, email: email },
      },
      { new: true } //to return the updated information
    );

    // Check if the user was not found
    if (!editedUser) {
      // Return a 404 status and a message indicating that the user was not found
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Update complete", editedUser });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error updating user information: ", error);
    // Return a 500 status and an error message in case of an internal server error
    res.status(500).json({ error: "Internal server error. Update fail" });
  }
});

// DELETE endpoint to remove a user by their ID
app.delete("/api/v1/users/:id", async (req, res) => {
  // Extract the user ID from the request parameters
  const userId = req.params.id;
  try {
    // find and delete the user by ID
    const deletedUser = await User.findByIdAndDelete(userId);
    // Check if the user was not found
    if (!deletedUser) {
      // Return a 404 status and a message indicating that the user does not exist
      return res.status(404).json({ message: "User does not exist" });
    }
    // Return a 200 status and a success message along with the deleted user information
    res.status(200).json({ message: "Deletion successful", deletedUser });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error deleting user: ", error);
    // Return a 500 status and an error message in case of an internal server error
    res
      .status(500)
      .json({ error: "An internal server error occured deletion failed" });
  }
});

// Start the server on the environemt variable specified port or use a default port value: 3010.
const port = process.env.PORT || 3010;
app.listen(port, () => console.log(" 💨💨 Server is running on port 3010"));
