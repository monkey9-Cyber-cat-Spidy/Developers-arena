// ui.js

class WeatherUI {
    constructor() {
        this.currentWeatherEl = document.getElementById('currentWeather');
        this.forecastEl = document.getElementById('forecast');
        this.statusMessageEl = document.getElementById('statusMessage');
        this.searchInput = document.getElementById('searchInput');
        this.unitToggle = document.getElementById('unitToggle');
        this.favoritesListEl = document.getElementById('favoritesList');
        this.lastUpdatedEl = document.getElementById('lastUpdated');
        this.currentUnit = 'celsius'; // or 'fahrenheit'
    }

    bindSearch(handler) {
        const form = document.getElementById('searchForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const value = this.searchInput.value.trim();
            if (value) {
                handler(value);
            }
        });
    }

    bindUseLocation(handler) {
        const btn = document.getElementById('useLocationBtn');
        btn.addEventListener('click', () => handler());
    }

    bindUnitToggle(handler) {
        this.unitToggle.addEventListener('click', () => {
            this.toggleUnit();
            handler(this.currentUnit);
        });
    }

    bindAddFavorite(handler) {
        const btn = document.getElementById('addFavoriteBtn');
        btn.addEventListener('click', () => handler());
    }

    bindFavoriteClick(handler) {
        this.favoritesListEl.addEventListener('click', (e) => {
            const target = e.target.closest('[data-city]');
            if (!target) return;
            const city = target.getAttribute('data-city');
            if (city) handler(city);
        });
    }

    toggleUnit() {
        this.currentUnit = this.currentUnit === 'celsius' ? 'fahrenheit' : 'celsius';
        this.unitToggle.textContent = `Switch to °${this.currentUnit === 'celsius' ? 'F' : 'C'}`;
    }

    convertTemp(celsius) {
        if (this.currentUnit === 'celsius') {
            return Math.round(celsius);
        }
        return Math.round((celsius * 9) / 5 + 32);
    }

    showLoading() {
        this.statusMessageEl.textContent = 'Loading weather data...';
        this.statusMessageEl.className = 'status-message loading';
        this.currentWeatherEl.innerHTML = '';
        this.forecastEl.innerHTML = '';
    }

    showError(message) {
        this.statusMessageEl.innerHTML = `<span class="status-icon">⚠️</span> ${message}`;
        this.statusMessageEl.className = 'status-message error';
    }

    clearStatus() {
        this.statusMessageEl.textContent = '';
        this.statusMessageEl.className = 'status-message';
    }

    setLastUpdated(date) {
        if (!date) {
            this.lastUpdatedEl.textContent = '';
            return;
        }
        const formatted = date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        this.lastUpdatedEl.textContent = `Last updated: ${formatted}`;
    }

    setSearchValue(city) {
        this.searchInput.value = city || '';
    }

    updateThemeFromWeather(weatherData) {
        const body = document.body;
        if (!weatherData || !weatherData.current) {
            body.classList.remove('theme-night');
            body.classList.add('theme-day');
            return;
        }

        // Weatherstack current object has an "is_day" flag: "yes" or "no"
        const isNight = weatherData.current.is_day === 'no';
        body.classList.toggle('theme-night', isNight);
        body.classList.toggle('theme-day', !isNight);
    }

    displayCurrentWeather(weatherData) {
        if (!weatherData || !weatherData.current || !weatherData.location) {
            this.currentWeatherEl.innerHTML = '';
            return;
        }

        const { current, location } = weatherData;
        const tempC = typeof current.temperature === 'number' ? current.temperature : null;
        const feelsLikeC = typeof current.feelslike === 'number' ? current.feelslike : tempC;
        const unitLabel = this.currentUnit === 'celsius' ? 'C' : 'F';

        const temp = tempC != null ? this.convertTemp(tempC) : '—';
        const feelsLike = feelsLikeC != null ? this.convertTemp(feelsLikeC) : '—';

        const descriptionArray = current.weather_descriptions || [];
        const description = descriptionArray.length > 0 ? descriptionArray[0] : '';
        const humidity = current.humidity != null ? `${current.humidity}%` : '—';
        const pressure = current.pressure != null ? `${current.pressure} mb` : '—';
        const windSpeed = current.wind_speed != null ? `${current.wind_speed} km/h` : '—';

        const html = `
            <div class="weather-card">
                <div class="weather-card-header">
                    <h2>${location.name}, ${location.country}</h2>
                    <span class="weather-main-desc">${description}</span>
                </div>
                <div class="weather-main">
                    <div class="temperature">${temp}°${unitLabel}</div>
                    <div class="weather-condition">
                        <span class="weather-icon-text">${description}</span>
                    </div>
                </div>
                <div class="weather-details">
                    <div class="detail">
                        <span>Feels like</span>
                        <span>${feelsLike}°${unitLabel}</span>
                    </div>
                    <div class="detail">
                        <span>Humidity</span>
                        <span>${humidity}</span>
                    </div>
                    <div class="detail">
                        <span>Wind</span>
                        <span>${windSpeed}</span>
                    </div>
                    <div class="detail">
                        <span>Pressure</span>
                        <span>${pressure}</span>
                    </div>
                </div>
            </div>
        `;

        this.currentWeatherEl.innerHTML = html;
    }

    displayForecast(forecastData) {
        if (!forecastData || !forecastData.forecast) {
            // Free Weatherstack plan does not include forecast data.
            this.forecastEl.innerHTML = `
                <div class="forecast-container">
                    <div class="forecast-day">
                        <div class="day-name">Forecast</div>
                        <div class="condition">Forecast data is not available on the current API plan.</div>
                    </div>
                </div>
            `;
            return;
        }

        const dates = Object.keys(forecastData.forecast).sort();
        const firstFive = dates.slice(0, 5);
        let html = '<div class="forecast-container">';

        firstFive.forEach((dateStr) => {
            const day = forecastData.forecast[dateStr];
            const date = new Date(dateStr);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const tempMin = this.convertTemp(day.mintemp);
            const tempMax = this.convertTemp(day.maxtemp);

            let description = '';
            if (Array.isArray(day.hourly) && day.hourly.length > 0) {
                const descArr = day.hourly[0].weather_descriptions || [];
                description = descArr.length > 0 ? descArr[0] : '';
            }

            html += `
                <div class="forecast-day">
                    <div class="day-name">${dayName}</div>
                    <div class="temps">
                        <span class="temp-max">${tempMax}°</span>
                        <span class="temp-min">${tempMin}°</span>
                    </div>
                    <div class="condition">${description}</div>
                </div>
            `;
        });

        html += '</div>';
        this.forecastEl.innerHTML = html;
    }

    groupForecastByDay(list) {
        const byDate = {};

        list.forEach((item) => {
            const date = new Date(item.dt * 1000);
            const key = date.toDateString();
            // Use the forecast around midday as representative if possible
            if (!byDate[key]) {
                byDate[key] = item;
            } else {
                const existingHour = new Date(byDate[key].dt * 1000).getHours();
                const thisHour = date.getHours();
                if (Math.abs(thisHour - 12) < Math.abs(existingHour - 12)) {
                    byDate[key] = item;
                }
            }
        });

        return Object.values(byDate);
    }

    updateFavorites(favorites) {
        if (!Array.isArray(favorites) || favorites.length === 0) {
            this.favoritesListEl.innerHTML = '<p class="empty">No favorite cities yet.</p>';
            return;
        }
        this.favoritesListEl.innerHTML = favorites
            .map(
                (city) => `
                <button class="favorite-chip" type="button" data-city="${city}">
                    ★ ${city}
                </button>
            `
            )
            .join('');
    }
}
