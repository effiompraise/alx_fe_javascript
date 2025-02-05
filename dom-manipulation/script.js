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
        alert('No quotes found in this category!');
    }
}

// Add a new quote dynamically
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText && quoteCategory) {
        quotes.push({ 
            text: quoteText, 
            category: quoteCategory 
        });
        
        // Save to local storage
        saveQuotes();
        
        // Clear input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        
        // Refresh quote display
        showRandomQuote();
    } else {
        alert('Please enter both quote text and category');
    }
}

// Dynamically populate category dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
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
    // Already handled in showRandomQuote function
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
            
            // Optional: Add validation for imported quotes
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

// Simulate server sync (periodic update)
function syncWithServer() {
    // Use fetch to simulate server interaction
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            // Convert server data to quote format
            const serverQuotes = data.slice(0, 5).map(post => ({
                text: post.title,
                category: 'Server Import'
            }));

            // Merge server quotes
            quotes.push(...serverQuotes);
            saveQuotes();
            showRandomQuote();
        })
        .catch(error => console.error('Server sync failed:', error));
}

// Periodic server sync every 5 minutes
setInterval(syncWithServer, 5 * 60 * 1000);