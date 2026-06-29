# 🎓 UNT Degree Audit — Student Portal Concept

> A student-built proposal for the University of North Texas (Denton)
> to modernize the degree audit experience for 46,000+ students.

---

## 💡 The Problem

Every UNT student has to dig through menus in MyUNT just to check
their degree progress. DegreeWorks is functional but reads like a
tax form — dense, confusing, and discouraging.

**Students shouldn't have to decode their own graduation status.**

---

## ✨ The Solution

A **Degree Audit tile** added directly to the MyUNT Student Homepage
— showing live completion progress the moment students open the portal.

One click opens a full AI-powered audit card that answers every
question a student has about their degree.

---

## 🚀 Features

### 📊 Player Card Dashboard
- Visual degree completion ring showing 99% complete
- Credits earned vs. in progress vs. required at a glance
- GPA tracker by academic year with color-coded bar chart
- Transfer credits broken down by institution

### 🤖 AI Degree Advisor
- Powered by Claude AI (Anthropic)
- Knows full audit data + entire UNT CS course catalog
- Web search enabled for live UNT catalog lookups
- Ask anything:
  - *"What courses do I still need?"*
  - *"What should I take next semester?"*
  - *"Am I on track to graduate?"*
  - *"Explain the prerequisites for CSCE4110"*

### 📋 Smart Course Cards
- Click any completed or in-progress course
- AI instantly explains what you will learn, prerequisites,
  difficulty, career paths, and tips for success

### ✅ Requirements Tracker
- All 19 degree requirement categories with live status
- Done ✓ / In Progress ⏳ clearly shown
- Transfer credit mapping from Dallas College and UT-Arlington

### 🏫 MyUNT Portal Mockup
- Pixel-matched clone of the real MyUNT homepage
- Shows exactly how the Degree Audit tile would look
- Click the tile → modal preview → full audit card

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| AI | Claude Sonnet (Anthropic API) |
| Data | Structured JS from real UNT degree audit PDF |
| Course Catalog | UNT CS catalog with full prerequisite chains |
| Hosting | GitHub Pages |

---

## 📁 Project Structure

```
unt-degree-audit/
├── index.html          # MyUNT portal mockup (entry point)
├── audit.html          # Full AI degree audit card
├── app.js              # AI engine + Claude API integration
├── data/
│   ├── my-audit.js     # Real student audit data (structured)
│   └── unt-courses.js  # UNT CS catalog + prerequisites
├── assets/             # Screenshots and images
└── README.md
```

---

## 🎯 Who Built This & Why

**Aashish Thapa Magar**
B.S. Computer Science — University of North Texas, Denton
College of Engineering · ENBS CSCI · Catalog Year Fall 2025
**Final Semester Student · Expected Graduation: December 2026**

As a final semester CS student I built this because I lived the
frustration firsthand. Every semester I had to dig through DegreeWorks
just to answer basic questions like "what do I still need?" and
"can I take this course yet?"

This took one weekend to prototype.
Imagine what UNT's engineering team could do with it.

---

## 🏫 Proposal to UNT

This project is a **concept proposal** submitted to the University
of North Texas to demonstrate what a modernized degree audit
experience could look like.

### What I Am Proposing
1. Add a **Degree Audit tile** to the MyUNT Student Homepage
2. Show live completion percentage without logging into DegreeWorks
3. Integrate an AI advisor that answers student questions 24/7
4. Surface transfer credit mapping clearly for UNT's large
   transfer student population

### Why It Matters
- UNT has **46,000+ students** — most check degree progress every semester
- UNT has one of the highest transfer student rates in Texas
- Advisors spend significant time answering questions this AI could handle instantly
- Student retention improves when progress is visible and motivating

---

## 🔧 Running Locally

```bash
# Clone the repo
git clone https://github.com/AashishThapaMagar/unt-degree-audit.git

# Navigate to folder
cd unt-degree-audit

# Create config.js with your Anthropic API key
# const CONFIG = { apiKey: 'sk-ant-YOUR-KEY-HERE' }

# Start local server
python -m http.server 8000

# Open in browser
http://localhost:8000/index.html
```

---

## 📬 Contact

**Aashish Thapa Magar**
University of North Texas · B.S. Computer Science · Class of December 2026
GitHub: [AashishThapaMagar](https://github.com/AashishThapaMagar)

---

*Built with ❤️ by a UNT student, for UNT students.*

*"Students shouldn't have to decode their own graduation status."*

Disclaimer: This is an independent student concept proposal 
and is not affiliated with or endorsed by the University of 
North Texas. UNT branding is used for demonstration purposes only.