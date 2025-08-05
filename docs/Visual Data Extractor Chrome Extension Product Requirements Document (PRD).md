# **Visual Data Extractor Chrome Extension Product Requirements Document (PRD)**

| Date | Version | Description | Author |
| :---- | :---- | :---- | :---- |
| August 3, 2025 | 1.2 | Added local storage for schema/webhook persistence in MVP. | John, Product Manager |

## **1\. Goals and Background Context**

### **Goals**

* **For Users:** To provide a fast, intuitive, and code-free way to extract structured data, including text and images, from any webpage and send it directly into their workflow via webhooks.  
* **For the Project:** To build a high-quality, functional application that serves as a key portfolio piece, validates a market need, and creates a technical foundation for a potential future commercial product.

### **Background Context**

Currently, non-technical users lack a simple tool for targeted, on-demand data extraction. They are forced to either use complex, bulk-scraping platforms that are overkill for their needs or resort to manual, error-prone copy-pasting. This is especially true when they have already found and filtered the exact data they need on a single page.

This project aims to fill that gap by providing an intelligent Chrome extension. It will allow users to define the data they want using natural language, extract it from the page, and send it to a webhook. This empowers users to create their own simple data pipelines without technical expertise, saving time and improving data quality.

## **2\. Requirements**

### **Functional Requirements**

1. **FR1: Schema Definition:** The user must be able to dynamically define a data schema by adding one or more named fields within the Chrome extension's UI. This will be used as the schema parameter for the API call.  
2. **FR2: Natural Language Prompt:** The user must be able to input a natural language text prompt to describe the data to be extracted and any filtering conditions. This will be used as the prompt parameter.  
3. **FR3: Webhook Configuration:** The user must be able to provide a destination webhook URL.  
4. **FR4: Extraction Execution:** The user must be able to trigger the data extraction process from the extension's UI.  
5. **FR5: Backend API Integration:** The extension must send the current page's URL, the user-defined schema, and the natural language prompt to a secure backend service.  
6. **FR6: Initiate Extraction Job:** The backend service must initiate an asynchronous extraction job by calling the Firecrawl.dev /v1/extract endpoint with the provided information. The service must securely store the returned Job ID.  
7. **FR7: Monitor Job Status:** The backend service must poll the Firecrawl.dev /v1/extract/{job\_id} endpoint to check the status of the extraction job until it is completed or failed.  
8. **FR8: Webhook Data Transmission:** Upon successful job completion (status: "completed"), the backend service must retrieve the final structured data and send it to the user's specified webhook URL.  
9. **FR9: Data Type Extraction:** The system must be capable of extracting both text content and image URLs/data as specified by the user's prompt.  
10. **FR10: Local Configuration Persistence:** After a successful extraction, the extension must automatically save the user's schema, prompt, and webhook URL to the browser's local storage (chrome.storage.local).  
11. **FR11: Pre-populate from Local Storage:** When the extension is opened, it must check for a saved configuration in local storage. If one exists, the schema, prompt, and webhook URL fields must be pre-populated with the saved values.

### **Non-Functional Requirements**

1. **NFR1: Performance:** The end-to-end extraction process (from user trigger to webhook delivery) should complete in under 20 seconds for a typical webpage. The backend must efficiently handle the polling process without excessive delay.  
2. **NFR2: Usability:** The extension's interface must be intuitive, allowing a first-time user to perform an extraction without needing a tutorial.  
3. **NFR3: Security:** All data in transit must be encrypted (HTTPS). No user data (webhook URLs, extracted content) should be stored permanently by the service after the job is complete. API keys for Firecrawl.dev must be stored securely on the backend, never exposed to the client.  
4. **NFR4: Cost-Effectiveness:** The backend infrastructure should be designed to leverage free or low-cost service tiers to minimize operational expenses for this portfolio project.  
5. **NFR5: Error Handling:** The system must gracefully handle errors. This includes:  
   * An invalid webhook URL provided by the user.  
   * A failed or cancelled status from the Firecrawl.dev job status endpoint.  
   * Network errors or timeouts during the process.  
   * (MVP) Simple feedback should be provided to the user in the extension UI if an error occurs.

## **3\. User Interface Design Goals**

### **Overall UX Vision**

The user experience should be clean, fast, and focused. The UI should appear as a simple pop-up or side panel that feels like a natural extension of the browser, not a heavy application. The core principle is "get in, get data, get out."

### **Key Interaction Paradigms**

* **Single-Purpose Interface:** The UI will be dedicated to a single task: defining and executing one extraction job at a time.  
* **Configuration Persistence:** The extension will remember the last used schema, prompt, and webhook, pre-filling these fields to streamline recurring use cases.  
* **Progressive Disclosure:** The interface will be simple by default, perhaps only showing the natural language prompt area. The schema builder might be an optional, advanced view for users who want more control.  
* **Real-time Feedback:** The UI should provide immediate feedback when the extraction job is initiated (e.g., a "processing" indicator) and a clear success or failure message upon completion.

