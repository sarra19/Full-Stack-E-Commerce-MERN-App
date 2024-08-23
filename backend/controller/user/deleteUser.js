const userModel = require("../../models/userModel");

const deleteUserController = async (req, res) => {
  try {
    // Retrieve the user ID from the request body
    const { userId } = req.body;

    // Attempt to find and delete the user by ID
    const deletedUser = await userModel.findByIdAndDelete(userId);

    // If the user does not exist, return a 404 response
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // If successful, return a success message
    res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    // Catch any errors and return a 500 response with the error message
    res.status(500).json({ success: false, message: "An error occurred while deleting the user.", error: error.message });
  }
};

module.exports = deleteUserController;
