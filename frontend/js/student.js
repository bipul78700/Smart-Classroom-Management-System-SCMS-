// Student Dashboard Logic

const API_BASE_URL = 'http://localhost:3000/api';

// Check if user is logged in and is a student
const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.role !== 'student') {
    window.location.href = 'index.html';
}

// Display student name
document.getElementById('studentName').textContent = user.fullName;

// DOM Elements
const markPresentBtn = document.getElementById('markPresentBtn');
const attendanceMessage = document.getElementById('attendanceMessage');
const logoutBtn = document.getElementById('logoutBtn');

// Load initial data on page load
window.addEventListener('DOMContentLoaded', () => {
    loadAttendanceData();
    loadAnnouncements();
    loadMaterials();
    loadStudentBookings();
});

// Mark attendance button click handler
markPresentBtn.addEventListener('click', markMyselfPresent);

// Logout button click handler
logoutBtn.addEventListener('click', logout);

// Function to mark myself present (simulated feature)
async function markMyselfPresent() {
    try {
        // Disable button to prevent double-clicking
        markPresentBtn.disabled = true;
        markPresentBtn.textContent = 'Marking...';

        // Send attendance request to backend
        const response = await fetch(`${API_BASE_URL}/attendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentId: user.id,
                studentName: user.fullName,
                status: 'present',
                markedBy: user.username
            })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Attendance marked successfully! ✓', 'success');
            // Reload attendance data
            loadAttendanceData();
        } else {
            showMessage(data.message || 'Failed to mark attendance', 'error');
        }

    } catch (error) {
        console.error('Mark attendance error:', error);
        showMessage('Server error. Please try again.', 'error');
    } finally {
        // Re-enable button
        markPresentBtn.disabled = false;
        markPresentBtn.textContent = '✓ Mark Myself Present';
    }
}

// Function to load attendance data
async function loadAttendanceData() {
    try {
        const response = await fetch(`${API_BASE_URL}/attendance/student/${user.id}`);
        const data = await response.json();

        if (data.success) {
            // Update statistics
            document.getElementById('totalDays').textContent = data.totalDays;
            document.getElementById('presentDays').textContent = data.presentDays;
            document.getElementById('absentDays').textContent = data.absentDays;
            document.getElementById('attendancePercentage').textContent = data.attendancePercentage;

            // Update attendance history table
            displayAttendanceHistory(data.attendance);
        } else {
            document.getElementById('attendanceHistory').innerHTML =
                '<p>Error loading attendance data</p>';
        }

    } catch (error) {
        console.error('Load attendance error:', error);
        document.getElementById('attendanceHistory').innerHTML =
            '<p>Error loading attendance data. Make sure backend is running.</p>';
    }
}

// Function to display attendance history in a table
function displayAttendanceHistory(attendanceRecords) {
    const historyContainer = document.getElementById('attendanceHistory');

    if (attendanceRecords.length === 0) {
        historyContainer.innerHTML = '<p>No attendance records found.</p>';
        return;
    }

    // Create table
    let tableHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Marked By</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Add rows for each attendance record
    attendanceRecords.forEach(record => {
        const date = new Date(record.date).toLocaleDateString();
        const statusClass = record.status === 'present' ? 'status-present' : 'status-absent';
        const statusText = record.status === 'present' ? '✓ Present' : '✗ Absent';

        tableHTML += `
            <tr>
                <td>${date}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
                <td>${record.markedBy}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    historyContainer.innerHTML = tableHTML;
}

// Function to show message to user
function showMessage(message, type) {
    attendanceMessage.textContent = message;
    attendanceMessage.className = `message message-${type}`;
    attendanceMessage.style.display = 'block';

    // Hide message after 3 seconds
    setTimeout(() => {
        attendanceMessage.style.display = 'none';
    }, 3000);
}

// Function to logout
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Function to load announcements
async function loadAnnouncements() {
    try {
        const response = await fetch(`${API_BASE_URL}/materials?type=announcement`);
        const data = await response.json();
        const container = document.getElementById('announcementsList');

        if (data.success && data.materials && data.materials.length > 0) {
            let html = '';
            data.materials.forEach(ann => {
                const date = new Date(ann.createdAt).toLocaleDateString();
                html += `
                    <div style="padding: 10px; border-left: 4px solid #007bff; background: #f8f9fa;">
                        <h4 style="margin: 0; color: #007bff;">${ann.title}</h4>
                        <p style="margin: 5px 0;">${ann.content}</p>
                        <small style="color: #666;">Posted by ${ann.teacherName} on ${date}</small>
                    </div>
                `;
            });
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p>No announcements found.</p>';
        }
    } catch (error) {
        console.error('Announcements error:', error);
        document.getElementById('announcementsList').innerHTML = '<p>Error loading announcements.</p>';
    }
}

// Function to load notes and images
async function loadMaterials() {
    try {
        // Fetch all materials, we will filter locally for note/image if backend didn't
        const response = await fetch(`${API_BASE_URL}/materials`);
        const data = await response.json();
        const container = document.getElementById('materialsList');

        if (data.success && data.materials) {
            const files = data.materials.filter(m => m.type === 'note' || m.type === 'image');
            if (files.length > 0) {
                let html = '';
                files.forEach(file => {
                    const icon = file.type === 'note' ? '📄' : '🖼️';
                    html += `
                        <div style="border: 1px solid #ddd; padding: 10px; border-radius: 4px; background: #fff;">
                            <div style="font-size: 24px; margin-bottom: 5px;">${icon}</div>
                            <h4 style="margin: 0 0 5px 0;">${file.title}</h4>
                            <p style="margin: 0 0 10px 0; font-size: 0.9em; color: #666;">From: ${file.teacherName}</p>
                            <a href="http://localhost:3000${file.fileUrl}" target="_blank" class="btn btn-primary" style="display: inline-block; text-align: center; text-decoration: none; font-size: 0.8em; padding: 5px 10px;">Open ${file.type}</a>
                        </div>
                    `;
                });
                container.innerHTML = html;
            } else {
                container.innerHTML = '<p>No notes or materials available.</p>';
            }
        } else {
            container.innerHTML = '<p>No materials found.</p>';
        }
    } catch (error) {
        console.error('Materials error:', error);
        document.getElementById('materialsList').innerHTML = '<p>Error loading materials.</p>';
    }
}

// Function to load active bookings
async function loadStudentBookings() {
    try {
        const response = await fetch(`${API_BASE_URL}/bookings`);
        const data = await response.json();
        const container = document.getElementById('studentBookingsList');

        if (data.success && data.bookings && data.bookings.length > 0) {
            let tableHTML = `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Resource</th>
                            <th>Date</th>
                            <th>Time</th>
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
                        <td><span class="${statusClass}">${booking.status}</span></td>
                    </tr>
                `;
            });
            tableHTML += `</tbody></table>`;
            container.innerHTML = tableHTML;
        } else {
            container.innerHTML = '<p>No active bookings available.</p>';
        }
    } catch (error) {
        console.error('Bookings error:', error);
        document.getElementById('studentBookingsList').innerHTML = '<p>Error loading bookings.</p>';
    }
}
