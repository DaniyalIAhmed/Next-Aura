const db = require('../config/db'); 

const loginUser = async (req, res) => {
  const { Email, password } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM User WHERE Email = ? AND password = ?', [Email, password]);

    if (users.length > 0) {
      const user = users[0];
      res.status(200).json({
        message: 'Login successful',
        user: { user_id: user.User_id, User_name: user.User_name, Email: user.Email, Role: user.Role, Contact_info: user.Contact_info },
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Failed to log in', error: error.message });
  }
};

const addUser = async (req, res) => {
  const { User_name, Email, password, Role, Contact_info, profile_pic } = req.body;

  const connection = await db.getConnection(); 
  await connection.beginTransaction();

  try {
    const [result] = await connection.query(
      'INSERT INTO User (User_name, Email, password, Role, Contact_info, profile_pic) VALUES (?, ?, ?, ?, ?, ?)',
      [User_name, Email, password, Role, Contact_info, profile_pic]
    );

    await connection.commit(); 

    res.status(201).json({
      message: 'User added successfully',
      user: { id: result.insertId, User_name, Email, Role, Contact_info },
    });
  } catch (error) {
    await connection.rollback(); 
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Failed to add user', error: error.message });
  } finally {
    connection.release(); 
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  const connection = await db.getConnection(); 
  await connection.beginTransaction(); 

  try {
    const [result] = await connection.query('DELETE FROM User WHERE User_id = ?', [id]);

    if (result.affectedRows > 0) {
      await connection.commit(); 
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      await connection.rollback(); 
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    await connection.rollback(); 
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  } finally {
    connection.release(); 
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { User_name, Email, password, Role, Contact_info, profile_pic } = req.body;

  const connection = await db.getConnection(); 
  await connection.beginTransaction(); 

  try {
    const fields = [];
    const values = [];

    if (User_name) {
      fields.push('User_name = ?');
      values.push(User_name);
    }
    if (Email) {
      fields.push('Email = ?');
      values.push(Email);
    }
    if (password) {
      fields.push('password = ?');
      values.push(password);
    }
    if (Role) {
      fields.push('Role = ?');
      values.push(Role);
    }
    if (Contact_info) {
      fields.push('Contact_info = ?');
      values.push(Contact_info);
    }
    if (profile_pic) {
      fields.push('profile_pic = ?');
      values.push(profile_pic);
    }

    values.push(id);

    const [result] = await connection.query(
      `UPDATE User SET ${fields.join(', ')} WHERE User_id = ?`,
      values
    );

    if (result.affectedRows > 0) {
      const [updatedUser] = await connection.query('SELECT * FROM User WHERE User_id = ?', [id]);
      await connection.commit(); 
      res.status(200).json({ message: 'User updated successfully', user: updatedUser[0] });
    } else {
      await connection.rollback(); 
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    await connection.rollback(); 
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  } finally {
    connection.release(); 
  }
};

module.exports = {
  addUser,
  deleteUser,
  updateUser,
  loginUser,
};
