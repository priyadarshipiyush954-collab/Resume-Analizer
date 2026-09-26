# 💼 Resume Analyser & ATS Diagnostic Engine

An intelligent Applicant Tracking System (ATS) resume diagnostic platform. Evaluates PDF resumes against modern hiring filters, measures technical keyword density, grades outcome-oriented action verbs, and identifies skill gaps with 100% ephemeral in-memory privacy.

---

## ✨ Features

- 📄 **Direct PDF Parsing**: In-memory text stream extraction from text-based PDF documents without writing files to disk.
- 🎯 **ATS Compatibility Scoring**: Composite rating based on keyword density, action verb strength, document length, and parsing hygiene.
- 🔍 **Categorized Skill Taxonomy**:
  - **Languages & Core Tech**: TypeScript, Python, JavaScript, Java, SQL, Go, Rust, HTML, CSS.
  - **Frameworks & Libraries**: React, Node.js, Next.js, Express, Django, Flask, FastAPI, Angular, Vue.
  - **Cloud, DevOps & Databases**: AWS, Docker, Kubernetes, Git, CI/CD, Linux, PostgreSQL, MongoDB, REST API.
  - **Data Science & AI**: Machine Learning, NLP, Pandas, NumPy, Scikit-learn, PyTorch, Deep Learning.
  - **Professional & Soft Skills**: Problem Solving, Teamwork, Leadership, Project Management, Collaboration.
- ⚡ **Action Verb Impact Analysis**: Identifies outcome-driven verbs (*Architected*, *Spearheaded*, *Optimized*, *Streamlined*) versus passive duty descriptions.
- 📊 **Targeted Missing Skill Recommendations**: Suggests high-demand industry skills relevant to your target engineering and data roles.
- 🚀 **1-Click Benchmark Profiles**: Built-in sample profiles for Senior Full-Stack Engineer, Data Scientist, and Junior Developer for instant testing without requiring an immediate file upload.
- 📖 **Interactive Editorial Writing Guides**: Practical frameworks including the Google XYZ achievement formula and ATS-safe formatting standards.
- 🔒 **Zero-Retention Privacy Guarantee**: Ephemeral RAM buffer processing. No resumes are ever stored, indexed, or saved to persistent disk.

---

## 🛠️ Architecture & Tech Stack

- **Runtime**: Node.js 22 (LTS)
- **Server Framework**: Express.js
- **File Handling**: Multer (`memoryStorage`)
- **PDF Extraction**: `pdf-parse` with fallback stream operator extraction
- **Frontend**: Clean semantic HTML5, modern CSS3 design system (`Plus Jakarta Sans` typography, hairline borders, responsive layout), vanilla JavaScript ES6+
- **Security & Privacy**: Ephemeral buffer pipeline, no third-party telemetry, sanitized output

---

## 📁 Repository Structure

```
.
├── .env.example            # Environment configuration template
├── metadata.json           # Applet manifest and capabilities
├── package.json            # Dependencies and npm scripts
├── public/                 # Static web assets
│   ├── index.html          # Semantic HTML5 layout and interactive workbench
│   └── style.css           # Modern design system and responsive grid styles
├── server.js               # Express application, ATS evaluation engine, API routes
└── README.md               # Technical documentation
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** 20+ or 22+
- **npm** (included with Node.js)

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Running Locally
Start the development server:
```bash
npm run dev
```

The application will be live at `http://localhost:3000`.

---

## 🔌 API Reference

### 1. `POST /analyze`
Accepts a multipart file upload (`resume`) in PDF format.

- **Request**: `multipart/form-data` with field `resume: [PDF binary]` (max 5MB)
- **Response**: `application/json`
```json
{
  "filename": "Alex_Morgan_Resume.pdf",
  "score": 86,
  "atsStatus": "Strong ATS Match",
  "statusTone": "success",
  "wordCount": 420,
  "skills": ["python", "react", "typescript", "node", "sql", "docker", "aws"],
  "categorizedSkills": {
    "languages": ["python", "typescript", "sql"],
    "frameworks": ["react", "node"],
    "toolsAndCloud": ["docker", "aws"],
    "dataAndAI": [],
    "softSkills": ["leadership", "problem solving"]
  },
  "detectedVerbs": ["architected", "optimized", "implemented"],
  "recommendations": ["git", "rest api", "ci/cd"],
  "metrics": {
    "keywordDensity": 82,
    "actionVerbImpact": 75,
    "structureScore": 90,
    "atsParsingReadability": 87
  },
  "keyTips": [
    "Strong structural balance and keyword coverage detected.",
    "Add metric-driven bullet points using XYZ formula."
  ]
}
```

### 2. `POST /api/analyze-sample`
Run immediate benchmark evaluation on built-in test resumes.

- **Request**: `application/json`
```json
{ "sampleId": "fullstack" }
```
*(Supported `sampleId` values: `"fullstack"`, `"data-scientist"`, `"junior-dev"`)*

### 3. `GET /api/samples`
Returns the list of available test benchmark profiles.

### 4. `GET /api/health`
Service health check and uptime monitor.

---

## 🧮 Scoring & Evaluation Methodology

The ATS score (0–100) is derived from three core dimensions:

1. **Keyword Density (50% Weight)**: Evaluates presence and breadth of modern industry-standard languages, frameworks, cloud tooling, and soft skills using whole-word boundary matching.
2. **Action-Verb Impact (25% Weight)**: Quantifies the presence of high-impact leadership and execution verbs that correlate with hiring manager engagement.
3. **Structure & Length (25% Weight)**: Scores resume word count against the optimal 400–750 word target range to avoid sparse or over-diluted resumes.

---

## 📄 License
MIT License. Open-source and free to deploy.
