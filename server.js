import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Memory storage for ephemeral container environment
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
});

// Structured skill taxonomy for ATS and career matching
const SKILL_TAXONOMY = {
  languages: [
    'python', 'javascript', 'typescript', 'java', 'sql', 'c++', 'c#', 'go', 'rust', 'html', 'css'
  ],
  frameworks: [
    'react', 'node', 'django', 'flask', 'express', 'next.js', 'vue', 'angular', 'spring', 'fastapi'
  ],
  toolsAndCloud: [
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'git', 'ci/cd', 'linux', 'rest api', 'graphql', 'postgresql', 'mongodb'
  ],
  dataAndAI: [
    'machine learning', 'data analysis', 'deep learning', 'nlp', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch'
  ],
  softSkills: [
    'communication', 'teamwork', 'problem solving', 'leadership', 'critical thinking', 'project management', 'collaboration', 'adaptability'
  ]
};

// Flattened list for quick boundary matching
const ALL_SKILLS = [
  ...SKILL_TAXONOMY.languages,
  ...SKILL_TAXONOMY.frameworks,
  ...SKILL_TAXONOMY.toolsAndCloud,
  ...SKILL_TAXONOMY.dataAndAI,
  ...SKILL_TAXONOMY.softSkills
];

// Curated sample resumes for immediate 1-click benchmarking
const SAMPLE_RESUMES = {
  'fullstack': {
    title: 'Senior Full-Stack Engineer',
    filename: 'Sample_Senior_FullStack_Resume.pdf',
    text: `Alex Morgan - Senior Full Stack Engineer
alex.morgan@example.com | San Francisco, CA | github.com/alexm

SUMMARY
Accomplished Full Stack Software Engineer with 6+ years of experience engineering high-throughput distributed web systems using React, TypeScript, Node, and Python. Proven track record optimizing REST API latency by 42% and managing AWS cloud infrastructure.

SKILLS
Languages: TypeScript, JavaScript, Python, SQL, HTML, CSS
Frameworks & Libraries: React, Node, Express, Next.js, Django
Cloud & DevOps: AWS, Docker, Kubernetes, Git, CI/CD, Linux, PostgreSQL
Professional Competencies: Problem solving, Teamwork, Leadership, Project management, Communication

PROFESSIONAL EXPERIENCE
Senior Software Engineer | CloudScale Systems (2021 - Present)
- Architected modular React and TypeScript frontends supporting 250k+ daily active users.
- Designed scalable REST API microservices with Node and Express, cutting p99 latency by 35%.
- Implemented automated CI/CD pipelines using Docker and AWS, accelerating deployment velocity by 4x.
- Mentored junior engineers, fostering engineering teamwork and technical documentation rigor.

Software Engineer | DevStream Labs (2018 - 2021)
- Developed enterprise analytics dashboards using Python, Flask, and PostgreSQL.
- Collaborated in cross-functional agile teams to deliver client-requested features on schedule.
- Conducted unit testing and code reviews through Git, decreasing bug escape rate by 28%.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley`
  },
  'data-scientist': {
    title: 'Data Scientist & ML Engineer',
    filename: 'Sample_Data_Scientist_Resume.pdf',
    text: `Dr. Elena Vance - Lead Data Scientist & Machine Learning Engineer
elena.vance@example.com | New York, NY | linkedin.com/in/elenavance

SUMMARY
Innovative Data Scientist with 5 years of experience deploying machine learning, data analysis, and predictive modeling pipelines. Expert in Python, SQL, NLP, and PyTorch with measurable ROI in customer retention and automated fraud detection.

SKILLS
Programming & Data: Python, SQL, Pandas, NumPy, Scikit-learn, PyTorch
Machine Learning & AI: Machine learning, Data analysis, Deep learning, NLP
Infrastructure & Backend: Docker, AWS, Git, FastAPI, Flask, PostgreSQL
Soft Skills: Critical thinking, Problem solving, Collaboration, Communication

EXPERIENCE
Lead Data Scientist | FinVanguard Group (2021 - Present)
- Deployed real-time fraud detection pipeline with machine learning models processing $12M daily transactions.
- Engineered NLP classification pipelines that automated 80% of customer ticket triage with 94% precision.
- Utilized Python, SQL, and AWS to build scalable data warehouses for predictive data analysis.
- Led collaborative workshops on statistical methodologies and machine learning reliability.

Data Analyst / ML Researcher | QuantAnalytics (2019 - 2021)
- Built automated reporting dashboards and predictive churn models in Python and Scikit-learn.
- Collaborated with engineering teams to deploy Flask inference endpoints inside Docker containers.

EDUCATION
Master of Science in Data Science | Columbia University`
  },
  'junior-dev': {
    title: 'Junior Software Developer',
    filename: 'Sample_Junior_Dev_Resume.pdf',
    text: `Jordan Lee - Junior Software Developer
jordan.lee@example.com | Austin, TX | github.com/jordanlee-dev

OBJECTIVE
Passionate Junior Software Developer seeking an entry-level engineering role to contribute solid foundational skills in Java, Python, and SQL while expanding full-stack capabilities.

TECHNICAL SKILLS
Languages: Java, Python, SQL, HTML, CSS
Familiar Concepts: Git, Linux, REST API
Soft Skills: Teamwork, Problem solving, Communication, Adaptability

PROJECTS
Task Tracker Application
- Created responsive web app using Python and Flask with a relational SQL database.
- Integrated REST API endpoints for user authentication and task CRUD operations.
- Version-controlled development lifecycle using Git.

Inventory Management System
- Built Java desktop tool for inventory auditing using object-oriented principles.

EDUCATION
B.S. in Software Engineering | University of Texas at Austin (Graduated 2024)`
  }
};

