# 📝 Resume Builder App

A full-stack Resume Builder web application that allows users to input their personal and professional information, preview a generated resume (with image upload), and store the data in a MongoDB database via a FastAPI backend.

## ✨ Features

- Create a custom resume with sections for:
  - Personal Information
  - Summary
  - Skills
  - Work Experience
  - Education
  - Volunteer Experience
  - Certifications
- Upload a professional image for the resume
- Live preview before saving
- Download resume as printable format
- Resume data and image stored in MongoDB

## 🧰 Technologies Used

### 🔹 Frontend

- React + TailwindCSS
- Lucide Icons
- HTML5 File Upload + Image Preview

### 🔹 Backend

- FastAPI
- Motor (Async MongoDB driver)
- Pydantic for schema validation
- MongoDB Atlas / local MongoDB

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js (v14 or higher)
- Python 3.10+
- MongoDB (cloud or local)

### 🔧 Backend Setup (FastAPI)

1. **Clone the repo:**

   ```bash
   git clone https://github.com/your-username/resume-builder.git
   cd resume-builder/backend

2. Create a virtual environment:

    ```bash
    python -m venv venv
    source venv/bin/activate  # or venv\Scripts\activate on Windows

3. Install dependencies:

   ```bash
   pip install -r requirements.txt

4. Create .env file:

   ```bash
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/db_name
    DEBUG=true

5. Run the server:

    ```bash
    uvicorn main:app --reload

6. API Endpoint:

    ```bash
    POST http://localhost:8000/resume

### 🖼️ Frontend Setup (React)

1. Navigate to frontend directory:

    ``` bash
    cd ../frontend

2. Install dependencies:

    ``` bash
    npm install

3. Start the development server:

    ``` bash
    npm run dev
    Visit: http://localhost:5173

