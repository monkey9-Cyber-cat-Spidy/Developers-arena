# Weather Application Documentation

## 1. Project Overview

### 1.1 Goal
The goal of this project is to build a responsive **Weather Dashboard** that integrates with a real public REST API (OpenWeatherMap) using only **HTML, CSS, and JavaScript**. It is designed as a Week 4 project to practice:

- Connecting frontend (browser) to a backend API
- Using HTTP methods and JSON
- Working with async JavaScript (`fetch`, `async/await`)
- Organizing code into modules
- Handling errors and loading states for better UX
- Using `localStorage` for simple client-side persistence

### 1.2 Objectives

The application should:

- Fetch real-time weather data from the OpenWeatherMap API
- Display **current weather** and a **5-day forecast**
- Support **city search** (with autocomplete suggestions)
- Support **Celsius/Fahrenheit** unit conversion
- Allow users to **save favorite cities**
- Offer **"Use my location"** using the Geolocation API
- Provide a **responsive** layout that works on desktop, tablet, and mobile
- Handle API errors and invalid input gracefully
- Cache responses for a short period to reduce unnecessary API calls

---

## 2. Setup Instructions

### 2.1 Prerequisites

- A modern web browser (Chrome, Edge, Firefox, etc.)
- A text editor (VS Code, Sublime, etc.)
- A free **OpenWeatherMap** account and API key
- Optional: a simple static server (e.g., VS Code Live Server, `npx serve`)

### 2.2 Get an OpenWeatherMap API key

1. Go to the OpenWeatherMap website and sign up for a free account.
2. After logging in, navigate to your **API keys** section.
3. Copy the generated API key (a long string of characters).

### 2.3 Configure the project

1. Open the project folder: `week4-weather-app/`.
2. Open `js/config.js` in a text editor.
3. Replace `YOUR_API_KEY_HERE` with your actual key:

   ```js
   const OPENWEATHER_API_KEY = 'YOUR_REAL_API_KEY_HERE';
   ```

4. Optionally, adjust:
   - `DEFAULT_CITY` (default: `"New York"`)
   - `CACHE_DURATION_MS` (default: 10 minutes)

### 2.4 Run the project locally

**Option A: Open directly in browser**

1. Locate `index.html` in the project root.
2. Double-click it or drag it into your browser window.
3. The app should load and show weather for the default city.

**Option B (recommended): Use a simple static server**

1. If you have Node.js installed, open a terminal in `week4-weather-app/`.
2. Run a static server, for example:

   ```bash
   npx serve .
   ```

3. Open the provided local URL (e.g., `http://localhost:3000`).

### 2.5 Deploy to GitHub Pages

1. Create a new GitHub repository and push the contents of `week4-weather-app/`.
2. In the repository settings, enable **GitHub Pages**:
   - Source: `main` (or `master`) branch
   - Folder: `/ (root)`
3. Wait for the deployment to finish.
4. Visit the GitHub Pages URL to use your weather app online.

---

## 3. Code Structure

The project follows a simple but clear separation of concerns into **HTML**, **CSS**, and **JavaScript modules**.

```text
week4-weather-app/
│── index.html              # Main HTML shell and layout
│── css/
│   ├── style.css           # Base styles, layout, cards, typography
│   ├── weather-icons.css   # Color and style tweaks for weather icons
│   └── responsive.css      # Media queries for mobile/tablet responsiveness
│── js/
│   ├── app.js              # Application entry; wires UI & services
│   ├── weatherService.js   # API integration + caching logic
│   ├── ui.js               # DOM manipulation and rendering helpers
│   ├── storage.js          # localStorage wrapper (cache, favorites, last city)
│   └── config.js           # API key, base URL, defaults, cache duration
│── assets/
│   ├── icons/              # (reserved for custom icons)
│   └── images/             # (reserved for background or branding images)
│── README.md               # High-level project description and setup
│── Documentation.md        # Detailed documentation (this file)
│── .env.example            # Example env var name for API key
└── .gitignore              # Ignore .env and IDE/OS-specific files
```

**Organization principles:**

- `index.html` contains **structure only** (no business logic).
- All **logic** is in JavaScript modules under `js/`.
- Styling is split into:
  - base styles (`style.css`)
  - responsive behavior (`responsive.css`)
  - icon customization (`weather-icons.css`)

---

## 4. Technical Details

### 4.1 Algorithms and Data Flow

#### 4.1.1 Weather Fetch & Caching Algorithm

For both current weather and forecast:

