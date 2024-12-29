const db = require('../config/db');

const addAppointment = async (req, res) => {
  const { buyer_id, seller_id, appointment_date, status, Property_id, time_slot } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO Appointment (buyer_id, seller_id, appointment_date, status, Property_id) VALUES (?, ?, ?, ?, ?)',
      [buyer_id, seller_id, appointment_date, status, Property_id]
    );

    const appointment_id = result.insertId;

    const [calendarResult] = await db.query(
      'INSERT INTO Calendar (Appointment_id, time_slot) VALUES (?, ?)',
      [appointment_id, time_slot]
    );

    res.status(201).json({
      message: 'Appointment added successfully',
      appointment: {
        id: appointment_id,
        buyer_id,
        seller_id,
        appointment_date,
        time_slot,
        calendar_id: calendarResult.insertId
      },
    });
  } catch (error) {
    console.error('Error adding appointment:', error);
    res.status(500).json({ message: 'Failed to add appointment', error: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const [appointments] = await db.query(
      `SELECT 
        a.Appointment_id, 
        a.buyer_id, 
        a.seller_id, 
        a.appointment_date, 
        a.status,
        c.time_slot,
        p.Property_title, 
        u_buyer.User_id AS buyer_user_id, 
        u_buyer.User_name AS buyer_name, 
        u_buyer.Email AS buyer_email,
        u_seller.User_id AS seller_user_id, 
        u_seller.User_name AS seller_name, 
        u_seller.Email AS seller_email
      FROM Appointment a
      LEFT JOIN Property p ON a.Property_id = p.Property_id
      LEFT JOIN User u_buyer ON a.buyer_id = u_buyer.User_id
      LEFT JOIN User u_seller ON a.seller_id = u_seller.User_id
      LEFT JOIN Calendar c ON a.Appointment_id = c.Appointment_id
      WHERE a.buyer_id = ? OR a.seller_id = ?`,
      [user_id, user_id]
    );

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this user' });
    }

    res.status(200).json({
      message: 'Appointments fetched successfully',
      appointments,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
};

  
  module.exports = {
    addAppointment,
    getAllAppointments,
  };
