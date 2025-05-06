const confirmationMessage = document.getElementById('confirmationMessage');
const roomsTableBody = document.getElementById('roomsTableBody');

let roomData = [];

console.log("test")

// Utility function to get Nepal Standard Time (UTC+5:45)
function getNepalTime(isoDate) {
    const date = new Date(isoDate);
    const nepalOffsetMinutes = 345;
    const localOffsetMinutes = date.getTimezoneOffset();
    return new Date(date.getTime() + (nepalOffsetMinutes + localOffsetMinutes) * 60 * 1000);
}

// Utility function to format date
function formatDateTime(isoDate) {
    const date = getNepalTime(isoDate);
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
    return date.toLocaleString('en-GB', options).replace(',', '');
}

// Show confirmation message
function showConfirmation(message, color) {
    confirmationMessage.textContent = message;
    confirmationMessage.style.color = color;
    confirmationMessage.style.display = 'block';
    setTimeout(() => confirmationMessage.style.display = 'none', 3000);
}

// Fetch all pending rooms
async function fetchRooms() {
    console.log("test")
    try {
        const response = await fetch('fetch_rooms.php', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        console.log("Response received:", response);
        
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        roomData = await response.json();
        console.log('Fetched roomData:', roomData);

        if (!Array.isArray(roomData)) {
            console.error('Invalid response format:', roomData);
            throw new Error(roomData.error || 'Response is not an array.');
        }
        if (roomData.length === 0) {
            showConfirmation('No pending room requests found.', '#721c24');
            roomsTableBody.innerHTML = '<tr><td colspan="7">No pending requests</td></tr>';
            return;
        }

        displayRooms();
        showConfirmation('Pending room requests loaded successfully!', '#155724');
    } catch (error) {
        console.error('Error fetching rooms:', error);
        showConfirmation('Error loading rooms: ' + error.message, '#721c24');
        roomsTableBody.innerHTML = '<tr><td colspan="7">Error loading data</td></tr>';
    }
}

// Display all rooms in the table
// Display all rooms in the table
function displayRooms() {
    roomsTableBody.innerHTML = ''; // Clear existing rows
    roomData.forEach(room => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${room.name || 'N/A'}</td> <!-- Room Name -->
            <td>${room.room_type || 'N/A'}</td> <!-- Room Type -->
            <td>${room.location || 'N/A'}</td> <!-- Location -->
            <td>${room.capacity || 'N/A'}</td> <!-- Capacity -->
            <td>${room.price ? `Rs ${room.price}/-` : 'N/A'}</td> <!-- Price/Day -->
            <td><img src="${room.image || 'https://via.placeholder.com/100x60'}" alt="Room Image"></td> <!-- Image -->
            <td class="actions">
                <button class="approve-btn" data-id="${room.id}" ${room.status !== 'pending' ? 'disabled' : ''}>Approve</button>
                <button class="deny-btn" data-id="${room.id}" ${room.status !== 'pending' ? 'disabled' : ''}>Deny</button>
                <button class="reset-btn" data-id="${room.id}" style="display: ${room.status === 'pending' ? 'none' : 'inline-block'}">Reset</button>
            </td>
        `;
        roomsTableBody.appendChild(row);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.approve-btn').forEach(btn => btn.addEventListener('click', () => updateStatus(btn.dataset.id, 'APPROVED')));
    document.querySelectorAll('.deny-btn').forEach(btn => btn.addEventListener('click', () => updateStatus(btn.dataset.id, 'DENIED')));
    document.querySelectorAll('.reset-btn').forEach(btn => btn.addEventListener('click', () => resetStatus(btn.dataset.id)));
}



// Update room status
async function updateStatus(roomId, status) {
    const person = prompt('Enter your name (Approver/Denier):', '');
    if (!person) {
        showConfirmation('Name is required.', '#721c24');
        return;
    }

    try {
        const response = await fetch('update_status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: roomId,
                status: status,
                approver: status === 'APPROVED' ? person : null,
                denier: status === 'DENIED' ? person : null
            })
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const updatedRoom = await response.json();

        const roomIndex = roomData.findIndex(r => r.id === updatedRoom.id);
        if (roomIndex !== -1) roomData[roomIndex] = updatedRoom;

        fetchRooms(); // Refresh the list
        showConfirmation(`Room ${status.toLowerCase()} successfully!`, status === 'APPROVED' ? '#155724' : '#721c24');
    } catch (error) {
        console.error('Error updating status:', error);
        showConfirmation('Error updating status: ' + error.message, '#721c24');
    }
}

// Reset room status
async function resetStatus(roomId) {
    try {
        const response = await fetch('reset_status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: roomId })
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const updatedRoom = await response.json();

        const roomIndex = roomData.findIndex(r => r.id === updatedRoom.id);
        if (roomIndex !== -1) roomData[roomIndex] = updatedRoom;

        fetchRooms(); // Refresh the list
        showConfirmation('Room status reset to PENDING.', '#333');
    } catch (error) {
        console.error('Error resetting status:', error);
        showConfirmation('Error resetting status: ' + error.message, '#721c24');
    }
}

// Load rooms on page load
document.addEventListener('DOMContentLoaded', fetchRooms);