async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    if (data && data.text && data.text.trim().length > 0) {
      return data.text;
    }
  } catch (err) {
    console.warn('pdf-parse failed, using fallback stream extraction:', err.message);
  }

  // Fallback: extract text from raw PDF streams
  try {
    const raw = buffer.toString('latin1');
    const matches = raw.match(/\(([^)]+)\)\s*Tj/g) || [];
    const extracted = matches.map(m => m.replace(/^\(|\)\s*Tj$/g, '')).join(' ');
    if (extracted && extracted.length > 20) {
      return extracted;
    }

    return buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
  } catch (err) {
    console.error('Fallback extraction error:', err);
    return '';
  }
}

function analyzeResumeText(text, filename = 'Uploaded Resume') {
  const normalizedText = (text || '').toLowerCase();
  const words = normalizedText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const matchedSkills = [];
  const categorizedMatches = {
    languages: [],
    frameworks: [],
    toolsAndCloud: [],
    dataAndAI: [],
    softSkills: []
  };

  for (const category of Object.keys(SKILL_TAXONOMY)) {
    for (const skill of SKILL_TAXONOMY[category]) {
      const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(normalizedText)) {
        if (!matchedSkills.includes(skill)) {
          matchedSkills.push(skill);
        }
        categorizedMatches[category].push(skill);
      }
    }
  }

  // Action verbs check (ATS quality signal)
  const ACTION_VERBS = [
    'architected', 'developed', 'spearheaded', 'optimized', 'designed',
    'deployed', 'engineered', 'led', 'managed', 'streamlined', 'reduced',
    'increased', 'built', 'implemented', 'collaborated', 'delivered'
  ];
  const detectedVerbs = ACTION_VERBS.filter(verb => {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    return regex.test(normalizedText);
  });

  // Calculate nuanced diagnostic scores
  const skillCount = matchedSkills.length;
  const keywordDensityScore = Math.min(100, Math.round((skillCount / 12) * 100));
  const actionVerbScore = Math.min(100, Math.round((detectedVerbs.length / 5) * 100));
  
  // Length & structure check (ideal resume: 350 - 800 words)
  let lengthScore = 90;
  if (wordCount < 150) lengthScore = 40;
  else if (wordCount < 250) lengthScore = 65;
  else if (wordCount > 1000) lengthScore = 75;

  // Composite overall score
  const overallScore = Math.round(
    keywordDensityScore * 0.50 +
    actionVerbScore * 0.25 +
    lengthScore * 0.25
  );

  // Status classification
  let atsStatus = 'Needs Optimization';
  let statusTone = 'warning';
  if (overallScore >= 80) {
    atsStatus = 'Strong ATS Match';
    statusTone = 'success';
  } else if (overallScore >= 60) {
    atsStatus = 'Competitive Match';
    statusTone = 'neutral';
  }

  // Generate actionable, concrete advice
  const keyTips = [];
  if (detectedVerbs.length < 4) {
    keyTips.push('Strengthen bullet points with decisive action verbs (e.g., "Architected", "Optimized", "Engineered") instead of passive phrases.');
  }
  if (categorizedMatches.toolsAndCloud.length < 2) {
    keyTips.push('Add modern deployment and version control competencies (e.g., Git, Docker, CI/CD, or Cloud services) to stand out to technical screening filters.');
  }
  if (wordCount < 300) {
    keyTips.push('Your resume content appears brief. Aim for 400-600 words to ensure adequate space for quantified achievements.');
  } else if (wordCount > 900) {
    keyTips.push('Your resume is relatively long. Consider condensing bullet points to keep readability high for 6-second recruiter scans.');
  }
  if (categorizedMatches.softSkills.length === 0) {
    keyTips.push('Incorporate core teamwork and problem-solving examples into your project descriptions.');
  }
  if (keyTips.length === 0) {
    keyTips.push('Strong structural balance and keyword coverage detected. Ensure all measurable metrics (percentages, revenue, latency) are prominently highlighted.');
  }

  // Recommended skills from missing entries in key categories
  const recommendedSkills = [];
  const popularHighDemand = ['docker', 'git', 'aws', 'rest api', 'sql', 'typescript', 'react', 'python', 'ci/cd'];
  for (const skill of popularHighDemand) {
    if (!matchedSkills.includes(skill) && recommendedSkills.length < 6) {
      recommendedSkills.push(skill);
    }
  }

  // Summary copy
  let summary = `Parsed ${wordCount} words and identified ${matchedSkills.length} relevant competencies across technical, operational, and soft skill categories.`;

  return {
    filename,
    score: overallScore,
    atsStatus,
    statusTone,
    summary,
    wordCount,
    skills: matchedSkills,
    categorizedSkills: categorizedMatches,
    detectedVerbs,
    recommendations: recommendedSkills,
    metrics: {
      keywordDensity: keywordDensityScore,
      actionVerbImpact: actionVerbScore,
      structureScore: lengthScore,
      atsParsingReadability: Math.min(98, Math.max(70, Math.round(overallScore * 0.95 + 5)))
    },
    keyTips
  };
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'resume-analyser', uptime: process.uptime() });
});

