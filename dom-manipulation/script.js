// Array of quote objects, each with 'text' and 'category' properties
const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" },
    { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" }
];

// Function to display a random quote in the 'quoteDisplay' div
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerHTML = `
        <p>"${randomQuote.text}"</p>
        <p><em>Category: ${randomQuote.category}</em></p>
    `;
}
console.log(quotes);


// Ensure 'Show New Quote' button triggers the showRandomQuote function
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Function to add a new quote based on user input
function addQuote() {
    // Get user input values
    const newText = document.getElementById('newQuoteText').value.trim();
    const newCategory = document.getElementById('newQuoteCategory').value.trim();

    // Check if both input fields are filled
    if (newText && newCategory) {
        // Add new quote object to the quotes array
        quotes.push({ text: newText, category: newCategory });
        
        // Provide feedback to the user
        document.getElementById('quoteDisplay').innerHTML = `<p>New quote added!</p>`;

        // Clear the input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    } else {
        alert("Please enter both a quote and a category.");
    }
    console.log(quotes);

}
