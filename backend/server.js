const express = require('express');
const db = require('./config/db');
const Routes = require('./routes/all_routes');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
const cors = require('cors');
app.use(cors());

app.use('/api/next_aura', Routes);

db.getConnection()
  .then(() => console.log('Connected to MySQL database.'))
  .catch((error) => console.error('Database connection failed:', error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
