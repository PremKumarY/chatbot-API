
import express from "express";
import Chat from "../models/Chat.js";

const router = express.Router();

// Comprehensive FAQ (75+ entries)
const faq = [
  { question: "Do you offer training or internships?", answer: "Yes! ijekerTech offers both training and internship programs in AI, ML, Web & Software Development. Our internships are 1–3 months long, giving hands-on experience on real projects. Trainings are customized for individuals and corporate clients." },
  { question: "Career opportunities at ijekerTech", answer: "We welcome talented individuals to join ijekerTech! Opportunities are available for interns, junior developers, AI/ML engineers, and IT consultants. You can apply by sending your resume to hr@ijekertech.com." },
  { question: "How can I contact the company?", answer: "You can reach us via email at support@ijekertech.com, call us at +91-XXXXXXXXXX, or visit our office at Padrauna, Kushinagar, Uttar Pradesh, India. Our support team is ready to assist you with any queries." },
  { question: "what services do you offer", answer: "We at ijekerTech provide AI solutions, Web Development, Mobile & Software Development, and IT Consultancy services." },
  { question: "pricing plans", answer: "Our pricing depends on the project scope. Contact us at support@ijekertech.com for a custom quote." },
  { question: "talk to support", answer: "Reach our support team via support@ijekertech.com or call +91-XXXXXXXXXX." },
  { question: "company", answer: "ijekerTech is an IT company focused on AI, Software, and Consultancy services." },
  { question: "training", answer: "We provide internship and training programs in AI, ML, Web Development, and Full Stack Development." },
  { question: "internship", answer: "Our internship programs provide hands-on experience in AI, ML, Web & Software projects. Duration: 1-3 months." },
  { question: "ai projects", answer: "We develop AI solutions like Smart Surveillance, Debate Assistant AI, and Chatbots." },
  { question: "career opportunities", answer: "Opportunities for interns, junior developers, and professionals are available. Apply at hr@ijekertech.com." },
  { question: "contact", answer: "Contact us via support@ijekertech.com or visit our office at Padrauna, Kushinagar, UP, India." },
  { question: "about founders", answer: "ijekerTech is founded by Prem Kumar Yadav, focusing on AI and IT innovations." },
  { question: "technologies used", answer: "We use Python, Node.js, React, MongoDB, AI/ML frameworks (TensorFlow, PyTorch), and cloud services." },
  { question: "custom software", answer: "We develop custom software for automation, analytics, web & mobile apps." },
  { question: "ongoing projects", answer: "Smart CCTV Surveillance, Debate Assistant AI, and web-based music systems." },
  { question: "client support", answer: "We provide dedicated client support for all our solutions." },
  { question: "feedback", answer: "Share feedback at feedback@ijekertech.com." },
  { question: "full stack development", answer: "We offer full-stack web development using MERN (MongoDB, Express, React, Node.js)." },
  { question: "mobile app development", answer: "We build Android and iOS apps using React Native and Flutter." },
  { question: "web development", answer: "We create responsive and modern websites using React, Tailwind CSS, and Node.js." },
  { question: "ai consultancy", answer: "We provide AI consultancy to integrate ML & AI into business processes." },
  { question: "machine learning", answer: "We develop ML models for predictive analytics, automation, and AI assistants." },
  { question: "deep learning", answer: "We implement deep learning solutions using TensorFlow and PyTorch." },
  { question: "smart surveillance", answer: "Our Smart CCTV Surveillance detects unusual activity in real-time using AI." },
  { question: "debate assistant ai", answer: "We provide a Debate Assistant AI that helps users prepare for debates using facts and voice input." },
  { question: "music system project", answer: "A web-based music system with personalized libraries, multi-user support, and premium features." },
  { question: "intern programs duration", answer: "Internship programs range from 1 to 3 months depending on the project." },
  { question: "training programs duration", answer: "Training programs are customized, typically 2-4 weeks per course." },
  { question: "online courses", answer: "We provide online courses in AI, ML, Python, Data Science, and Full Stack Development." },
  { question: "onsite training", answer: "Onsite training is available for institutions or corporate clients." },
  { question: "github resources", answer: "Our projects and demo codes are available on our official GitHub." },
  { question: "portfolio", answer: "Our portfolio includes AI projects, web & mobile apps, and software solutions." },
  { question: "subscription plans", answer: "Premium users can access high-quality features in our apps and services." },
  { question: "trial period", answer: "We offer a free trial period for new users in our products." },
  { question: "security", answer: "We follow best practices for data security and user privacy in all projects." },
  { question: "data privacy", answer: "User data is handled securely and never shared without consent." },
  { question: "clientele", answer: "We serve startups, SMEs, and corporate clients across India." },
  { question: "automation solutions", answer: "We provide software to automate business processes efficiently." },
  { question: "analytics", answer: "We build analytics dashboards and reports using AI and ML models." },
  { question: "technical consultancy", answer: "We advise companies on software, AI, and IT infrastructure." },
  { question: "support channels", answer: "Email: support@ijekertech.com, Phone: +91-XXXXXXXXXX, Chatbot support available on our website." },
  { question: "ai research", answer: "Our AI research focuses on NLP, computer vision, and predictive analytics." },
  { question: "future projects", answer: "Upcoming projects include AI assistants, IoT solutions, and smart automation tools." },
  { question: "languages we use", answer: "Python, JavaScript, TypeScript, SQL, NoSQL (MongoDB)." },
  { question: "hosting services", answer: "We deploy apps using cloud services like AWS, Azure, and Google Cloud." },
  { question: "open source contributions", answer: "We contribute to open-source AI and web development projects." },
  { question: "team", answer: "Our team consists of AI engineers, software developers, data scientists, and IT consultants." },
  { question: "vision", answer: "To empower businesses with AI and innovative IT solutions." },
  { question: "mission", answer: "To provide reliable, cutting-edge software and AI solutions that drive growth." },
  { question: "client testimonials", answer: "Our clients praise our innovative solutions, technical expertise, and support." },
  { question: "project collaboration", answer: "We collaborate with clients to understand requirements and deliver customized solutions." },
  { question: "demo requests", answer: "Request a demo by contacting us at support@ijekertech.com." },
  { question: "partnerships", answer: "We partner with tech companies, institutions, and startups for joint projects." },
  { question: "research collaborations", answer: "We collaborate with universities and research institutions for AI/ML research." },
  { question: "faq", answer: "You can ask me about services, training, AI projects, pricing, internships, and company info." },
  { question: "customer support hours", answer: "Our support team is available Monday to Friday, 9 AM to 6 PM IST." },
  { question: "project timeline", answer: "Project timelines depend on complexity; typically 2-6 weeks for small apps." },
  { question: "maintenance services", answer: "We provide post-deployment maintenance and updates for software and apps." },
  { question: "certifications", answer: "Our training programs provide completion certificates for students and interns." },
  { question: "client onboarding", answer: "We guide clients through project onboarding and requirements gathering." },
  { question: "demo session", answer: "You can schedule a live demo session to explore our services and projects." },
  { question: "refund policy", answer: "For paid services or courses, refunds are provided as per our company policy." },
  { question: "workshop", answer: "We organize workshops on AI, ML, and Web Development for students and professionals." },
  { question: "latest updates", answer: "Follow our social media channels for the latest news and project updates." },
  { question: "newsletter", answer: "Subscribe to our newsletter at support@ijekertech.com to receive updates and announcements." },
  { question: "privacy policy", answer: "Read our privacy policy at www.ijekertech.com/privacy." },
  { question: "terms and conditions", answer: "Our terms and conditions are available at www.ijekertech.com/terms." },
  { question: "feedback mechanism", answer: "Users can submit feedback via feedback@ijekertech.com or our website form." },
];


