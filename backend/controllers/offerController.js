const db = require("../config/db");

const getAllOffers = async (req, res) => {
  const { user_id } = req.body;

  const connection = await db.getConnection();
  try {
    const [offers] = await connection.query(
      `SELECT 
                o.Offer_id, 
                o.Property_id, 
                o.Buyer_id, 
                o.Seller_id, 
                o.Offer_price, 
                o.Status, 
                o.Date,
                p.Property_title,
                u_buyer.User_id AS buyer_user_id, 
                u_buyer.User_name AS buyer_name, 
                u_buyer.Email AS buyer_email,
                u_seller.User_id AS seller_user_id, 
                u_seller.User_name AS seller_name, 
                u_seller.Email AS seller_email
            FROM Offer o
            LEFT JOIN Property p ON o.Property_id = p.Property_id
            LEFT JOIN User u_buyer ON o.Buyer_id = u_buyer.User_id
            LEFT JOIN User u_seller ON o.Seller_id = u_seller.User_id
            WHERE (o.Buyer_id = ? OR o.Seller_id = ?)`,
      [user_id, user_id]
    );

    if (offers.length === 0) {
      return res.status(404).json({ message: "No offers found for this user" });
    }

    res.status(200).json({
      message: "Offers fetched successfully",
      offers,
    });
  } catch (error) {
    console.error("Error fetching offers:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch offers", error: error.message });
  } finally {
    connection.release();
  }
};

const addOffer = async (req, res) => {
  const {
    Property_id,
    Buyer_id,
    Seller_id,
    Offer_price,
    status,
    Date: offerDate,
  } = req.body;

  if (!Property_id || !Buyer_id || !Seller_id || !Offer_price) {
    return res
      .status(400)
      .json({
        error:
          "Property_id, Buyer_id, Seller_id, and Offer_price are required.",
      });
  }

  if (isNaN(Offer_price) || Offer_price <= 0) {
    return res
      .status(400)
      .json({ error: "Offer_price must be a valid positive number." });
  }

  const currentDate = offerDate
    ? offerDate
    : new Date().toISOString().split("T")[0];

  const query = `INSERT INTO Offer (Property_id, Buyer_id, Seller_id, Offer_price, Status, Date) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

  try {
    const finalStatus = status ? status : "Pending";

    const [result] = await db.execute(query, [
      Property_id,
      Buyer_id,
      Seller_id,
      Offer_price,
      finalStatus,
      currentDate,
    ]);

    res
      .status(201)
      .json({ message: "Offer added successfully", Offer_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Failed to add offer" });
  }
};

const updateOffer = async (req, res) => {
  const { offerId } = req.params;
  const { Property_id, Buyer_id, Seller_id, Offer_price, Status, Date } =
    req.body;

  const query = `
        UPDATE Offer 
        SET Property_id = COALESCE(?, Property_id),
            Buyer_id = COALESCE(?, Buyer_id),
            Seller_id = COALESCE(?, Seller_id),
            Offer_price = COALESCE(?, Offer_price),
            Status = COALESCE(?, Status),
            Date = COALESCE(?, Date)
        WHERE Offer_id = ?`;

  try {
    const [result] = await db.execute(query, [
      Property_id,
      Buyer_id,
      Seller_id,
      Offer_price,
      Status,
      Date,
      offerId,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Offer not found" });
    }
    res.status(200).json({ message: "Offer updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update offer" });
  }
};

const updateOfferStatus = async (req, res) => {
  const { offer_id, status } = req.body;

  try {
    const [offer] = await db.query(
      "SELECT * FROM Offer WHERE Offer_id = ?",
      [offer_id]
    );

    if (!offer || offer.length === 0) {
      return res.status(404).json({
        message: "Offer not found or you are not authorized to update this offer",
      });
    }
    await db.query("UPDATE Offer SET Status = ? WHERE Offer_id = ?", [
      status,
      offer_id,
    ]);
    if (status === 'Accepted') {
      await db.query(
        "UPDATE Offer SET Status = 'Rejected' WHERE Property_id = ? AND Status = 'Pending' AND Offer_id != ?",
        [offer[0].Property_id, offer_id]
      );
    }

    res.status(200).json({ message: "Offer status updated successfully" });
  } catch (error) {
    console.error("Error updating offer status:", error);
    res.status(500).json({ message: "Failed to update offer status", error: error.message });
  }
};


const deleteOffer = async (req, res) => {
  const { offer_id } = req.body;

  try {
    const [offer] = await db.query(
      "SELECT * FROM Offer WHERE Offer_id = ?",
      [offer_id]
    );

    if (!offer || offer.length === 0) {
      return res
        .status(404)
        .json({
          message:
            "Offer not found or you are not authorized to delete this offer",
        });
    }

    await db.query("DELETE FROM Offer WHERE Offer_id = ?", [
      offer_id
    ]);

    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    console.error("Error deleting offer:", error);
    res
      .status(500)
      .json({ message: "Failed to delete offer", error: error.message });
  }
};

module.exports = {
  addOffer,
  deleteOffer,
  updateOffer,
  getAllOffers,
  updateOfferStatus,
  deleteOffer,
};
