if (window.location.pathname.includes('stays.html')) {
  let properties = [];
  let filteredProperties = [];
  const propertiesPerPage = 6;
  let currentPage = 1;

  // Fetch properties from the backend
  async function fetchProperties() {
      console.log("Fetching properties...");
      try {
          const response = await fetch("../staysSection/stays.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "getFeaturedRooms" }),
          });
          const data = await response.json();
          console.log("Raw data from PHP:", data);
          if (data.status === 200) {
              properties = data.data;
              console.log("Properties array:", properties);
              applyFiltersAndSort();
              renderFeaturedRooms();
          } else {
              console.error("Error fetching properties:", data.message);
          }
      } catch (err) {
          console.error("Error fetching properties:", err);
      }
  }

  // Apply filters and sorting to properties
  function applyFiltersAndSort() {
      const roomType = document.getElementById('room-type').value.toLowerCase();
      const sortBy = document.getElementById('sort-by').value;

      // Filter by room type
      filteredProperties = roomType
          ? properties.filter(property => property.roomtype.toLowerCase() === roomType)
          : [...properties];

      // Log the prices before sorting for debugging
      console.log("Prices before sorting:", filteredProperties.map(p => p.price));

      // Sort by price with improved logic
      filteredProperties.sort((a, b) => {
          // Parse prices, removing non-numeric characters
          const priceA = parseFloat(a.price?.toString().replace(/[^0-9.-]+/g, '')) || 0;
          const priceB = parseFloat(b.price?.toString().replace(/[^0-9.-]+/g, '')) || 0;

          // Log parsed prices for debugging
          console.log(`Parsed price for ${a.title}: ${priceA}, ${b.title}: ${priceB}`);

          // Primary sort: price
          let comparison;
          if (sortBy === 'price-asc') {
              comparison = priceA - priceB; // Low to High
          } else if (sortBy === 'price-desc') {
              comparison = priceB - priceA; // High to Low
          } else {
              comparison = 0;
          }

          // Secondary sort: title (for stable sorting when prices are equal)
          if (comparison === 0) {
              return a.title.localeCompare(b.title);
          }

          return comparison;
      });

      // Log the prices after sorting for debugging
      console.log("Prices after sorting:", filteredProperties.map(p => p.price));

      currentPage = 1;
      renderProperties();
      renderFeaturedRooms();
  }

  // Render properties for the Property Grid
  function renderProperties() {
      const propertyGrid = document.getElementById('property-grid');
      propertyGrid.innerHTML = '';

      const start = (currentPage - 1) * propertiesPerPage;
      const end = start + propertiesPerPage;
      const currentProperties = filteredProperties.slice(start, end);

      currentProperties.forEach(property => {
          const card = document.createElement('div');
          card.className = 'property-card';
          card.innerHTML = `
              <div class="property-image">
                  <img src="${property.images ? property.images : 'https://via.placeholder.com/300x150.png?text=' + property.title}" alt="${property.title}">
              </div>
              <div class="property-details">
                  <h3>${property.title || 'Unnamed Property'}</h3>
                  <p><strong>Description:</strong> ${property.description || 'No description available'}</p>
                  <p><strong>Price:</strong> $${property.price || 'N/A'}/night</p>
                  <p><strong>Type:</strong> ${property.roomtype || 'N/A'}</p>
                  <p><strong>Capacity:</strong> ${property.capacity || 'N/A'}</p>
                  <p><strong>Location:</strong> ${property.location || 'Not specified'}</p>
              </div>
          `;
          card.addEventListener('click', () => {
              alert(`Selected property: ${property.title}. You can now book this property!`);
          });
          propertyGrid.appendChild(card);
      });

      updatePagination();
  }

  // Render featured rooms (using the same database data)
  function renderFeaturedRooms() {
      const featuredRoomsGrid = document.querySelector('.featured-rooms-grid');
      featuredRoomsGrid.innerHTML = '';

      filteredProperties.forEach(property => {
          const roomDiv = document.createElement('div');
          roomDiv.className = 'featured-room';
          roomDiv.innerHTML = `
              <div class="room-box">
                  <img src="${property.images ? property.images : 'https://via.placeholder.com/300x150.png?text=' + property.title}" alt="${property.title}">
                  <h3>${property.title || 'Unnamed Property'}</h3>
              </div>
              <div class="room-details">
                  <p><strong>Description:</strong> ${property.description || 'No description available'}</p>
                  <p><strong>Price:</strong> $${property.price || 'N/A'}/night</p>
                  <p><strong>Type:</strong> ${property.roomtype || 'N/A'}</p>
                  <p><strong>Capacity:</strong> ${property.capacity || 'N/A'}</p>
                  <p><strong>Location:</strong> ${property.location || 'Not specified'}</p>
                  <a href="../loginANDsignup/log-in.html">
                      <button class="book-now">Book now</button>
                  </a>
              </div>
          `;
          roomDiv.querySelector('.room-box').addEventListener('click', () => {
              alert(`Selected room: ${property.title}. You can now book this room!`);
          });
          featuredRoomsGrid.appendChild(roomDiv);
      });
  }

  // Update pagination
  function updatePagination() {
      const totalProperties = filteredProperties.length;
      const totalPages = Math.ceil(totalProperties / propertiesPerPage);
      const start = (currentPage - 1) * propertiesPerPage + 1;
      const end = Math.min(currentPage * propertiesPerPage, totalProperties);

      document.getElementById('pagination-info').textContent = `Showing ${start} to ${end} of ${totalProperties} (${totalPages} Pages)`;

      const pagination = document.getElementById('pagination');
      pagination.innerHTML = '';
      for (let i = 1; i <= totalPages; i++) {
          const button = document.createElement('button');
          button.textContent = i;
          button.className = i === currentPage ? 'active' : '';
          button.addEventListener('click', () => {
              currentPage = i;
              renderProperties();
          });
          pagination.appendChild(button);
      }
  }

  // Event listeners for filter and sort
  document.getElementById('room-type').addEventListener('change', applyFiltersAndSort);
  document.getElementById('sort-by').addEventListener('change', applyFiltersAndSort);

  // Initial load
  fetchProperties();
}