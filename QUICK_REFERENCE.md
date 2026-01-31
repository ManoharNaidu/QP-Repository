# Quick Reference: Dynamic URL Filters

## What Changed?

### Frontend (question-paper-frontend/src/pages/DownloadPage.js)

**Added:**

- Import `useSearchParams` from `react-router-dom`
- Hook to read/write URL query parameters
- Function to parse URL parameters on component load
- Function to update URL when filters change

**Modified Functions:**

- `handleInputChange()` - Now updates URL in real-time
- `handleFilterSubmit()` - Now updates URL when applying filters

### Backend

- ✅ No changes needed - already supports query parameter filtering

## How It Works

1. **User applies filters** → URL updates automatically
2. **User shares URL** → Recipient opens it with filters pre-applied
3. **User modifies filters** → URL changes in real-time

## URL Format

```
/download?module=Bachelor&branch=CSE&year=2024&semester=End
```

- `module`: Base, Bachelor, or Master
- `branch`: AE, CE, CSE, ECE, EEE, ME
- `academicYear`: 1st Year, 2nd Year, 3rd Year, 4th Year
- `year`: YYYY format
- `semester`: Mid or End
- `cycle`: Jan-Jun or Jul-Dec
- `courseCode`: 2 letters + 5 digits (e.g., CS12345)

## Testing Steps

1. Open `/download` page
2. Select filters (e.g., Branch: CSE, Year: 2024)
3. Check URL changes to: `/download?branch=CSE&year=2024`
4. Copy and share the URL
5. Open shared URL → filters apply automatically

## File Modified

- [question-paper-frontend/src/pages/DownloadPage.js](question-paper-frontend/src/pages/DownloadPage.js)
