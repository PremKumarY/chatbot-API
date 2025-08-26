import express from "express";
import Chat from "../models/Chat.js";
import sanitize from "mongo-sanitize";

const router = express.Router();

// ✅ FAQ entries

export const faq = [
  // Company & Registration
  { question: "about ijekerTech", answer: "ijekerTech is an IT consultancy and services firm focused on AI/ML, Web & Software Development, Research, and Technology Advisory." },
  { question: "ijekerTech services", answer: "We provide AI/ML solutions, custom web & app development, consultancy, research-driven projects, and smart surveillance systems." },
  { question: "ijekerTech team", answer: "ijekerTech is founded by Prem Kumar Yadav and managed collaboratively with a team of 2–10 specialists across AI, Web, Data, Mobile, and IT consultancy." },
  { question: "ijekerTech projects", answer: "Our projects include AI-powered chatbots, smart CCTV surveillance, debate assistant AI, typing game platforms, and custom web applications." },
  { question: "company", answer: "ijekerTech is an IT consultancy and services firm focused on AI/ML, web & software development, and technology advisory." },
  { question: "founder", answer: "ijekerTech was founded by Prem Kumar Yadav to deliver practical AI and modern software solutions." },
  { question: "company type", answer: "ijekerTech is officially registered as a sole proprietorship (MSME) in India, but it is managed and operated by a collaborative team of professionals, not a single person." },
  { question: "msme", answer: "Yes, ijekerTech is registered under MSME (Micro, Small & Medium Enterprises) in India." },
  { question: "location", answer: "We are based in Padrauna, Kushinagar, Uttar Pradesh, India, and work with clients across India and abroad remotely." },

  // Team & Expertise
  { question: "team size", answer: "Our agile team consists of 2–10 members covering AI/ML, Web, Mobile, Data Engineering, DevOps, UI/UX, QA, and IT consultancy." },
  { question: "team expertise", answer: "Core expertise spans Artificial Intelligence, Machine Learning, Computer Vision, NLP, MERN full-stack, mobile apps, cloud, automation, and data analytics." },
  { question: "about founder / team expertise", answer: "Founder-led but team-driven—ijekerTech combines AI research, product engineering, and end-to-end web/mobile solution delivery for education, automation, and analytics." },

  // Mission, Vision & Values
  { question: "mission", answer: "To deliver reliable, high-impact AI and software solutions and to upskill students and professionals through practical training." },
  { question: "vision", answer: "To become a trusted technology partner known for applied AI, quality engineering, and hands-on learning." },
  { question: "values", answer: "Transparency, ownership, craftsmanship, speed with quality, and continuous learning." },

  // Services
  { question: "services", answer: "AI/ML development, custom software & web apps, mobile apps, chatbots, smart surveillance, data analytics dashboards, automation, and IT consultancy." },
  { question: "custom software", answer: "Yes—bespoke web/mobile apps, internal tools, workflow automation, and integrations tailored to your business." },
  { question: "ai consultancy", answer: "We help assess AI readiness, select use-cases, build PoCs, and deploy production ML pipelines." },
  { question: "technical consultancy", answer: "Architecture reviews, cloud adoption, DevOps, performance, security posture, and cost optimization." },
  { question: "maintenance services", answer: "Yes—SLA-based maintenance, monitoring, and iterative enhancements post-launch." },

  // Domains & Use-cases
  { question: "industries served", answer: "Education, retail, small businesses, startups, research groups, and early-stage SaaS." },
  { question: "use cases", answer: "Lead qualification chatbots, smart CCTV analytics, content moderation, document processing, sales dashboards, and workflow automation." },

  // Projects & Portfolio
  { question: "projects", answer: "Smart CCTV Surveillance (AI), Debate Assistant AI, web-based music platform, typing practice game, data dashboards, and custom CRMs." },
  { question: "project completion", answer: "We have successfully delivered multiple AI/ML and full-stack projects with ongoing support." },
  { question: "ongoing projects", answer: "AI assistants, IoT-enabled monitoring, knowledge chatbots, and enterprise automation tools." },
  { question: "future projects", answer: "Healthcare AI, domain-specific copilots, and scalable low-code automation modules." },
  { question: "portfolio", answer: "Selected case studies can be shared privately on request due to client confidentiality." },

  // Clients, Testimonials, Partnerships
  { question: "clients", answer: "Students, startups, institutes, and SMEs seeking training, AI adoption, or custom software." },
  { question: "customers", answer: "Learners, professionals, and organizations looking for practical solutions and upskilling." },
  { question: "testimonials", answer: "Clients and students appreciate our hands-on approach, clarity, and on-time delivery." },
  { question: "partners", answer: "Open to collaborations with institutes, startups, and technology vendors for joint delivery and research." },

  // Training, Internships & Courses
  { question: "training", answer: "Instructor-led programs in AI/ML, Data Science, Python, MERN full-stack, and software engineering—online and offline." },
  { question: "internship", answer: "Paid/Unpaid project-based internships (1–3 months) in AI/ML, Web, and Software Development with real deliverables." },
  { question: "courses", answer: "AI & ML, Data Science, MERN Full-Stack, Python, Web Development fundamentals, Git/DevOps basics, and deployment. And provide hands-on projects for practical experience-Internship & Training" },
  { question: "certifications", answer: "Yes—industry-recognized certificates on successful completion of training or internship." },
  { question: "who can join", answer: "Students, freshers, and working professionals aiming to build a project portfolio and job-ready skills." },
  { question: "training duration", answer: "Short programs: 2–4 weeks; advanced tracks: 3–6 months, depending on depth and capstone work." },
  { question: "internship duration", answer: "Typically 1–3 months, extendable based on project scope and performance." },
  { question: "online or offline", answer: "Both are available; online cohorts support flexible schedules and remote collaboration." },
  { question: "demo", answer: "Yes—free orientation/demo sessions before enrollment to assess fit and expectations." },
  { question: "fees", answer: "Program fees vary by track and duration; scholarships/discounts may be available for eligible candidates." },

  // Careers
  { question: "career", answer: "We welcome applications for internships, fresher roles, and technical collaborations. Send your resume to hr@ijekertech.com." },
  { question: "is ijekertech hiring", answer: "We hire interns and part-time contributors periodically. Share your portfolio/GitHub with hr@ijekertech.com." },
  { question: "student opportunities", answer: "Internships, live projects, mentorship, and resume-ready capstone work under supervision." },

  // Process & Engagement
  { question: "engagement model", answer: "Fixed-scope projects, retainer-based engagements, or time-and-materials for ongoing work." },
  { question: "project timeline", answer: "Small apps: 2–6 weeks; mid-sized solutions: 6–12 weeks; complex AI/enterprise work varies by scope." },
  { question: "onboarding", answer: "Requirement discovery, solution proposal, milestone plan, and a clear communication cadence." },
  { question: "proof of concept", answer: "We recommend PoCs for AI use-cases to validate feasibility and ROI before scaling." },
  { question: "communication", answer: "Weekly/bi-weekly updates via email/meetings; shared boards for tasks and milestones." },

  // Security, Privacy & Compliance
  { question: "security", answer: "We follow secure-by-design principles, least-privilege access, encrypted data at rest/in transit, and regular reviews." },
  { question: "data privacy", answer: "Client/stakeholder data is used strictly for the agreed purpose and is never shared without consent." },
  { question: "privacy policy", answer: "Our privacy policy outlines data handling, retention, and user rights; it can be shared on request or via our website." },
  { question: "nda", answer: "We support mutual NDAs and confidential engagement terms for sensitive work." },
  { question: "ip ownership", answer: "By default, IP created under paid engagements is transferred to the client upon final payment unless otherwise agreed." },

  // Pricing & Payments
  { question: "pricing plans", answer: "Pricing depends on scope, complexity, and timelines; we provide transparent quotes and phased billing." },
  { question: "payment terms", answer: "Milestone-based invoicing with standard net terms; advance may apply for new engagements." },
  { question: "refund policy", answer: "Refunds follow our engagement agreement; training refunds depend on session consumption and policy terms." },

  // Support & Contact
  { question: "support", answer: "Business hours are Monday–Friday, 9 AM–6 PM IST. Extended support is available under SLA." },
  { question: "support channels", answer: "Email support@ijekertech.com, phone +91 6392554947, or the website chatbot." },
  { question: "contact", answer: "General inquiries: info@ijekertech.com. Careers: hr@ijekertech.com. Support: support@ijekertech.com." },
  { question: "newsletter", answer: "Subscribe by emailing support@ijekertech.com to receive product and training updates." },
  { question: "social media", answer: "Follow us on LinkedIn, X (Twitter), and GitHub for updates, releases, and learning resources." },

  // Sales & Demos
  { question: "demo requests", answer: "Request a live demo or walkthrough by emailing info@ijekertech.com with your use-case and preferred time." },
  { question: "proposal", answer: "Share your requirements and we’ll send a detailed proposal with scope, milestones, and pricing." },

  // Chatbot-specific
  { question: "what can this chatbot answer", answer: "Ask about our services, training, internships, projects, pricing, support hours, and how to get started." },
  { question: "how to start a project", answer: "Send your brief to info@ijekertech.com. We’ll schedule a discovery call and share a proposal with timelines and costs." },

  // Policies (Website)
  { question: "terms and conditions", answer: "Our terms and conditions cover usage, liabilities, payment, and IP. A copy is available on our website or on request." },

  // Extras (Good to have)
  { question: "technology stack", answer: "Python, Node.js, React, MongoDB, PostgreSQL, TensorFlow, PyTorch, OpenCV, Docker, and major cloud providers." },
  { question: "code ownership", answer: "Client retains ownership of deliverables as per the contract, including source code and documentation." },
  { question: "documentation", answer: "We deliver basic setup docs, runbooks, and handover notes; extended documentation is available on request." },
  { question: "training outcomes", answer: "Hands-on skills, portfolio projects, mentorship, and certificate—aimed at job or internship readiness." },
  { question: "internship outcomes", answer: "Real project exposure, supervised deliverables, review cycles, and a completion certificate." }
];




