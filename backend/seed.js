// Seed Script - Populate database with test data
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const Booking = require('./models/Booking');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scms')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Function to hash password
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

// Main seed function
async function seedDatabase() {
    try {
        console.log('\n🌱 Starting database seeding...\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Attendance.deleteMany({});
        await Booking.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Create Users
        console.log('👥 Creating users...');

        const hashedStudentPassword = await hashPassword('student123');
        const hashedTeacherPassword = await hashPassword('teacher123');
        const hashedAdminPassword = await hashPassword('admin123');

        const users = await User.insertMany([
            // Admin user
            {
                username: 'admin',
                password: hashedAdminPassword,
                role: 'admin',
                fullName: 'System Administrator',
                email: 'admin@scms.com'
            },
            // Teacher users
            {
                username: 'teacher1',
                password: hashedTeacherPassword,
                role: 'teacher',
                fullName: 'Dr. Sarah Johnson',
                email: 'sarah.johnson@scms.com'
            },
            {
                username: 'teacher2',
                password: hashedTeacherPassword,
                role: 'teacher',
                fullName: 'Prof. Michael Chen',
                email: 'michael.chen@scms.com'
            },
            // Student users
            {
                username: 'student1',
                password: hashedStudentPassword,
                role: 'student',
                fullName: 'John Doe',
                email: 'john.doe@scms.com'
            },
            {
                username: 'student2',
                password: hashedStudentPassword,
                role: 'student',
                fullName: 'Jane Smith',
                email: 'jane.smith@scms.com'
            },
            {
                username: 'student3',
                password: hashedStudentPassword,
                role: 'student',
                fullName: 'Mike Johnson',
                email: 'mike.johnson@scms.com'
            },
            {
                username: 'student4',
                password: hashedStudentPassword,
                role: 'student',
                fullName: 'Sarah Williams',
                email: 'sarah.williams@scms.com'
            },
            {
                username: 'student5',
                password: hashedStudentPassword,
                role: 'student',
                fullName: 'David Brown',
                email: 'david.brown@scms.com'
            }
        ]);

        console.log(`✅ Created ${users.length} users\n`);

        // Create Attendance Records
        console.log('📋 Creating attendance records...');

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const attendanceRecords = await Attendance.insertMany([
            // Today's attendance
            {
                studentId: 'student1',
                studentName: 'John Doe',
                status: 'present',
                date: today,
                markedBy: 'teacher1'
            },
            {
                studentId: 'student2',
                studentName: 'Jane Smith',
                status: 'present',
                date: today,
                markedBy: 'teacher1'
            },
            {
                studentId: 'student3',
                studentName: 'Mike Johnson',
                status: 'absent',
                date: today,
                markedBy: 'teacher1'
            },
            // Yesterday's attendance
            {
                studentId: 'student1',
                studentName: 'John Doe',
                status: 'present',
                date: yesterday,
                markedBy: 'teacher1'
            },
            {
                studentId: 'student2',
                studentName: 'Jane Smith',
                status: 'present',
                date: yesterday,
                markedBy: 'teacher1'
            },
            {
                studentId: 'student3',
                studentName: 'Mike Johnson',
                status: 'present',
                date: yesterday,
                markedBy: 'teacher1'
            },
            {
                studentId: 'student4',
                studentName: 'Sarah Williams',
                status: 'present',
                date: yesterday,
                markedBy: 'teacher1'
            },
            // Two days ago attendance
            {
                studentId: 'student1',
                studentName: 'John Doe',
                status: 'present',
                date: twoDaysAgo,
                markedBy: 'teacher2'
            },
            {
                studentId: 'student2',
                studentName: 'Jane Smith',
                status: 'absent',
                date: twoDaysAgo,
                markedBy: 'teacher2'
            },
            {
                studentId: 'student4',
                studentName: 'Sarah Williams',
                status: 'present',
                date: twoDaysAgo,
                markedBy: 'teacher2'
            },
            {
                studentId: 'student5',
                studentName: 'David Brown',
                status: 'present',
                date: twoDaysAgo,
                markedBy: 'teacher2'
            }
        ]);

        console.log(`✅ Created ${attendanceRecords.length} attendance records\n`);

        // Create Booking Records
        console.log('📅 Creating booking records...');

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const bookings = await Booking.insertMany([
            {
                resourceName: 'Computer Lab',
                timeSlot: '09:00-10:00',
                date: tomorrow,
                bookedBy: 'teacher1',
                purpose: 'Programming Class - Python Basics',
                status: 'confirmed'
            },
            {
                resourceName: 'Science Lab',
                timeSlot: '10:00-11:00',
                date: tomorrow,
                bookedBy: 'teacher2',
                purpose: 'Chemistry Experiment - Acids and Bases',
                status: 'confirmed'
            },
            {
                resourceName: 'Projector',
                timeSlot: '11:00-12:00',
                date: tomorrow,
                bookedBy: 'teacher1',
                purpose: 'Mathematics Lecture - Calculus',
                status: 'confirmed'
            },
            {
                resourceName: 'Smart Board',
                timeSlot: '13:00-14:00',
                date: nextWeek,
                bookedBy: 'teacher1',
                purpose: 'Interactive History Lesson',
                status: 'confirmed'
            },
            {
                resourceName: 'Library',
                timeSlot: '14:00-15:00',
                date: nextWeek,
                bookedBy: 'teacher2',
                purpose: 'Research Study Session',
                status: 'confirmed'
            }
        ]);

        console.log(`✅ Created ${bookings.length} bookings\n`);

        // Summary
        console.log('═══════════════════════════════════════════════');
        console.log('✅ Database seeding completed successfully!');
        console.log('═══════════════════════════════════════════════\n');

        console.log('📊 Summary:');
        console.log(`   - Users: ${users.length}`);
        console.log(`   - Attendance Records: ${attendanceRecords.length}`);
        console.log(`   - Bookings: ${bookings.length}\n`);

        console.log('🔐 Test Credentials:');
        console.log('   Admin:     admin / admin123');
        console.log('   Teacher:   teacher1 / teacher123');
        console.log('   Student:   student1 / student123\n');

        console.log('🚀 You can now start the server and test the application!\n');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed function
seedDatabase();
