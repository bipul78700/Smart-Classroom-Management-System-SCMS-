// Admin Dashboard Logic

const API_BASE_URL = 'http://localhost:3000/api';

// Check if user is logged in and is an admin
const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.role !== 'admin') {
    window.location.href = 'index.html';
}

// Display admin name
document.getElementById('adminName').textContent = user.fullName;

// DOM Elements
const logoutBtn = document.getElementById('logoutBtn');

// Load all data on page load
window.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    loadAttendanceSummary();
    loadTodayAttendance();
    loadAllBookings();
});

// Logout button handler
logoutBtn.addEventListener('click', logout);

// Function to load all users
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/users`);
        const data = await response.json();

        const usersContainer = document.getElementById('usersList');

        if (data.success) {
            // Count users by role
            const students = data.users.filter(u => u.role === 'student');
            const teachers = data.users.filter(u => u.role === 'teacher');
            const admins = data.users.filter(u => u.role === 'admin');

            // Update statistics
            document.getElementById('totalUsers').textContent = data.users.length;
            document.getElementById('totalStudents').textContent = students.length;
            document.getElementById('totalTeachers').textContent = teachers.length;

            // Display users table
            let tableHTML = `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Role</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            data.users.forEach(u => {
                const roleClass = `role-${u.role}`;
                tableHTML += `
                    <tr>
                        <td>${u.username}</td>
                        <td>${u.fullName}</td>
                        <td><span class="role-badge ${roleClass}">${u.role}</span></td>
                        <td>${u.email || 'N/A'}</td>
                    </tr>
                `;
            });

            tableHTML += `</tbody></table>`;
            usersContainer.innerHTML = tableHTML;

        } else {
            usersContainer.innerHTML = '<p>Error loading users</p>';
        }

    } catch (error) {
        console.error('Load users error:', error);
        document.getElementById('usersList').innerHTML =
            '<p>Error loading users. Make sure backend is running.</p>';
    }
}

// Function to load attendance summary
async function loadAttendanceSummary() {
    try {
        const response = await fetch(`${API_BASE_URL}/attendance/summary`);
        const data = await response.json();

        if (data.success) {
            document.getElementById('presentToday').textContent = data.todayPresent;
            document.getElementById('absentToday').textContent = data.todayAbsent;
            document.getElementById('attendanceRate').textContent = data.attendanceRate;
        }

    } catch (error) {
        console.error('Load summary error:', error);
    }
}

// Function to load today's attendance
async function loadTodayAttendance() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(`${API_BASE_URL}/attendance/date/${today}`);
        const data = await response.json();

        const attendanceContainer = document.getElementById('todayAttendance');

        if (data.success && data.attendance.length > 0) {
            let tableHTML = `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Status</th>
                            <th>Marked By</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            data.attendance.forEach(record => {
                const date = new Date(record.date);
                const time = date.toLocaleTimeString();
                const statusClass = record.status === 'present' ? 'status-present' : 'status-absent';
                const statusText = record.status === 'present' ? '✓ Present' : '✗ Absent';

                tableHTML += `
                    <tr>
                        <td>${record.studentName} (${record.studentId})</td>
                        <td><span class="${statusClass}">${statusText}</span></td>
                        <td>${record.markedBy}</td>
                        <td>${time}</td>
                    </tr>
                `;
            });

            tableHTML += `</tbody></table>`;
            attendanceContainer.innerHTML = tableHTML;

        } else {
            attendanceContainer.innerHTML = '<p>No attendance marked today yet.</p>';
        }

    } catch (error) {
        console.error('Load attendance error:', error);
        document.getElementById('todayAttendance').innerHTML =
            '<p>Error loading attendance data.</p>';
    }
}

// Function to load all bookings
async function loadAllBookings() {
    try {
        const response = await fetch(`${API_BASE_URL}/bookings`);
        const data = await response.json();

        const bookingsContainer = document.getElementById('allBookings');

        if (data.success) {
            // Update total bookings count
            document.getElementById('totalBookings').textContent = data.bookings.length;

            if (data.bookings.length > 0) {
                let tableHTML = `
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Resource</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Booked By</th>
                                <th>Purpose</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                data.bookings.forEach(booking => {
                    const date = new Date(booking.date).toLocaleDateString();
                    const statusClass = booking.status === 'confirmed' ? 'status-present' : 'status-absent';

                    tableHTML += `
                        <tr>
                            <td>${booking.resourceName}</td>
                            <td>${date}</td>
                            <td>${booking.timeSlot}</td>
                            <td>${booking.bookedBy}</td>
                            <td>${booking.purpose}</td>
                            <td><span class="${statusClass}">${booking.status}</span></td>
                        </tr>
                    `;
                });

                tableHTML += `</tbody></table>`;
                bookingsContainer.innerHTML = tableHTML;

            } else {
                bookingsContainer.innerHTML = '<p>No bookings found.</p>';
            }

        } else {
            bookingsContainer.innerHTML = '<p>Error loading bookings</p>';
        }

    } catch (error) {
        console.error('Load bookings error:', error);
        document.getElementById('allBookings').innerHTML =
            '<p>Error loading bookings.</p>';
    }
}

// Function to logout
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}
