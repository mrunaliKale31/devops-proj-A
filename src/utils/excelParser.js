import * as xlsx from 'xlsx';

export const parseAttendanceData = async (fileUrl) => {
  try {
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    
    // Parse workbook
    const workbook = xlsx.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to JSON
    const jsonStr = xlsx.utils.sheet_to_json(worksheet);
    
    // Group records by student
    const studentRecords = {};
    
    jsonStr.forEach((row) => {
      const enrollment = row['Enrollment No'];
      const phone = row['Phone Number'];
      const name = row['Student Name'];
      const date = row['Date'];
      const status = row['Status'];
      const subject = row['SubjectName'];
      const faculty = row['FacultyName'];
      const timeslot = row['Time Slot'];
      
      if (!studentRecords[enrollment]) {
        studentRecords[enrollment] = {
          enrollment,
          phone: String(phone),
          name,
          subjects: {},
          history: [],
          totalConducted: 0,
          totalAttended: 0
        };
      }
      
      const student = studentRecords[enrollment];
      
      // Update overall
      student.totalConducted += 1;
      if (status === 'Present') student.totalAttended += 1;
      
      // Add to history
      student.history.push({
        date,
        subject,
        faculty,
        timeslot,
        status,
        timestamp: new Date(date).getTime()
      });
      
      // Update subject-wise
      if (!student.subjects[subject]) {
        student.subjects[subject] = {
          name: subject,
          faculty,
          conducted: 0,
          attended: 0,
          lastAttended: null,
          lastAbsent: null,
        };
      }
      student.subjects[subject].conducted += 1;
      if (status === 'Present') {
        student.subjects[subject].attended += 1;
        // Keep track of latest present date
        const currentLast = student.subjects[subject].lastAttended;
        if (!currentLast || new Date(date) > new Date(currentLast)) {
          student.subjects[subject].lastAttended = date;
        }
      } else {
        // Keep track of latest absent date
        const currentLastAbs = student.subjects[subject].lastAbsent;
        if (!currentLastAbs || new Date(date) > new Date(currentLastAbs)) {
          student.subjects[subject].lastAbsent = date;
        }
      }
    });
    
    // Compute percentages and format for each student
    Object.values(studentRecords).forEach(student => {
      student.overallPercentage = student.totalConducted > 0 
        ? Math.round((student.totalAttended / student.totalConducted) * 100) 
        : 0;
        
      Object.values(student.subjects).forEach(sub => {
        sub.percentage = sub.conducted > 0 
          ? Math.round((sub.attended / sub.conducted) * 100) 
          : 0;
      });

      // Find weakest subject
      let weakest = null;
      let lowestPct = 101;
      Object.values(student.subjects).forEach(sub => {
        if (sub.percentage < lowestPct) {
          lowestPct = sub.percentage;
          weakest = sub.name;
        }
      });
      student.weakestSubject = weakest;

      // Sort history by Date descending
      student.history.sort((a, b) => b.timestamp - a.timestamp);
      
      // Calculate latest streak (last consecutive days attended)
      let streak = 0;
      const uniqueDates = [...new Set(student.history.map(h => h.date))];
      
      for (const date of uniqueDates) {
        const recordsThatDay = student.history.filter(h => h.date === date);
        const wasPresentAtAll = recordsThatDay.some(r => r.status === 'Present');
        
        if (wasPresentAtAll) {
          streak++;
        } else {
          break; 
        }
      }
      student.streak = streak;

      // Calculate Weekly Summary (last 7 recorded days)
      const last7Dates = uniqueDates.slice(0, 7);
      let weeklyConducted = 0;
      let weeklyAttended = 0;
      student.history.forEach(h => {
        if (last7Dates.includes(h.date)) {
          weeklyConducted++;
          if (h.status === 'Present') weeklyAttended++;
        }
      });
      student.weeklySummary = {
        conducted: weeklyConducted,
        attended: weeklyAttended
      };

    });
    
    return studentRecords;
  } catch (error) {
    console.error('Error parsing excel file:', error);
    return null;
  }
};
