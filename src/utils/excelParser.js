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
        status
      });
      
      // Update subject-wise
      if (!student.subjects[subject]) {
        student.subjects[subject] = {
          name: subject,
          faculty,
          conducted: 0,
          attended: 0
        };
      }
      student.subjects[subject].conducted += 1;
      if (status === 'Present') student.subjects[subject].attended += 1;
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

      // Sort history by Date descending
      student.history.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Calculate latest streak (last consecutive days attended)
      let streak = 0;
      // Filter out duplicate dates to find daily presence streak
      const uniqueDates = [...new Set(student.history.map(h => h.date))];
      
      for (const date of uniqueDates) {
        // If the student was present for at least one lecture on this day, count as streak
        const recordsThatDay = student.history.filter(h => h.date === date);
        const wasPresentAtAll = recordsThatDay.some(r => r.status === 'Present');
        
        if (wasPresentAtAll) {
          streak++;
        } else {
          break; // break streak on first absent day backwards
        }
      }
      student.streak = streak;
    });
    
    return studentRecords;
  } catch (error) {
    console.error('Error parsing excel file:', error);
    return null;
  }
};
