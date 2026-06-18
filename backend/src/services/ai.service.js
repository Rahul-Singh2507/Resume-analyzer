import {GoogleGenAI } from "@google/genai";
import config from "../config/config.js"
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import puppeteer from "puppeteer"

const ai = new GoogleGenAI({
    apiKey: config.GOOGLE_GENAI_API_KEY
})

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function getMeaningfulLines(text, maxItems = 8) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, maxItems)
}

function buildFallbackResumeHtml({ resume, selfDescription, jobDescription }) {
  const resumeLines = getMeaningfulLines(resume, 8)
  const profileLines = getMeaningfulLines(selfDescription, 5)
  const jobLines = getMeaningfulLines(jobDescription, 6)
  const summary = escapeHtml(
    (selfDescription || resume || "Candidate profile")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 900)
  )

  const listMarkup = (items, emptyLabel) => {
    if (!items.length) {
      return `<li>${escapeHtml(emptyLabel)}</li>`
    }

    return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
  }

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Generated Resume</title>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
        color: #111827;
        margin: 0;
        padding: 40px;
        line-height: 1.5;
        background: #ffffff;
      }
      h1, h2, p, ul {
        margin: 0;
      }
      .page {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .header {
        border-bottom: 2px solid #e11d48;
        padding-bottom: 16px;
      }
      .eyebrow {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #e11d48;
        margin-bottom: 8px;
      }
      .title {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 8px;
      }
      .summary {
        font-size: 14px;
        color: #374151;
      }
      .section {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .section h2 {
        font-size: 16px;
        color: #111827;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 6px;
      }
      ul {
        padding-left: 20px;
      }
      li {
        margin-bottom: 6px;
        font-size: 13px;
        color: #374151;
      }
    </style>
  </head>
  <body>
    <div class="page">
      <section class="header">
        <p class="eyebrow">AI Tailored Resume</p>
        <h1 class="title">Professional Candidate</h1>
        <p class="summary">${summary || "Generated resume summary."}</p>
      </section>
      <section class="section">
        <h2>Profile Highlights</h2>
        <ul>${listMarkup(profileLines, "Profile summary was generated from the available resume information.")}</ul>
      </section>
      <section class="section">
        <h2>Experience Snapshot</h2>
        <ul>${listMarkup(resumeLines, "Resume details were limited, so this section was generated from the available profile information.")}</ul>
      </section>
      <section class="section">
        <h2>Target Role Alignment</h2>
        <ul>${listMarkup(jobLines, "Job alignment details were inferred from the saved interview report.")}</ul>
      </section>
    </div>
  </body>
</html>
`
}

const interviewReportSchema = z.object({
  matchScore: z.number().describe("Score between 0 and 100 representing how well the candidate matches the job role"),
  technicalQuestions: z.array(
    z.object({
      question: z.string().describe("A technical question that may be asked in the interview"),
      intention: z.string().describe("Purpose behind asking this technical question"),
      answer: z.string().describe("Suggested way to answer this question with key points")
    })
  ).describe("List of technical interview questions with intent and answers"),
  behavioralQuestions: z.array(
    z.object({
      question: z.string().describe("A behavioral question that may be asked in the interview"),
      intention: z.string().describe("Purpose behind asking this behavioral question"),
      answer: z.string().describe("Suggested way to answer this question with key points")
    })
  ).describe("List of behavioral interview questions with intent and answers"),
  skillGaps: z.array(
    z.object({
      skill: z.string().describe("Skill that the candidate is lacking"),
      severity: z.enum(["low", "medium", "high"]).describe("Severity level of the skill gap")
    })
  ).describe("Identified skill gaps in the candidate profile"),
  preparationPlans: z.array(
    z.object({
      day: z.number().describe("Day number in the preparation schedule"),
      focus: z.string().describe("Main focus area for the day"),
      tasks: z.array(z.string().describe("Tasks to complete on this day"))
    })
  ).describe("Day-wise preparation plan for interview readiness"),
  title: z.string().describe("The title of the job for which the interview report is generated"),
});


export async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
Analyze the candidate and generate interview report.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Return ONLY JSON. No text.

{
  "title": "",
  "matchScore": number,
  "technicalQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],
  "behavioralQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],
  "skillGaps": [
    {
      "skill": "",
      "severity": "low | medium | high"
    }
  ],
  "preparationPlans": [
    {
      "day": number,
      "focus": "",
      "tasks": []
    }
  ]
}
`
  });

  const text = response.candidates[0].content.parts[0].text;
  console.log("RAW AI TEXT:", text);

  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    console.log("No JSON found in response");
    return {
      title: "Untitled Position",
      technicalQuestions: [],
      behavioralQuestions: [],
      skillGaps: [],
      preparationPlans: []
    };
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.log("JSON parse error:", err);
    return {
      title: "Untitled Position",
      technicalQuestions: [],
      behavioralQuestions: [],
      skillGaps: [],
      preparationPlans: []
    };
  }
}

export async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()
    return pdfBuffer
}

export async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const fallbackHtml = buildFallbackResumeHtml({ resume, selfDescription, jobDescription })

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(resumePdfSchema),
            }
        })

        const responseText = typeof response.text === "function" ? await response.text() : response.text
        const jsonContent = JSON.parse(responseText)

        if (!jsonContent?.html?.trim()) {
            throw new Error("AI response did not include resume HTML.")
        }

        return await generatePdfFromHtml(jsonContent.html)
    } catch (error) {
        console.error("AI resume generation failed, using fallback HTML.", error)
        return await generatePdfFromHtml(fallbackHtml)
    }
}
