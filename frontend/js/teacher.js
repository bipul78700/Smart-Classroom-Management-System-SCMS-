// Teacher Dashboard Logic

const API_BASE_URL = 'http://localhost:3000/api';

// Check if user is logged in and is a teacher
const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.role !== 'teacher') {
    window.location.href = 'index.html';
}

// Display teacher name
document.getElementById('teacherName').textContent = user.fullName;

// Set default booking date to today
document.getElementById('bookingDate').valueAsDate = new Date();

// DOM Elements
const studentSelect = document.getElementById('studentSelect');
const markPresentBtn = document.getElementById('markPresentBtn');
const markAbsentBtn = document.getElementById('markAbsentBtn');
const attendanceMessage = document.getElementById('attendanceMessage');
const bookingForm = document.getElementById('bookingForm');
const bookingMessage = document.getElementById('bookingMessage');
const logoutBtn = document.getElementById('logoutBtn');

// Material DOM Elements
const announcementForm = document.getElementById('announcementForm');
const uploadMaterialForm = document.getElementById('uploadMaterialForm');
const annMessage = document.getElementById('annMessage');
const uploadMessage = document.getElementById('uploadMessage');

// Load data on page load
window.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    loadAttendanceSummary();
    loadTodayAttendance();
    loadBookings();
});

// Mark attendance button handlers
markPresentBtn.addEventListener('click', () => markAttendance('present'));
markAbsentBtn.addEventListener('click', () => markAttendance('absent'));

// Booking form handler
bookingForm.addEventListener('submit', bookResource);

// Logout button handler
logoutBtn.addEventListener('click', logout);

// Material form handlers
if (announcementForm) announcementForm.addEventListener('submit', postAnnouncement);
if (uploadMaterialForm) uploadMaterialForm.addEventListener('submit', uploadMaterial);

