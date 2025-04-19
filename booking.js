document.addEventListener('DOMContentLoaded', function () {
    const bookingOption = document.getElementById('booking-option');
    const optionInputContainer = document.getElementById('option-input-container');
    const optionInputLabel = document.getElementById('option-input-label');
    const optionInput = document.getElementById('option-input');

    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            roomType: params.get('roomType') || 'Standard',
            price: parseFloat(params.get('price')) || 0
        };
    }

    const { roomType, price } = getQueryParams();

    const roomTypeSelect = document.getElementById('room-type');
    if (roomTypeSelect) {
        const optionExists = Array.from(roomTypeSelect.options).some(option => option.value.toLowerCase() === roomType.toLowerCase());
        if (optionExists) {
            roomTypeSelect.value = roomType;
        } else {
            const newOption = document.createElement('option');
            newOption.value = roomType;
            newOption.textContent = roomType;
            roomTypeSelect.appendChild(newOption);
            roomTypeSelect.value = roomType;
        }
    }

    roomTypeSelect.addEventListener('change', function () {
        console.log('Room type changed to:', this.value);
    });

    bookingOption.addEventListener('change', function () {
        const selectedOption = this.value;
        if (selectedOption) {
            optionInputContainer.classList.add('show');
            const today = new Date().toISOString().split('T')[0];
            switch (selectedOption) {
                case 'checkin':
                    optionInputLabel.textContent = 'Select check-in date';
                    optionInput.type = 'date';
                    optionInput.min = today;
                    break;
                case 'checkout':
                    optionInputLabel.textContent = 'Select check-out date';
                    optionInput.type = 'date';
                    optionInput.min = today;
                    break;
                case 'staylength':
                    optionInputLabel.textContent = 'Enter length of stay (nights)';
                    optionInput.type = 'number';
                    optionInput.min = '1';
                    break;
                case 'checkintime':
                    optionInputLabel.textContent = 'Select check-in time';
                    optionInput.type = 'time';
                    break;
                case 'checkouttime':
                    optionInputLabel.textContent = 'Select check-out time';
                    optionInput.type = 'time';
                    break;
            }
            optionInput.value = ''; // Reset input value on option change
        } else {
            optionInputContainer.classList.remove('show');
        }
    });

    optionInput.addEventListener('change', function () {
        const selectedOption = bookingOption.value;
        const value = this.value;
        if (value) {
            if (selectedOption === 'staylength' && value < 1) {
                this.value = 1;
                alert("Length of stay must be at least 1 night");
                return;
            }
            let formattedValue;
            switch (selectedOption) {
                case 'checkin':
                    formattedValue = formatDate(value);
                    document.getElementById('checkin-display').textContent = formattedValue;
                    break;
                case 'checkout':
                    formattedValue = formatDate(value);
                    const checkinDateStr = document.getElementById('checkin-display').textContent;
                    if (checkinDateStr !== 'Not Selected') {
                        const checkinDate = new Date(checkinDateStr);
                        const checkoutDate = new Date(value);
                        if (checkoutDate <= checkinDate) {
                            alert("Check-out date must be after check-in date");
                            this.value = '';
                            return;
                        }
                    }
                    document.getElementById('checkout-display').textContent = formattedValue;
                    break;
                case 'staylength':
                    document.getElementById('stay-length-display').textContent = value + (value === '1' ? ' night' : ' nights');
                    break;
                case 'checkintime':
                    formattedValue = formatTime(value);
                    document.getElementById('check-intime-display').textContent = formattedValue;
                    break;
                case 'checkouttime':
                    formattedValue = formatTime(value);
                    document.getElementById('check-outtime-display').textContent = formattedValue;
                    break;
            }
        }
    });

    function formatDate(dateString) {
        const date = new Date(dateString);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${dayName}, ${day} ${month} ${year}`;
    }

    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    document.querySelector('.done-button').addEventListener('click', async function() {
        const button = this;
        button.innerHTML = '<span class="spinner"></span> Processing...';
        button.disabled = true;
    
        const bookingData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            region: document.getElementById('region').value.trim(),
            checkin: document.getElementById('checkin-display').textContent,
            checkout: document.getElementById('checkout-display').textContent,
            checkInTime: document.getElementById('check-intime-display').textContent,
            checkOutTime: document.getElementById('check-outtime-display').textContent,
            paymentMethod: document.getElementById('payment-method').value,
            roomType: document.getElementById('room-type').value || 'Standard',
            price: parseFloat(getQueryParams().price) || 0,
            userId: getCurrentUserId()
        };
    
        console.log('Booking Data being sent:', bookingData);

        const validationErrors = validateBookingData(bookingData);
        if (validationErrors.length > 0) {
            alert("Please fix the following issues:\n" + validationErrors.join("\n"));
            resetButton(button);
            return;
        }

        try {
            const backendUrl = 'booking.php';
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            });

            const text = await response.text();
            console.log('Raw response:', text);
            console.log('Response status:', response.status);

            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                throw new Error(`Server returned non-JSON response (status ${response.status}): ${text.substring(0, 100)}...`);
            }

            if (!response.ok || !result.success) {
                throw new Error(result.error || `Booking failed (status ${response.status})`);
            }

            handleSuccess(result);
            
        } catch (error) {
            handleError(error);
        } finally {
            resetButton(button);
        }
    });
    
    function getCurrentUserId() {
        return localStorage.getItem('userId') || 'guest';
    }
    
    function validateBookingData(data) {
        const errors = [];
        if (!data.firstName) errors.push("• First name is required");
        if (!data.lastName) errors.push("• Last name is required");
        if (!data.phone) errors.push("• Phone number is required");
        if (data.checkin === "Not Selected") errors.push("• Check-in date is required");
        if (data.checkout === "Not Selected") errors.push("• Check-out date is required");
        if (data.checkInTime === "Not Selected") errors.push("• Check-in time is required");
        if (data.checkOutTime === "Not Selected") errors.push("• Check-out time is required");
        if (!/^\d{10,15}$/.test(data.phone)) errors.push("• Phone number must be 10-15 digits");
        if (!/^[a-zA-Z\s-]+$/.test(data.firstName)) errors.push("• First name can only contain letters, spaces, and hyphens");
        if (!/^[a-zA-Z\s-]+$/.test(data.lastName)) errors.push("• Last name can only contain letters, spaces, and hyphens");
        return errors;
    }
    
    function handleSuccess(result) {
        showSuccessMessage(result.bookingId);
        resetForm();
    }
    
    function handleError(error) {
        console.error('Booking error:', error);
        let errorMessage = error.message || 'Failed to process booking. Please try again.';
        if (errorMessage.includes('42S22') || errorMessage.includes('Unknown column')) {
            errorMessage = 'Booking failed: Database column issue. Please contact support.';
        } else if (errorMessage.includes('non-JSON')) {
            errorMessage += '\nServer issue detected. Check logs or contact support.';
        }
        alert(`Error: ${errorMessage}`);
    }
    
    function resetForm() {
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('region').value = '';
        document.getElementById('checkin-display').textContent = 'Not Selected';
        document.getElementById('checkout-display').textContent = 'Not Selected';
        document.getElementById('check-intime-display').textContent = 'Not Selected';
        document.getElementById('check-outtime-display').textContent = 'Not Selected';
        document.getElementById('stay-length-display').textContent = 'Not Selected';
        document.getElementById('booking-option').value = '';
        optionInputContainer.classList.remove('show');
    }
    
    function resetButton(button) {
        button.disabled = false;
        button.innerHTML = 'Confirm Booking';
    }
    
    function showSuccessMessage(bookingId) {
        const successBackdrop = document.createElement('div');
        successBackdrop.className = 'success-backdrop';
        const successPopup = document.createElement('div');
        successPopup.className = 'success-popup';
        successPopup.innerHTML = `
            <h2>🎉 Booked Successfully!</h2>
            <p>Your reservation has been confirmed.<br>Booking ID: ${bookingId}</p>
            <button>OK</button>`;
        successPopup.querySelector('button').addEventListener('click', () => {
            successBackdrop.remove();
        });
        successBackdrop.appendChild(successPopup);
        document.body.appendChild(successBackdrop);
    }
});