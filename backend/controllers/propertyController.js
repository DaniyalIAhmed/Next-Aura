const db = require("../config/db");

const searchProperties = async (req, res) => {
  const { name, location } = req.query;

  try {
    const connection = await db.getConnection();

    const searchConditions = [];
    const searchValues = [];

    if (name) {
      searchConditions.push("Property_title LIKE ?");
      searchValues.push(`%${name}%`);
    }

    if (location) {
      searchConditions.push("location LIKE ?");
      searchValues.push(`%${location}%`);
    }

    if (searchConditions.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide a name or location to search" });
    }

    const query = `
      SELECT * FROM Property
      WHERE ${searchConditions.join(" OR ")}
    `;

    const [results] = await connection.query(query, searchValues);

    res
      .status(200)
      .json({
        message: "Properties fetched successfully",
        properties: results,
      });
  } catch (error) {
    console.error("Error searching properties:", error);
    res
      .status(500)
      .json({ message: "Failed to search properties", error: error.message });
  }
};

const addPropertyWithOffer = async (req, res) => {
  const {
    Property_title,
    Description,
    location,
    price,
    size,
    type,
    posting_date,
    seller_id,
    Buyer_id = null,
    Offer_price = null,
    Status = "Available",
  } = req.body;

  const offerDate = new Date().toISOString().slice(0, 19).replace("T", " ");

  if (
    !Property_title ||
    !location ||
    !price ||
    !size ||
    !type ||
    !posting_date ||
    !seller_id
  ) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Insert into Property table
    const [propertyResult] = await connection.query(
      "INSERT INTO Property (Property_title, Description, location, price, size, type, posting_date, seller_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        Property_title,
        Description,
        location,
        price,
        size,
        type,
        posting_date,
        seller_id,
      ]
    );

    const propertyId = propertyResult.insertId;

    // Insert into Offer table
    const [offerResult] = await connection.query(
      "INSERT INTO Offer (Property_id, Buyer_id, Seller_id, Offer_price, Status, Date) VALUES (?, ?, ?, ?, ?, ?)",
      [propertyId, Buyer_id, seller_id, Offer_price || price, Status, offerDate]
    );

    await connection.commit();

    res.status(201).json({
      message: "Property and offer added successfully",
      property: {
        id: propertyId,
        Property_title,
        location,
        price,
        size,
        type,
        posting_date,
      },
      offer: {
        id: offerResult.insertId,
        Property_id: propertyId,
        Buyer_id,
        Seller_id: seller_id,
        Offer_price: Offer_price || price,
        Status,
        Date: offerDate,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error adding property and offer:", error);
    res
      .status(500)
      .json({
        message: "Failed to add property and offer",
        error: error.message,
      });
  } finally {
    connection.release();
  }
};

const deletePropertyWithOffer = async (req, res) => {
  const { user_id, property_id } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Check if the user is the seller of the property
    const [propertyCheck] = await connection.query(
      "SELECT * FROM Property WHERE Property_id = ? AND Seller_id = ?",
      [property_id, user_id]
    );

    if (!propertyCheck || propertyCheck.length === 0) {
      return res.status(403).json({
        message: "You are not authorized to delete this property",
      });
    }

    // Step 1: Delete associated calendar records first
    await connection.query("DELETE FROM Calendar WHERE Appointment_id IN (SELECT Appointment_id FROM Appointment WHERE Property_id = ?)", [property_id]);

    // Step 2: Delete associated appointments
    await connection.query("DELETE FROM Appointment WHERE Property_id = ?", [property_id]);

    // Step 3: Delete associated offers
    await connection.query("DELETE FROM Offer WHERE Property_id = ?", [property_id]);

    // Step 4: Delete the property itself
    const [propertyResult] = await connection.query(
      "DELETE FROM Property WHERE Property_id = ?",
      [property_id]
    );

    if (propertyResult.affectedRows > 0) {
      await connection.commit();
      res.status(200).json({
        message: "Property, corresponding offer, appointments, and calendar records deleted successfully",
      });
    } else {
      await connection.rollback();
      res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting property and offer:", error);
    res.status(500).json({
      message: "Failed to delete property and offer",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

const updatePropertyWithOffer = async (req, res) => {
  const { id } = req.params;
  const {
    Property_title,
    Description,
    location,
    price,
    size,
    type,
    posting_date,
    Offer_price,
    Status,
    Date,
  } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const propertyFields = [];
    const propertyValues = [];
    if (Property_title) {
      propertyFields.push("Property_title = ?");
      propertyValues.push(Property_title);
    }
    if (Description) {
      propertyFields.push("Description = ?");
      propertyValues.push(Description);
    }
    if (location) {
      propertyFields.push("location = ?");
      propertyValues.push(location);
    }
    if (price) {
      propertyFields.push("price = ?");
      propertyValues.push(price);
    }
    if (size) {
      propertyFields.push("size = ?");
      propertyValues.push(size);
    }
    if (type) {
      propertyFields.push("type = ?");
      propertyValues.push(type);
    }
    if (posting_date) {
      propertyFields.push("posting_date = ?");
      propertyValues.push(posting_date);
    }
    propertyValues.push(id);

    const [propertyResult] = await connection.query(
      `UPDATE Property SET ${propertyFields.join(", ")} WHERE Property_id = ?`,
      propertyValues
    );

    const offerFields = [];
    const offerValues = [];
    if (Offer_price) {
      offerFields.push("Offer_price = ?");
      offerValues.push(Offer_price);
    }
    if (Status) {
      offerFields.push("Status = ?");
      offerValues.push(Status);
    }
    if (Date) {
      offerFields.push("Date = ?");
      offerValues.push(Date);
    }
    offerValues.push(id);

    const [offerResult] = await connection.query(
      `UPDATE Offer SET ${offerFields.join(", ")} WHERE Property_id = ?`,
      offerValues
    );

    await connection.commit();

    if (propertyResult.affectedRows > 0 || offerResult.affectedRows > 0) {
      res
        .status(200)
        .json({ message: "Property and offer updated successfully" });
    } else {
      res
        .status(404)
        .json({ message: "Property or corresponding offer not found" });
    }
  } catch (error) {
    await connection.rollback();
    console.error("Error updating property and offer:", error);
    res
      .status(500)
      .json({
        message: "Failed to update property and offer",
        error: error.message,
      });
  } finally {
    connection.release();
  }
};
const getAllProperties = async (req, res) => {
  const { user_id } = req.params;
  try {
    const [properties] = await db.query(
      `SELECT 
        Property.Property_id,
        Property.Property_title, 
        Property.Description, 
        Property.location, 
        Property.price, 
        Property.size, 
        Property.type, 
        Property.posting_date,
        offer.Status
      FROM Property
      JOIN offer ON Property.Property_id = offer.Property_id
      WHERE Property.seller_id = ? AND offer.Status NOT IN ('Completed', 'Rejected')`,
      [user_id]
    );

    if (properties.length === 0) {
      return res.status(404).json({
        message: "No properties found for the provided user.",
      });
    }

    const uniqueProperties = [];
    const propertyIds = new Set();

    properties.forEach((property) => {
      if (!propertyIds.has(property.Property_id)) {
        propertyIds.add(property.Property_id);
        if (property.Status.toLowerCase() === 'available') {
          uniqueProperties.push(property);
        }
      }
    });

    return res.status(200).json({
      message: "Properties fetched successfully",
      properties: uniqueProperties,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while fetching properties",
    });
  }
};

const get_All_Properties = async (req, res) => {
  try {
    const [properties] = await db.query(
      `SELECT 
        Property_id, 
        Property_title, 
        Description, 
        location, 
        price, 
        size, 
        type, 
        posting_date 
      FROM Property`
    );

    if (properties.length === 0) {
      return res.status(404).json({ message: "No properties found" });
    }

    res.status(200).json({
      message: "Properties fetched successfully",
      properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch properties", error: error.message });
  }
};

const getPropertyCountByType = async (req, res) => {
  const { type } = req.body;

  try {
    let countQuery = `
      SELECT p.type, COUNT(DISTINCT p.Property_id) AS count
      FROM Property p
      JOIN Offer o ON p.Property_id = o.Property_id
      WHERE o.Status = 'Pending'
      GROUP BY p.type
    `;

    const countQueryParams = [];

    const [counts] = await db.query(countQuery, countQueryParams);

    let propertyQuery = `
      SELECT DISTINCT 
        p.Property_id, 
        p.Property_title, 
        p.Description, 
        p.location, 
        p.price, 
        p.size, 
        p.type, 
        p.posting_date, 
        p.seller_id
      FROM 
        Property p
      JOIN 
        Offer o 
      ON 
        p.Property_id = o.Property_id
      WHERE 
        o.Status = 'Pending'
    `;

    const propertyQueryParams = [];

    if (type) {
      propertyQuery += " AND p.type = ?";
      propertyQueryParams.push(type);
    }

    const [properties] = await db.query(propertyQuery, propertyQueryParams);

    res.status(200).json({
      message: "Properties with pending offers fetched successfully",
      counts: counts,
      properties: properties,
    });
  } catch (error) {
    console.error("Error fetching properties with pending offers:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch properties", error: error.message });
  }
};

module.exports = {
  addPropertyWithOffer,
  deletePropertyWithOffer,
  updatePropertyWithOffer,
  searchProperties,
  getAllProperties,
  getPropertyCountByType,
  get_All_Properties,
};
