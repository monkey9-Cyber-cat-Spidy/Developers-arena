// weatherService.js
// Weatherstack-based implementation of the WeatherService.

class WeatherService {
    constructor(accessKey, baseUrl, storageService) {
        this.accessKey = accessKey;
        this.baseUrl = baseUrl;
        this.storage = storageService;
        this.cache = new Map();
        this.cacheDuration = CACHE_DURATION_MS;

        // Initialize cache from localStorage if present
        this._loadCacheFromStorage();
    }

    _cacheKey(type, identifier) {
        return `${type}_${identifier}`;
    }

    _loadCacheFromStorage() {
        if (!this.storage) return;
        const stored = this.storage.loadCache();
        Object.keys(stored).forEach((key) => {
            this.cache.set(key, stored[key]);
        });
    }

    _persistCache() {
        if (!this.storage) return;
        const obj = {};
        this.cache.forEach((value, key) => {
            obj[key] = value;
        });
        this.storage.saveCache(obj);
    }

    _getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        if (Date.now() - cached.timestamp < this.cacheDuration) {
            return cached.data;
        }
        // expired
        this.cache.delete(key);
        this._persistCache();
        return null;
    }

    _saveToCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
        this._persistCache();
    }

    async _fetchJson(url) {
        const response = await fetch(url);
        const json = await response.json();

        // Weatherstack returns error objects inside a 200 response body
        if (!response.ok || (json && json.error)) {
            let message = 'Error fetching weather data.';
            if (json && json.error && json.error.info) {
                message = json.error.info;
            } else if (!response.ok) {
                message = `API Error: ${response.status}`;
            }
            throw new Error(message);
        }

        return json;
    }

    // City-based helpers

    async getCurrentWeatherByCity(city) {
        const normalized = city.trim();
        const cacheKey = this._cacheKey('current_city', normalized.toLowerCase());
        const cached = this._getFromCache(cacheKey);
        if (cached) return cached;

        const url = `${this.baseUrl}/current?access_key=${encodeURIComponent(
            this.accessKey
        )}&query=${encodeURIComponent(normalized)}&units=m`;
        const data = await this._fetchJson(url);
        this._saveToCache(cacheKey, data);
        return data;
    }

    async getForecastByCity(city) {
        // The current Weatherstack subscription plan in use does not support the
        // /forecast endpoint. This method is kept for future upgrades but should not
        // be called from the app code on the free plan.
        throw new Error('Forecast data is not available on the current Weatherstack plan.');
    }

    // Coordinate-based helpers (use "lat,lon" in the query parameter)

    async getCurrentWeatherByCoords(lat, lon) {
        const id = `${lat.toFixed(3)},${lon.toFixed(3)}`;
        const cacheKey = this._cacheKey('current_coords', id);
        const cached = this._getFromCache(cacheKey);
        if (cached) return cached;

        const query = `${lat},${lon}`;
        const url = `${this.baseUrl}/current?access_key=${encodeURIComponent(
            this.accessKey
        )}&query=${encodeURIComponent(query)}&units=m`;
        const data = await this._fetchJson(url);
        this._saveToCache(cacheKey, data);
        return data;
    }

    async getForecastByCoords(lat, lon) {
        // See comment in getForecastByCity – /forecast is not available on the
        // current Weatherstack plan.
        throw new Error('Forecast data is not available on the current Weatherstack plan.');
    }
}
