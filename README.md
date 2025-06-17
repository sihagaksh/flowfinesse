# FlowFinesse: Intelligent Group Expense Management with Next.js & Supabase

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-black?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-black.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**FlowFinesse** is a full-stack web application that transforms the **Cash Flow Minimizer** concept into a secure, scalable, and user-friendly platform. Built with **Next.js** and powered by **Supabase**, it offers effortless group expense management, real-time balance tracking, and automated debt settlement.
![image](https://github.com/user-attachments/assets/0c1ec888-3ff5-470b-9262-18f30b3fcabf)

---

## ✨ Key Features

-   **Seamless User Authentication**: Secure user sign-up, login, and session management powered by Supabase Auth.
-   **Robust Data Security**: Utilizes Supabase's Row-Level Security (RLS) to ensure users can only access their own data.
-   **Real-Time Expense Tracking**: Create, read, update, and delete expenses within groups, with balances updating instantly across all members.
-   **Group & Member Management**: Easily create shared expense groups and invite members.
-   **Optimized Debt Settlement**: The core algorithm minimizes the total number of transactions required to settle all debts within a group.
-   **Interactive Dashboard**: A clean UI built with Tailwind CSS provides a visual overview of personal and group finances.
  
![image](https://github.com/user-attachments/assets/e7db9684-f6ce-4992-9a71-781136605376)

---

## ⚙️ How the Settlement Algorithm Works

FlowFinesse employs a powerful algorithm to simplify and minimize cash flow between group members.

1.  **Calculate Net Balances**: The system first calculates the net financial position of each member. Members who have paid more than their share are "creditors," and those who have paid less are "debtors."
2.  **Model as a Graph Problem**: The members and their balances are modeled as nodes in a directed graph. The goal is to find the minimum number of transactions (edges) to bring all balances to zero.
3.  **Use Heaps for Efficiency**: To solve this efficiently, the algorithm uses two heaps:
    -   A **Max-Heap** for creditors (to quickly find the person owed the most).
    -   A **Min-Heap** for debtors (to quickly find the person who owes the most).
4.  **Apply a Greedy Strategy**:
    -   The algorithm takes the top members from both heaps (the largest creditor and the largest debtor).
    -   A transaction is created between them for an amount that is the minimum of their absolute balances.
    -   This process is repeated until all debts are cleared, guaranteeing the minimum number of payments.

---

## 💻 Technical Architecture

The application is built with a modern, serverless-first approach using Next.js and Supabase.

-   **Framework**: **Next.js** (App Router) for a hybrid of server-side rendering and static generation.
-   **Backend & Database**: **Supabase** serves as the complete backend, providing:
    -   A **PostgreSQL Database** for storing user, group, and expense data[6].
    -   **Supabase Auth** for handling all user authentication and management[3].
-   **UI & Styling**: **Tailwind CSS** for a utility-first, responsive, and modern design[1, 4].
-   **Deployment**: **Vercel** for seamless, continuous deployment of the Next.js frontend.

---

## 📜 License

Distributed under the MIT License. See `LICENSE.txt` for more information.
