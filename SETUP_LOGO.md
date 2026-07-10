Place the provided Swara logo image so the site uses it automatically

1) Save the provided logo file as `swara-logo.png` inside the frontend public images folder:

   - Path: frontend/public/images/swara-logo.png

2) If you're running the dev server, simply refresh the browser page. Vite serves `public` assets directly.

3) If you want the backend local DB to reference the new logo (already updated), verify `backend/data/db.json` has:

   "logo": "/images/swara-logo.png"

4) Quick copy commands (Windows PowerShell) if the file is on your Desktop and named `SwaraLogo.png`:

```powershell
Copy-Item -Path "$env:USERPROFILE\Desktop\SwaraLogo.png" -Destination "c:\Swara-Cotton-Thread\frontend\public\images\swara-logo.png"
```

5) After copying, reload the site at http://localhost:5173/ and the logo should appear in the navbar and other brand locations.

Notes:
- If you prefer another filename, update the `logo` field in `backend/data/db.json` and the default in `frontend/src/context/BrandContext.jsx`.
- The site already uses `brand.logo` values from the backend; once the file exists in `public/images/`, it will display immediately.
