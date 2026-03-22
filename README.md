# 🇮🇳 Bharat-Insight Analytics Platform

Bharat-Insight is a high-performance, multi-tenant public data analytics platform built to make exploring massive Indian government datasets (data.gov.in) fast, elegant, and intelligent. 

It features an integrated AI assistant capable of answering contextual questions about the exact data you are viewing, all within a buttery-smooth Next.js 16 application.

![Bharat-Insight Dashboard Preview](public/landing_preview.png) *(Note: Add a screenshot of your dashboard here if you have one!)*

---

## 🌟 Key Features

*   **⚡ 100k+ Record Grid:** Explore huge datasets with zero paginated loading screens, fully virtualized using TanStack Virtual.
*   **✨ Context-Aware AI Insights:** An integrated AI side-panel that streams intelligent, markdown-formatted answers about the specific data currently filtered in your grid.
*   **🏛 Multi-Ministry Toggling:** Seamlessly switch between different datasets (Ministry of Health, Agriculture, Finance) with dynamic color themes.
*   **🔒 Role-Based Access Control (RBAC):** Supabase-powered authentication with Admin and Viewer toggle capabilities.
*   **⌨️ Command Palette:** Press `Cmd+K` anywhere to quickly navigate, toggle your AI panel, switch ministries, or manage your role.
*   **🎨 Premium UI:** Custom-built with modular vanilla CSS featuring glassmorphism, smooth micro-animations, and responsive design.

---

## 🛠️ Tech Stack

*   **Core:** [Next.js 16](https://nextjs.org/) (App Router), React 19
*   **Styling:** CSS Modules with dynamic CSS variables
*   **Virtualization:** [TanStack Virtual](https://tanstack.com/virtual/latest)
*   **AI Engine:** OpenAI Node SDK (Streaming Responses)
*   **Authentication:** [Supabase](https://supabase.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Typography:** Geist Sans & Geist Mono

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/namyaJ/bharat-insigh.git
cd bharat-insigh
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and add your keys:
```env
# AI Service API Key (Server-side only)
AI_SERVICE_KEY=your_openai_or_groq_api_key

# Supabase Authentication (Publicly safe)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the vibrant landing page!

---

## 🌐 Deployment

This project is optimized for deployment on **Vercel**.
1. Import your GitHub repository into your Vercel Dashboard.
2. In the Vercel project settings, go to **Environment Variables** and securely paste your 3 keys from `.env.local`.
3. Click Deploy! 

*(This project uses Next.js server-side API routes to ensure your `AI_SERVICE_KEY` is completely hidden and secure from the client browser).*

---

## 👤 About the Developer / Project

> **👇 FILL THIS SECTION OUT 👇**  
> *Tell visitors who you are, what hackathon this is for (if applicable), and what inspired you to build it!*

*   **Developer:** [Your Name / Namya]
*   **Purpose:** Built for [Name of Hackathon / Personal Portfolio / Final Year Project] to solve the problem of [briefly explain why you decided to make this].
*   **Challenges Overcome:** [Write 1-2 sentences about a tough technical challenge you solved, e.g., "Implementing smooth infinite scrolling for 100,000 JSON records" or "Syncing the AI prompt seamlessly with the active grid filters."]
*   **Future Scope:** [What features do you want to add next? E.g., Exporting reports to PDF, adding live API connections to data.gov.in...]

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
