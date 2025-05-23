## Documentation

### How do I run this locally?

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm run dev
   ```
3. Open your browser to the local address shown in the terminal (usually `http://localhost:5173`).

### How do I extend with new data sources?

- Currently the project is being run on mock data. Replace the files in src/api/ with real api calls to add more data.

- NOTE: it is currently being run with mock data because I was having trouble calling the api listed in the docs as it was returning a 401 unauthorized error.

### What patterns should I be paying attention to?

- **Data-driven UI:**
  - The modal and graph are rendered based on the data structure returned from the mock API and the `globalDataSources` array. Adding or changing data sources or forms does not require UI code changes.
- **Expandable Dropdowns:**
  - Data sources and forms with nested fields are rendered as expandable dropdowns in the modal, using a recursive tree pattern.
- **State Management:**
  - React `useState` and `useEffect` are used for managing graph data, selection, and prefill mappings.
- **Separation of Concerns:**
  - Data fetching, UI rendering, and data source definitions are separated into different files/modules for maintainability.
- **TypeScript Types:**
  - Types are defined for graph structure, edges, and data sources to ensure type safety and easier refactoring.

---
