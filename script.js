document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const cardContainer = document.getElementById('cardContainer');
    let data = []; // Сохраняем данные здесь

    // Функция для загрузки данных из JSON
    async function loadData() {
        try {
            const response = await fetch('data.json');
            data = await response.json();
            renderCards(data); // Отображаем все карточки при загрузке
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            cardContainer.innerHTML = '<p>Ошибка загрузки данных.</p>';
        }
    }

    // Функция для отображения карточек
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

    // Функция для фильтрации данных
    function filterData(searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        const filteredData = data.filter(item => {
            return (
                item.title.toLowerCase().includes(searchTermLower) ||
                item.description.toLowerCase().includes(searchTermLower) ||
                item.author.toLowerCase().includes(searchTermLower)
            );
        });
        return filteredData;
    }

    // Обработчик события ввода в поле поиска
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value;
        const filteredResults = filterData(searchTerm);
        renderCards(filteredResults);
    });

    // Загружаем данные при загрузке страницы
    loadData();
});