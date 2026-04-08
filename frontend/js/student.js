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

// Load attendance data on page load
window.addEventListener('DOMContentLoaded', loadAttendanceData);

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
