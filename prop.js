const apiUrl = 'http://localhost:8080/dashboard/collab/apis/property_management.php';

// CREATE Property
document.getElementById('create-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    let payload = {
        action: 'create',
        name: document.getElementById('room_name').value,
        image: document.getElementById('image_url').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        room_type: document.getElementById('room_type').value,
        capacity: document.getElementById('capacity').value,
        location: document.getElementById('location').value
    };

    let response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    let result = await response.json();
    alert(result.message);
    fetchProperties();
});

// READ (Fetch and Display Properties)
async function fetchProperties() {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'read' })
    });

    const data = await response.json();

    // Populate property table
    let tableBody = document.getElementById('property-list');
    if (tableBody) {
        tableBody.innerHTML = '';
        data.forEach(property => {
            let row = `<tr>
                <td>${property.id}</td>
                <td><img src="${property.image}" alt="Property Image"></td>
                <td>${property.name}</td>
                <td>${property.description}</td>
                <td>${property.price}</td>
                <td>${property.room_type}</td>
                <td>${property.capacity}</td>
                <td>${property.location}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    }

    // Populate valid property IDs for update (skip invalid ones)
    let updateIdDropdown = document.getElementById('update_id');
    if (updateIdDropdown) {
        updateIdDropdown.innerHTML = '<option value="">Select Property ID</option>';
        data.forEach(property => {
            if (property.id > 0) {
                let option = document.createElement('option');
                option.value = property.id;
                option.text = `ID ${property.id} - ${property.name}`;
                updateIdDropdown.appendChild(option);
            }
        });
    }

    // Populate valid property IDs for delete (optional dropdown)
    let deleteIdDropdown = document.getElementById('delete_id_dropdown');
    if (deleteIdDropdown) {
        deleteIdDropdown.innerHTML = '<option value="">Or select from list</option>';
        data.forEach(property => {
            if (property.id > 0) {
                let option = document.createElement('option');
                option.value = property.id;
                option.text = `ID ${property.id} - ${property.name}`;
                deleteIdDropdown.appendChild(option);
            }
        });
    }
}

// Sync dropdown to delete input
function syncDeleteId() {
    const dropdown = document.getElementById('delete_id_dropdown');
    const input = document.getElementById('delete_id');
    input.value = dropdown.value;
}

// UPDATE Property
document.getElementById('update-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    let payload = {
        action: 'update',
        id: document.getElementById('update_id').value,
        name: document.getElementById('update_room_name').value || null,
        description: document.getElementById('update_description').value || null,
        price: document.getElementById('update_price').value || null,
        room_type: document.getElementById('update_room_type').value || null,
        capacity: document.getElementById('update_capacity').value || null,
        location: document.getElementById('update_location').value || null
    };

    // Remove empty or null values to avoid overwriting with null
    Object.keys(payload).forEach(key => {
        if (payload[key] === null || payload[key] === "") {
            delete payload[key];
        }
    });

    let response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    let result = await response.json();
    alert(result.message);
    fetchProperties();
});

// DELETE Property
document.getElementById('delete-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    let propertyId = parseInt(document.getElementById('delete_id').value);

    if (isNaN(propertyId) || propertyId <= 0) {
        alert("Please enter a valid property ID greater than 0.");
        return;
    }

    let payload = {
        action: 'delete',
        id: propertyId
    };

    let response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    let result = await response.json();
    alert(result.message);
    fetchProperties();
});

// Load properties on page load
fetchProperties();

// Switch section visibility (for tab UI)
function showSection(sectionId) {
    let sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

// Redirect to owner app
function redirectToOwnerApp() {
    window.location.href = '../ownerapp/ownerapp.html';
}
