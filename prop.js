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

// READ (Fetch Properties)
async function fetchProperties() {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'read' })
    });

    const data = await response.json();
    console.log(data);

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

    // Removing empty fields to avoid overwriting with null
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

    let payload = {
        action: 'delete',
        id: document.getElementById('delete_id').value
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

// Function to show the selected section and hide others
function showSection(sectionId) {
    // Get all sections
    let sections = document.querySelectorAll('.section');
    
    // Hide all sections
    sections.forEach(section => section.classList.remove('active'));

    // Show the selected section
    document.getElementById(sectionId).classList.add('active');
}

// Call this function in your HTML button click events
