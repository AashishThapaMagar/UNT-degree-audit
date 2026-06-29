// ── AI ENGINE ─────────────────────────────────────────────
// Connects MY_AUDIT + UNT_COURSES + Claude AI API

const AI_ENGINE = {

  // Build the full system prompt with live data
  buildSystemPrompt() {
    const s = MY_AUDIT.student;
    const completed = MY_AUDIT.completedCourses.map(c => c.code);
    const inProgress = MY_AUDIT.inProgressCourses.map(c => c.code);
    const available = UNT_COURSES.getAvailable(completed, inProgress);

    return `
You are an expert academic advisor AI for UNT (University of North Texas) Denton.
You are helping ${s.name}, a ${s.degree} student.

═══════════════════════════════════════
STUDENT PROFILE
═══════════════════════════════════════
Name: ${s.name}
Student ID: ${s.id}
Degree: ${s.degree}
College: ${s.college}
Program: ${s.program}
Catalog Year: ${s.catalogYear}
Expected Graduation: ${s.expectedGraduation}
UNT GPA: ${s.untGPA}
Overall GPA: ${s.overallGPA}
Credits Earned: ${s.totalEarned}
Credits In Progress: ${s.inProgress}
Credits Required: ${s.required}
Completion: ${s.completionPercent}%

═══════════════════════════════════════
COMPLETED COURSES (${MY_AUDIT.completedCourses.length} courses)
═══════════════════════════════════════
${MY_AUDIT.completedCourses.map(c =>
  `${c.code} - ${c.name} (${c.credits}cr, Grade: ${c.grade})`
).join('\n')}

═══════════════════════════════════════
COURSES IN PROGRESS THIS SEMESTER
═══════════════════════════════════════
${MY_AUDIT.inProgressCourses.map(c =>
  `${c.code} - ${c.name} (${c.credits}cr)`
).join('\n')}

═══════════════════════════════════════
DEGREE REQUIREMENTS STATUS
═══════════════════════════════════════
${MY_AUDIT.requirements.map(r =>
  `${r.status === 'done' ? '✓' : '⏳'} ${r.name}: ${r.earned}/${r.required} hrs [${r.status.toUpperCase()}]`
).join('\n')}

═══════════════════════════════════════
TRANSFER CREDITS
═══════════════════════════════════════
${MY_AUDIT.transferSources.map(t =>
  `${t.school}: ${t.credits} credits`
).join('\n')}

═══════════════════════════════════════
ACADEMIC HISTORY (GPA by Year)
═══════════════════════════════════════
${MY_AUDIT.academicHistory.map(y =>
  `${y.year}: ${y.hours} hrs, ${y.courses} courses, GPA: ${y.gpa}`
).join('\n')}

═══════════════════════════════════════
COURSES AVAILABLE TO TAKE NEXT
(prerequisites already met)
═══════════════════════════════════════
${available.map(c =>
  `${c.code} - ${c.name} (${c.credits}cr, Difficulty: ${c.difficulty})`
).join('\n')}

═══════════════════════════════════════
FULL UNT CS COURSE CATALOG
═══════════════════════════════════════
${UNT_COURSES.catalog.map(c =>
  `${c.code} - ${c.name}
   Credits: ${c.credits} | Level: ${c.level} | Difficulty: ${c.difficulty}
   Prerequisites: ${c.prerequisites.length ? c.prerequisites.join(', ') : 'None'}
   Leads To: ${c.leadsTo.length ? c.leadsTo.join(', ') : 'N/A'}
   Description: ${c.description}`
).join('\n\n')}

═══════════════════════════════════════
YOUR JOB AS ADVISOR
═══════════════════════════════════════
1. Answer any question about the student's degree progress accurately
2. Recommend next semester courses based on what's available and graduation goals
3. Explain prerequisites clearly — which ones are done, which are missing
4. Be encouraging but honest about GPA and academic standing
5. Always reference real course codes and names from the data above
6. For any course not in the catalog above, search the web for current UNT catalog info
7. Format responses cleanly with bullet points, bold headers, and emojis where helpful
8. Keep answers concise but complete — no unnecessary filler

IMPORTANT: Always verify course recommendations against the completed courses list.
Never recommend a course the student already completed or is taking.
`;
  },

  // Chat history for multi-turn conversation
  history: [],

  // Send a message to Claude AI
  async ask(userMessage) {
    this.history.push({ role: 'user', content: userMessage });

   const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': CONFIG.apiKey,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true',
  },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: this.buildSystemPrompt(),
        messages: this.history,
        tools: [
          {
            type: "web_search_20250305",
            name: "web_search"
          }
        ]
      })
    });

    const data = await response.json();
    const reply = data.content
      ?.map(block => block.type === 'text' ? block.text : '')
      .filter(Boolean)
      .join('') || 'Sorry, I had trouble responding.';

    this.history.push({ role: 'assistant', content: reply });
    return reply;
  },

  // Get course recommendation for next semester
  async getRecommendations() {
    const completed = MY_AUDIT.completedCourses.map(c => c.code);
    const inProgress = MY_AUDIT.inProgressCourses.map(c => c.code);
    const available = UNT_COURSES.getAvailable(completed, inProgress);

    return this.ask(
      `Based on my current progress, what are the best 3-4 courses I should 
      take next semester to graduate by ${MY_AUDIT.student.expectedGraduation}? 
      Consider my GPA, difficulty balance, and remaining requirements. 
      Available courses with prereqs met: ${available.map(c => c.code).join(', ')}`
    );
  },

  // Explain a specific course + its prerequisites
  async explainCourse(courseCode) {
    const course = UNT_COURSES.getCourse(courseCode);
    const completed = MY_AUDIT.completedCourses.map(c => c.code);
    const chain = UNT_COURSES.getPrereqChain(courseCode, completed);

    if (!course) {
      return this.ask(
        `Search the UNT course catalog for ${courseCode} and explain: 
        what it covers, prerequisites, difficulty, and whether I can take it now.`
      );
    }

    const prereqStatus = chain.map(p =>
      `${p.code} (${p.completed ? '✓ Completed' : '✗ Not completed'})`
    ).join(', ');

    return this.ask(
      `Explain the course ${courseCode} - ${course.name} to me:
      - What will I learn?
      - Prerequisites needed: ${prereqStatus}
      - Can I take it now based on my completed courses?
      - How difficult is it?
      - What does it lead to career-wise?
      - Any tips for success?`
    );
  },

  // Check graduation status
  async checkGraduation() {
    return this.ask(
      `Am I on track to graduate by ${MY_AUDIT.student.expectedGraduation}? 
      Analyze my current progress, in-progress courses, remaining requirements, 
      and give me a clear YES/NO with detailed explanation and any risks I should know about.`
    );
  },

  // GPA analysis
  async analyzeGPA() {
    return this.ask(
      `Analyze my GPA situation:
      - UNT GPA: ${MY_AUDIT.student.untGPA}
      - Overall GPA: ${MY_AUDIT.student.overallGPA}
      - Academic history by year: ${MY_AUDIT.academicHistory.map(y => `${y.year}: ${y.gpa}`).join(', ')}
      What's my trend? How can I improve before graduation? 
      What GPA will I likely graduate with?`
    );
  },

  // Clear conversation
  reset() {
    this.history = [];
  }
};