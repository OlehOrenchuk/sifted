
// Оголошення глобальної змінної newsData
let newsData;
let currentPage = 1;
const itemsPerPage = 25;
let totalItems
let totalPages

// Add click event listeners to category and tone elements
const categoriesList = document.getElementById('categories-list');
const tonesList = document.getElementById('tones-list');

fetch('http://127.0.0.1:8000/api/news_data', {
    method: 'GET',
    headers: {
        'allowAccess': 'true'
    }
})
    .then(response => response.json())
    .then(data => {
        newsData = data;
        totalItems = newsData.length
        console.log("Fetched data from API call",newsData)
        updateNewsList(newsData);

        // Initial setup
        totalPages = calculateTotalPages(totalItems, itemsPerPage);
        generatePaginationLinks(currentPage, totalPages);
    })
    .catch(error => console.error('Error fetching news data:', error));


function updateNewsList(filteredNews) {
    // Очистка поточного списку новин
    const newsListContainer = document.getElementById('news-list');
    newsListContainer.innerHTML = '';

    // Calculate the start and end indexes based on the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Display only the items for the current page
    const currentNewsPage = filteredNews.slice(startIndex, endIndex);

   // Check if currentNewsPage is empty
    if (currentNewsPage.length === 0) {
        const noNewsMessage = document.createElement('h3');
        noNewsMessage.innerHTML = 'Новини відсутні.';
        noNewsMessage.style.textAlign = 'center';
        newsListContainer.appendChild(noNewsMessage);
    } else {
        // Додавання нових елементів до списку
        currentNewsPage.forEach(news => {
            const anchorElement = document.createElement('a');
            anchorElement.href = `newsId=${news.news_id__id}`;

            const newsItem = document.createElement('li');
            newsItem.innerHTML = `${news.headline}`;

            anchorElement.appendChild(newsItem);
            newsListContainer.appendChild(anchorElement);
        });
    }

}

