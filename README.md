# Tech Smart Hire – Frontend

A modern frontend application built with **Next.js 16**, **React 19**, and **Tailwind CSS 4**. This project uses **Shadcn/UI** for components and **Axios** for API integration.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4, Tailwind Merge, CLSX
- **UI Components:** Shadcn/UI (@radix-ui primitives)
- **Icons:** Lucide React, Iconify
- **Forms:** React Hook Form + Zod validation
- **API Client:** Axios
- **State/Cookies:** cookies-next

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd techsmarthire-frontend-nextjs
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory by copying the example (if available) or adding the required variables:

    ```bash
    NEXT_PUBLIC_API_URL=http://your-api-url.com/api
    ```

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## 📂 Project Structure

```
.
├── api/              # API configuration and services (Axios client)
├── app/              # Next.js App Router pages and layouts
├── assets/           # Static assets (images, fonts, etc.)
├── components/       # Reusable UI components (Shadcn/UI, etc.)
├── lib/              # Utility functions and libraries
├── public/           # Public static files
├── package.json      # Project dependencies and scripts
└── ...
```

## 🎨 UI & Styling

This project uses **Tailwind CSS 4** for styling.
Components are built using **Shadcn/UI**, which provides accessible and customizable components based on Radix UI.

## ✨ Key Features

The application serves three distinct user roles: **Candidates**, **Recruiters**, and **Admins**.

### 👨‍💻 Candidate Module

- **Assessments Engine:**
  - View list of assessments with details (Image, Skill, Duration, Difficulty).
  - Search and filter assessments by skill or name.
  - Detailed assessment pages with syllabi, video descriptions, and "Need Help" options.
  - Secure assessment environment with integrity checks and code of conduct acknowledgment.
- **Job Board:**
  - View job listings prioritized by location.
  - Smart job recommendations based on completed assessment scores.
  - Advanced search/filter by Name, Skills, Location, and Job Type.
  - Apply for jobs directly (requires assessment completion for mandatory skills).
- **Dashboard:**
  - Track taken assessments and scores.
  - Download certificates.
  - View applied jobs and their status.
- **Profile Management:** Edit profile details and manage account privacy.

### 🏢 Recruiter Module

- **Job Management:**
  - Create detailed job postings (Role, Salary, Skills, Employment type, etc.).
  - Manage job proposals and candidate applications.
  - "Handshake" feature to confirm candidate selection (deducts credits).
  - Boost job listings (Planned).
- **Talent Pool:**
  - Search accessible candidate database.
  - Filter by skills, score range, and experience.
  - Send interest requests and invite candidates to assessments.
- **Assessment Creation:**
  - Create custom assessments or use team-built templates.
  - Define skills, job descriptions, and custom instructions.
