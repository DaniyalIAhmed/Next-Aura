const db = require("../config/db");

const addRating = async (req, res) => {
  const { user_id, property_id, rating } = req.body;

  if (rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ success: false, message: "Rating must be between 1 and 5." });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO rating (user_id, property_id, rating) VALUES (?, ?, ?)",
      [user_id, property_id, rating]
    );

    await connection.commit();
    connection.release();

    res.status(201).json({
      success: true,
      message: "Rating added successfully.",
      ratingId: result.insertId,
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding rating." });
  }
};

const updateRating = async (req, res) => {
  const { user_id, property_id, rating, rating_id } = req.body;

  if (rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ success: false, message: "Rating must be between 1 and 5." });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      "UPDATE rating SET user_id = ?, property_id = ?, rating = ? WHERE rating_id = ?",
      [user_id, property_id, rating, rating_id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Rating not found.");
    }

    await connection.commit();
    connection.release();

    res
      .status(200)
      .json({ success: true, message: "Rating updated successfully." });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating rating.",
    });
  }
};
const fetchRatings = async (req, res) => {
  const { property_id } = req.body;

  // Validate if the property_id is provided
  if (!property_id) {
    return res
      .status(400)
      .json({ success: false, message: "Property ID is required" });
  }

  const connection = await db.getConnection();
  try {
    // Query to fetch the average rating for the given property_id
    const [result] = await connection.query(
      "SELECT AVG(rating) AS average_rating FROM rating WHERE property_id = ?",
      [property_id]
    );

    // If no ratings are found, return a message indicating so
    if (result.length === 0 || result[0].average_rating === null) {
      return res.status(404).json({
        success: false,
        message: "No ratings found for this property",
      });
    }

    // Extract the average rating from the result
    const averageRating = result[0].average_rating;

    // Send the average rating as response
    res.status(200).json({
      success: true,
      averageRating: averageRating,
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ success: false, message: "Error fetching ratings" });
  } finally {
    connection.release(); // Ensure connection is released back to the pool
  }
};

module.exports = {
  addRating,
  updateRating,
  fetchRatings,
};
