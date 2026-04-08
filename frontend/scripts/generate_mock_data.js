import * as xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Subjects list
const subjects = [
  { name: 'DEVOPS', faculty: 'Prof. Ashvini' },
  { name: 'Automation Testing', faculty: 'Prof. Rupali' },
  { name: 'Application Security', faculty: 'Prof. Rahul' },
  { name: 'Foundation of AI', faculty: 'Prof. Swati' },
  { name: 'SCIL Aptitude', faculty: 'SCIL Team' },
  { name: 'SCIL Professional Skills', faculty: 'SCIL Team' },
  { name: 'SHD', faculty: 'Foreign Language' }
];

// Generate past 30 days of standard week days (Mon-Fri)
const dates = [];
let currentDate = new Date();
for (let i = 0; i < 30; i++) {
  const d = new Date(currentDate);
  d.setDate(d.getDate() - i);
  if (d.getDay() !== 0 && d.getDay() !== 6) { // Not Sunday or Saturday
    dates.push(d.toISOString().split('T')[0]);
  }
}

// Fixed timeslots
const timeslots = [
  '08:45-09:40',
  '09:40-10:35',
  '10:50-11:45',
  '11:45-12:40',
  '01:40-02:35',
  '02:35-03:30',
  '03:40-04:30'
];

// Create students
const students = [
  { enrollment: 'MITU19IT101', phone: '9876543210', name: 'John Doe' },
  { enrollment: 'MITU19IT102', phone: '9876543211', name: 'Jane Smith' }
];

const attendanceRecords = [];

// Generate records
students.forEach(student => {
  dates.forEach(date => {
    // 3 lectures a day per student randomly picked from subjects
    for (let l = 0; l < 3; l++) {
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const timeslot = timeslots[Math.floor(Math.random() * timeslots.length)];
      // 80% chance to be present
      const isPresent = Math.random() > 0.2;
      
      attendanceRecords.push({
        'Enrollment No': student.enrollment,
        'Phone Number': student.phone,
        'Student Name': student.name,
        'Date': date,
        'Time Slot': timeslot,
        'SubjectName': subject.name,
        'FacultyName': subject.faculty,
        'Status': isPresent ? 'Present' : 'Absent'
      });
    }
  });
});

const destPath = path.join(__dirname, '../public/data/attendance.xlsx');

const workbook = xlsx.utils.book_new();
const worksheet = xlsx.utils.json_to_sheet(attendanceRecords);

xlsx.utils.book_append_sheet(workbook, worksheet, 'Attendance');
xlsx.writeFile(workbook, destPath);

console.log(`Mock attendance data generated at: ${destPath}`);
