# The Use of AI

## Table of Contents

- [[#How to Use This Note]]
- [[#Safe AI Use]]
- [[#Questions and Answers]]
	- [[#1. What AI Tools Do You Use in Your Work?]]
	- [[#2. Do You Use AI Outside Testing?]]
	- [[#3. Are You Learning Any AI Tools Now?]]
	- [[#4. How Does AI Help You Detect and Classify Defects?]]
	- [[#5. Do You Use AI to Generate Test Data?]]
	- [[#6. Give an Example of How AI Saved Your Time]]
- [[#LMS Requirement]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## How to Use This Note

The Skills Matrix applies these questions to all grades. The answers below are examples for an Intern or Junior AQA interview. Change personal details so that every statement is true for you.

Aim for a 30–60 second short answer. Use the detailed answer only when the interviewer asks a follow-up question.

---

## Safe AI Use

> [!danger] Core rule
> AI output is a draft, not a final decision. Check important information against requirements, official documentation, code, logs, and actual test results.

Key rules:

- Do not send passwords, tokens, personal data, production data, or private company information to an unapproved AI tool.
- Give clear context: the task, constraints, expected format, and examples.
- Check generated test cases, code, SQL, and test data before using them.
- Keep the engineer responsible for severity, priority, coverage, and release decisions.
- Follow the project's security policy and approved tool list.

---

## Questions and Answers

### 1. What AI Tools Do You Use in Your Work?

**Short answer:**

I use Codex as an AI assistant. It helps me organise QA notes, understand difficult topics, review Java code, and prepare answers for interviews. I treat its output as a draft and verify important information before I use it.

**Detailed answer:**

I use AI for research, learning, planning, and first drafts. For example, I can ask it to explain a Java error, suggest test scenarios, review a checklist, or improve the structure of a note. I provide context and constraints, then check the result against requirements and documentation. I do not give an AI tool secrets or private production data.

**Follow-up:** What tasks should not be delegated completely to AI?

AI should not make the final decision about defect priority, test coverage, security risk, or release readiness. These decisions need verified evidence and human judgement.

### 2. Do You Use AI Outside Testing?

**Short answer:**

Yes. I use AI to practise English, organise notes in Obsidian, summarise learning material, and plan study tasks. It helps me work faster, but I still check the result and rewrite it in my own words.

**Detailed answer:**

Outside testing, AI can act as a language partner, study assistant, or planning tool. I can use it to correct an English answer, create flashcards, compare technical concepts, or break a large learning goal into smaller tasks. I avoid using it as a replacement for learning because I need to understand and explain the result myself.

**Follow-up:** How do you make sure that AI helps you learn instead of doing all the work?

I answer first, compare my answer with AI feedback, correct my mistakes, and repeat the answer without reading.

### 3. Are You Learning Any AI Tools Now?

**Short answer:**

Yes. I am learning how to use Codex and CLI AI tools more effectively. I am also studying context engineering and the Model Context Protocol, or MCP, because good context and correct tool access improve the result.

**Detailed answer:**

My goal is not only to write prompts. I want to understand how to give useful context, define constraints, connect tools safely, review generated changes, and keep control of the task. I am also interested in using AI in a repeatable development and testing workflow.

**Follow-up:** What is context engineering?

Context engineering means preparing the relevant instructions, project information, examples, constraints, and tool access that an AI system needs to complete a task correctly.

### 4. How Does AI Help You Detect and Classify Defects?

**Short answer:**

AI can analyse logs, error messages, screenshots, and defect descriptions. It can group similar failures, suggest possible duplicates, and propose a defect type or affected component. A QA engineer must verify the suggestion and decide the final classification.

**Detailed answer:**

AI is useful when there is a large amount of repeated information. It can find patterns in test failures, compare a new error with previous defects, summarise a stack trace, or separate product defects from test automation and environment problems. However, it may miss business context, so severity and priority must be confirmed by people using requirements and evidence.

**Example:**

If 40 automated tests fail after one deployment, AI can compare their logs and show that 32 failures have the same authentication error. This helps the engineer investigate one likely root cause instead of treating every failed test as a separate product defect.

### 5. Do You Use AI to Generate Test Data?

**Short answer:**

Yes, I can use AI to create synthetic test data for positive, negative, and boundary scenarios. I describe the format and constraints, then validate the generated values. I never send private production data to an unapproved AI tool.

**Detailed answer:**

For example, I can ask AI to generate valid and invalid email addresses, boundary-length strings, Unicode values, dates, or JSON objects. I check uniqueness, format, boundaries, and business rules before using the data. For sensitive scenarios, I use fake data and approved local tools instead of copying real customer information.

**Example prompt:**

```text
Generate 10 synthetic user records in JSON.
Include valid, invalid, and boundary cases for name, email, and age.
Do not use real personal information.
Explain which test condition each record covers.
```

### 6. Give an Example of How AI Saved Your Time

> [!warning] Personalise this answer
> Use an example that you really completed. The answer below is a model based on a learning workflow.

**Short answer:**

AI helped me turn a large list of QA and Java topics into a structured Obsidian learning plan. It created the first draft and suggested links between related topics. I checked the order, corrected mistakes, and verified the final structure. This saved time on routine organisation.

**Detailed answer:**

The original information was spread across a spreadsheet and many notes. I used AI to extract the topics, prepare a consistent structure, and find related study notes. The first output was not perfect, so I reviewed it against the source and corrected it. AI saved time on extraction and formatting, while I remained responsible for accuracy.

**Follow-up:** How did you measure the saved time?

I can compare the manual steps with the AI-assisted workflow: extracting every topic, formatting links, and creating the first structure took less manual work. I would describe the result honestly instead of giving an exact number that I did not measure.

---

## LMS Requirement

The Skills Matrix states that the `AI for Developers` course in the company LMS is mandatory for all AQA engineers.

Priority sections:

1. Onboarding AI
2. Context Engineering for Developers
3. Model Context Protocol
4. Command Line Interface AI Tools

The other sections provide a deeper understanding of AI-driven development processes.

