// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!


document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("state-input");
  const button = document.getElementById("fetch-alerts");
  const alertsDisplay = document.getElementById("alerts-display");
  const errorMessage = document.getElementById("error-message");

  button.addEventListener("click", async () => {
    const state = input.value.trim().toUpperCase();

    // Clear input
    input.value = "";

    if (!state) {
      errorMessage.textContent = "Please enter a state abbreviation.";
      errorMessage.classList.remove("hidden");
      return;
    }

    try {
      const response = await fetch(`${weatherApi}${state}`);

      if (!response.ok) {
        throw new Error("Failed to fetch weather alerts");
      }

      const data = await response.json();

      // Clear previous results
      alertsDisplay.innerHTML = "";

      // Hide previous errors
      errorMessage.textContent = "";
      errorMessage.classList.add("hidden");

      const summary = document.createElement("h2");
      summary.textContent = `${data.title}: ${data.features.length}`;
      alertsDisplay.append(summary);

      const list = document.createElement("ul");

      data.features.forEach((alert) => {
        const item = document.createElement("li");
        item.textContent = alert.properties.headline;
        list.append(item);
      });

      alertsDisplay.append(list);
    } catch (error) {
      errorMessage.textContent = error.message;
      errorMessage.classList.remove("hidden");
    }
  });
});
