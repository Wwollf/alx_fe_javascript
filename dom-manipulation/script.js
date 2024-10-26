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

// Function to post a new quote to the server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quote)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Quote posted successfully:', data);
            notifyUser("Quote added to the server successfully.");
        } else {
            console.error('Failed to post quote:', response.statusText);
        }
    } catch (error) {
        console.error('Error posting quote:', error);
    }
}

// Function to fetch quotes from the simulated server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        const serverQuotes = await response.json();

        // Example: Merge server quotes with local quotes
        const newQuotes = serverQuotes.map(quote => ({ text: quote.title, category: "Imported" }));

        let isConflict = false; // Flag to check if there are conflicts

        // Merge logic with conflict resolution
        newQuotes.forEach(serverQuote => {
            const existingQuote = quotes.find(q => q.text === serverQuote.text);
            if (!existingQuote) {
                quotes.push(serverQuote); // Add new quotes if they don't exist
            } else {
                isConflict = true; // Conflict detected if the quote already exists
            }
        });

        saveQuotes(); // Save updated quotes to local storage

        // Notify user about the sync
        notifyUser("Quotes synced with server!");

        if (isConflict) {
            notifyUser("Conflicts detected: Some quotes already exist.");
        } else {
            notifyUser("Quotes updated from server successfully.");
        }

        populateCategories(); // Update categories in dropdown
        filterQuotes(); // Refresh displayed quotes
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}

// Function to synchronize quotes with the server
async function syncQuotes() {
    await fetchQuotesFromServer(); // Fetch new quotes from the server
}

// Notification function to inform users about updates
function notifyUser(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.backgroundColor = 'lightyellow';
    notification.style.padding = '10px';
    notification.style.margin = '10px 0';
    notification.style.border = '1px solid #ccc';
    notification.style.borderRadius = '5px';
    notification.style.position = 'relative';

    // Add a close button to the notification
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.onclick = () => notification.remove();
    
    notification.appendChild(closeButton);
    document.body.prepend(notification);

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Function to synchronize local quotes with the server every 10 seconds
setInterval(syncQuotes, 10000); // Adjust interval as needed (10 seconds)

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        
        quotes.push(newQuote);
        saveQuotes();
        notifyUser("New quote added locally.");
        postQuoteToServer(newQuote); // Post to server
        populateCategories(); // Update categories in dropdown
        filterQuotes(); // Refresh displayed quotes
    } else {
        alert("Please fill in both fields.");
    }
}

// Function to populate categories
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

// Function to filter quotes based on the selected category
function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;
    
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(q => q.category === selectedCategory);
    
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';
    
    filteredQuotes.forEach(quote => {
        const quoteElement = document.createElement('div');
        quoteElement.textContent = `${quote.text} - ${quote.category}`;
        quoteDisplay.appendChild(quoteElement);
    });

    // Save the last selected category in local storage
    localStorage.setItem('lastSelectedCategory', selectedCategory);
}

// Load the initial random quote and categories when the page is loaded
window.onload = function() {
    populateCategories(); // Populate categories on load
    filterQuotes(); // Filter quotes to display based on the last selected category
    syncQuotes(); // Initial sync with server
};

