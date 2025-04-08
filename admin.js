// Get DOM elements
const statusElement = document.getElementById('status');
const approveBtn = document.getElementById('approveBtn');
const denyBtn = document.getElementById('denyBtn');
const resetBtn = document.getElementById('resetBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const requestIndicator = document.getElementById('requestIndicator');
const confirmationMessage = document.getElementById('confirmationMessage');

// Elements to populate with data
const submitterElement = document.getElementById('submitter');
const dateSubmittedElement = document.getElementById('dateSubmitted');
const approverElement = document.getElementById('approver');
const roomNameElement = document.getElementById('roomName');
const roomNameDetailElement = document.getElementById('roomNameDetail');
const ownerNameElement = document.getElementById('ownerName');
const roomTypeElement = document.getElementById('roomType');
const roomLocationElement = document.getElementById('roomLocation');
const roomCapacityElement = document.getElementById('roomCapacity');
const roomPriceElement = document.getElementById('roomPrice');
const roomImageElement = document.getElementById('roomImage');

// Variables to store data and track current request
let roomData = [];
let currentIndex = 0;

// Function to format a date to "DD-MMM-YYYY" (e.g., "28-Mar-2025")
function formatDate(isoDate) {
    const date = new Date(isoDate);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
}

// Function to fetch data
async function fetchRoomData() {
    try {
        const response = await fetch('mockdata.json');
        roomData = await response.json();
        if (roomData.length === 0) {
            throw new Error('No room requests found.');
        }
        displayRoom(currentIndex); // Display the first room initially
    } catch (error) {
        console.error('Error fetching room data:', error);
        confirmationMessage.textContent = 'Error loading room data. Please try again later.';
        confirmationMessage.style.color = '#721c24';
        confirmationMessage.style.display = 'block';
    }
}

// Function to display a room request based on the index
function displayRoom(index) {
    const room = roomData[index];

    // Populate the fields with data
    submitterElement.textContent = room.submitter;
    dateSubmittedElement.textContent = formatDate(room.dateSubmitted); // Format the date
    approverElement.textContent = room.approver;
    roomNameElement.textContent = room.roomName;
    roomNameDetailElement.textContent = room.roomName;
    ownerNameElement.textContent = room.ownerName;
    roomTypeElement.textContent = room.roomType;
    roomLocationElement.textContent = room.roomLocation;
    roomCapacityElement.textContent = room.roomCapacity;
    roomPriceElement.textContent = room.roomPrice;
    roomImageElement.src = room.imageUrl;

    // Update request indicator
    requestIndicator.textContent = `Request ${index + 1} of ${roomData.length}`;

    // Update status from localStorage (if it exists for this room)
    const savedStatus = localStorage.getItem(`roomStatus_${room.id}`);
    const savedBgColor = localStorage.getItem(`statusBgColor_${room.id}`);
    const savedTextColor = localStorage.getItem(`statusTextColor_${room.id}`);

    if (savedStatus && savedBgColor && savedTextColor) {
        statusElement.textContent = savedStatus;
        statusElement.style.backgroundColor = savedBgColor;
        statusElement.style.color = savedTextColor;
        approveBtn.disabled = true;
        denyBtn.disabled = true;
        resetBtn.style.display = 'inline-block';
    } else {
        statusElement.textContent = 'PENDING';
        statusElement.style.backgroundColor = '#E0E0E0';
        statusElement.style.color = '#000';
        approveBtn.disabled = false;
        denyBtn.disabled = false;
        resetBtn.style.display = 'none';
    }

    // Update navigation button states
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === roomData.length - 1;
}

// Function to show confirmation message
function showConfirmation(message, color) {
    confirmationMessage.textContent = message;
    confirmationMessage.style.color = color;
    confirmationMessage.style.display = 'block';
    setTimeout(() => {
        confirmationMessage.style.display = 'none';
    }, 3000); // Hide after 3 seconds
}

// Function to update status and save to localStorage
function updateStatus(status, bgColor, textColor) {
    const room = roomData[currentIndex];
    statusElement.textContent = status;
    statusElement.style.backgroundColor = bgColor;
    statusElement.style.color = textColor;
    localStorage.setItem(`roomStatus_${room.id}`, status);
    localStorage.setItem(`statusBgColor_${room.id}`, bgColor);
    localStorage.setItem(`statusTextColor_${room.id}`, textColor);

    // Disable buttons after action
    approveBtn.disabled = true;
    denyBtn.disabled = true;
    resetBtn.style.display = 'inline-block';
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchRoomData();
});

// Previous button event listener
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        displayRoom(currentIndex);
    }
});

// Next button event listener
nextBtn.addEventListener('click', () => {
    if (currentIndex < roomData.length - 1) {
        currentIndex++;
        displayRoom(currentIndex);
    }
});

// Approve button event listener
approveBtn.addEventListener('click', () => {
    updateStatus('APPROVED', '#d4edda', '#155724');
    showConfirmation('Room request approved!', '#155724');
});

// Deny button event listener
denyBtn.addEventListener('click', () => {
    updateStatus('DENIED', '#f8d7da', '#721c24');
    showConfirmation('Room request denied!', '#721c24');
});

// Reset button event listener
resetBtn.addEventListener('click', () => {
    const room = roomData[currentIndex];
    statusElement.textContent = 'PENDING';
    statusElement.style.backgroundColor = '#E0E0E0';
    statusElement.style.color = '#000';
    approveBtn.disabled = false;
    denyBtn.disabled = false;
    resetBtn.style.display = 'none';
    localStorage.removeItem(`roomStatus_${room.id}`);
    localStorage.removeItem(`statusBgColor_${room.id}`);
    localStorage.removeItem(`statusTextColor_${room.id}`);
    showConfirmation('Status reset to PENDING.', '#333');
});