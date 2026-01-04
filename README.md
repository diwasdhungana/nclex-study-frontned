# nclexstudy Nursing Student Platform

## Overview

nclexstudy is a comprehensive web application designed for nursing students and administrators. It provides a robust platform for creating, managing, and attempting a variety of nursing test types, including advanced question formats and the unique Archer test mode. The application supports dynamic test creation, user management, and detailed performance tracking.

---

## Features

### For Admins

- **Add Questions:**
  - Support for multiple question types: Select One, Select All That Apply (SATA), Extended Dropdown, Grid and Matrix, Highlight, Drag and Drop, Bowtie, Fill in the Blank.
  - Organize questions by Subject and System.
  - Add questions to two test types: Normal Tests and Archer Tests.
  - Choose between Traditional and Next Gen question generations.
- **User Management:**
  - Enable or disable Archer feature for individual users.
  - View, edit, and remove users.
- **Test & Set Management:**
  - Create and manage question sets.
  - Group questions for targeted assessments.
- **Metrics & Analytics:**
  - Dashboard with metric cards and charts for monitoring student and test performance.

### For Students

- **Dynamic Test Creation:**
  - Create custom tests by selecting subjects, systems, question generations (Traditional/Next Gen), and question modes (Used/Unused).
  - Specify the number of questions (5-300).
- **Test Attempting:**
  - Attempt Normal and Archer tests (if enabled by admin).
  - Access active tests and view results.
- **Results & Progress:**
  - View detailed results and track progress over time.

### Common Features

- **Authentication & Role-Based Access:**
  - Secure login and role-based routing (admin, student, guest, archer).
- **Modern UI Components:**
  - Responsive design with reusable components for forms, tables, navigation, and metrics.
- **Accessibility & Feedback:**
  - Loading screens, error handling, and user feedback for all actions.
- **Settings:**
  - Update account details, toggle color scheme, and manage preferences.

---

## User Journey

### Admin

1. **Login:** Access the admin dashboard after authentication.
2. **Add Questions:** Navigate to add questions, select test type (Normal/Archer), question generation (Traditional/Next Gen), and question type. Organize by subject and system.
3. **User Management:** Enable/disable Archer feature for users, manage user accounts.
4. **Manage Sets & Groups:** Create and organize question sets and groups.
5. **View Metrics:** Monitor student performance and test analytics.
6. **Logout:** Securely log out of the platform.

### Student

1. **Login:** Access the student dashboard after authentication.
2. **Create Test:** Use dynamic test creation to select subjects, systems, question types, and number of questions.
3. **Attempt Tests:** Take available Normal or Archer tests (if enabled).
4. **View Results:** Review test results and track progress.
5. **Logout:** Securely log out of the platform.

---

## Question Types Supported

- Select One
- Select All That Apply (SATA)
- Extended Dropdown
- Grid and Matrix
- Highlight
- Drag and Drop
- Bowtie
- Fill in the Blank

---

## Tech Stack & Structure

- **Frontend:** React (TypeScript), Mantine UI, Vite
- **State Management:** React Context, custom hooks
- **Routing:** React Router with role-based guards
- **API:** Axios-based API layer
- **Testing:** Vitest
- **Project Structure:**
  - `components/` – Reusable UI components
  - `pages/` – Route-based pages for admin and student
  - `guards/` – Role-based access control
  - `hooks/` – Custom hooks for data and auth
  - `enum/` – Enums for question types, etc.
  - `utilities/` – Helper functions
  - `store/` – State management

---

## Getting Started

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Build for production: `npm run build`

---

## License

[MIT](LICENSE)
