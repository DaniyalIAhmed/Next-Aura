const db = require('../config/db');

const addMessage = async (req, res) => {
  const { Sender_id, Property_id, msg_content, timestamp } = req.body;

  try {
    const messageTimestamp = timestamp || new Date();
    const [result] = await db.query(
      'INSERT INTO Message (Sender_id, Property_id, msg_content, timestamp) VALUES (?, ?, ?, ?)',
      [Sender_id, Property_id, msg_content, messageTimestamp]
    );

    res.status(201).json({
      message: 'Message added successfully',
      messageDetails: { id: result.insertId, Sender_id, Property_id, msg_content, timestamp: messageTimestamp },
    });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ message: 'Failed to add message', error: error.message });
  }
};

const getMessages = async (req, res) => {
  const { property_id } = req.body;

  try {
    const [rows] = await db.query(
      `SELECT 
        m.Msg_id, 
        m.Sender_id, 
        m.Property_id, 
        m.msg_content, 
        m.timestamp, 
        u.User_name, 
        u.Email
      FROM Message m
      LEFT JOIN User u ON m.Sender_id = u.User_id
      WHERE m.Property_id = ?
      ORDER BY m.timestamp ASC`,
      [property_id]
    );

    res.status(200).json({
      message: `Messages for property ID ${property_id} fetched successfully`,
      messages: rows,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
  }
};

module.exports = {
  addMessage,
  getMessages,
};
