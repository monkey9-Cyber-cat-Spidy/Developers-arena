// storage.js
// Small wrapper around localStorage for this project.

class StorageService {
    constructor() {
        this.KEYS = {
            LAST_CITY: 'weather_last_city',
            FAVORITES: 'weather_favorites',
            CACHE: 'weather_cache_v1'
        };
    }

    getLastCity() {
        return localStorage.getItem(this.KEYS.LAST_CITY) || DEFAULT_CITY;
    }

    setLastCity(city) {
        if (!city) return;
        localStorage.setItem(this.KEYS.LAST_CITY, city);
    }

    getFavorites() {
        try {
            const raw = localStorage.getItem(this.KEYS.FAVORITES);
            if (!raw) return [];
            const list = JSON.parse(raw);
            return Array.isArray(list) ? list : [];
        } catch (e) {
            console.error('Error reading favorites from localStorage', e);
            return [];
        }
    }

    saveFavorites(favorites) {
        try {
            localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(favorites || []));
        } catch (e) {
            console.error('Error saving favorites to localStorage', e);
        }
    }

    /**
     * Weather cache helpers: we store a map of cacheKey -> { data, timestamp }
     */
    loadCache() {
        try {
            const raw = localStorage.getItem(this.KEYS.CACHE);
            if (!raw) return {};
            const parsed = JSON.parse(raw);
            return typeof parsed === 'object' && parsed !== null ? parsed : {};
        } catch (e) {
            console.error('Error reading cache from localStorage', e);
            return {};
        }
    }

    saveCache(cacheObject) {
        try {
            localStorage.setItem(this.KEYS.CACHE, JSON.stringify(cacheObject || {}));
        } catch (e) {
            console.error('Error saving cache to localStorage', e);
        }
    }
}
