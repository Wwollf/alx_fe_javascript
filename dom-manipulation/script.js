// Array of quote objects, each with 'text' and 'category' properties
const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" },
    { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" }
];

// Function to display a random quote in the 'quoteDisplay' div using createElement and appendChild
function showRandomQuote() {
    // Clear the existing content in 'quoteDisplay'
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';

    // Select a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Create elements for the quote text and category
    const quoteText = document.createElement('p');
    quoteText.textContent = `"${randomQuote.text}"`;

    const quoteCategory = document.createElement('p');
    quoteCategory.textContent = `Category: ${randomQuote.category}`;
    quoteCategory.style.fontStyle = 'italic';

    // Append the elements to the 'quoteDisplay' div
    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
}

// Ensure 'Show New Quote' button triggers the showRandomQuote function
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Function to add a new quote based on user input using createElement and appendChild
function createAddQuoteForm() {
    // Get user input values
    const newText = document.getElementById('newQuoteText').value.trim();
    const newCategory = document.getElementById('newQuoteCategory').value.trim();

    // Check if both input fields are filled
    if (newText && newCategory) {
        // Add new quote object to the quotes array
        quotes.push({ text: newText, category: newCategory });

        // Provide feedback to the user by updating the DOM
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = ''; // Clear the display

        const confirmationMessage = document.createElement('p');
        confirmationMessage.textContent = 'New quote added!';
        quoteDisplay.appendChild(confirmationMessage);

        // Clear the input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    } else {
        alert("Please enter both a quote and a category.");
    }
}


}