1. Build a **cache key** based on the request type and identifier:
   - Example: `current_city_london`, `forecast_coords_51.51,-0.13`
2. Check an in-memory `Map` for the key.
3. If not found or expired (older than `CACHE_DURATION_MS`):
   - Build the full API URL with query parameters (`q` or `lat`/`lon`, `units=metric`, `appid`).
   - Call the API with `fetch()`.
   - If `response.ok === false`, convert HTTP status to a human-readable **error message**.
   - Parse JSON and store it in the cache along with a `timestamp`.
4. Persist the cache object to `localStorage` so it survives page reloads.
5. Return the parsed JSON to the caller (`app.js`).

This algorithm reduces repeated API calls when the user searches for the same city or quickly reloads the page.

#### 4.1.2 5-Day Forecast Grouping

OpenWeatherMap’s forecast endpoint returns data in **3-hour intervals**. To show a clean 5-day summary:

1. Iterate over each forecast item in `forecast.list`.
2. Convert each item’s `dt` field into a date string (e.g., `"Mon Jan 01 2024"`).
3. Group items by that date string.
4. For each date, pick a **representative entry**, preferring the one closest to noon (12:00) for a typical day overview.
5. Use this representative entry to show:
   - Day name (Mon, Tue, etc.)
   - Min/max temperatures
   - Weather icon and description

#### 4.1.3 Unit Conversion (Celsius ⇄ Fahrenheit)

- All API calls are made with `units=metric` → server returns Celsius.
- A simple function in `WeatherUI` converts Celsius to Fahrenheit:

  ```js
  function convertTemp(celsius) {
      return Math.round((celsius * 9) / 5 + 32);
  }
  ```

- When the user clicks the unit toggle button, the app **does not** make new API calls; it just re-renders the existing data using the new unit.

### 4.2 Data Structures

#### 4.2.1 Cache Structure

The cache is stored in two layers:

1. **In-memory `Map`** inside `WeatherService`:

   ```js
   Map<string, { data: object, timestamp: number }>
   ```

2. **Persistent localStorage** under key `weather_cache_v1`:

   ```json
   {
     "current_city_london": {
       "data": { ...OpenWeather JSON... },
       "timestamp": 1700000000000
     },
     "forecast_city_london": {
       "data": { ...OpenWeather JSON... },
       "timestamp": 1700000005000
     }
   }
   ```

#### 4.2.2 Favorites Structure

- Stored as a simple **array of city names** in `localStorage` under key `weather_favorites`.

  ```json
  ["New York", "London", "Tokyo"]
  ```

- Rendered as clickable **chips**; clicking a chip triggers a new search for that city.

### 4.3 Architecture

The architecture is inspired by a simple MVC-style separation:

- **Model / Data layer**: `WeatherService`, `StorageService`
- **View / UI layer**: `WeatherUI` (DOM only)
- **Controller**: `app.js` (event wiring and orchestration)

This keeps responsibilities clear and makes the code easier to maintain and extend.

---

## 5. Testing Evidence

There is no automated test framework in this project; instead, we use **manual test cases** to validate behavior.

### 5.1 Functional Test Cases

1. **Valid city search**
   - **Input**: Type `New York` and click **Search**.
   - **Expected**:
     - Current weather card with city name and country.
     - A list of 5 forecast cards (one per day).
     - A "Last updated" timestamp appears in the header.

2. **Invalid city search**
   - **Input**: Type `Xyzabc` and click **Search**.
   - **Expected**:
     - Status message area displays a friendly error: _"City not found. Please check the name and try again."_
     - No current weather or forecast cards are shown.

3. **Unit conversion**
   - **Steps**:
     1. Search for `London`.
     2. Click **Switch to °F**.
   - **Expected**:
     - All displayed temperatures (current & forecast) switch to Fahrenheit.
     - Clicking again switches back to Celsius.
     - No additional network requests should be necessary (data reused).

4. **Favorites management**
   - **Steps**:
     1. Search for `Tokyo`.
     2. Click **★ Add current city**.
     3. Reload the page.
   - **Expected**:
     - `Tokyo` appears as a favorite chip.
     - Clicking the chip loads Tokyo’s weather without typing again.

5. **Use my location**
   - **Steps**:
     1. Click **Use my location**.
     2. Accept the browser’s geolocation permission.
   - **Expected**:
     - The app shows current weather and forecast for your approximate location.
     - The search input is updated with the detected city name.

6. **Caching behavior**
   - **Steps**:
     1. Search for `Paris`.
     2. Immediately search for `Paris` again or reload the page.
   - **Expected**:
     - Second load is noticeably faster and should reuse cached data.
     - The displayed data should be the same as long as the cache has not expired.

