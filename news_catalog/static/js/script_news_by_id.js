const sliderDot = document.getElementById('sliderDot');
const sliderLine = document.querySelector('.slider-line');
const sentimentScoreElement = document.getElementById('sentimentScore');

// Function to update dot position based on value
function updateDotPosition(value) {
    const lineRect = sliderLine.getBoundingClientRect();
    const dotPosition = (value + 0.90) / 2 * lineRect.width;
    sliderDot.style.left = `${dotPosition}px`;
}

// Access sentiment score from data attribute
let sentimentScore = sentimentScoreElement.dataset.score;

// sentimentScore = -0.5
console.log(parseFloat(sentimentScore))
updateDotPosition(parseFloat(sentimentScore));

function navigateToMainPage() {
    window.location.href = '/';
}

// Function to handle clicks on category and tone elements
function handleFilterClick(event) {
    const selectedFilter = event.target.dataset.category || event.target.dataset.tone;


    if (selectedFilter) {
        // Redirect to a new page with the selected filter as a query parameter
        if (event.target.dataset.category) {
            window.location.href = `/filtered-news/category=${selectedFilter}`;
        } else if (event.target.dataset.tone) {
            window.location.href = `/filtered-news/sentiment_label=${selectedFilter}`;
        }
    }
}

// Add click event listeners to category and tone elements
const categoriesList = document.getElementById('categories-list');
const tonesList = document.getElementById('tones-list');

categoriesList.addEventListener('click', handleFilterClick);
tonesList.addEventListener('click', handleFilterClick);
