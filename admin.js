// Ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');

    // Select DOM elements and verify they exist
    const confirmationMessage = document.getElementById('confirmationMessage');
    const roomsTableBody = document.getElementById('roomsTableBody');
    const userProfileTableBody = document.getElementById('userProfileTableBody');
    const pendingRoomsSection = document.getElementById('pendingRoomsSection');
    const userProfileSection = document.getElementById('userProfileSection');
    const sectionTitle = document.getElementById('sectionTitle');
    const pendingRoomsBtn = document.getElementById('pendingRoomsBtn');
    const userProfileBtn = document.getElementById('userProfileBtn');

    // Debug: Verify elements are found
    if (!pendingRoomsBtn || !userProfileBtn || !pendingRoomsSection || !userProfileSection) {
        console.error('One or more DOM elements not found:', {
            pendingRoomsBtn,
            userProfileBtn,
            pendingRoomsSection,
            userProfileSection,
            sectionTitle,
            confirmationMessage,
            roomsTableBody,
            userProfileTableBody
        });
        return;
    }
    console.log('Elements found:', { pendingRoomsBtn, userProfileBtn, pendingRoomsSection, userProfileSection });

    function showConfirmation(message, color) {
        if (!confirmationMessage) {
            console.error('Confirmation message element not found');
            return;
        }
        confirmationMessage.textContent = message;
        confirmationMessage.style.color = color;
        confirmationMessage.style.display = 'block';
        setTimeout(() => confirmationMessage.style.display = 'none', 3000);
    }

    // Fetch and display pending rooms
    async function fetchRooms() {
        try {
            const response = await fetch('fetch_rooms.php', {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const roomData = await response.json();
            if (!Array.isArray(roomData)) throw new Error('Invalid response format');
            if (roomData.length === 0) {
                showConfirmation('No pending room requests found.', '#721c24');
                roomsTableBody.innerHTML = '<tr><td colspan="7">No pending requests</td></tr>';
                return;
            }
            displayRooms(roomData);
            showConfirmation('Pending room requests loaded successfully!', '#155724');
        } catch (error) {
            console.error('Error fetching rooms:', error);
            showConfirmation('Error loading rooms: ' + error.message, '#721c24');
            roomsTableBody.innerHTML = '<tr><td colspan="7">Error loading data</td></tr>';
        }
    }

    // Display pending rooms
    function displayRooms(roomData) {
        roomsTableBody.innerHTML = '';
        roomData.forEach(room => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${room.name || 'N/A'}</td>
                <td>${room.room_type || 'N/A'}</td>
                <td>${room.location || 'N/A'}</td>
                <td>${room.capacity || 'N/A'}</td>
                <td>${room.price || 'N/A'}</td>
                <td><img src="${room.image || ''}" alt="Room Image"></td>
                <td class="actions">
                    <button class="approve-btn" data-id="${room.id || ''}" ${room.status !== 'pending' ? 'disabled' : ''}>Approve</button>
                    <button class="deny-btn" data-id="${room.id || ''}" ${room.status !== 'pending' ? 'disabled' : ''}>Deny</button>
                </td>
            `;
            roomsTableBody.appendChild(row);
        });
        // document.querySelectorAll('.approve-btn').forEach(btn => btn.addEventListener('click', () => console.log(`Approved room ${btn.dataset.id}`)));
        // document.querySelectorAll('.deny-btn').forEach(btn => btn.addEventListener('click', () => console.log(`Denied room ${btn.dataset.id}`)));











        // Handle approve button click
document.querySelectorAll('.approve-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const roomId = btn.dataset.id;
        try {
            const response = await fetch('update_status.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: roomId, status: 'APPROVED' })
            });
            if (!response.ok) throw new Error('Failed to approve room');
            const data = await response.json();
            showConfirmation(`Room "${data.name}" approved successfully!`, '#155724');
            fetchRooms(); // Reload list
        } catch (error) {
            showConfirmation('Error approving room: ' + error.message, '#721c24');
        }
    });
});

// Handle deny button click
document.querySelectorAll('.deny-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const roomId = btn.dataset.id;
        try {
            const response = await fetch('update_status.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: roomId, status: 'DENIED' })
            });
            if (!response.ok) throw new Error('Failed to deny room');
            const data = await response.json();
            showConfirmation(`Room "${data.name}" denied.`, '#721c24');
            fetchRooms(); // Reload list
        } catch (error) {
            showConfirmation('Error denying room: ' + error.message, '#721c24');
        }
    });
});



































    }

    // Fetch and display user profiles
    async function fetchUserProfiles() {
        try {
            const response = await fetch('fetch_user_profiles.php', {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const userProfileData = await response.json();
            if (!Array.isArray(userProfileData)) throw new Error('Invalid response format');
            if (userProfileData.length === 0) {
                showConfirmation('No user profiles found.', '#721c24');
                userProfileTableBody.innerHTML = '<tr><td colspan="5">No user profiles</td></tr>';
                return;
            }
            displayUserProfiles(userProfileData);
            showConfirmation('User profiles loaded successfully!', '#155724');
        } catch (error) {
            console.error('Error fetching user profiles:', error);
            showConfirmation('Error loading user profiles: ' + error.message, '#721c24');
            userProfileTableBody.innerHTML = '<tr><td colspan="5">Error loading data</td></tr>';
        }
    }

    // Display user profiles

    function displayUserProfiles(userProfileData) {
        userProfileTableBody.innerHTML = '';
        userProfileData.forEach(profile => {
            const isSuspended = profile.status === 'suspended';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${profile.id || 'N/A'}</td>
                <td>${profile.username || 'N/A'}</td>
                <td>${profile.email || 'N/A'}</td>
                <td>${profile.role || 'N/A'}</td>
                <td class="actions">
                    ${isSuspended
                        ? `<button class="suspend-btn" disabled>Suspended</button>`
                        : `<button class="suspend-btn" data-id="${profile.id}">Suspend</button>`}
                </td>
            `;
            userProfileTableBody.appendChild(row);
        });
    
        document.querySelectorAll('.suspend-btn').forEach(btn => {
            if (!btn.disabled) {
                btn.addEventListener('click', async () => {
                    const userId = btn.dataset.id;
                    try {
                        const response = await fetch('suspend_user.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: userId })
                        });
    
                        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                        showConfirmation(`User ID ${userId} suspended successfully`, '#155724');
                        fetchUserProfiles(); // refresh list
                    } catch (error) {
                        console.error('Error suspending user:', error);
                        showConfirmation(`Error suspending user: ${error.message}`, '#721c24');
                    }
                });
            }
        });
    }
    

    // Toggle between sections
    function showSection(sectionId, title) {
        console.log(`Switching to section: ${sectionId}`);
        
        // Always toggle the sections, even if fetch fails
        if (sectionId === 'pendingRooms') {
            pendingRoomsSection.style.display = 'block';
            userProfileSection.style.display = 'none';
            sectionTitle.textContent = 'PENDING ROOM REQUESTS';
            pendingRoomsBtn.classList.add('active');
            userProfileBtn.classList.remove('active');
            fetchRooms(); // Fetch data after toggling
        } else if (sectionId === 'userProfile') {
            pendingRoomsSection.style.display = 'none';
            userProfileSection.style.display = 'block';
            sectionTitle.textContent = 'USER PROFILE';
            pendingRoomsBtn.classList.remove('active');
            userProfileBtn.classList.add('active');
            fetchUserProfiles(); // Fetch data after toggling
        }
        console.log(`Section switched, pendingRoomsSection: ${pendingRoomsSection.style.display}, userProfileSection: ${userProfileSection.style.display}`);
    }

    // Add event listeners with debug logs
    pendingRoomsBtn.addEventListener('click', () => {
        console.log('Pending Rooms button clicked');
        showSection('pendingRooms', 'PENDING ROOM REQUESTS');
    });

    userProfileBtn.addEventListener('click', () => {
        console.log('User Profile button clicked');
        showSection('userProfile', 'USER PROFILE');
    });

    // Load pending rooms by default
    console.log('Loading default section: Pending Rooms');
    showSection('pendingRooms', 'PENDING ROOM REQUESTS');
});