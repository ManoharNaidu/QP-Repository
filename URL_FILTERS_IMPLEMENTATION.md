# Dynamic URL Filters Implementation

## Overview

The Download Page now supports dynamic, shareable URLs with filter parameters. Users can apply filters and share the URL to other users, who will see the same filtered results.

## Implementation Details

### Frontend Changes (DownloadPage.js)

#### 1. **Added React Router Dependency**

- Imported `useSearchParams` from `react-router-dom`
- This hook allows reading and writing URL query parameters

#### 2. **Initialize Filters from URL on Mount**

```javascript
// Initialize filters from URL on component mount
useEffect(() => {
  const urlFilters = {
    module: searchParams.get("module") || "",
    branch: searchParams.get("branch") || "",
    academicYear: searchParams.get("academicYear") || "",
    year: searchParams.get("year") || "",
    semester: searchParams.get("semester") || "",
    cycle: searchParams.get("cycle") || "",
    courseCode: searchParams.get("courseCode") || "",
  };
  setFilters(urlFilters);
}, []);
```

- When the page loads or URL changes, filters are populated from query parameters

#### 3. **Update URL When Filters Change**

```javascript
// Update URL with current filters
const updateUrlWithFilters = (filtersToUpdate) => {
  const params = new URLSearchParams();
  Object.keys(filtersToUpdate).forEach((key) => {
    if (filtersToUpdate[key]) {
      params.set(key, filtersToUpdate[key]);
    }
  });
  setSearchParams(params);
};
```

- Converts filters to URL query parameters
- Only includes non-empty filters in the URL

#### 4. **Update handleInputChange Function**

```javascript
const handleInputChange = (e) => {
  const updatedFilters = { ...filters, [e.target.name]: e.target.value };
  setFilters(updatedFilters);
  updateUrlWithFilters(updatedFilters);
};
```

- Now updates URL in real-time as user changes filter selections

### Backend

**No changes required!** The backend already supports filtering via query parameters.

The `/api/download` endpoint correctly:

- Accepts query parameters: `branch`, `module`, `academicYear`, `year`, `semester`, `cycle`, `courseCode`
- Builds MongoDB queries based on provided filters
- Returns matching results

## URL Examples

### Example 1: CSE 2nd Year End Semester Papers

```
/download?module=Bachelor&branch=CSE&academicYear=2nd%20Year&cycle=Jul-Dec&semester=End
```

### Example 2: Base Module Papers

```
/download?module=Base&branch=AE&year=2024
```

### Example 3: Specific Course Code

```
/download?courseCode=CS12345
```

## Features

✅ **Shareable URLs** - Copy URL and share with others to show filtered results
✅ **Bookmarkable** - Users can bookmark filtered views
✅ **Browser History** - Back/Forward buttons work correctly with filters
✅ **Dynamic Updates** - Filters update URL in real-time as user selects options
✅ **Clean URLs** - Only non-empty filters appear in the URL

## Testing the Implementation

1. **Test Shareable URL:**

   - Apply filters on the Download page
   - Copy the URL
   - Share with another user or open in a new tab
   - Verify filters are applied automatically

2. **Test URL Parameter Combinations:**

   - Test with single filter
   - Test with multiple filters
   - Test with empty filters (returns all papers)

3. **Test Browser Navigation:**
   - Use browser back/forward buttons
   - Verify filters change accordingly

## Technical Details

- **Frontend Framework:** React with React Router v6+
- **Hook Used:** `useSearchParams` from `react-router-dom`
- **Query Parameter Names:** Match backend filter names (snake_case friendly with URL encoding)
- **Empty Filter Handling:** Empty filters are not included in the URL for cleaner URLs

## Future Enhancements

Possible future improvements:

- Add "Copy URL" button to easily share current filters
- Add filter presets/favorites
- Add export functionality with selected filters applied
