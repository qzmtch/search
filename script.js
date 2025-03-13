document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const cardContainer = document.getElementById('cardContainer');
    const categoryFilters = document.getElementById('categoryFilters');

    let allData = []; // Сохраняем все загруженные данные здесь
    let categories = []; // Сохраняем список категорий
    const cache = {}; // Объект для кэширования данных
    let dataLoaded = false; // Флаг, указывающий, были ли загружены данные

    // Функция для загрузки категорий
    async function loadCategories() {
        try {
            const response = await fetch('categories.json');
            categories = await response.json();
            renderCategoryFilters(categories);
        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
            categoryFilters.innerHTML = '<p>Ошибка загрузки категорий.</p>';
        }
    }

    // Функция для отображения чекбоксов категорий
    function renderCategoryFilters(categories) {
        categoryFilters.innerHTML = ''; // Очищаем контейнер

        categories.forEach(category => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = category.id;
            checkbox.value = category.id;

            const label = document.createElement('label');
            label.htmlFor = category.id;
            label.textContent = category.name;

            const div = document.createElement('div');
            div.appendChild(checkbox);
            div.appendChild(label);

            categoryFilters.appendChild(div);

            // Добавляем обработчик события change для чекбокса
            checkbox.addEventListener('change', function() {
                loadSelectedCategoriesAndRender();
            });
        });
    }

    // Функция для загрузки данных из выбранных категорий и отображения (вместо разделения)
    async function loadSelectedCategoriesAndRender() {
      if (!dataLoaded) {
        allData = []; // Очищаем все данные перед загрузкой
        const selectedCategories = Array.from(document.querySelectorAll('#categoryFilters input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);

        if (selectedCategories.length === 0) {
            renderCards([]); // Если ничего не выбрано, показываем пустой результат
            return;
        }

        // Загружаем данные из каждой выбранной категории
        for (const categoryId of selectedCategories) {
            const category = categories.find(cat => cat.id === categoryId);
            if (category) {
                try {
                    // Проверяем, есть ли данные в кэше
                    if (cache[category.url]) {
                        allData = allData.concat(cache[category.url]); // Используем данные из кэша
                    } else {
                        // Если данных нет в кэше, загружаем их
                        const response = await fetch(category.url);
                        const categoryData = await response.json();
                        cache[category.url] = categoryData; // Сохраняем данные в кэше
                        allData = allData.concat(categoryData); // Добавляем данные к общему массиву
                    }
                } catch (error) {
                    console.error(`Ошибка загрузки данных из категории ${categoryId}:`, error);
                }
            }
        }
        dataLoaded = true; // Устанавливаем флаг, что данные загружены
      }
        renderCards(filterData(searchInput.value)); // Отображаем отфильтрованные данные
    }

    // Функция для отображения карточек (без изменений)
    function renderCards(items) {
        cardContainer.innerHTML = ''; // Очищаем контейнер

        if (items.length === 0) {
            cardContainer.innerHTML = '<p>Ничего не найдено.</p>';
            return;
        }

        items.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <h2>${item.title}</h2>
                <p>${item.description}</p>
                <p>Автор: ${item.author}</p>
            `;
            cardContainer.appendChild(card);
        });
    }

    // Функция для фильтрации данных (без изменений)
    function filterData(searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        const filteredData = allData.filter(item => { // Ищем во всех загруженных данных
            return (
                item.title.toLowerCase().includes(searchTermLower) ||
                item.description.toLowerCase().includes(searchTermLower) ||
                item.author.toLowerCase().includes(searchTermLower)
            );
        });
        return filteredData;
    }

    // Обработчик события ввода в поле поиска (без изменений)
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value;
        const filteredResults = filterData(searchTerm);
        renderCards(filteredResults);
    });

    // Загружаем категории при загрузке страницы
    loadCategories();
});