function getSmartSuggestions(currentQ) {
  if (!currentQ) return [];
  const keywords = currentQ
    .split(" ")
    .filter((w) => w.length > 3)
    .map((w) => w.toLowerCase());

  const related = faq.filter(f => {
    if (f.question === currentQ) return false;
    const fKeywords = f.question.split(" ").map(w => w.toLowerCase());
    return keywords.some(k => fKeywords.includes(k));
  });

  const shuffled = related.sort(() => 0.5 - Math.random());
  const uniqueSuggestions = [];
  const seen = new Set();

  for (let q of shuffled) {
    if (!seen.has(q.question)) {
      uniqueSuggestions.push(q.question);
      seen.add(q.question);
    }
    if (uniqueSuggestions.length >= 6) break;
  }

  if (uniqueSuggestions.length < 5) {
    const remaining = faq
      .filter(f => f.question !== currentQ && !seen.has(f.question))
      .sort(() => 0.5 - Math.random());

    for (let q of remaining) {
      uniqueSuggestions.push(q.question);
      if (uniqueSuggestions.length >= 6) break;
    }
  }

  return uniqueSuggestions;
}

// ✅ POST chat message (secure)
router.post("/", async (req, res) => {
  try {
    const { email, from, text } = req.body;
    if (!email || !text) {
      return res.status(400).json({ error: "Email and message required" });
    }

    // Save user message
    const userMsg = await Chat.create({ email, from, text });

    let reply = "Sorry, Please try again! Choose from the suggestions below:";
    let matchedQuestion = "";
    const lowerText = text.toLowerCase();

    const matched = faq.find((q) => lowerText.includes(q.question));
    if (matched) {
      reply = matched.answer;
      matchedQuestion = matched.question;
    }
    // Save bot reply
    const botMsg = await Chat.create({ email, from: "bot", text: reply });

    // ✅ Return only safe fields (no _id, no __v)
    const chats = await Chat.find({ email })
      .select("from text createdAt")
      .sort({ createdAt: 1 });

    res.json({
      chats,
      suggestions: getSmartSuggestions(matchedQuestion),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
});
export default router;