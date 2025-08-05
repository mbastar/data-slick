# **Fullstack Architecture Document: Visual Data Extractor**

| Date | Version | Description | Author |
| :---- | :---- | :---- | :---- |
| August 3, 2025 | 1.4 | Added Project Structure. | Winston, Architect |

## **1\. Introduction**

This document outlines the complete fullstack architecture for the Visual Data Extractor, including the frontend Chrome extension and the backend serverless functions. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack. This unified approach combines backend and frontend architecture to streamline the development process for this modern, integrated application.

## **2\. High-Level Architecture**

### **2.1 Technical Summary**

The system will be a fullstack application composed of a frontend Chrome extension and a backend API built with serverless functions. The architecture is designed to be cost-effective, scalable, and maintainable. The frontend will handle all user interactions for defining data schemas and triggering extractions. The backend will manage the core logic of communicating with the third-party Firecrawl.dev API, handling the asynchronous job polling, and securely delivering the final data payload to the user's specified webhook.

### **2.2 Platform and Infrastructure Choice**

Based on the PRD's requirements for a serverless, cost-effective, and modern stack, the recommended platform is **Vercel**.

* **Rationale:** Vercel provides a seamless, all-in-one platform for deploying frontend applications (built with frameworks like React/Next.js) and their associated serverless backend functions. It offers a generous free tier, automatic scaling, and a world-class developer experience that is ideal for a portfolio project with potential for future growth.

### **2.3 Repository Structure**

As recommended in the PRD, the project will be structured as a **monorepo**.

* **Rationale:** This approach simplifies development by keeping the frontend extension and backend API code in a single repository. It facilitates code sharing (e.g., for data types and validation) and allows for a unified build and deployment process. We will use a modern tool like **pnpm workspaces** or **Turborepo** to manage the monorepo.

### **2.4 High-Level Architecture Diagram**

The following diagram illustrates the primary components and data flow for a single extraction job.

graph TD  
    subgraph User's Browser  
        A\[Chrome Extension UI\]  
    end

    subgraph Vercel Platform  
        B\[Backend API \<br\>(Serverless Function)\]  
    end

    subgraph Third-Party Services  
        C\[Firecrawl.dev API\]  
        D\[User's Webhook Destination\]  
    end

    A \-- "1. POST /api/extract \<br\>(URL, Schema, Prompt, Webhook)" \--\> B  
    B \-- "2. Start Extraction Job" \--\> C  
    C \-- "3. Return Job ID" \--\> B  
    B \-- "4. Poll Job Status" \--\> C  
    C \-- "5. Return 'Completed' \+ Data" \--\> B  
    B \-- "6. POST Data Payload" \--\> D

    style A fill:\#cce5ff,stroke:\#333,stroke-width:2px  
    style B fill:\#d5e8d4,stroke:\#333,stroke-width:2px  
    style C fill:\#fff2cc,stroke:\#333,stroke-width:2px  
    style D fill:\#fff2cc,stroke:\#333,stroke-width:2px

## **3\. Tech Stack**

This section defines the definitive technology choices for the project. All development must adhere to this stack to ensure consistency and compatibility.

| Category | Technology | Version | Rationale |
| :---- | :---- | :---- | :---- |
| **Monorepo Tool** | pnpm | 8.x | Efficient, fast, and excellent support for workspaces. |
| **Frontend Language** | TypeScript | 5.x | Provides type safety, improving code quality and maintainability. |
| **Frontend Framework** | React | 18.x | Industry standard for building dynamic UIs, ideal for Chrome extensions. |
| **UI Component Library** | Shadcn/UI | Latest | A modern, accessible, and highly composable component library. |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS framework for rapid, consistent styling. |
| **Backend Language** | Python | 3.9 | Excellent data handling libraries and direct compatibility with the Firecrawl SDK. |
| **API Framework** | Standard Python Serverless | N/A | Vercel's native support for Python serverless functions is simple and effective. |
| **Frontend Testing** | Vitest | Latest | A modern, fast, and simple testing framework, compatible with Vite. |
| **Backend Testing** | pytest | Latest | The industry standard for testing in Python, powerful and flexible. |
| **Third-Party Service** | Firecrawl.dev API | v1 | Core service for all AI-powered data extraction, specifically using the /extract endpoint. |

## **4\. API Specification & Data Models**

### **4.1 API Endpoint**

The backend will expose a single, primary endpoint to handle all extraction requests.

* **Endpoint:** POST /api/extract  
* **Description:** Initiates an asynchronous data extraction job.  
* **Authentication:** None for the MVP (can be secured later if needed).

### **4.2 Data Models (as TypeScript Interfaces)**

These TypeScript interfaces define the shape of the JSON objects exchanged between the frontend and backend.

#### **ExtractRequest (Frontend to Backend)**

This is the payload the Chrome extension sends to the backend.

interface ExtractRequest {  
  pageUrl: string;  
  webhookUrl: string;  
  schema: Record\<string, any\>; // JSON schema defined by the user  
  prompt: string;  
}

#### **ExtractResponse (Backend to Frontend)**

This is the immediate response the backend sends after successfully starting the Firecrawl job.

interface ExtractResponse {  
  jobId: string;  
}

#### **WebhookPayload (Backend to User's Webhook)**

This is the payload the backend sends to the user's destination webhook upon successful completion.

interface WebhookPayload {  
  success: boolean;  
  sourceUrl: string;  
  data: Record\<string, any\> | null; // The structured data from Firecrawl  
  error?: string; // Included if success is false  
  jobId: string;  
}

## **5\. Project Structure**

The project will be organized as a pnpm monorepo with two primary applications (apps) and a shared packages directory.

/  
├── apps/  
│   ├── extension/      \# React Chrome Extension Frontend  
│   │   ├── public/  
│   │   │   ├── manifest.json  
│   │   │   └── icons/  
│   │   ├── src/  
│   │   │   ├── components/ \# Reusable UI components  
│   │   │   ├── hooks/      \# Custom React hooks  
│   │   │   ├── services/   \# API client service  
│   │   │   ├── App.tsx     \# Main extension component  
│   │   │   └── index.tsx   \# Entry point  
│   │   ├── package.json  
│   │   └── tsconfig.json  
│   └── api/            \# Python Serverless Backend (Vercel)  
│       ├── extract.py  \# The serverless function for POST /api/extract  
│       └── requirements.txt  
│  
├── packages/  
│   └── types/          \# Shared TypeScript types  
│       ├── src/  
│       │   └── index.ts  \# Exporting ExtractRequest, ExtractResponse, etc.  
│       └── package.json  
│  
├── .gitignore  
├── package.json        \# Root package.json for pnpm workspaces  
└── pnpm-workspace.yaml  