### **Core Screens and Views (Conceptual)**

For the MVP, the entire user interface can be contained within a single view or pop-up with three main sections:

1. **Input Section:** Contains the natural language prompt area and the schema builder.  
2. **Configuration Section:** Contains the input field for the webhook URL.  
3. **Action Section:** Contains the "Extract Data" button and a status display area for feedback.

### **Branding**

The branding should be minimal, modern, and professional. The focus should be on clarity and usability rather than a distinct visual identity. A simple logo and a clean color palette will suffice for the MVP.

## **4\. Technical Assumptions**

### **Repository Structure: Monorepo**

To simplify development and dependency management between the Chrome extension frontend and the backend service, a monorepo structure is recommended. This will allow for shared code (e.g., types, validation logic) and a unified build process.

### **Service Architecture: Serverless**

To align with the non-functional requirement for cost-effectiveness (NFR4), a serverless architecture is strongly recommended. The backend will consist of serverless functions (e.g., AWS Lambda, Vercel Functions) to handle API requests, interact with the Firecrawl API, and manage the asynchronous polling logic. This approach minimizes idle costs and scales automatically with usage.

### **Testing Requirements: Unit \+ Integration**

The project should include both unit tests for individual components and functions, as well as integration tests to validate the connection between the frontend, backend, and the Firecrawl API. This ensures a high-quality, reliable application suitable for a professional portfolio.

### **Additional Technical Assumptions**

* **Frontend:** A modern JavaScript framework like React or Svelte will be used to build the extension's UI.  
* **Backend:** A modern runtime like Node.js (with TypeScript) or Python will be used for the serverless functions.  
* **API:** The backend will expose a simple, secure REST or RPC API for the Chrome extension to communicate with.  
* **Third-Party API:** The system is critically dependent on the Firecrawl.dev /extract API. The architecture must be designed around its asynchronous, job-based nature.

## **5\. Epic List**

For the MVP, all work will be contained within a single epic focused on delivering the core functionality.

* **Epic 1: MVP Core Functionality:** Establish the project foundation, build the core UI for defining and triggering extractions, implement the backend service to manage the asynchronous job with Firecrawl, and deliver the final data to a user's webhook.

## **6\. Epic 1: MVP Core Functionality**

### **Story 1.1: Foundational Project Setup**

As a developer, I want a complete monorepo setup for the Chrome extension and backend service, so that I have a functional development environment to build upon.  
Acceptance Criteria:

1. A monorepo is initialized with a package manager (e.g., npm workspaces, pnpm).  
2. A basic Chrome extension project is created with a manifest file and a placeholder UI.  
3. A basic serverless function project is created for the backend API.  
4. The developer can run the frontend and backend services locally.

### **Story 1.2: Backend Extraction Endpoint Stub**

As a developer, I want a backend API endpoint that accepts extraction requests from the Chrome extension, so that the frontend has a target to communicate with.  
Acceptance Criteria:

1. A serverless function is created that accepts a POST request with a URL, schema, and prompt.  
2. The endpoint validates the incoming request payload.  
3. The endpoint returns a mock Job ID and a 202 Accepted status code.  
4. The endpoint is deployed and accessible via a secure URL.

### **Story 1.3: Core UI Implementation**

As a user, I want to define my data schema, write a prompt, configure a webhook, and trigger an extraction, so that I can submit a data extraction job.  
Acceptance Criteria:

1. The UI allows me to add and name fields for a data schema.  
2. The UI provides a text area for my natural language prompt.  
3. The UI has an input field for my webhook URL.  
4. Clicking the "Extract Data" button sends the page URL, schema, prompt, and webhook to the backend API.  
5. The UI displays a "Processing..." status message after submitting the job.

### **Story 1.4: Full Backend Extraction and Webhook Logic**

As a user, I want the system to process my extraction request and send the final data to my webhook, so that I can receive the structured information I asked for.  
Acceptance Criteria:

1. The backend service, upon receiving a request, calls the Firecrawl /extract API.  
2. The service correctly stores the returned Job ID.  
3. The service implements a polling mechanism to check the job status.  
4. When the job status is "completed," the service sends the data payload to the user's webhook URL.  
5. If the job status is "failed," the service logs the error (no user-facing feedback for MVP).

### **Story 1.5: Local Configuration Persistence**

As a user, I want the extension to remember my last configuration, so that I don't have to re-enter it every time.  
Acceptance Criteria:

1. After a successful extraction, the schema, prompt, and webhook URL are saved to chrome.storage.local.  
2. When the extension is next opened, the UI fields are pre-populated with the saved data.  
3. The user can modify the pre-populated data before running a new extraction.