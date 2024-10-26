// Initialize quotes from local storage or use default array if not present
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" },
    { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" }
];

// Simulated server URL (for demonstration purposes)
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Use a mock API endpoint

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to fetch quotes from the simulated server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        const serverQuotes = await response.json();

        // Example: Merge server quotes with local quotes
        const newQuotes = serverQuotes.map(quote => ({ text: quote.title, category: "Imported" }));
        
        // Merge logic with conflict resolution
        newQuotes.forEach(serverQuote => {
            const existingQuote = quotes.find(q => q.text === serverQuote.text);
            if (!existingQuote) {
                quotes.push(serverQuote); // Add new quotes
            }
        });

        saveQuotes(); // Save updated quotes to local storage
        notifyUser("Quotes updated from server.");
        populateCategories(); // Update categories in dropdown
        filterQuotes(); // Refresh displayed quotes
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}

// Notification function to inform users about updates
function notifyUser(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.backgroundColor = 'lightyellow';
    notification.style.padding = '10px';
    notification.style.margin = '10px 0';
    document.body.prepend(notification);

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to synchronize local quotes with the server every 10 seconds
setInterval(() => {
    fetchQuotesFromServer();
}, 10000); // Adjust interval as needed (10 seconds)

function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const uniqueCategories = new Set(quotes.map(quote => quote.category));

    // Clear previous options
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore last selected category in the dropdown
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
    categoryFilter.value = lastSelectedCategory;
}

// The rest of your existing functions remain unchanged (showRandomQuote, addQuote, etc.)
// Include the remaining code as necessary...

// Load the initial random quote and categories when the page is loaded
window.onload = function() {
    populateCategories(); // Populate categories on load
    filterQuotes(); // Filter quotes to display based on the last selected category
    fetchQuotesFromServer(); // Initial fetch from server
};
