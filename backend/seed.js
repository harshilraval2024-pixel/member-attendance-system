/**
 * Seed script - populates the database with sample data for development.
 * Run: node seed.js
 */

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Member = require('./models/Member');
const Attendance = require('./models/Attendance');
const Admin = require('./models/Admin');

const members = [
  {
    firstName: 'Ahmad',
    surname: 'Rahimi',
    fatherName: 'Mohammad',
    dob: new Date('1998-03-15'),
    address: '123 Kabul Street, District 4',
    status: 'studying',
    studyField: 'Computer Science',
    skills: ['JavaScript', 'Python', 'React'],
    occupation: 'Student',
    interests: ['Programming', 'AI', 'Web Development'],
  },
  {
    firstName: 'Sara',
    surname: 'Ahmadi',
    fatherName: 'Ali',
    dob: new Date('1995-07-22'),
    address: '456 Herat Road, District 1',
    status: 'working',
    jobTitle: 'Software Engineer',
    company: 'Tech Corp',
    skills: ['Java', 'Spring Boot', 'SQL'],
    occupation: 'Software Engineer',
    interests: ['Backend Development', 'Cloud Computing'],
  },
  {
    firstName: 'Hassan',
    surname: 'Karimi',
    fatherName: 'Reza',
    dob: new Date('2000-11-05'),
    address: '789 Mazar Blvd',
    status: 'studying',
    studyField: 'Information Technology',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    occupation: 'Student',
    interests: ['Frontend Development', 'UI/UX Design'],
  },
  {
    firstName: 'Fatima',
    surname: 'Nazari',
    fatherName: 'Hossein',
    dob: new Date('1997-01-30'),
    address: '321 Balkh Avenue',
    status: 'working',
    jobTitle: 'Data Analyst',
    company: 'DataFlow Inc',
    skills: ['Python', 'SQL', 'Tableau', 'Excel'],
    occupation: 'Data Analyst',
    interests: ['Data Science', 'Machine Learning'],
  },
  {
    firstName: 'Omar',
    surname: 'Ghani',
    fatherName: 'Karim',
    dob: new Date('1999-06-18'),
    address: '654 Kandahar Way',
    status: 'studying',
    studyField: 'Software Engineering',
    skills: ['C++', 'Python', 'Git'],
    occupation: 'Student',
    interests: ['Algorithms', 'Competitive Programming'],
  },
  {
    firstName: 'Zahra',
    surname: 'Hosseini',
    fatherName: 'Abbas',
    dob: new Date('1996-09-12'),
    address: '987 Jalalabad Circle',
    status: 'working',
    jobTitle: 'Project Manager',
    company: 'BuildIt Solutions',
    skills: ['Agile', 'Scrum', 'Jira', 'Leadership'],
    occupation: 'Project Manager',
    interests: ['Management', 'Team Building'],
  },
  {
    firstName: 'Yusuf',
    surname: 'Mohammadi',
    fatherName: 'Ibrahim',
    dob: new Date('2001-04-25'),
    address: '147 Bamyan Lane',
    status: 'studying',
    studyField: 'Cybersecurity',
    skills: ['Linux', 'Networking', 'Python'],
    occupation: 'Student',
    interests: ['Cybersecurity', 'Ethical Hacking'],
  },
  {
    firstName: 'Maryam',
    surname: 'Sultani',
    fatherName: 'Ahmad',
    dob: new Date('1994-12-08'),
    address: '258 Parwan Street',
    status: 'working',
    jobTitle: 'UX Designer',
    company: 'DesignHub',
    skills: ['Figma', 'Sketch', 'Adobe XD', 'CSS'],
    occupation: 'UX Designer',
    interests: ['Design', 'User Research', 'Prototyping'],
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Member.deleteMany({});
    await Attendance.deleteMany({});
    await Admin.deleteMany({});

    console.log('Cleared existing data.');

    // Create admin
    await Admin.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
    });
    console.log('Admin created: admin@example.com / admin123');

    // Create members
    const createdMembers = await Member.insertMany(members);
    console.log(`${createdMembers.length} members created.`);

    // Generate attendance records for last 8 weeks
    const attendanceRecords = [];
    const today = new Date();

    for (let weekOffset = 0; weekOffset < 8; weekOffset++) {
      for (const member of createdMembers) {
        const date = new Date(today);
        date.setDate(date.getDate() - weekOffset * 7);
        date.setHours(0, 0, 0, 0);

        // Random attendance, weighted toward present
        const status = Math.random() > 0.25 ? 'present' : 'absent';

        attendanceRecords.push({
          memberId: member._id,
          date,
          status,
        });
      }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log(`${attendanceRecords.length} attendance records created.`);

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
