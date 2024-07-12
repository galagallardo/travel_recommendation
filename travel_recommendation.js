// Display the selected page
function showPage(pageId) {
    document.getElementById('home').style.display = 'none';
    document.getElementById('about').style.display = 'none';
    document.getElementById('contact').style.display = 'none';
    document.getElementById(pageId).style.display = 'block';
}

// Initialize page to show Home
showPage('home');

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const resetButton = document.getElementById('resetButton');
    const clearButton = document.getElementById('clearButton');
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('results');

    // Fetch recommendations from the JSON file
    fetch('travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            window.recommendations = data; // Store recommendations in global scope
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

    function displayResults(results) {
        resultsContainer.innerHTML = '';
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>No results found.</p>';
            return;
        }
        results.forEach(rec => {
            const recommendationDiv = document.createElement('div');
            recommendationDiv.className = 'recommendation';
            recommendationDiv.innerHTML = `
                <img src="${rec.imageUrl}" alt="${rec.name}">
                <div class="recommendation-content">
                    <h3>${rec.name}</h3>
                    <p>${rec.description}</p>
                    ${rec.timeZone ? `<p>Current time: <span id="time-${rec.name.replace(/\s+/g, '')}">Loading...</span></p>` : ''}
                </div>
            `;
            resultsContainer.appendChild(recommendationDiv);
            if (rec.timeZone) {
                updateTime(rec.timeZone, rec.name);
            }
        });
    }

    function updateTime(timeZone, countryName) {
        const options = { timeZone: timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const timeElement = document.getElementById(`time-${countryName.replace(/\s+/g, '')}`);
        function update() {
            const time = new Date().toLocaleTimeString('en-US', options);
            timeElement.textContent = time;
        }
        update(); // Initial update
        setInterval(update, 1000); // Update every second
    }

    function handleSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if (query === '') {
            resultsContainer.innerHTML = '<p>Please enter a search term.</p>';
            return;
        }
        const results = window.recommendations.filter(rec => rec.name.toLowerCase().includes(query));
        displayResults(results);
    }

    searchButton.addEventListener('click', handleSearch);

    resetButton.addEventListener('click', () => {
        searchInput.value = '';
        resultsContainer.innerHTML = '';
    });

    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        resultsContainer.innerHTML = '';
        showPage('home'); // Go back to home page
    });
});