### 5.2 Error Handling Cases

1. **No internet connection / network error**
   - **Simulate**: Temporarily disconnect your network and try a search.
   - **Expected**:
     - A generic error is shown in the status area (e.g., unable to fetch data).

2. **Invalid API key**
   - **Simulate**: Use a random string as `OPENWEATHER_API_KEY`.
   - **Expected**:
     - Status area shows: _"Invalid API key. Please check your configuration."_

3. **Geolocation denied**
   - **Simulate**: Click **Use my location** and deny permission.
   - **Expected**:
     - Status area shows a helpful message: _"Unable to access your location. Please allow permission or search by city."_

---

## 6. Component Architecture

### 6.1 Component Hierarchy

- **index.html**
  - `header.app-header`
    - Branding (logo + titles)
    - Last updated text
  - `main`
    - `section.controls`
      - Search form (input + search button + use-my-location button)
      - Unit toggle button
    - `section.favorites`
      - Favorites header + "Add favorite" button
      - Favorites chips container
    - `section#statusMessage`
    - `section#currentWeather`
    - `section#forecast`
  - `footer.app-footer`

JavaScript components:

- **StorageService** (in `storage.js`)
  - Reads/writes `localStorage` keys for last city, favorites, and cache.

- **WeatherService** (in `weatherService.js`)
  - Depends on `StorageService` and config constants.
  - Handles all interactions with the OpenWeatherMap API and caching.

- **WeatherUI** (in `ui.js`)
  - Knows about DOM elements and how to render data.
  - Does **not** talk to the network or `localStorage` directly.

- **App Controller** (IIFE in `app.js`)
  - Creates instances of the above classes.
  - Wires user events to service calls and UI updates.

### 6.2 Data Flow Diagram (Textual)

1. **User Action → Controller**
   - User submits search form / clicks favorite / toggles unit / uses location.
   - `app.js` receives the event via bound handlers.

2. **Controller → Service**
   - For search or location:
     - `app.js` calls `WeatherService.getCurrentWeatherByCity()` and `getForecastByCity()`, or the coordinate equivalents.

3. **Service → API + Storage**
   - `WeatherService` checks its in-memory + localStorage cache.
   - If needed, it calls the OpenWeatherMap API using `fetch()`.
   - Responses are cached and persisted.

4. **Service → Controller**
   - `WeatherService` returns parsed JSON objects for current weather and forecast.

5. **Controller → UI**
   - `app.js` stores the latest data in memory (`lastWeather`, `lastForecast`).
   - Calls `WeatherUI.displayCurrentWeather()` and `WeatherUI.displayForecast()`.
   - UI converts temperatures to the currently selected unit.

6. **UI → DOM**
   - `WeatherUI` updates the DOM: cards, icons, status messages, favorites.
   - Also updates the theme (day/night) based on sunrise/sunset.

This separation ensures each part of the app has a clear responsibility and makes it easier to extend (e.g., adding weather alerts or maps later).

## 7. Weatherstack API Endpoints & Performance

This project uses the **Weatherstack API** for current weather data. Weatherstack exposes several endpoints with strong performance characteristics:

- **Current Weather API**
  - Purpose: Live weather conditions for a given location.
  - Typical latency: ~471 ms
  - Availability: 100%
  - Pass rate: 100%
  - Error rate: 0.00%

- **Historical Time-Series API**
  - Purpose: Hourly/time-series historical weather data over a date range.
  - Typical latency: ~437 ms
  - Availability: 100%
  - Pass rate: 100%
  - Error rate: 0.00%

- **Historical Weather API**
  - Purpose: Daily historical weather data (past dates).
  - Typical latency: ~427 ms
  - Availability: 100%
  - Pass rate: 100%
  - Error rate: 0.00%

- **Location Lookup / Autocomplete API**
  - Purpose: Search for and autocomplete locations by name.
  - Typical latency: ~389 ms
  - Availability: 100%
  - Pass rate: 100%
  - Error rate: 0.00%

- **Weather Forecast API**
  - Purpose: Forecast weather for up to 14 days.
  - Typical latency: ~418 ms
  - Availability: 100%
  - Pass rate: 100%
  - Error rate: 0.00%

> Note: The current project API key is on a free Weatherstack plan, which only supports the **Current Weather** endpoint. Other endpoints (Forecast, Historical, Time-Series, Autocomplete) are documented here as part of the API capabilities but are not called by the live app unless the subscription plan is upgraded.
