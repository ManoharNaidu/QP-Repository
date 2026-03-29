# Question Paper Frontend

React frontend for uploading papers, searching them, downloading them, and sending feedback.

## Scripts

```bash
npm start
npm test -- --watchAll=false
npm run build
```

## Environment variables

Optional:

```bash
REACT_APP_API_URL=http://localhost:5000
```

If omitted, the app uses relative `/api/...` requests.

## Highlights

- Shared frontend constants for module, branch, semester, and cycle values.
- Centralized Axios client in `src/lib/api.js`.
- Backend-driven pagination for download results.
- Normalized course-code input and consistent `EE` branch usage.

## Main pages

- `src/pages/UploadPage.js`
- `src/pages/DownloadPage.js`
- `src/pages/FeedBackPage.js`

## Notes

- Uploads accept PDF files selected from the browser.
- Search pagination is driven by backend `page` and `pageSize` query params.
- Feedback now sends structured fields instead of flattening everything into one string.
