// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
// Get references to DOM elements
const stateInput = document.getElementById('state-input');
const fetchButton = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessage = document.getElementById('error-message');

// Function to display weather alerts
function displayAlerts(data) {
    // Clear any previous error message
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
    
    // Get the number of alerts
    const alertCount = data.features.length;
    
    // Create the summary message
    const summary = `Weather Alerts: ${alertCount}`;
    
    // Build the HTML content
    let htmlContent = `<h2>${summary}</h2>`;
    
    // Loop through each alert and add it to the display
    if (alertCount > 0) {
        htmlContent += '<ul>';
        data.features.forEach(alert => {
            const headline = alert.properties.headline;
            if (headline) {
                htmlContent += `<li>${headline}</li>`;
            }
        });
        htmlContent += '</ul>';
    } else {
        htmlContent += '<p>No active weather alerts for this state.</p>';
    }
    
    // Update the alerts display
    alertsDisplay.innerHTML = htmlContent;
}

// Function to display error messages
function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    // Clear the alerts display when there's an error
    alertsDisplay.innerHTML = '';
}

// Function to fetch weather alerts for a state
async function fetchWeatherAlerts(stateAbbr) {
    try {
        // Show loading state (optional)
        fetchButton.textContent = 'Loading...';
        fetchButton.disabled = true;
        
        // Fetch data from the API
        const response = await fetch(`https://api.weather.gov/alerts/active?area=${stateAbbr}`);
        
        // Check if the response is ok (status 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse the JSON response
        const data = await response.json();
        
        // Display the alerts
        displayAlerts(data);
        
    } catch (error) {
        // Display the error message
        displayError(error.message);
        console.error('Error fetching weather alerts:', error);
    } finally {
        // Reset button state
        fetchButton.textContent = 'Get Weather Alerts';
        fetchButton.disabled = false;
    }
}

// Function to handle the fetch button click
function handleFetchClick() {
    // Get the state abbreviation from input and trim whitespace
    const stateAbbr = stateInput.value.trim().toUpperCase();
    
    // Clear the input field (as required by the test)
    stateInput.value = '';
    
    // Validate input (bonus feature)
    if (stateAbbr === '') {
        displayError('Please enter a state abbreviation');
        return;
    }
    
    if (stateAbbr.length !== 2 || !/^[A-Z]{2}$/.test(stateAbbr)) {
        displayError('Please enter a valid 2-letter state abbreviation');
        return;
    }
    
    // Fetch weather alerts for the entered state
    fetchWeatherAlerts(stateAbbr);
}

// Add event listener to the button
fetchButton.addEventListener('click', handleFetchClick);

// Add event listener for Enter key on the input field
stateInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleFetchClick();
    }
});

// Initialize the app
console.log('Weather Alerts App initialized!');
console.log('Enter a state abbreviation and click "Get Weather Alerts"');