function applyFilters() {
    // Перевірка, чи newsData встановлено
    if (!newsData) {
        console.error('newsData is not defined.');
        return;
    }

    const selectedCategoryId = document.getElementById('categories-filter').value;
    const selectedTone = document.getElementById('tones-filter').value;
    const searchQuery = document.getElementById('search-input').value.toLowerCase();

    // Get default values if startDate or endDate is not set
    const defaultStartDate = new Date("1950-01-01");
    const defaultEndDate = new Date("2050-01-01");

    // Отримати вибраний діапазон дат
    const selectedDateRange = document.getElementById('dates-filter').value.split(" to ");
    const startDate = selectedDateRange[0] ? new Date(selectedDateRange[0]) : defaultStartDate;
    const endDate = selectedDateRange[1] ? new Date(selectedDateRange[1]) : defaultEndDate;

    let filteredNews = newsData.filter(news => {
        // Фільтр за категорією
        const categoryFilter = selectedCategoryId === 'all' || news.news_id__category_id_id.toString() === selectedCategoryId;

        // Фільтр за тоном
        const toneFilter = selectedTone === 'all' || news.news_id__sentiment_label === selectedTone;

        // Фільтр за датою
        const dateFilter = new Date(news.news_id__publication_date) >= startDate &&
            new Date(news.news_id__publication_date) <= endDate;

        // Повернути результат логічного "І" всіх фільтрів
        return categoryFilter && toneFilter && dateFilter;
    });

    // Фільтрація за заголовком
    filteredNews = filteredNews.filter(news => {
        const headline = news.headline.toLowerCase();
        return headline.includes(searchQuery);
    });

    // Update the totalItems and calculate total pages
    totalItems = filteredNews.length;
    const totalPages = calculateTotalPages(totalItems, itemsPerPage);

    // Оновлення списку новин на основі фільтрів
    updateNewsList(filteredNews);

    // After performing actions, regenerate pagination links
    generatePaginationLinks(currentPage, totalPages);

    currentPage = 1

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

categoriesList.addEventListener('click', handleFilterClick);
tonesList.addEventListener('click', handleFilterClick);

function clearDate() {
    document.getElementById('dates-filter').value = '';
    applyFilters(); // Call your filter function after clearing the date
}

document.getElementById('categories-filter').addEventListener('change', applyFilters);
document.getElementById('tones-filter').addEventListener('change', applyFilters);
document.getElementById('dates-filter').addEventListener('change', applyFilters);

// Підключення Flatpickr до інпуту
flatpickr("#dates-filter", {
    mode: "range",  // Вказати режим вибору діапазону
    minDate: "1950-01-01",
    maxDate: "2050-01-01",
    dateFormat: "Y-m-d",  // Формат дати, відповідно до ваших потреб
    onChange: function(selectedDates, dateStr) {
        applyFilters();  // Викликати функцію при зміні дат
    }
});


function navigateToMainPage() {
    window.location.href = '/';
}

function generatePaginationLinks(currentPage, totalPages) {
    const paginationList = document.getElementById('pagination-list');
    paginationList.innerHTML = '';

    const maxVisiblePages = 4;

    // Previous page link
    const isPreviousDisabled = currentPage === 1;
    paginationList.innerHTML += `<li id="prev-page" ${isPreviousDisabled ? 'class="disabled"' : ''}><a href="#" onclick="${isPreviousDisabled ? '' : `changePage(${currentPage - 1})`}">
        <svg  style="display: flex" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-short" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"/>
        </svg>
    </a></li>`;

    // Page links
    if (totalPages > maxVisiblePages) {
        if (currentPage < 4) {
            // Display pages 1, 2, 3, 4, ..., totalPages
            for (let page = 1; page <= Math.min(maxVisiblePages, totalPages); page++) {
                paginationList.innerHTML += `<li class="page-item ${page === currentPage ? 'active' : ''}"><a class="page-link" href="#" onclick="changePage(${page})">${page}</a></li>`;
            }
            if (totalPages > maxVisiblePages) {
                paginationList.innerHTML += `<li class="page-item"><span>...</span></li>`;
            }
            paginationList.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a></li>`;
        } else if (currentPage > totalPages - 3) {
            // Display pages 1, ..., totalPages-3, totalPages-2, totalPages-1, totalPages
            paginationList.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(1)">1</a></li>`;
            paginationList.innerHTML += `<li class="page-item"><span>...</span></li>`;
            for (let page = totalPages - maxVisiblePages + 1; page <= totalPages; page++) {
                paginationList.innerHTML += `<li class="page-item ${page === currentPage ? 'active' : ''}"><a class="page-link" href="#" onclick="changePage(${page})">${page}</a></li>`;
            }
        } else {
            // Display pages 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
            paginationList.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(1)">1</a></li>`;
            paginationList.innerHTML += `<li class="page-item"><span>...</span></li>`;
            for (let page = currentPage - 1; page <= currentPage + 1; page++) {
                paginationList.innerHTML += `<li class="page-item ${page === currentPage ? 'active' : ''}"><a class="page-link" href="#" onclick="changePage(${page})">${page}</a></li>`;
            }
            paginationList.innerHTML += `<li class="page-item"><span>...</span></li>`;
            paginationList.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a></li>`;
        }
    } else {
        // Display all pages if total pages are less than or equal to maxVisiblePages
        for (let page = 1; page <= totalPages; page++) {
            paginationList.innerHTML += `<li class="page-item ${page === currentPage ? 'active' : ''}"><a class="page-link" href="#" onclick="changePage(${page})">${page}</a></li>`;
        }
    }

    // Next page link
    const hasNextPage = currentPage < totalPages;
    paginationList.innerHTML += `<li id="next-page" ${hasNextPage ? '' : 'class="disabled"'}><a href="#" onclick="changePage(${currentPage + 1})">
        <svg style="display: flex" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
        </svg>
    </a></li>`;
}


function calculateTotalPages(totalItems, itemsPerPage) {
    return Math.ceil(totalItems / itemsPerPage);
}


// Function to handle page change
function changePage(pageNumber) {
    console.log("click")
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        currentPage = pageNumber;
        applyFilters()
        // After performing actions, regenerate pagination links
        // generatePaginationLinks(currentPage, totalPages);
    }
}