// Function to mark attendance for a student
async function markAttendance(status) {
    const selectedValue = studentSelect.value;

    if (!selectedValue) {
        showAttendanceMessage('Please select a student', 'error');
        return;
    }

    // Parse student ID and name from select value
    const [studentId, studentName] = selectedValue.split('|');

    try {
        // Disable buttons
        markPresentBtn.disabled = true;
        markAbsentBtn.disabled = true;

        const response = await fetch(`${API_BASE_URL}/attendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentId: studentId,
                studentName: studentName,
                status: status,
                markedBy: user.username
            })
        });

        const data = await response.json();

        if (data.success) {
            showAttendanceMessage(`${studentName} marked as ${status}`, 'success');
            // Reload attendance data
            loadAttendanceSummary();
            loadTodayAttendance();
        } else {
            showAttendanceMessage(data.message || 'Failed to mark attendance', 'error');
        }

    } catch (error) {
        console.error('Mark attendance error:', error);
        showAttendanceMessage('Server error. Please try again.', 'error');
    } finally {
        // Re-enable buttons
        markPresentBtn.disabled = false;
        markAbsentBtn.disabled = false;
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
            document.getElementById('totalStudents').textContent = data.totalStudents;
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
                        </tr>
                    </thead>
                    <tbody>
            `;

            data.attendance.forEach(record => {
                const statusClass = record.status === 'present' ? 'status-present' : 'status-absent';
                const statusText = record.status === 'present' ? '✓ Present' : '✗ Absent';

                tableHTML += `
                    <tr>
                        <td>${record.studentName}</td>
                        <td><span class="${statusClass}">${statusText}</span></td>
                        <td>${record.markedBy}</td>
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

// Function to book a resource
async function bookResource(e) {
    e.preventDefault();

    const resourceName = document.getElementById('resourceName').value;
    const timeSlot = document.getElementById('timeSlot').value;
    const date = document.getElementById('bookingDate').value;
    const purpose = document.getElementById('bookingPurpose').value;

    if (!resourceName || !timeSlot || !date || !purpose) {
        showBookingMessage('Please fill in all fields', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                resourceName,
                timeSlot,
                date,
                bookedBy: user.username,
                purpose
            })
        });

        const data = await response.json();

        if (data.success) {
            showBookingMessage('Resource booked successfully! ✓', 'success');
            bookingForm.reset();
            document.getElementById('bookingDate').valueAsDate = new Date();
            loadBookings();
        } else {
            showBookingMessage(data.message || 'Failed to book resource', 'error');
        }

    } catch (error) {
        console.error('Booking error:', error);
        showBookingMessage('Server error. Please try again.', 'error');
    }
}

// Function to load bookings
async function loadBookings() {
    try {
        const response = await fetch(`${API_BASE_URL}/bookings`);
        const data = await response.json();

        const bookingsContainer = document.getElementById('bookingsList');

        if (data.success && data.bookings.length > 0) {
            let tableHTML = `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Resource</th>
                            <th>Date</th>
                            <th>Time</th>
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

    } catch (error) {
        console.error('Load bookings error:', error);
        document.getElementById('bookingsList').innerHTML =
            '<p>Error loading bookings.</p>';
    }
}

// Function to show attendance message
function showAttendanceMessage(message, type) {
    attendanceMessage.textContent = message;
    attendanceMessage.className = `message message-${type}`;
    attendanceMessage.style.display = 'block';

    setTimeout(() => {
        attendanceMessage.style.display = 'none';
    }, 3000);
}

// Function to show booking message
function showBookingMessage(message, type) {
    bookingMessage.textContent = message;
    bookingMessage.className = `message message-${type}`;
    bookingMessage.style.display = 'block';

    setTimeout(() => {
        bookingMessage.style.display = 'none';
    }, 3000);
}

// Function to logout
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Function to post announcement
async function postAnnouncement(e) {
    e.preventDefault();
    const title = document.getElementById('annTitle').value.trim();
    const content = document.getElementById('annContent').value.trim();

    if (!title || !content) {
        showCustomMessage(annMessage, 'Please fill in all fields', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/materials/announcement`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title, 
                content, 
                teacherName: user.fullName, 
                teacherId: user.id 
            })
        });

        const data = await response.json();
        if (data.success) {
            showCustomMessage(annMessage, 'Announcement posted successfully!', 'success');
            announcementForm.reset();
        } else {
            showCustomMessage(annMessage, data.message || 'Failed to post announcement', 'error');
        }
    } catch (error) {
        console.error('Announcement error:', error);
        showCustomMessage(annMessage, 'Server error. Please try again.', 'error');
    }
}

// Function to upload material (PDF/Image)
async function uploadMaterial(e) {
    e.preventDefault();
    const title = document.getElementById('matTitle').value.trim();
    const type = document.getElementById('matType').value;
    const fileInput = document.getElementById('matFile');
    const file = fileInput.files[0];

    if (!title || !type || !file) {
        showCustomMessage(uploadMessage, 'Please fill in all fields and select a file', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    formData.append('teacherName', user.fullName);
    if (user.id) formData.append('teacherId', user.id);
    formData.append('file', file);

    try {
        const response = await fetch(`${API_BASE_URL}/materials/upload`, {
            method: 'POST',
            body: formData // Note: no Content-Type header needed for FormData
        });

        const data = await response.json();
        if (data.success) {
            showCustomMessage(uploadMessage, 'Material uploaded successfully!', 'success');
            uploadMaterialForm.reset();
        } else {
            showCustomMessage(uploadMessage, data.message || 'Failed to upload material', 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showCustomMessage(uploadMessage, 'Server error. Please try again.', 'error');
    }
}

// Helper generic message function
function showCustomMessage(element, message, type) {
    element.textContent = message;
    element.className = `message message-${type}`;
    element.style.display = 'block';
    setTimeout(() => { element.style.display = 'none'; }, 3000);
}

// Function to dynamically load students into dropdown
async function loadStudents() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/users`);
        const data = await response.json();
        
        if (data.success && data.users) {
            const select = document.getElementById('studentSelect');
            
            // Keep default option
            select.innerHTML = '<option value="">-- Select Student --</option>';
            
            // Filter users to get only students and sort alphabetically
            const students = data.users.filter(u => u.role === 'student')
                                      .sort((a, b) => a.fullName.localeCompare(b.fullName));
            
            students.forEach(student => {
                const option = document.createElement('option');
                // Format matches existing structure: studentId|studentName -> username|fullName
                option.value = `${student.username}|${student.fullName}`;
                option.textContent = `${student.fullName} (${student.username})`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading students:', error);
    }
}
