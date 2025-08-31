require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const tasksRouter = require('./routes/tasks');
app.use('/tasks', tasksRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
