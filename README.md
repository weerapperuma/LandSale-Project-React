# BodymaLK-React
Sri Lanka Body Room &amp; Rental Finder Platform

## Run Project
```html
npm install
```

## 📁 Project Structure

```

src/
├── assets/
├── redux/
│      └──store.ts
├── App.tsx
├── index.css
├── main.tsx   
index.html
LICENSE
package.json
package-lock.json
README.md
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.json 
````

## Project Creating Roadmap
1. Create Vite Project with React-ts template.
2. "dependencies": {
   "@reduxjs/toolkit": "^2.8.2",
   "@tailwindcss/vite": "^4.1.11,"
   "nodemon": "^3.1.10",
   "react": "^19.1.0",
   "react-dom": "^19.1.0",
   "react-redux": "^9.2.0",
   "react-router-dom": "^7.7.0",
   "remixicon": "^4.6.0",
   "tailwindcss": "^4.1.11"
   },
3. change main.tsx with redux

# Login
1. A Login Form (UI) - 
```src/features/auth/LoginPage.tsx```
2. Logic to authenticate users(API or local check)
```src/features/auth/authAPI.ts```
3. State management for authentication(API or local check)
```src/features/auth/authSlice.ts (Redux slice for auth)```
4. Redirects or UI changes after login