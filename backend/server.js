const express = require('express');
const cors = require('cors');
const path = require('path');
const { parseAttendanceData } = require('./services/excelParser');

const app = express();
const PORT = 9091;

app.use(cors());
app.use(express.json());

// Endpoints
app.get('/api/attendance', (req, res) => {
  const data = parseAttendanceData(path.join(__dirname, 'data', 'attendance.xlsx'));
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to process attendance data' });
  }
});

app.get('/api/current-lecture', (req, res) => {
  res.json({ lecture: 'DevOps & CI/CD', faculty: 'Dr. Jane Roe', room: 'A-202' });
});

app.get('/api/timetable', (req, res) => {
  res.json({ status: 'Available soon' });
});

app.listen(PORT, () => {
  console.log(`Backend Server API running on port ${PORT}`);
});
