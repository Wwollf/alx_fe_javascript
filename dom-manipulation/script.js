// Retrieve quotes from local storage or use default array if not present
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" },
    { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" }
];

// Retrieve last selected category from local storage
let lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';

// Function to save the quotes array to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes)); // Use localStorage.setItem to save quotes
}

// Function to populate categories dynamically in the dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const uniqueCategories = new Set(quotes.map(quote => quote.category));

    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore last selected category in the dropdown
    categoryFilter.value = lastSelectedCategory;
}

// Function to display quotes based on the selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    lastSelectedCategory = selectedCategory; // Save last selected category
    localStorage.setItem('lastSelectedCategory', lastSelectedCategory); // Update local storage

    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = ''; // Clear previous quotes

    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

    filteredQuotes.forEach(quote => {
        const quoteText = document.createElement('p');
        quoteText.textContent = `"${quote.text}"`;

        const quoteCategory = document.createElement('p');
        quoteCategory.textContent = `Category: ${quote.category}`;
        quoteCategory.style.fontStyle = 'italic';

        quoteDisplay.appendChild(quoteText);
        quoteDisplay.appendChild(quoteCategory);
    });
}

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = ''; // Clear previous quotes

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    const quoteText = document.createElement('p');
    quoteText.textContent = `"${randomQuote.text}"`;

    const quoteCategory = document.createElement('p');
    quoteCategory.textContent = `Category: ${randomQuote.category}`;
    quoteCategory.style.fontStyle = 'italic';

    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);

    // Save the last viewed quote to session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// Ensure 'Show New Quote' button triggers the showRandomQuote function
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Function to add a new quote and save it to local storage
function createAddQuoteForm() {
    const newText = document.getElementById('newQuoteText').value.trim();
    const newCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newText && newCategory) {
        const newQuote = { text: newText, category: newCategory };
        quotes.push(newQuote); // Add new quote to the quotes array
        saveQuotes(); // Call saveQuotes to store it in local storage
        populateCategories(); // Update categories in dropdown

        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = '';
        const confirmationMessage = document.createElement('p');
        confirmationMessage.textContent = 'New quote added!';
        quoteDisplay.appendChild(confirmationMessage);

        document.getElementById('newQuoteText').value = ''; // Clear input fields
        document.getElementById('newQuoteCategory').value = '';
        filterQuotes(); // Refresh displayed quotes after adding
    } else {
        alert("Please enter both a quote and a category.");
    }
}

// Export quotes to a JSON file
function exportToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json"; // Name of the exported file
    document.body.appendChild(a);
    a.click(); // Trigger the download
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Release the URL object
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result); // Parse JSON file content
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes); // Append new quotes to existing quotes
                saveQuotes(); // Save updated quotes array to local storage
                populateCategories(); // Update categories in dropdown
                filterQuotes(); // Refresh displayed quotes after import
                alert('Quotes imported successfully!');
            } else {
                alert('Invalid file format. Please upload a JSON array of quotes.');
            }
        } catch (error) {
            alert('Error reading file: ' + error.message);
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Load the initial random quote and categories when the page is loaded
window.onload = function() {
    populateCategories(); // Populate categories on load
    filterQuotes(); // Filter quotes to display based on the last selected category
};
