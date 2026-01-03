// app.js

(function () {
    const storage = new StorageService();
    const ui = new WeatherUI();
    const service = new WeatherService(WEATHERSTACK_ACCESS_KEY, WEATHERSTACK_BASE_URL, storage);

    let lastWeather = null; // Weatherstack current weather response
    let lastForecast = null; // Weatherstack forecast response
    let lastCity = storage.getLastCity();

    function renderAll() {
        ui.displayCurrentWeather(lastWeather);
        ui.displayForecast(lastForecast);
        ui.updateThemeFromWeather(lastWeather);
        ui.setLastUpdated(new Date());
    }

    async function loadWeatherForCity(city) {
        if (!city) return;
        lastCity = city;
        storage.setLastCity(city);
        ui.setSearchValue(city);
        ui.showLoading();

        try {
            // On the free Weatherstack plan we only have access to current weather.
            const current = await service.getCurrentWeatherByCity(city);

            lastWeather = current;
            lastForecast = null; // no forecast available on this plan

            ui.clearStatus();
            renderAll();
        } catch (error) {
            console.error(error);
            ui.showError(error.message || 'Failed to load weather data. Please try again later.');
        }
    }

    async function loadWeatherForLocation() {
        if (!navigator.geolocation) {
            ui.showError('Geolocation is not supported by your browser.');
            return;
        }

        ui.showLoading();

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const current = await service.getCurrentWeatherByCoords(latitude, longitude);

                    lastWeather = current;
                    lastForecast = null; // no forecast on this plan
                    lastCity = current && current.location ? current.location.name : 'My location';
                    storage.setLastCity(lastCity);
                    ui.setSearchValue(lastCity);

                    ui.clearStatus();
                    renderAll();
                } catch (error) {
                    console.error(error);
                    ui.showError(error.message || 'Failed to load weather for your location.');
                }
            },
            (error) => {
                console.error(error);
                ui.showError('Unable to access your location. Please allow permission or search by city.');
            }
        );
    }

    function handleUnitChange() {
        if (!lastWeather || !lastForecast) return;
        renderAll();
    }

    function getFavorites() {
        return storage.getFavorites();
    }

    function saveFavorites(list) {
        storage.saveFavorites(list);
        ui.updateFavorites(list);
    }

    function addCurrentCityToFavorites() {
        if (!lastCity) return;
        const favorites = getFavorites();
        if (!favorites.includes(lastCity)) {
            favorites.push(lastCity);
            saveFavorites(favorites);
        }
    }

    function initFavorites() {
        ui.updateFavorites(getFavorites());
    }

    function initEventHandlers() {
        ui.bindSearch(loadWeatherForCity);
        ui.bindUseLocation(loadWeatherForLocation);
        ui.bindUnitToggle(handleUnitChange);
        ui.bindAddFavorite(addCurrentCityToFavorites);
        ui.bindFavoriteClick(loadWeatherForCity);
    }

    function init() {
        initFavorites();
        initEventHandlers();
        ui.setSearchValue(lastCity);
        loadWeatherForCity(lastCity);
    }

    document.addEventListener('DOMContentLoaded', init);
})();
