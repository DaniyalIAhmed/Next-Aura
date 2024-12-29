const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_type: {
    type: DataTypes.ENUM('buyer', 'seller', 'admin'),
    defaultValue: 'buyer'
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
