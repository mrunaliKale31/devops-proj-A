// Shared Timetable Constants

export const TIMESLOTS = [
  { id: 1, label: '08:45-09:40', start: '08:45', end: '09:40', type: 'lecture' },
  { id: 2, label: '09:40-10:35', start: '09:40', end: '10:35', type: 'lecture' },
  { id: 3, label: '10:35-10:50', start: '10:35', end: '10:50', type: 'break', name: 'Short Break' },
  { id: 4, label: '10:50-11:45', start: '10:50', end: '11:45', type: 'lecture' },
  { id: 5, label: '11:45-12:40', start: '11:45', end: '12:40', type: 'lecture' },
  { id: 6, label: '12:40-13:40', start: '12:40', end: '13:40', type: 'break', name: 'Long Break' },
  { id: 7, label: '13:40-14:35', start: '13:40', end: '14:35', type: 'lecture' },
  { id: 8, label: '14:35-15:30', start: '14:35', end: '15:30', type: 'lecture' },
  { id: 9, label: '15:30-15:40', start: '15:30', end: '15:40', type: 'break', name: 'Short Break' },
  { id: 10, label: '15:40-16:30', start: '15:40', end: '16:30', type: 'lecture' },
];

export const IT_CORE_SCHEDULE = {
  1: { 1: 'DEVOPS', 2: 'Automation Testing', 4: 'Application Security', 5: 'Foundation of AI', 7: 'DEVOPS (Lab)', 8: 'DEVOPS (Lab)', 10: 'Library' },
  2: { 1: 'Application Security', 2: 'Foundation of AI', 4: 'Automation Testing', 5: 'DEVOPS', 7: 'Project Meeting', 8: 'Project Meeting', 10: 'Library' },
  3: { 1: 'Foundation of AI', 2: 'DEVOPS', 4: 'SCIL Aptitude', 5: 'Automation Testing', 7: 'Application Sec (Lab)', 8: 'Application Sec (Lab)', 10: 'Library' },
  4: { 1: 'Automation Testing', 2: 'Application Security', 4: 'DEVOPS', 5: 'Foundation of AI', 7: 'SCIL Professional Skills', 8: 'Library', 10: 'Mentor Meeting' },
  5: { 1: 'SHD', 2: 'SHD', 4: 'Application Security', 5: 'Automation Testing', 7: 'Foundation of AI (Lab)', 8: 'Foundation of AI (Lab)', 10: 'DEVOPS' }
};

export const parseTimeMins = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};
