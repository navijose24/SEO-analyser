# 🔍 SEO Analyzer (Full-Stack App)

SEO Analyzer is a full-stack web app that visually and interactively evaluates the SEO meta tags and technical details of any public webpage. Instantly check for best practices, missing tags, and technical health in a fun, comic-style 2D interface.

---

## 🚀 Features

- Analyze **Title**, **Meta Description**, **Canonical**, **Robots**, and **Open Graph** tags
- Visual, color-coded feedback for each tag (comic/2D style)
- Displays Open Graph images and technical details (response time, page size, images/links found, HTTP status, SSL validity)
- Overall SEO score out of 100
- Black & white 2D comic UI with Comic Sans font
- Fast, interactive, and easy to use

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **HTML Parsing:** Cheerio
- **HTTP Requests:** Axios
- **SSL Checking:** ssl-checker

---

## ⚡ Setup & Usage

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd SEO-analyser
   ```
2. **Install dependencies:**
   ```bash
   # In the root directory
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. **Start the backend:**
   ```bash
   cd ../backend
   node index.js
   # or for auto-reload: npx nodemon index.js
   ```
4. **Start the frontend:**
   ```bash
   cd ../frontend
   npm run dev
   ```
5. **Open your browser:**
   Go to the address shown in the terminal 

---


## 📄 License
MIT

---

## 🙏 Credits
- [Express](https://expressjs.com/)
- [React](https://react.dev/)
- [Cheerio](https://cheerio.js.org/)
- [ssl-checker](https://www.npmjs.com/package/ssl-checker)

---