// ✅ Suggestion generator (2 related + 2 general)
function getSmartSuggestions(currentQ) {
  const keywords = currentQ ? currentQ.split(" ").map(w => w.toLowerCase()) : [];

  // ✅ Find related FAQs
  const related = faq.filter(f => {
    const fKeywords = f.question.split(" ").map(w => w.toLowerCase());
    return keywords.some(k => fKeywords.includes(k));
  });

  // ✅ Shuffle related
  const shuffledRelated = related.sort(() => 0.5 - Math.random());

  // ✅ Pick max 2 related
  const relatedSuggestions = shuffledRelated.slice(0, 2).map(r => r.question);

  // ✅ Get general random suggestions (excluding related)
  const remaining = faq.filter(f => !relatedSuggestions.includes(f.question));
  const shuffledGeneral = remaining.sort(() => 0.5 - Math.random());
  const generalSuggestions = shuffledGeneral.slice(0, 2).map(g => g.question);

  // ✅ Final list (mix of related + general)
  return [...relatedSuggestions, ...generalSuggestions];
}


// ✅ POST chat message (secure)
router.post("/", async (req, res) => {
  try {
    let { email, from, text } = req.body;
    if (!email || !text) {
      return res.status(400).json({ error: "Email and message required" });
    }

    // ✅ Sanitize inputs
    email = sanitize(email);
    from = sanitize(from);
    text = sanitize(text);

    // Save user message
    await Chat.create({ email, from, text });

    let reply = "Sorry, I couldn’t understand that. Please choose from the suggestions below:";
    let matchedQuestion = "";

    const lowerText = text.toLowerCase();

    // ✅ Keyword-based matching
    const matched = faq.find((f) =>
      lowerText.includes(f.question.toLowerCase())
    );

    if (matched) {
      reply = matched.answer;
      matchedQuestion = matched.question;
    }

    // Save bot reply
    const botMsg = await Chat.create({ email, from: "bot", text: reply });

    // ✅ Return with better suggestions (2 related + 2 random)
    res.json({
      botMsg: { from: "bot", text: reply },
      suggestions: getSmartSuggestions(matchedQuestion),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
});

export default router;
