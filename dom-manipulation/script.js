// Global quotes array to store all quotes
let quotes = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Load quotes from local storage on startup
    loadQuotes();
    // Populate categories dropdown
    populateCategories();
    // Show initial random quote
    showRandomQuote();
    // Create the add quote form dynamically
    createAddQuoteForm();
});

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        // Default quotes if none exist
        quotes = [
            { text: "Believe you can and you're halfway there.", category: "Motivation" },
            { text: "The only way to do great work is to love what you do.", category: "Work" }
        ];
        saveQuotes();
    }
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    populateCategories(); // Update categories after saving
}

// Dynamically create the add quote form
function createAddQuoteForm() {
    // Ensure we have a container for the form
    let formContainer = document.querySelector('.quote-form');
    if (!formContainer) {
        formContainer = document.createElement('div');
        formContainer.classList.add('quote-form');
        document.querySelector('.container').appendChild(formContainer);
    }

    // Create form HTML dynamically
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button id="addQuoteButton">Add Quote</button>
    `;

    // Add event listener for adding quotes
    document.getElementById('addQuoteButton').addEventListener('click', addQuote);
}

// Show a random quote, optionally filtered by category
function showRandomQuote() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const filteredQuotes = categoryFilter === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category === categoryFilter);

    if (filteredQuotes.length > 0) {
        const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `
            <blockquote>
                <p>"${randomQuote.text}"</p>
                <cite>- ${randomQuote.category}</cite>
            </blockquote>
        `;
    } else {
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = '<p>No quotes found in this category!</p>';
    }
}

// Add a new quote dynamically
function addQuote() {
    // Get input elements
    const quoteTextInput = document.getElementById('newQuoteText');
    const quoteCategoryInput = document.getElementById('newQuoteCategory');

    // Extract values
    const quoteText = quoteTextInput.value.trim();
    const quoteCategory = quoteCategoryInput.value.trim();

    // Validate input
    if (quoteText && quoteCategory) {
        // Add new quote to quotes array
        quotes.push({ 
            text: quoteText, 
            category: quoteCategory 
        });
        
        // Save to local storage
        saveQuotes();
        
        // Clear input fields
        quoteTextInput.value = '';
        quoteCategoryInput.value = '';
        
        // Refresh quote display
        showRandomQuote();
    } else {
        alert('Please enter both quote text and category');
    }
}

// Dynamically populate category dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    
    // Extract unique categories
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    // Clear existing options except 'All Categories'
    while (categoryFilter.options.length > 1) {
        categoryFilter.remove(1);
    }

    // Add new categories
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Filter quotes based on selected category
function filterQuotes() {
    // Trigger quote refresh
    showRandomQuote();
}

// Export quotes to JSON file
function exportToJsonFile() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes_export.json';
    a.click();
    
    URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            
            // Validate imported quotes
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                showRandomQuote();
                alert('Quotes imported successfully!');
            } else {
                throw new Error('Invalid JSON format');
            }
        } catch (error) {
            alert('Error importing quotes: ' + error.message);
        }
    };
    fileReader.readAsText(event.target.files[0]);
}