app.get('/api/samples', (req, res) => {
  const sampleList = Object.keys(SAMPLE_RESUMES).map(key => ({
    id: key,
    title: SAMPLE_RESUMES[key].title,
    filename: SAMPLE_RESUMES[key].filename
  }));
  res.json(sampleList);
});

app.post('/api/analyze-sample', (req, res) => {
  const { sampleId } = req.body;
  const sample = SAMPLE_RESUMES[sampleId] || SAMPLE_RESUMES['fullstack'];
  const result = analyzeResumeText(sample.text, sample.filename);
  res.json(result);
});

app.post('/analyze', upload.single('resume'), async (req, res) => {
  // Check if file was provided
  if (!req.file) {
    return res.status(400).json({ error: 'No resume file uploaded' });
  }

  const originalname = req.file.originalname || 'resume.pdf';
  if (!originalname.toLowerCase().endsWith('.pdf') && req.file.mimetype !== 'application/pdf') {
    return res.status(400).json({ error: 'Only PDF documents are supported for ATS analysis.' });
  }

  try {
    const extractedText = await extractTextFromPDF(req.file.buffer);
    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(422).json({
        error: 'Unable to extract legible text from this PDF. It may be a scanned image or protected document. Please upload a standard text-based PDF.'
      });
    }

    const result = analyzeResumeText(extractedText, originalname);
    return res.json(result);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return res.status(500).json({ error: error.message || 'Error processing resume document' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Resume Analyser running on http://0.0.0.0:${port}`);
});
