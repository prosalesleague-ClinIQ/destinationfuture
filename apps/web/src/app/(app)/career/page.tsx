"use client";

import { useState, useEffect } from "react";
import { db, type UserProfile } from "@/lib/db";
import { calculateFullNumerology } from "@destination-future/core";
import { calculateSolarAstrology } from "@destination-future/core";

/* ────────────────────────────────────────────────────────
   TYPES
   ──────────────────────────────────────────────────────── */

type Availability = "Hot" | "Warm" | "Growing" | "Stable";
type MarketGrowth = "Rising" | "Stable" | "Declining";
type WorkEnv = "Remote" | "Hybrid" | "On-site";
type BestFor = "Fast Income" | "Long-Term Growth";

interface Career {
  id: number;
  title: string;
  fit: number;
  salaryEntry: string;
  salaryMid: string;
  salaryHigh: string;
  salaryEntryNum: number;
  salaryMidNum: number;
  salaryHighNum: number;
  availability: Availability;
  growth: MarketGrowth;
  education: string;
  workEnv: WorkEnv;
  bestFor: BestFor;
  whyFits: string;
  trainingTime: string;
  effortLevel: string;
  satisfaction: string;
  remotePotential: string;
  licensingNeeded: string;
  timeToFirstJob: string;
  certPath: string[];
  degreePath: string[];
  portfolioMilestones: string[];
  quickStart: string[];
  ninetyDayGoals: string[];
  yearArc: string[];
  resumeTips: string[];
  networkingTips: string[];
  applicationTips: string[];
  fallbacks: string[];
  whyFitsLong: string;
  bestRoute: string;
}

/* ────────────────────────────────────────────────────────
   MOCK DATA
   ──────────────────────────────────────────────────────── */

const CAREERS: Career[] = [
  {
    id: 1,
    title: "UX Designer",
    fit: 92,
    salaryEntry: "$65K",
    salaryMid: "$95K",
    salaryHigh: "$140K",
    salaryEntryNum: 65,
    salaryMidNum: 95,
    salaryHighNum: 140,
    availability: "Hot",
    growth: "Rising",
    education: "Bootcamp / Self-taught",
    workEnv: "Remote",
    bestFor: "Fast Income",
    whyFits: "Your creative intuition and empathy for people make you a natural fit for designing digital experiences.",
    trainingTime: "3-6 months",
    effortLevel: "Medium",
    satisfaction: "High",
    remotePotential: "High",
    licensingNeeded: "None",
    timeToFirstJob: "4-6 months",
    certPath: ["Google UX Design Certificate (3 mo)", "Nielsen Norman UX Certification (6 mo)", "Interaction Design Foundation (ongoing)"],
    degreePath: ["HCI or Design degree (4 yr)", "Design bootcamp (6 mo)", "Online UX program (1 yr)"],
    portfolioMilestones: ["3 case studies", "1 redesign project", "1 original app concept", "Dribbble/Behance presence"],
    quickStart: [
      "Sign up for Google UX Design Certificate on Coursera",
      "Download Figma and complete beginner tutorials",
      "Join 3 UX design communities (ADPList, UX Collective, Dribbble)",
      "Start a UX journal documenting daily observations",
      "Audit 5 apps you use daily for UX patterns",
      "Read Don't Make Me Think by Steve Krug",
      "Follow 10 UX designers on LinkedIn and Twitter",
      "Set up a Notion portfolio template",
      "Complete 1 daily UI challenge on dailyui.co",
      "Schedule 2 informational interviews with UX designers",
    ],
    ninetyDayGoals: [
      "Month 1: Complete Google UX Certificate Module 1-3, finish 10 daily UI challenges, read 2 UX books",
      "Month 2: Complete first full case study, learn user research methods, conduct 5 user interviews",
      "Month 3: Build portfolio with 2 case studies, start applying to junior roles, attend 2 UX meetups",
    ],
    yearArc: [
      "Q1: Foundation — complete certification, build 3 portfolio pieces, learn Figma proficiency",
      "Q2: Growth — land internship or freelance gig, build network, start specializing",
      "Q3: Acceleration — apply to full-time roles, refine portfolio, get mentorship",
      "Q4: Launch — secure junior UX role, negotiate salary, plan advancement path",
    ],
    resumeTips: [
      "Lead with a UX-focused summary highlighting empathy and problem-solving",
      "Quantify impact: 'Redesigned checkout flow, reducing drop-off by 23%'",
      "Include a link to your portfolio prominently at the top",
      "List tools: Figma, Sketch, Adobe XD, Miro, UserTesting",
      "Highlight any cross-functional collaboration experience",
    ],
    networkingTips: [
      "Attend local UX meetups and UXPA chapter events monthly",
      "Request portfolio reviews from senior designers on ADPList",
      "Share UX teardowns and insights on LinkedIn weekly",
      "Join design-focused Slack communities (Mixed Methods, Figma Community)",
      "Volunteer for non-profit UX projects to build connections",
    ],
    applicationTips: [
      "Apply to 5-10 roles per week, prioritizing startups and agencies first",
      "Customize your portfolio case study to match each company's product",
      "Prepare a whiteboard design challenge practice routine",
      "Follow up with recruiters within 48 hours of applying",
      "Target companies with dedicated design teams for better mentorship",
    ],
    fallbacks: [
      "UI Designer — more visual, less research-heavy, similar tools",
      "Product Designer — broader scope, higher ceiling, same foundation",
      "UX Researcher — pivot to the research side if design doesn't click",
    ],
    whyFitsLong: "Your combination of creative thinking, empathy for others, and analytical problem-solving makes UX Design an exceptional match. You naturally notice when things feel awkward or unintuitive, and you're driven to make experiences better. The field rewards exactly the kind of human-centered thinking you excel at, and the remote-friendly nature aligns perfectly with your lifestyle preferences.",
    bestRoute: "certification",
  },
  {
    id: 2,
    title: "Product Manager",
    fit: 88,
    salaryEntry: "$80K",
    salaryMid: "$120K",
    salaryHigh: "$180K",
    salaryEntryNum: 80,
    salaryMidNum: 120,
    salaryHighNum: 180,
    availability: "Hot",
    growth: "Rising",
    education: "Degree preferred",
    workEnv: "Hybrid",
    bestFor: "Long-Term Growth",
    whyFits: "Your strategic thinking and ability to see the big picture while managing details make you an ideal product leader.",
    trainingTime: "6-12 months",
    effortLevel: "High",
    satisfaction: "High",
    remotePotential: "Medium",
    licensingNeeded: "None",
    timeToFirstJob: "6-12 months",
    certPath: ["Product School Certificate (2 mo)", "Pragmatic Institute (3 mo)", "Certified Scrum Product Owner (1 wk)"],
    degreePath: ["MBA with Tech focus (2 yr)", "Business or CS degree (4 yr)", "PM bootcamp (3 mo)"],
    portfolioMilestones: ["2 product specs", "1 go-to-market strategy", "1 metrics dashboard", "Product teardown blog"],
    quickStart: [
      "Read Inspired by Marty Cagan",
      "Take Product School's free intro course",
      "Start writing product teardowns on Medium or LinkedIn",
      "Learn SQL basics on Khan Academy",
      "Shadow a PM — reach out to 5 on LinkedIn",
      "Create a product spec for an app improvement",
      "Join Product Hunt and analyze daily launches",
      "Learn basic wireframing in Figma",
      "Study the PM interview question bank on Lewis C. Lin's site",
      "Subscribe to Lenny's Newsletter and The Pragmatic Engineer",
    ],
    ninetyDayGoals: [
      "Month 1: Read 3 PM books, complete SQL basics, write 4 product teardowns",
      "Month 2: Build a full product spec, learn analytics tools, start PM certification",
      "Month 3: Complete certification, apply to APM programs, network with 10 PMs",
    ],
    yearArc: [
      "Q1: Foundation — learn PM frameworks, build analytical skills, write product content",
      "Q2: Experience — land PM-adjacent role or internal transfer, build stakeholder skills",
      "Q3: Growth — take on product ownership, lead a feature launch, get PM certification",
      "Q4: Advancement — secure PM title, build team influence, plan specialization",
    ],
    resumeTips: [
      "Highlight cross-functional leadership and stakeholder management",
      "Show metrics-driven thinking: 'Drove 15% increase in user retention'",
      "Emphasize strategic decision-making and prioritization experience",
      "Include technical literacy: SQL, analytics platforms, agile methodologies",
      "Demonstrate customer empathy through research or support experience",
    ],
    networkingTips: [
      "Attend ProductCamp and local PM meetups regularly",
      "Join Mind the Product and Product School Slack communities",
      "Seek mentorship through PMLeaders or Plato",
      "Share product insights and frameworks on LinkedIn",
      "Contribute to product communities on Reddit (r/productmanagement)",
    ],
    applicationTips: [
      "Target Associate Product Manager (APM) programs at large tech companies",
      "Prepare for case interviews with product sense and estimation questions",
      "Network internally if transitioning — PM roles often fill through referrals",
      "Build a portfolio of product specs, teardowns, and metrics analyses",
      "Consider PM-adjacent roles (analyst, project manager) as stepping stones",
    ],
    fallbacks: [
      "Project Manager — similar coordination skills, easier entry, good stepping stone",
      "Business Analyst — analytical focus, strong demand, PM pipeline",
      "Technical Program Manager — if you develop technical skills, higher pay ceiling",
    ],
    whyFitsLong: "Your natural ability to synthesize information from multiple sources, communicate a clear vision, and rally people around shared goals is the core of great product management. You think in systems and outcomes, not just tasks, which sets you apart. The PM role will challenge you to balance user needs, business goals, and technical constraints — exactly the kind of complex problem-solving you thrive in.",
    bestRoute: "certification",
  },
  {
    id: 3,
    title: "Marketing Strategist",
    fit: 85,
    salaryEntry: "$55K",
    salaryMid: "$85K",
    salaryHigh: "$130K",
    salaryEntryNum: 55,
    salaryMidNum: 85,
    salaryHighNum: 130,
    availability: "Warm",
    growth: "Rising",
    education: "Cert / Degree",
    workEnv: "Hybrid",
    bestFor: "Fast Income",
    whyFits: "Your storytelling ability and understanding of human motivation make you a compelling marketing strategist.",
    trainingTime: "3-6 months",
    effortLevel: "Medium",
    satisfaction: "Medium",
    remotePotential: "High",
    licensingNeeded: "None",
    timeToFirstJob: "3-6 months",
    certPath: ["Google Digital Marketing Certificate (3 mo)", "HubSpot Marketing Certification (free)", "Meta Marketing Professional Certificate (6 mo)"],
    degreePath: ["Marketing or Communications degree (4 yr)", "Digital marketing bootcamp (3 mo)", "MBA with Marketing focus (2 yr)"],
    portfolioMilestones: ["3 campaign case studies", "1 brand audit", "1 content calendar", "Analytics dashboard"],
    quickStart: [
      "Complete HubSpot Inbound Marketing Certification (free)",
      "Start Google Digital Marketing Certificate",
      "Create a personal brand on LinkedIn with weekly posts",
      "Analyze 5 successful marketing campaigns",
      "Learn Google Analytics basics",
      "Set up a blog or newsletter on Substack",
      "Study SEO fundamentals on Moz Beginner's Guide",
      "Follow 10 marketing leaders on Twitter/LinkedIn",
      "Join Marketing Twitter and participate in discussions",
      "Volunteer to manage social media for a local business or nonprofit",
    ],
    ninetyDayGoals: [
      "Month 1: Complete HubSpot cert, start Google cert, write 8 LinkedIn posts",
      "Month 2: Build 2 campaign case studies, learn paid ads basics, grow network",
      "Month 3: Complete Google cert, apply to coordinator/strategist roles, launch personal newsletter",
    ],
    yearArc: [
      "Q1: Foundation — certifications, build personal brand, learn analytics tools",
      "Q2: Experience — land marketing role, execute 2 campaigns, build case studies",
      "Q3: Specialization — choose niche (growth, content, brand), deepen expertise",
      "Q4: Growth — lead strategy for a major initiative, negotiate raise or next role",
    ],
    resumeTips: [
      "Quantify everything: impressions, conversion rates, ROI, growth percentages",
      "Show campaign ownership from strategy to execution to measurement",
      "Highlight multi-channel experience: social, email, paid, content, SEO",
      "Include tools: Google Analytics, HubSpot, Mailchimp, Hootsuite, Canva",
      "Demonstrate storytelling ability in your resume itself",
    ],
    networkingTips: [
      "Join the American Marketing Association (AMA) local chapter",
      "Attend MarketingProfs and Content Marketing World events",
      "Share marketing insights and mini-case studies on LinkedIn",
      "Join Superpath, Demand Curve, or CXL communities",
      "Offer free marketing audits to build relationships and portfolio",
    ],
    applicationTips: [
      "Target marketing coordinator and strategist roles at mid-size companies",
      "Prepare a 30-60-90 day plan for each company you interview with",
      "Bring a sample campaign strategy to interviews",
      "Highlight data-driven decision-making alongside creative thinking",
      "Consider agency roles for faster skill development and variety",
    ],
    fallbacks: [
      "Social Media Manager — more focused, easier entry, high demand",
      "Content Marketing Manager — leverage writing skills, strong growth path",
      "Growth Marketing — more technical, higher pay, startup-friendly",
    ],
    whyFitsLong: "Marketing strategy sits at the intersection of creativity and analytics — two areas where you show strong aptitude. Your ability to understand what motivates people and craft compelling narratives translates directly into campaigns that convert. The field is evolving rapidly with AI and data-driven approaches, and your adaptability positions you well for the future of marketing.",
    bestRoute: "certification",
  },
  {
    id: 4,
    title: "Data Analyst",
    fit: 83,
    salaryEntry: "$60K",
    salaryMid: "$90K",
    salaryHigh: "$130K",
    salaryEntryNum: 60,
    salaryMidNum: 90,
    salaryHighNum: 130,
    availability: "Hot",
    growth: "Rising",
    education: "Cert / Bootcamp",
    workEnv: "Remote",
    bestFor: "Fast Income",
    whyFits: "Your pattern recognition skills and curiosity about why things work make data analysis a natural fit.",
    trainingTime: "3-6 months",
    effortLevel: "Medium-High",
    satisfaction: "Medium",
    remotePotential: "High",
    licensingNeeded: "None",
    timeToFirstJob: "4-6 months",
    certPath: ["Google Data Analytics Certificate (3 mo)", "IBM Data Analyst Certificate (4 mo)", "Microsoft Power BI Certification (2 mo)"],
    degreePath: ["Statistics or Math degree (4 yr)", "Data science bootcamp (6 mo)", "CS or Business Analytics degree (4 yr)"],
    portfolioMilestones: ["3 data projects on GitHub", "1 Tableau/Power BI dashboard", "1 Kaggle competition entry", "Blog explaining analyses"],
    quickStart: [
      "Start Google Data Analytics Certificate on Coursera",
      "Install Python and complete a basic pandas tutorial",
      "Learn SQL on SQLBolt (free, interactive)",
      "Sign up for Kaggle and explore beginner datasets",
      "Download Tableau Public and build your first visualization",
      "Follow data analysts on LinkedIn and Twitter",
      "Read Storytelling with Data by Cole Nussbaumer Knaflic",
      "Practice Excel pivot tables and VLOOKUP",
      "Join r/dataanalysis and r/dataisbeautiful communities",
      "Set up a GitHub account for portfolio projects",
    ],
    ninetyDayGoals: [
      "Month 1: Complete SQL basics, start Google cert, build 2 Excel analyses",
      "Month 2: Learn Python/pandas fundamentals, build first Tableau dashboard, complete Kaggle notebook",
      "Month 3: Finish Google cert, build 3 portfolio projects, start applying to roles",
    ],
    yearArc: [
      "Q1: Foundation — SQL, Python basics, Excel mastery, first certifications",
      "Q2: Portfolio — build 5 projects, learn Tableau/Power BI, enter Kaggle competitions",
      "Q3: Job search — apply aggressively, practice SQL interviews, refine portfolio",
      "Q4: Career — land analyst role, deepen skills on the job, plan advancement",
    ],
    resumeTips: [
      "List technical skills prominently: SQL, Python, Excel, Tableau, Power BI",
      "Quantify analytical impact: 'Identified $50K in cost savings through inventory analysis'",
      "Link to GitHub portfolio and Tableau Public dashboards",
      "Highlight business communication — translating data into actionable insights",
      "Include any domain expertise (finance, healthcare, marketing)",
    ],
    networkingTips: [
      "Join DataTalks.Club and Locally Optimistic Slack communities",
      "Attend local data meetups and analytics conferences",
      "Share data visualizations and insights on LinkedIn",
      "Contribute to open-source data projects",
      "Seek mentorship through MentorCruise or ADPList",
    ],
    applicationTips: [
      "Apply to junior analyst and business intelligence roles broadly",
      "Practice SQL interview questions on StrataScratch and LeetCode",
      "Prepare to discuss your portfolio projects in depth during interviews",
      "Target companies in industries you have domain knowledge in",
      "Consider contract or freelance analytics work to build experience",
    ],
    fallbacks: [
      "Business Intelligence Analyst — more visualization focus, similar skills",
      "Marketing Analyst — niche but high demand, leverages marketing interest",
      "Data Engineer — more technical, higher pay, if you enjoy the coding side",
    ],
    whyFitsLong: "Your analytical mindset and curiosity about patterns in data make this career a strong match. Data analysts are the storytellers of the business world — they turn raw numbers into insights that drive decisions. Your combination of logical thinking and communication skills means you can not only find the insights but explain them compellingly to stakeholders.",
    bestRoute: "certification",
  },
  {
    id: 5,
    title: "Creative Director",
    fit: 80,
    salaryEntry: "$70K",
    salaryMid: "$110K",
    salaryHigh: "$175K",
    salaryEntryNum: 70,
    salaryMidNum: 110,
    salaryHighNum: 175,
    availability: "Warm",
    growth: "Stable",
    education: "Experience-based",
    workEnv: "Hybrid",
    bestFor: "Long-Term Growth",
    whyFits: "Your vision for aesthetics combined with leadership instincts position you for creative direction.",
    trainingTime: "2-5 years",
    effortLevel: "High",
    satisfaction: "Very High",
    remotePotential: "Medium",
    licensingNeeded: "None",
    timeToFirstJob: "2-4 years",
    certPath: ["Adobe Creative Suite mastery (6 mo)", "Brand strategy workshops (ongoing)", "Leadership development programs (1 yr)"],
    degreePath: ["Graphic Design or Fine Arts degree (4 yr)", "Communications/Advertising degree (4 yr)", "MFA in Design (2 yr)"],
    portfolioMilestones: ["10+ campaign showcases", "3 brand identity projects", "Leadership case studies", "Awards or recognition"],
    quickStart: [
      "Audit your creative portfolio — identify gaps and strengths",
      "Study award-winning campaigns on Ads of the World",
      "Take a creative leadership course on LinkedIn Learning",
      "Start building a brand identity project from scratch",
      "Read Hey Whipple, Squeeze This by Luke Sullivan",
      "Follow creative directors on Instagram and Behance",
      "Analyze 5 brand redesigns and document what works",
      "Mentor a junior designer to build leadership skills",
      "Join AIGA or the One Club for Creativity",
      "Pitch a creative concept to a local business pro bono",
    ],
    ninetyDayGoals: [
      "Month 1: Complete creative audit, take leadership course, study 10 award-winning campaigns",
      "Month 2: Build 1 full brand identity project, mentor a junior, attend 2 creative events",
      "Month 3: Pitch creative concepts, update portfolio, apply to senior designer roles",
    ],
    yearArc: [
      "Q1: Skill deepening — master design tools, study creative leadership, build portfolio",
      "Q2: Experience — lead a creative team project, build brand strategy skills",
      "Q3: Recognition — enter award competitions, publish creative work, grow influence",
      "Q4: Advancement — target senior creative roles, build industry reputation",
    ],
    resumeTips: [
      "Lead with a visually stunning portfolio — your resume IS the proof",
      "Quantify creative impact: 'Led rebrand increasing brand awareness by 40%'",
      "Highlight team leadership and mentorship experience",
      "Show range across mediums: digital, print, video, brand systems",
      "Include awards, press, or notable client work",
    ],
    networkingTips: [
      "Attend AIGA events, D&AD, and creative industry conferences",
      "Build relationships at creative agencies through informational interviews",
      "Share behind-the-scenes creative process content on social media",
      "Join The Dots, Working Not Working, or CreativePool communities",
      "Collaborate with other creatives on passion projects",
    ],
    applicationTips: [
      "Target senior designer or art director roles as stepping stones",
      "Build relationships at agencies — creative director roles are often referral-based",
      "Prepare a creative presentation showcasing your vision and process",
      "Demonstrate both creative excellence and business acumen in interviews",
      "Consider freelance creative direction for smaller brands to build your track record",
    ],
    fallbacks: [
      "Art Director — similar creativity, more focused scope, clearer path",
      "Brand Designer — strong demand, portfolio-driven, good stepping stone",
      "Design Lead — technical design leadership, faster entry than CD",
    ],
    whyFitsLong: "Your instinct for visual storytelling, combined with your natural ability to lead and inspire others, makes Creative Director a long-term career goal worth pursuing. This role rewards the kind of holistic thinking you bring — blending aesthetics, strategy, and human psychology into campaigns that move people. The path requires patience but the ceiling is exceptional.",
    bestRoute: "experience",
  },
  {
    id: 6,
    title: "Content Strategist",
    fit: 78,
    salaryEntry: "$50K",
    salaryMid: "$75K",
    salaryHigh: "$115K",
    salaryEntryNum: 50,
    salaryMidNum: 75,
    salaryHighNum: 115,
    availability: "Growing",
    growth: "Rising",
    education: "Self-taught / Cert",
    workEnv: "Remote",
    bestFor: "Fast Income",
    whyFits: "Your ability to organize ideas and communicate clearly makes content strategy a strong match.",
    trainingTime: "2-4 months",
    effortLevel: "Medium",
    satisfaction: "Medium-High",
    remotePotential: "Very High",
    licensingNeeded: "None",
    timeToFirstJob: "3-5 months",
    certPath: ["HubSpot Content Marketing (free)", "Semrush SEO Certification (free)", "Content Science Academy (3 mo)"],
    degreePath: ["English, Journalism, or Communications degree (4 yr)", "Content marketing bootcamp (2 mo)", "Digital marketing degree (4 yr)"],
    portfolioMilestones: ["5 published articles", "1 content audit", "1 editorial calendar", "SEO case study"],
    quickStart: [
      "Complete HubSpot Content Marketing Certification",
      "Start a niche blog or Substack newsletter",
      "Learn SEO fundamentals on Semrush Academy",
      "Audit a company's content strategy and write findings",
      "Study content frameworks (pillar-cluster, content matrix)",
      "Read Content Strategy for the Web by Kristina Halvorson",
      "Learn basic analytics (Google Analytics, Search Console)",
      "Join Superpath and Content Marketing Institute communities",
      "Write 5 sample articles showcasing different content types",
      "Research AI-driven content tools (Jasper, Surfer SEO, ChatGPT prompting)",
    ],
    ninetyDayGoals: [
      "Month 1: Complete HubSpot cert, start blog, write 8 articles, learn SEO basics",
      "Month 2: Build content audit case study, learn analytics, grow newsletter to 100 subscribers",
      "Month 3: Complete Semrush cert, build full content strategy sample, start applying",
    ],
    yearArc: [
      "Q1: Foundation — certifications, build writing portfolio, learn SEO and analytics",
      "Q2: Growth — land content role, execute full content calendar, build case studies",
      "Q3: Specialization — develop niche expertise (B2B, SaaS, e-commerce)",
      "Q4: Advancement — lead content strategy, grow team, increase impact metrics",
    ],
    resumeTips: [
      "Showcase writing samples and published work prominently",
      "Quantify content impact: traffic growth, engagement, conversion rates",
      "List tools: CMS platforms, SEO tools, analytics, AI content tools",
      "Highlight editorial planning and cross-team collaboration",
      "Show ability to align content with business objectives",
    ],
    networkingTips: [
      "Join Superpath Slack community for content professionals",
      "Attend Content Marketing World and ContentTECH events",
      "Guest post on industry blogs to build authority",
      "Connect with content leads at target companies on LinkedIn",
      "Start a content-focused podcast or interview series",
    ],
    applicationTips: [
      "Apply to content coordinator, content marketer, and strategist roles",
      "Prepare a content strategy proposal for each company you interview with",
      "Showcase SEO knowledge and data-driven content decisions",
      "Highlight experience with content management systems",
      "Consider freelance content work to build portfolio and income fast",
    ],
    fallbacks: [
      "Copywriter — more execution-focused, faster entry, strong demand",
      "SEO Specialist — technical content angle, high demand, good pay",
      "Technical Writer — if you enjoy structured documentation, stable field",
    ],
    whyFitsLong: "Content strategy combines your organizational thinking with your communication skills in a way that creates real business impact. You'll be the architect of how brands communicate with their audiences, and your ability to see both the big picture and the details makes you well-suited for this planning-intensive role. The remote-friendly nature and low barrier to entry make this an accessible and rewarding path.",
    bestRoute: "self-taught",
  },
  {
    id: 7,
    title: "Business Analyst",
    fit: 76,
    salaryEntry: "$65K",
    salaryMid: "$95K",
    salaryHigh: "$140K",
    salaryEntryNum: 65,
    salaryMidNum: 95,
    salaryHighNum: 140,
    availability: "Hot",
    growth: "Stable",
    education: "Degree / Cert",
    workEnv: "Hybrid",
    bestFor: "Long-Term Growth",
    whyFits: "Your problem-solving skills and ability to translate complex ideas into actionable plans align with BA work.",
    trainingTime: "3-6 months",
    effortLevel: "Medium-High",
    satisfaction: "Medium",
    remotePotential: "Medium",
    licensingNeeded: "None",
    timeToFirstJob: "4-8 months",
    certPath: ["IIBA Entry Certificate in BA (2 mo)", "PMI-PBA (3 mo)", "Certified Business Analysis Professional (6 mo)"],
    degreePath: ["Business Administration degree (4 yr)", "Information Systems degree (4 yr)", "MBA (2 yr)"],
    portfolioMilestones: ["2 requirements documents", "1 process improvement case study", "1 data model", "Stakeholder analysis"],
    quickStart: [
      "Learn business analysis fundamentals on LinkedIn Learning",
      "Study the BABOK Guide (Business Analysis Body of Knowledge)",
      "Practice creating user stories and requirements documents",
      "Learn basic SQL and Excel data analysis",
      "Understand Agile and Waterfall methodologies",
      "Create a process map for a real-world business problem",
      "Join IIBA and attend local chapter meetings",
      "Practice stakeholder interview techniques",
      "Learn Jira, Confluence, and Visio basics",
      "Shadow a BA or attend BA webinars to understand day-to-day work",
    ],
    ninetyDayGoals: [
      "Month 1: Complete BA fundamentals course, learn SQL basics, study BABOK framework",
      "Month 2: Build 2 requirements documents, learn agile tools, practice stakeholder analysis",
      "Month 3: Earn ECBA certification, build portfolio, start applying to junior BA roles",
    ],
    yearArc: [
      "Q1: Foundation — BA certification, SQL/Excel skills, learn requirements elicitation",
      "Q2: Application — land BA or analyst role, build domain knowledge",
      "Q3: Deepening — lead requirements for a project, improve process modeling",
      "Q4: Growth — pursue CCBA certification, expand influence, target senior roles",
    ],
    resumeTips: [
      "Emphasize requirements gathering, stakeholder management, and process improvement",
      "Quantify impact: 'Streamlined process reducing cycle time by 30%'",
      "List tools: SQL, Excel, Jira, Confluence, Visio, Power BI",
      "Highlight cross-functional communication and facilitation skills",
      "Include domain expertise relevant to target industries",
    ],
    networkingTips: [
      "Join IIBA local and virtual chapter events",
      "Connect with BAs at target companies on LinkedIn",
      "Participate in BA community forums and discussion groups",
      "Attend Agile and PM conferences for cross-functional networking",
      "Seek mentorship from experienced BAs through IIBA mentoring program",
    ],
    applicationTips: [
      "Target junior BA, systems analyst, and requirements analyst roles",
      "Prepare to discuss your approach to requirements elicitation in interviews",
      "Bring a sample requirements document or process improvement analysis",
      "Highlight any experience bridging business and technical teams",
      "Consider consulting firms for accelerated BA experience",
    ],
    fallbacks: [
      "Systems Analyst — more technical, similar analytical skills, good demand",
      "Project Coordinator — stepping stone role, builds PM and BA skills",
      "Operations Analyst — process-focused, stable demand, similar skill set",
    ],
    whyFitsLong: "Business analysis is about being the bridge between what a business needs and how technology delivers it. Your ability to ask the right questions, document complex processes clearly, and manage diverse stakeholder expectations is exactly what makes great BAs. This path offers steady growth and the ability to work across virtually any industry.",
    bestRoute: "certification",
  },
  {
    id: 8,
    title: "Brand Consultant",
    fit: 74,
    salaryEntry: "$55K",
    salaryMid: "$90K",
    salaryHigh: "$160K",
    salaryEntryNum: 55,
    salaryMidNum: 90,
    salaryHighNum: 160,
    availability: "Growing",
    growth: "Rising",
    education: "Experience-based",
    workEnv: "Remote",
    bestFor: "Long-Term Growth",
    whyFits: "Your intuition for brand identity and strategic thinking position you well for brand consulting.",
    trainingTime: "1-2 years",
    effortLevel: "High",
    satisfaction: "High",
    remotePotential: "High",
    licensingNeeded: "None",
    timeToFirstJob: "6-12 months",
    certPath: ["Brand strategy workshops (3 mo)", "Marketing certifications (3 mo)", "Design thinking certification (2 mo)"],
    degreePath: ["Marketing or Advertising degree (4 yr)", "MBA with Brand focus (2 yr)", "Design or Communications degree (4 yr)"],
    portfolioMilestones: ["3 brand audits", "2 brand identity projects", "1 brand positioning case study", "Published thought leadership"],
    quickStart: [
      "Read Building a StoryBrand by Donald Miller",
      "Study 10 iconic brand transformations (Apple, Airbnb, etc.)",
      "Create a brand audit framework template",
      "Audit 3 local businesses' brands and document findings",
      "Build your own personal brand online",
      "Learn brand strategy frameworks (brand pyramid, archetype model)",
      "Follow top brand consultants and agencies on social media",
      "Take a brand strategy course on Coursera or Skillshare",
      "Start writing brand analysis articles on LinkedIn",
      "Offer a free brand audit to a startup or small business",
    ],
    ninetyDayGoals: [
      "Month 1: Complete brand strategy course, audit 3 brands, read 3 branding books",
      "Month 2: Build brand identity project for a real client, write 4 thought leadership pieces",
      "Month 3: Develop consulting framework, build portfolio site, start pitching small clients",
    ],
    yearArc: [
      "Q1: Knowledge — master brand strategy frameworks, build initial case studies",
      "Q2: Experience — take on 3-5 small brand projects, build reputation",
      "Q3: Authority — publish thought leadership, speak at events, grow client base",
      "Q4: Scale — raise rates, target larger clients, consider agency partnership or hire",
    ],
    resumeTips: [
      "Present as a portfolio-driven brand strategist, not a traditional resume",
      "Show before/after brand transformations with measurable results",
      "Highlight strategic thinking alongside creative execution",
      "Include client testimonials and case study outcomes",
      "Demonstrate understanding of market positioning and competitive analysis",
    ],
    networkingTips: [
      "Join brand strategy communities (Brand New, Under Consideration)",
      "Attend branding conferences (Brand Minds, Brandweek)",
      "Build referral relationships with designers, marketers, and PR professionals",
      "Share brand insights and analysis on social media consistently",
      "Join startup communities where founders need brand help",
    ],
    applicationTips: [
      "Start with freelance brand work to build your consulting practice",
      "Target brand coordinator or brand manager roles at agencies first",
      "Prepare case studies showing strategic thinking and measurable outcomes",
      "Position yourself as a specialist — choose a niche (tech, wellness, food)",
      "Consider white-labeling for established agencies while building your name",
    ],
    fallbacks: [
      "Brand Manager (in-house) — stable salary, brand work, corporate benefits",
      "Marketing Consultant — broader scope, more client variety, similar model",
      "Freelance Graphic Designer — build design skills while developing brand strategy chops",
    ],
    whyFitsLong: "Brand consulting allows you to blend strategic thinking with creative intuition in a way that directly shapes how businesses present themselves to the world. Your ability to see the essence of what makes something unique and translate that into a cohesive brand story is a rare and valuable skill. The consulting model also aligns with your desire for autonomy and variety in your work.",
    bestRoute: "experience",
  },
  {
    id: 9,
    title: "Therapist / Counselor",
    fit: 72,
    salaryEntry: "$45K",
    salaryMid: "$65K",
    salaryHigh: "$95K",
    salaryEntryNum: 45,
    salaryMidNum: 65,
    salaryHighNum: 95,
    availability: "Hot",
    growth: "Rising",
    education: "Degree required",
    workEnv: "Hybrid",
    bestFor: "Long-Term Growth",
    whyFits: "Your deep empathy and desire to help others heal point toward a meaningful career in therapy.",
    trainingTime: "4-7 years",
    effortLevel: "Very High",
    satisfaction: "Very High",
    remotePotential: "Medium",
    licensingNeeded: "Yes — State License (LPC, LCSW, LMFT)",
    timeToFirstJob: "5-7 years",
    certPath: ["Life coaching certification (3 mo, as stepping stone)", "Peer counselor certification (6 mo)", "Specialized therapy modalities (ongoing)"],
    degreePath: ["Master's in Counseling (2-3 yr)", "Master's in Social Work (2 yr)", "PsyD / PhD in Psychology (4-6 yr)"],
    portfolioMilestones: ["Clinical hours (2000-4000 required)", "Supervision documentation", "Specialization training", "Published research or articles"],
    quickStart: [
      "Research Master's programs in Counseling or Social Work",
      "Take a psychology course on Coursera to confirm interest",
      "Volunteer at a crisis hotline to gain experience",
      "Read The Gift of Therapy by Irvin Yalom",
      "Shadow a therapist or attend an open counseling workshop",
      "Explore therapy modalities (CBT, DBT, EMDR, psychodynamic)",
      "Join the American Counseling Association as a student member",
      "Start a personal therapy practice to understand the client experience",
      "Research licensure requirements in your state",
      "Connect with graduate students in counseling programs for insights",
    ],
    ninetyDayGoals: [
      "Month 1: Complete psychology intro course, research 5 grad programs, start volunteering",
      "Month 2: Take GRE if needed, prepare applications, read 3 therapy books",
      "Month 3: Submit grad school applications, continue volunteer hours, attend ACA events",
    ],
    yearArc: [
      "Q1: Research — explore programs, volunteer, confirm commitment to this path",
      "Q2: Preparation — apply to graduate programs, build prerequisite experience",
      "Q3: Transition — prepare for graduate school, deepen volunteer experience",
      "Q4: Begin — start graduate program, join professional associations, set long-term goals",
    ],
    resumeTips: [
      "Highlight empathy, active listening, and interpersonal communication skills",
      "Include volunteer experience with vulnerable populations",
      "Show commitment to the field through continuing education",
      "List relevant coursework and specialization interests",
      "Include any peer support or mentoring experience",
    ],
    networkingTips: [
      "Join ACA, NASW, or AAMFT professional associations",
      "Attend therapy conferences and workshop intensives",
      "Connect with practicing therapists for informational interviews",
      "Join online therapy communities for students and early-career professionals",
      "Seek supervision and mentorship early in your journey",
    ],
    applicationTips: [
      "Apply to accredited CACREP or CSWE programs for best licensure path",
      "Highlight personal growth journey and motivation in application essays",
      "Seek programs with strong clinical placement partnerships",
      "Consider part-time programs if you need to maintain income during school",
      "Research assistantship and scholarship opportunities to reduce costs",
    ],
    fallbacks: [
      "Life Coach — no license required, faster entry, growing market",
      "Peer Support Specialist — certification-based, meaningful work, faster start",
      "Human Resources — empathy-driven, no degree change needed, decent pay",
    ],
    whyFitsLong: "Your deep empathy, emotional intelligence, and genuine desire to help others navigate difficult moments makes therapy one of the most personally fulfilling career paths for you. While the education investment is significant, the impact you'll make on people's lives is immeasurable. This career offers the kind of meaning and purpose that sustains long-term satisfaction. The growing demand for mental health services also means strong job security.",
    bestRoute: "degree",
  },
  {
    id: 10,
    title: "Real Estate Agent",
    fit: 70,
    salaryEntry: "$30K",
    salaryMid: "$75K",
    salaryHigh: "$200K+",
    salaryEntryNum: 30,
    salaryMidNum: 75,
    salaryHighNum: 200,
    availability: "Warm",
    growth: "Stable",
    education: "License required",
    workEnv: "On-site",
    bestFor: "Fast Income",
    whyFits: "Your people skills and entrepreneurial drive could thrive in the high-reward world of real estate.",
    trainingTime: "2-4 months",
    effortLevel: "High",
    satisfaction: "Medium",
    remotePotential: "Low",
    licensingNeeded: "Yes — State Real Estate License",
    timeToFirstJob: "2-4 months",
    certPath: ["State pre-licensing course (2-3 mo)", "National Association of Realtors (ongoing)", "Certified Buyer Representative (3 mo)"],
    degreePath: ["Real estate pre-licensing (2-3 mo)", "Business degree (optional, 4 yr)", "Real estate investment courses (ongoing)"],
    portfolioMilestones: ["License obtained", "First 5 transactions", "Client testimonials", "Market analysis reports"],
    quickStart: [
      "Research your state's real estate licensing requirements",
      "Enroll in a pre-licensing course (online or in-person)",
      "Start studying for the state licensing exam",
      "Research brokerages in your area and their commission structures",
      "Attend open houses to observe experienced agents",
      "Read The Millionaire Real Estate Agent by Gary Keller",
      "Build your social media presence focused on local real estate",
      "Join local real estate investor meetups",
      "Start learning your local market — prices, neighborhoods, trends",
      "Connect with 3 active real estate agents for mentorship conversations",
    ],
    ninetyDayGoals: [
      "Month 1: Enroll in pre-licensing course, study daily, research brokerages",
      "Month 2: Complete pre-licensing course, pass state exam, join a brokerage",
      "Month 3: Set up business systems, start prospecting, attend 10 open houses",
    ],
    yearArc: [
      "Q1: Licensing — complete education, pass exam, join brokerage, set up systems",
      "Q2: Launch — start prospecting, close first 2-3 transactions, build sphere",
      "Q3: Growth — generate consistent leads, build reputation, get referrals",
      "Q4: Scale — target 1-2 transactions/month, build team or niche, increase income",
    ],
    resumeTips: [
      "Focus on sales experience, negotiation skills, and client relationship management",
      "Highlight any experience with contracts, finance, or property",
      "Show entrepreneurial drive and self-motivation",
      "Include community involvement and local market knowledge",
      "List technology skills: CRM, MLS, social media marketing",
    ],
    networkingTips: [
      "Join your local Board of Realtors and attend every event",
      "Build relationships with lenders, inspectors, and contractors",
      "Network at community events, chamber of commerce, and local groups",
      "Create a sphere of influence list and stay in touch monthly",
      "Partner with experienced agents on open houses and co-listings",
    ],
    applicationTips: [
      "Interview at 3-5 brokerages before choosing — compare splits, training, culture",
      "Look for brokerages with strong training programs for new agents",
      "Consider team structures that provide leads while you learn",
      "Negotiate your commission split and understand all fees upfront",
      "Prepare a business plan showing your first-year strategy",
    ],
    fallbacks: [
      "Property Manager — stable income, real estate adjacent, less sales pressure",
      "Mortgage Loan Officer — finance side of real estate, commission-based, growing",
      "Real Estate Investor — if you have capital, build passive income portfolio",
    ],
    whyFitsLong: "Real estate combines your interpersonal skills with your entrepreneurial spirit in a field where your income is directly tied to your effort and skill. The low barrier to entry and unlimited earning potential make it attractive for fast starters. Your ability to build rapport and negotiate effectively will serve you well in a relationship-driven industry. The key challenge is the initial income uncertainty, but the ceiling is virtually unlimited.",
    bestRoute: "license",
  },
];

/* ────────────────────────────────────────────────────────
   HELPER COMPONENTS
   ──────────────────────────────────────────────────────── */

function FitBar({ value }: { value: number }) {
  const color =
    value >= 85 ? "from-emerald-400 to-emerald-600" :
    value >= 75 ? "from-indigo-400 to-indigo-600" :
    value >= 65 ? "from-purple-400 to-purple-600" :
    "from-amber-400 to-amber-600";

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-white/80">{value}%</span>
    </div>
  );
}

function SalaryBar({ entry, mid, high, max = 220 }: { entry: number; mid: number; high: number; max?: number }) {
  return (
    <div className="relative h-3 rounded-full bg-white/[0.06] overflow-hidden">
      <div
        className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-emerald-500/60 to-emerald-400/80"
        style={{ width: `${(high / max) * 100}%` }}
      />
      <div
        className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-emerald-500/80 to-emerald-400"
        style={{ width: `${(mid / max) * 100}%` }}
      />
      <div
        className="absolute left-0 top-0 h-full rounded-full bg-emerald-500"
        style={{ width: `${(entry / max) * 100}%` }}
      />
    </div>
  );
}

function Badge({ label, variant }: { label: string; variant: "hot" | "warm" | "growing" | "stable" | "rising" | "declining" | "remote" | "hybrid" | "onsite" | "fast" | "long" }) {
  const styles: Record<string, string> = {
    hot: "bg-red-500/20 text-red-300 border-red-500/30",
    warm: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    growing: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    stable: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    rising: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    declining: "bg-red-500/20 text-red-300 border-red-500/30",
    remote: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    hybrid: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    onsite: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    fast: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    long: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles[variant]}`}>
      {label}
    </span>
  );
}

function badgeVariant(career: Career, type: "availability" | "growth" | "workEnv" | "bestFor") {
  const map: Record<string, "hot" | "warm" | "growing" | "stable" | "rising" | "declining" | "remote" | "hybrid" | "onsite" | "fast" | "long"> = {
    Hot: "hot", Warm: "warm", Growing: "growing", Stable: "stable",
    Rising: "rising", Declining: "declining",
    Remote: "remote", Hybrid: "hybrid", "On-site": "onsite",
    "Fast Income": "fast", "Long-Term Growth": "long",
  };
  const val = career[type];
  return map[val] || "stable";
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.04] backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  const labels = ["Top 10", "Narrow", "Compare", "Your Info", "Action Plan"];
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-white/40">Step {current} of {total}</span>
        <span className="text-sm text-white/40">{labels[current - 1]}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {labels.map((label, i) => (
          <span
            key={label}
            className={`text-[10px] font-medium transition-colors ${
              i + 1 <= current ? "text-indigo-400" : "text-white/20"
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function MetricCell({ value, level }: { value: string; level: "green" | "yellow" | "red" }) {
  const colors = {
    green: "text-emerald-400",
    yellow: "text-amber-400",
    red: "text-red-400",
  };
  return <span className={`font-medium ${colors[level]}`}>{value}</span>;
}

/* ────────────────────────────────────────────────────────
   PILL SELECTOR
   ──────────────────────────────────────────────────────── */

function PillSelect({ options, selected, onSelect, multi = false }: {
  options: string[];
  selected: string | string[];
  onSelect: (val: string) => void;
  multi?: boolean;
}) {
  const isSelected = (opt: string) =>
    multi ? (selected as string[]).includes(opt) : selected === opt;

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
            isSelected(opt)
              ? "border-indigo-500/50 bg-indigo-500/20 text-indigo-300"
              : "border-white/[0.08] bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/70"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   MAIN COMPONENT
   ──────────────────────────────────────────────────────── */

export default function CareerPage() {
  // Profile loading
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    db.getProfile().then((p) => {
      setProfile(p);
      setProfileLoading(false);
    });
  }, []);

  // Derived profile data
  const fullName = profile
    ? [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ")
    : "";
  const displayName = profile?.nickname || profile?.firstName || "";
  const dob = profile?.birthday ? new Date(profile.birthday + "T00:00:00") : null;
  const currentYear = new Date().getFullYear();

  const numerology = dob && fullName
    ? calculateFullNumerology(dob, fullName, currentYear)
    : null;
  const astrology = dob
    ? calculateSolarAstrology(dob, !!profile?.birthTime)
    : null;

  const lifePathNumber = numerology?.lifePath.value ?? null;
  const lifePathInterpretation = numerology?.lifePath.interpretation ?? "";
  const sunSign = astrology?.sunSign.name ?? null;
  const sunSignKeywords = astrology?.sunSign.keywords ?? [];
  const elementName = astrology?.element.name ?? null;
  const elementStrengths = astrology?.element.strengths ?? [];

  // Wizard step
  const [step, setStep] = useState(1);

  // Step 1: selected career IDs (max 3)
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Step 2: narrowing answers
  const [mostInteresting, setMostInteresting] = useState<number | null>(null);
  const [preferredEnv, setPreferredEnv] = useState<string>("");
  const [entryVsUpside, setEntryVsUpside] = useState(50);
  const [workTypes, setWorkTypes] = useState<string[]>([]);
  const [incomeTarget, setIncomeTarget] = useState<string>("");
  const [educationWilling, setEducationWilling] = useState<string>("");
  const [incomeSpeed, setIncomeSpeed] = useState<string>("");

  // Step 3: top 2 from narrowing, and chosen 1
  const [topTwo, setTopTwo] = useState<number[]>([]);
  const [chosenId, setChosenId] = useState<number | null>(null);

  // Step 4: user info
  const [educationLevel, setEducationLevel] = useState("");
  const [degrees, setDegrees] = useState("");
  const [certifications, setCertifications] = useState("");
  const [yearsExp, setYearsExp] = useState<number | "">("");
  const [industries, setIndustries] = useState("");
  const [skills, setSkills] = useState("");
  const [currentIncome, setCurrentIncome] = useState<number | "">("");
  const [targetIncome, setTargetIncome] = useState<number | "">("");
  const [timeline, setTimeline] = useState("");
  const [relocate, setRelocate] = useState("");
  const [attendSchool, setAttendSchool] = useState("");
  const [trainingBudget, setTrainingBudget] = useState("");
  const [weeklyHours, setWeeklyHours] = useState<number | "">("");
  const [remoteNeed, setRemoteNeed] = useState("");

  // ── Intake-based career personalization ──
  // Map user's career field to career titles that align
  const CAREER_FIELD_BOOST: Record<string, string[]> = {
    Technology: ["UX Designer", "Data Analyst", "Product Manager"],
    Healthcare: ["Therapist / Counselor"],
    "Creative/Arts": ["Creative Director", "UX Designer", "Content Strategist"],
    "Business/Finance": ["Business Analyst", "Product Manager", "Brand Consultant"],
    Education: ["Therapist / Counselor", "Content Strategist"],
    Engineering: ["Data Analyst", "Product Manager", "UX Designer"],
    "Marketing/Media": ["Marketing Strategist", "Content Strategist", "Brand Consultant"],
    Law: ["Business Analyst", "Brand Consultant"],
    "Science/Research": ["Data Analyst", "Business Analyst"],
    "Trades/Skilled Labor": ["Real Estate Agent"],
    Entertainment: ["Creative Director", "Content Strategist", "Brand Consultant"],
    "Social Work": ["Therapist / Counselor"],
    "Real Estate": ["Real Estate Agent", "Business Analyst"],
    Hospitality: ["Brand Consultant", "Real Estate Agent", "Marketing Strategist"],
    Government: ["Business Analyst", "Data Analyst"],
    Entrepreneurship: ["Product Manager", "Brand Consultant", "Marketing Strategist"],
    "Freelance/Consulting": ["Brand Consultant", "Creative Director", "Content Strategist"],
    "Not Sure Yet": [],
  };

  const CAREER_GOAL_BOOST: Record<string, string[]> = {
    "High Income": ["Product Manager", "Creative Director", "Data Analyst"],
    "Work-Life Balance": ["UX Designer", "Content Strategist", "Data Analyst"],
    "Creative Freedom": ["Creative Director", "UX Designer", "Content Strategist"],
    "Remote Work": ["UX Designer", "Data Analyst", "Content Strategist"],
    "Leadership/Management": ["Product Manager", "Creative Director"],
    "Making an Impact": ["Therapist / Counselor", "Marketing Strategist"],
    "Job Security": ["Data Analyst", "Business Analyst", "Product Manager"],
    "Fast Growth": ["UX Designer", "Data Analyst", "Marketing Strategist"],
    Flexibility: ["Brand Consultant", "Real Estate Agent", "Content Strategist"],
    "Travel Opportunities": ["Brand Consultant", "Marketing Strategist"],
    "Building Something": ["Product Manager", "Creative Director"],
    "Helping Others": ["Therapist / Counselor", "Content Strategist"],
  };

  // Score and sort careers based on intake preferences
  const personalizedCareers = [...CAREERS].map((c) => {
    let boost = 0;
    const userField = profile?.careerField || "";
    const userGoals = profile?.careerGoals || [];

    // Boost careers that match user's career field interest
    const fieldMatches = CAREER_FIELD_BOOST[userField] || [];
    if (fieldMatches.includes(c.title)) boost += 10;

    // Boost careers that match user's career goals
    for (const goal of userGoals) {
      const goalMatches = CAREER_GOAL_BOOST[goal] || [];
      if (goalMatches.includes(c.title)) boost += 5;
    }

    return { ...c, fit: Math.min(99, c.fit + boost) };
  }).sort((a, b) => b.fit - a.fit);

  // Reassign IDs for display ordering
  const DISPLAY_CAREERS = personalizedCareers;

  // Derived data
  const selectedCareers = DISPLAY_CAREERS.filter((c) => selectedIds.includes(c.id));
  const topTwoCareers = DISPLAY_CAREERS.filter((c) => topTwo.includes(c.id));
  const chosenCareer = DISPLAY_CAREERS.find((c) => c.id === chosenId) || null;

  /* ── Step 1 handlers ── */
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  /* ── Step 2 → 3 transition: pick top 2 from 3 ── */
  const handleNarrowToTwo = () => {
    const scored = selectedCareers.map((c) => {
      let score = c.fit;
      if (c.id === mostInteresting) score += 15;
      if (c.workEnv === preferredEnv) score += 5;
      if (entryVsUpside < 40 && c.bestFor === "Fast Income") score += 5;
      if (entryVsUpside > 60 && c.bestFor === "Long-Term Growth") score += 5;
      if (workTypes.includes("Creative") && ["UX Designer", "Creative Director", "Content Strategist", "Brand Consultant"].includes(c.title)) score += 3;
      if (workTypes.includes("Analytical") && ["Data Analyst", "Business Analyst", "Product Manager"].includes(c.title)) score += 3;
      if (workTypes.includes("Leadership") && ["Product Manager", "Creative Director"].includes(c.title)) score += 3;
      if (workTypes.includes("Client-facing") && ["Brand Consultant", "Real Estate Agent", "Therapist / Counselor"].includes(c.title)) score += 3;
      if (workTypes.includes("Technical") && ["Data Analyst", "UX Designer"].includes(c.title)) score += 3;
      if (workTypes.includes("Hands-on") && ["Real Estate Agent", "Therapist / Counselor"].includes(c.title)) score += 3;
      if (incomeTarget === "$150K+" && c.salaryHighNum >= 150) score += 5;
      if (incomeTarget === "$100K+" && c.salaryHighNum >= 100) score += 3;
      if (incomeSpeed === "ASAP" && c.bestFor === "Fast Income") score += 5;
      return { id: c.id, score };
    });
    scored.sort((a, b) => b.score - a.score);
    setTopTwo([scored[0].id, scored[1].id]);
    setStep(3);
  };

  /* ── Step 5: export ── */
  const handleExport = () => {
    if (!chosenCareer) return;
    const c = chosenCareer;
    const md = `# Career Action Plan: ${c.title}${displayName ? `\n**Prepared for:** ${fullName}` : ""}${sunSign ? `\n**Sun Sign:** ${sunSign}` : ""}${lifePathNumber !== null ? ` | **Life Path:** ${lifePathNumber}` : ""}${profile?.birthCity && profile?.birthState ? `\n**Location:** ${profile.birthCity}, ${profile.birthState}` : ""}

## Why This Fits
${c.whyFitsLong}

## Salary Outlook
- Entry: ${c.salaryEntry}
- Mid-Career: ${c.salaryMid}
- Senior: ${c.salaryHigh}

## Best Route
${c.bestRoute === "certification" ? c.certPath.map((s, i) => `${i + 1}. ${s}`).join("\n") :
  c.bestRoute === "degree" ? c.degreePath.map((s, i) => `${i + 1}. ${s}`).join("\n") :
  c.bestRoute === "self-taught" ? c.portfolioMilestones.map((s, i) => `${i + 1}. ${s}`).join("\n") :
  c.certPath.map((s, i) => `${i + 1}. ${s}`).join("\n")}

## 30-Day Quick Start
${c.quickStart.map((s, i) => `- [ ] ${s}`).join("\n")}

## 90-Day Milestone Plan
${c.ninetyDayGoals.map((s) => `- ${s}`).join("\n")}

## 12-Month Strategic Arc
${c.yearArc.map((s) => `- ${s}`).join("\n")}

## Resume & Portfolio Tips
${c.resumeTips.map((s) => `- ${s}`).join("\n")}

## Networking Strategy
${c.networkingTips.map((s) => `- ${s}`).join("\n")}

## Application Strategy
${c.applicationTips.map((s) => `- ${s}`).join("\n")}

## Fallback Options
${c.fallbacks.map((s) => `- ${s}`).join("\n")}

---
Generated by Destination Future Career Decision Engine
`;
    navigator.clipboard.writeText(md);
  };

  /* ────────────────────────────────────────────────────────
     RENDER
     ──────────────────────────────────────────────────────── */

  if (profileLoading) {
    return (
      <div className="mx-auto max-w-5xl pb-20 flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-4 rounded-full border-2 border-indigo-500/40 border-t-indigo-400 animate-spin" />
          <p className="text-sm text-white/40">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile || !profile.intakeComplete || !profile.birthday) {
    return (
      <div className="mx-auto max-w-5xl pb-20 flex items-center justify-center min-h-[40vh]">
        <GlassCard className="p-8 text-center max-w-md">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
            <span className="text-2xl">&#9733;</span>
          </div>
          <h2 className="text-lg font-bold text-white/90 mb-2">Complete Your Profile First</h2>
          <p className="text-sm text-white/50 mb-6 leading-relaxed">
            We need your name and birthday to generate personalized career recommendations based on your numerological and astrological profile.
          </p>
          <a
            href="/intake"
            className="inline-block rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
          >
            Complete Intake
          </a>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl pb-20">
      <h1 className="text-2xl font-bold text-white/90 mb-1">Career Decision Engine</h1>
      <p className="text-white/30 mb-6">From 10 recommendations to 1 chosen path with a full action plan.</p>

      {/* Personalized Profile Banner */}
      <GlassCard className="p-5 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white/90 mb-1">
              Personalized for {displayName || fullName}
            </h2>
            {profile.birthCity && profile.birthState && (
              <p className="text-xs text-white/40 mb-2">Based in {profile.birthCity}, {profile.birthState}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {sunSign && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300">
                  {astrology?.sunSign.symbol} {sunSign}
                </span>
              )}
              {lifePathNumber !== null && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300">
                  Life Path {lifePathNumber}
                </span>
              )}
              {elementName && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                  {elementName} Element
                </span>
              )}
              {profile?.careerField && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                  {profile.careerField}
                </span>
              )}
              {profile?.careerGoals && profile.careerGoals.length > 0 && profile.careerGoals.map((goal) => (
                <span key={goal} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-300">
                  {goal}
                </span>
              ))}
            </div>
          </div>
          <div className="text-left sm:text-right">
            {sunSignKeywords.length > 0 && (
              <p className="text-xs text-white/30">
                <span className="text-white/50 font-medium">Core Traits:</span>{" "}
                {sunSignKeywords.slice(0, 4).join(", ")}
              </p>
            )}
            {elementStrengths.length > 0 && (
              <p className="text-xs text-white/30 mt-1">
                <span className="text-white/50 font-medium">Strengths:</span>{" "}
                {elementStrengths.slice(0, 3).join(", ")}
              </p>
            )}
          </div>
        </div>
        {lifePathInterpretation && (
          <p className="mt-3 pt-3 border-t border-white/[0.06] text-xs text-white/40 leading-relaxed">
            <span className="text-white/60 font-medium">Career Insight (Life Path {lifePathNumber}):</span>{" "}
            {lifePathInterpretation}
          </p>
        )}
      </GlassCard>

      <StepIndicator current={step} total={5} />

      {/* ═══════════════════════════════════════
          STEP 1: TOP 10
          ═══════════════════════════════════════ */}
      {step === 1 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white/80">{displayName ? `${displayName}'s` : "Your"} Top 10 Career Matches</h2>
            <span className="text-sm text-white/40">{selectedIds.length}/3 selected</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {DISPLAY_CAREERS.map((c) => {
              const isSelected = selectedIds.includes(c.id);
              return (
                <GlassCard
                  key={c.id}
                  className={`p-5 transition-all cursor-pointer ${
                    isSelected
                      ? "border-indigo-500/40 bg-indigo-500/[0.06] ring-1 ring-indigo-500/20"
                      : "hover:border-white/[0.12] hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-base font-bold text-white/90">{c.title}</h3>
                      <p className="mt-1 text-xs text-white/40 leading-relaxed">{c.whyFits}</p>
                    </div>
                    <button
                      onClick={() => toggleSelect(c.id)}
                      className={`ml-3 flex-shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                        isSelected
                          ? "border-indigo-500/50 bg-indigo-500/30 text-indigo-200"
                          : "border-white/[0.1] bg-white/[0.04] text-white/50 hover:bg-white/[0.08]"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </button>
                  </div>

                  {/* Fit score */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase tracking-wider text-white/30">Fit Score</span>
                    </div>
                    <FitBar value={c.fit} />
                  </div>

                  {/* Salary */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase tracking-wider text-white/30">Salary Range</span>
                      <span className="text-[10px] text-white/40">{c.salaryEntry} → {c.salaryMid} → {c.salaryHigh}</span>
                    </div>
                    <SalaryBar entry={c.salaryEntryNum} mid={c.salaryMidNum} high={c.salaryHighNum} />
                  </div>

                  {/* Badges row 1 */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <Badge label={c.availability} variant={badgeVariant(c, "availability")} />
                    <Badge label={c.growth} variant={badgeVariant(c, "growth")} />
                    <Badge label={c.workEnv} variant={badgeVariant(c, "workEnv")} />
                    <Badge label={c.bestFor} variant={badgeVariant(c, "bestFor")} />
                  </div>

                  {/* Education path */}
                  <p className="text-[11px] text-white/30">
                    <span className="text-white/50 font-medium">Path:</span> {c.education}
                  </p>
                </GlassCard>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => {
                if (selectedIds.length === 3) setStep(2);
              }}
              disabled={selectedIds.length !== 3}
              className={`rounded-xl px-8 py-3 text-sm font-semibold transition-all ${
                selectedIds.length === 3
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                  : "bg-white/[0.06] text-white/30 cursor-not-allowed"
              }`}
            >
              Continue with Top 3 →
            </button>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════
          STEP 2: NARROWING QUESTIONS
          ═══════════════════════════════════════ */}
      {step === 2 && (
        <>
          <button onClick={() => setStep(1)} className="mb-6 flex items-center gap-1 text-sm text-white/40 hover:text-white/60 transition-colors">
            ← Back to Top 10
          </button>

          {/* Selected career summary cards */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {selectedCareers.map((c) => (
              <GlassCard key={c.id} className="p-3 text-center">
                <h4 className="text-sm font-bold text-white/80">{c.title}</h4>
                <p className="text-xs text-white/40 mt-0.5">{c.fit}% fit</p>
                <p className="text-[10px] text-white/30 mt-0.5">{c.salaryEntry} – {c.salaryHigh}</p>
              </GlassCard>
            ))}
          </div>

          <div className="space-y-8">
            {/* Q1: Most interesting */}
            <GlassCard className="p-5">
              <h3 className="text-sm font-semibold text-white/80 mb-3">Which sounds most interesting to you?</h3>
              <div className="space-y-2">
                {selectedCareers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setMostInteresting(c.id)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                      mostInteresting === c.id
                        ? "border-indigo-500/50 bg-indigo-500/20 text-indigo-200"
                        : "border-white/[0.08] bg-white/[0.02] text-white/50 hover:bg-white/[0.06]"
                    }`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Q2: Work environment */}
            <GlassCard className="p-5">
              <h3 className="text-sm font-semibold text-white/80 mb-3">Which work environment feels best?</h3>
              <PillSelect
                options={["Remote", "Hybrid", "On-site"]}
                selected={preferredEnv}
                onSelect={setPreferredEnv}
              />
            </GlassCard>

            {/* Q3: Quick entry vs long-term upside */}
            <GlassCard className="p-5">
              <h3 className="text-sm font-semibold text-white/80 mb-3">Do you want quick entry or long-term upside?</h3>
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/40 w-20 text-right">Quick Entry</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={entryVsUpside}
                  onChange={(e) => setEntryVsUpside(Number(e.target.value))}
                  className="flex-1 accent-indigo-500"
                />
                <span className="text-xs text-white/40 w-24">Long-Term Upside</span>
              </div>
            </GlassCard>

            {/* Q4: Work type */}
            <GlassCard className="p-5">
              <h3 className="text-sm font-semibold text-white/80 mb-3">What type of work do you prefer? <span className="text-white/30 font-normal">(select multiple)</span></h3>
              <PillSelect
                options={["Hands-on", "Analytical", "Creative", "Leadership", "Client-facing", "Technical"]}
                selected={workTypes}
                onSelect={(val) =>
                  setWorkTypes((prev) =>
                    prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
                  )
                }
                multi
              />
            </GlassCard>

            {/* Q5: Income target */}
            <GlassCard className="p-5">
              <h3 className="text-sm font-semibold text-white/80 mb-3">What income target matters most?</h3>
              <PillSelect
                options={["$50K+", "$75K+", "$100K+", "$150K+"]}
                selected={incomeTarget}
                onSelect={setIncomeTarget}
              />
            </GlassCard>

            {/* Q6: Education willingness */}
            <GlassCard className="p-5">
              <h3 className="text-sm font-semibold text-white/80 mb-3">How much education are you willing to do?</h3>
              <PillSelect
                options={["None", "3-month cert", "6-month bootcamp", "2-year degree", "4-year degree"]}
                selected={educationWilling}
                onSelect={setEducationWilling}
              />
            </GlassCard>

            {/* Q7: Income speed */}
            <GlassCard className="p-5">
              <h3 className="text-sm font-semibold text-white/80 mb-3">How quickly do you need income?</h3>
              <PillSelect
                options={["ASAP", "3 months", "6 months", "1 year+"]}
                selected={incomeSpeed}
                onSelect={setIncomeSpeed}
              />
            </GlassCard>
          </div>

          {/* CTA */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleNarrowToTwo}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
            >
              Narrow to Top 2 →
            </button>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════
          STEP 3: SIDE-BY-SIDE COMPARISON
          ═══════════════════════════════════════ */}
      {step === 3 && (
        <>
          <button onClick={() => setStep(2)} className="mb-6 flex items-center gap-1 text-sm text-white/40 hover:text-white/60 transition-colors">
            ← Back to Narrowing
          </button>

          <h2 className="text-lg font-semibold text-white/80 mb-6">Side-by-Side Comparison</h2>

          {topTwoCareers.length === 2 && (
            <GlassCard className="overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-3 border-b border-white/[0.06]">
                <div className="p-4">
                  <span className="text-xs uppercase tracking-wider text-white/30">Metric</span>
                </div>
                {topTwoCareers.map((c) => (
                  <div key={c.id} className="p-4 text-center border-l border-white/[0.06]">
                    <h3 className="text-sm font-bold text-white/90">{c.title}</h3>
                    <p className="text-xs text-indigo-400 mt-0.5">{c.fit}% fit</p>
                  </div>
                ))}
              </div>

              {/* Rows */}
              {([
                {
                  label: "Salary Range",
                  values: topTwoCareers.map((c) => ({ text: `${c.salaryEntry} – ${c.salaryHigh}`, level: c.salaryHighNum >= 140 ? "green" as const : c.salaryHighNum >= 100 ? "yellow" as const : "red" as const })),
                },
                {
                  label: "Market Growth",
                  values: topTwoCareers.map((c) => ({ text: c.growth, level: c.growth === "Rising" ? "green" as const : c.growth === "Stable" ? "yellow" as const : "red" as const })),
                },
                {
                  label: "Training Time",
                  values: topTwoCareers.map((c) => ({ text: c.trainingTime, level: c.trainingTime.includes("month") && !c.trainingTime.includes("year") ? "green" as const : "yellow" as const })),
                },
                {
                  label: "Effort Level",
                  values: topTwoCareers.map((c) => ({ text: c.effortLevel, level: c.effortLevel === "Medium" ? "green" as const : c.effortLevel === "High" || c.effortLevel === "Medium-High" ? "yellow" as const : "red" as const })),
                },
                {
                  label: "Demand",
                  values: topTwoCareers.map((c) => ({ text: c.availability, level: c.availability === "Hot" ? "green" as const : c.availability === "Warm" || c.availability === "Growing" ? "yellow" as const : "red" as const })),
                },
                {
                  label: "Work Environment",
                  values: topTwoCareers.map((c) => ({ text: c.workEnv, level: c.workEnv === "Remote" ? "green" as const : c.workEnv === "Hybrid" ? "yellow" as const : "red" as const })),
                },
                {
                  label: "Satisfaction Fit",
                  values: topTwoCareers.map((c) => ({ text: c.satisfaction, level: c.satisfaction.includes("High") ? "green" as const : "yellow" as const })),
                },
                {
                  label: "Remote Potential",
                  values: topTwoCareers.map((c) => ({ text: c.remotePotential, level: c.remotePotential === "High" || c.remotePotential === "Very High" ? "green" as const : c.remotePotential === "Medium" ? "yellow" as const : "red" as const })),
                },
                {
                  label: "Licensing Needed",
                  values: topTwoCareers.map((c) => ({ text: c.licensingNeeded, level: c.licensingNeeded === "None" ? "green" as const : "red" as const })),
                },
                {
                  label: "Time to First Job",
                  values: topTwoCareers.map((c) => ({ text: c.timeToFirstJob, level: c.timeToFirstJob.includes("month") && !c.timeToFirstJob.includes("year") ? "green" as const : "yellow" as const })),
                },
              ]).map((row, ri) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-3 ${ri % 2 === 0 ? "bg-white/[0.02]" : ""} border-b border-white/[0.04]`}
                >
                  <div className="p-3 flex items-center">
                    <span className="text-xs font-medium text-white/50">{row.label}</span>
                  </div>
                  {row.values.map((v, vi) => (
                    <div key={vi} className="p-3 text-center border-l border-white/[0.06]">
                      <MetricCell value={v.text} level={v.level} />
                    </div>
                  ))}
                </div>
              ))}

              {/* Choose buttons */}
              <div className="grid grid-cols-3 border-t border-white/[0.06]">
                <div className="p-4" />
                {topTwoCareers.map((c) => (
                  <div key={c.id} className="p-4 text-center border-l border-white/[0.06]">
                    <button
                      onClick={() => {
                        setChosenId(c.id);
                        setStep(4);
                      }}
                      className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
                    >
                      Choose {c.title}
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════
          STEP 4: EDUCATION & EXPERIENCE INTAKE
          ═══════════════════════════════════════ */}
      {step === 4 && chosenCareer && (
        <>
          <button onClick={() => setStep(3)} className="mb-6 flex items-center gap-1 text-sm text-white/40 hover:text-white/60 transition-colors">
            ← Back to Comparison
          </button>

          {/* Chosen career mini card */}
          <GlassCard className="p-4 mb-8 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              #1
            </div>
            <div>
              <h3 className="text-sm font-bold text-white/90">{chosenCareer.title}</h3>
              <p className="text-xs text-white/40">{chosenCareer.fit}% fit — {chosenCareer.salaryEntry} to {chosenCareer.salaryHigh}</p>
            </div>
          </GlassCard>

          <h2 className="text-lg font-semibold text-white/80 mb-2">Tell Us About You</h2>
          <p className="text-sm text-white/30 mb-6">We&apos;ll use this to personalize your action plan.</p>

          <div className="space-y-6">
            {/* Education level */}
            <GlassCard className="p-5">
              <label className="block text-sm font-medium text-white/70 mb-2">Current Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white/80 outline-none focus:border-indigo-500/50 transition-colors"
              >
                <option value="" className="bg-[#0a0e27]">Select...</option>
                <option value="High School" className="bg-[#0a0e27]">High School</option>
                <option value="Some College" className="bg-[#0a0e27]">Some College</option>
                <option value="Associate's" className="bg-[#0a0e27]">Associate&apos;s</option>
                <option value="Bachelor's" className="bg-[#0a0e27]">Bachelor&apos;s</option>
                <option value="Master's" className="bg-[#0a0e27]">Master&apos;s</option>
                <option value="PhD" className="bg-[#0a0e27]">PhD</option>
              </select>
            </GlassCard>

            {/* Degrees */}
            <GlassCard className="p-5">
              <label className="block text-sm font-medium text-white/70 mb-2">Degrees Completed</label>
              <input
                type="text"
                value={degrees}
                onChange={(e) => setDegrees(e.target.value)}
                placeholder="e.g., B.A. in Communications"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-indigo-500/50 transition-colors"
              />
            </GlassCard>

            {/* Certifications */}
            <GlassCard className="p-5">
              <label className="block text-sm font-medium text-white/70 mb-2">Certifications Held</label>
              <input
                type="text"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                placeholder="e.g., Google Analytics, PMP"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-indigo-500/50 transition-colors"
              />
            </GlassCard>

            {/* Years of experience */}
            <GlassCard className="p-5">
              <label className="block text-sm font-medium text-white/70 mb-2">Years of Work Experience</label>
              <input
                type="number"
                value={yearsExp}
                onChange={(e) => setYearsExp(e.target.value ? Number(e.target.value) : "")}
                placeholder="0"
                min={0}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-indigo-500/50 transition-colors"
              />
            </GlassCard>

            {/* Industries */}
            <GlassCard className="p-5">
              <label className="block text-sm font-medium text-white/70 mb-2">Relevant Industries</label>
              <input
                type="text"
                value={industries}
                onChange={(e) => setIndustries(e.target.value)}
                placeholder="e.g., Tech, Healthcare, Finance"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-indigo-500/50 transition-colors"
              />
            </GlassCard>

            {/* Transferable skills */}
            <GlassCard className="p-5">
              <label className="block text-sm font-medium text-white/70 mb-2">Transferable Skills</label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., Project management, public speaking, data analysis, writing..."
                rows={3}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-indigo-500/50 transition-colors resize-none"
              />
            </GlassCard>

            {/* Income fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <GlassCard className="p-5">
                <label className="block text-sm font-medium text-white/70 mb-2">Current Income</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
                  <input
                    type="number"
                    value={currentIncome}
                    onChange={(e) => setCurrentIncome(e.target.value ? Number(e.target.value) : "")}
                    placeholder="50,000"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-8 pr-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
              </GlassCard>
              <GlassCard className="p-5">
                <label className="block text-sm font-medium text-white/70 mb-2">Target Income</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
                  <input
                    type="number"
                    value={targetIncome}
                    onChange={(e) => setTargetIncome(e.target.value ? Number(e.target.value) : "")}
                    placeholder="100,000"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-8 pr-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
              </GlassCard>
            </div>

            {/* Timeline */}
            <GlassCard className="p-5">
              <label className="block text-sm font-medium text-white/70 mb-3">Preferred Timeline</label>
              <PillSelect
                options={["3 months", "6 months", "1 year", "2 years"]}
                selected={timeline}
                onSelect={setTimeline}
              />
            </GlassCard>

            {/* Relocate */}
            <GlassCard className="p-5">
              <label className="block text-sm font-medium text-white/70 mb-3">Willing to Relocate?</label>
              <PillSelect
                options={["Yes", "No", "Maybe"]}
                selected={relocate}
                onSelect={setRelocate}
              />
            </GlassCard>

            {/* School */}
            <GlassCard className="p-5">
              <label className="block text-sm font-medium text-white/70 mb-3">Willing to Attend School?</label>
              <PillSelect
                options={["Yes", "No", "Online Only"]}
                selected={attendSchool}
                onSelect={setAttendSchool}
              />
            </GlassCard>

            {/* Training budget */}
            <GlassCard className="p-5">
              <label className="block text-sm font-medium text-white/70 mb-3">Budget for Training</label>
              <PillSelect
                options={["$0", "Under $500", "Under $2K", "Under $10K", "$10K+"]}
                selected={trainingBudget}
                onSelect={setTrainingBudget}
              />
            </GlassCard>

            {/* Weekly hours */}
            <GlassCard className="p-5">
              <label className="block text-sm font-medium text-white/70 mb-2">Hours Available Weekly for Training</label>
              <input
                type="number"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(e.target.value ? Number(e.target.value) : "")}
                placeholder="10"
                min={0}
                max={80}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-indigo-500/50 transition-colors"
              />
            </GlassCard>

            {/* Remote need */}
            <GlassCard className="p-5">
              <label className="block text-sm font-medium text-white/70 mb-3">Need for Remote Work</label>
              <PillSelect
                options={["Required", "Preferred", "Flexible", "No"]}
                selected={remoteNeed}
                onSelect={setRemoteNeed}
              />
            </GlassCard>
          </div>

          {/* CTA */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setStep(5)}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
            >
              Build My Action Plan →
            </button>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════
          STEP 5: FINAL ACTION PLAN
          ═══════════════════════════════════════ */}
      {step === 5 && chosenCareer && (() => {
        const c = chosenCareer;
        return (
          <>
            <button onClick={() => setStep(4)} className="mb-6 flex items-center gap-1 text-sm text-white/40 hover:text-white/60 transition-colors">
              ← Back to Your Info
            </button>

            {/* 1. Chosen Career Summary */}
            <div className="rounded-2xl overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/60 mb-1">{displayName ? `${displayName}'s` : "Your"} Chosen Career Path</p>
                    <h2 className="text-2xl font-bold text-white">{c.title}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">{c.fit}%</p>
                    <p className="text-xs text-white/60">Fit Score</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge label={c.availability} variant={badgeVariant(c, "availability")} />
                  <Badge label={c.growth} variant={badgeVariant(c, "growth")} />
                  <Badge label={c.workEnv} variant={badgeVariant(c, "workEnv")} />
                  <Badge label={c.bestFor} variant={badgeVariant(c, "bestFor")} />
                </div>
              </div>
              <div className="border border-t-0 border-white/[0.06] bg-white/[0.04] px-6 py-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-white/30 mb-0.5">Training Time</p>
                    <p className="text-sm font-semibold text-white/80">{c.trainingTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/30 mb-0.5">Time to First Job</p>
                    <p className="text-sm font-semibold text-white/80">{c.timeToFirstJob}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/30 mb-0.5">Remote Potential</p>
                    <p className="text-sm font-semibold text-white/80">{c.remotePotential}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Why This Fits */}
            <GlassCard className="p-6 mb-6">
              <h3 className="text-base font-bold text-white/90 mb-3 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-bold">1</span>
                Why This Fits {displayName || "You"}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">{c.whyFitsLong}</p>

              {/* Personalized astrological/numerological insight */}
              {(sunSign || lifePathNumber !== null) && (
                <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3">
                  {sunSign && (
                    <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.04] p-4">
                      <p className="text-xs font-semibold text-amber-300/80 mb-1">
                        {astrology?.sunSign.symbol} {sunSign} Alignment
                      </p>
                      <p className="text-xs text-white/50 leading-relaxed">
                        As a {sunSign} ({astrology?.sunSign.dateRange}), your core traits
                        {" "}&#8212; {sunSignKeywords.slice(0, 3).join(", ")} &#8212;{" "}
                        align well with this career path.
                        {elementName && (
                          <> Your {elementName} element brings {elementStrengths.slice(0, 2).join(" and ").toLowerCase()} to the table.</>
                        )}
                      </p>
                    </div>
                  )}
                  {lifePathNumber !== null && (
                    <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/[0.04] p-4">
                      <p className="text-xs font-semibold text-indigo-300/80 mb-1">
                        Life Path {lifePathNumber} Connection
                      </p>
                      <p className="text-xs text-white/50 leading-relaxed">
                        {numerology?.lifePath.opportunity}
                      </p>
                    </div>
                  )}
                  {numerology?.personalYear && (
                    <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/[0.04] p-4">
                      <p className="text-xs font-semibold text-cyan-300/80 mb-1">
                        Personal Year {numerology.personalYear.value} ({currentYear})
                      </p>
                      <p className="text-xs text-white/50 leading-relaxed">
                        {numerology.personalYear.interpretation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>

            {/* 3. Salary Outlook */}
            <GlassCard className="p-6 mb-6">
              <h3 className="text-base font-bold text-white/90 mb-4 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold">2</span>
                Salary Outlook
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-white/40">Entry Level</span>
                    <span className="text-xs font-semibold text-emerald-400">{c.salaryEntry}</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500/60" style={{ width: `${(c.salaryEntryNum / 220) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-white/40">Mid-Career</span>
                    <span className="text-xs font-semibold text-emerald-400">{c.salaryMid}</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500/80" style={{ width: `${(c.salaryMidNum / 220) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-white/40">Senior / High</span>
                    <span className="text-xs font-semibold text-emerald-300">{c.salaryHigh}</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${(c.salaryHighNum / 220) * 100}%` }} />
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* 4. Best Route */}
            <GlassCard className="p-6 mb-6">
              <h3 className="text-base font-bold text-white/90 mb-4 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 text-xs font-bold">3</span>
                Recommended Path: {c.bestRoute === "certification" ? "Certification Ladder" : c.bestRoute === "degree" ? "Degree Path" : c.bestRoute === "self-taught" ? "Self-Taught Portfolio" : c.bestRoute === "experience" ? "Experience-Based" : "Licensing Route"}
              </h3>
              <div className="space-y-3">
                {(c.bestRoute === "certification" ? c.certPath :
                  c.bestRoute === "degree" ? c.degreePath :
                  c.bestRoute === "self-taught" ? c.portfolioMilestones :
                  c.bestRoute === "license" ? c.certPath :
                  c.certPath
                ).map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5 h-6 w-6 rounded-full border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-indigo-400">{i + 1}</span>
                    </div>
                    <p className="text-sm text-white/60">{item}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* 5. 30-Day Quick Start */}
            <GlassCard className="p-6 mb-6">
              <h3 className="text-base font-bold text-white/90 mb-4 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 text-xs font-bold">4</span>
                30-Day Quick Start Checklist
              </h3>
              <div className="space-y-2.5">
                {c.quickStart.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-md border border-white/[0.12] bg-white/[0.04] flex items-center justify-center group-hover:border-indigo-500/40 transition-colors">
                      <span className="text-[10px] text-white/30">{i + 1}</span>
                    </div>
                    <p className="text-sm text-white/60">{item}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* 6. 90-Day Milestone Plan */}
            <GlassCard className="p-6 mb-6">
              <h3 className="text-base font-bold text-white/90 mb-4 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-bold">5</span>
                90-Day Milestone Plan
              </h3>
              <div className="space-y-4">
                {c.ninetyDayGoals.map((goal, i) => (
                  <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-sm text-white/70 leading-relaxed">{goal}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* 7. 12-Month Strategic Arc */}
            <GlassCard className="p-6 mb-6">
              <h3 className="text-base font-bold text-white/90 mb-4 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 text-xs font-bold">6</span>
                12-Month Strategic Arc
              </h3>
              <div className="space-y-4">
                {c.yearArc.map((quarter, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16">
                      <div className={`rounded-lg px-2 py-1 text-center text-[10px] font-bold uppercase tracking-wider ${
                        i === 0 ? "bg-indigo-500/20 text-indigo-400" :
                        i === 1 ? "bg-purple-500/20 text-purple-400" :
                        i === 2 ? "bg-cyan-500/20 text-cyan-400" :
                        "bg-emerald-500/20 text-emerald-400"
                      }`}>
                        Q{i + 1}
                      </div>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed">{quarter}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* 8. Resume & Portfolio Tips */}
            <GlassCard className="p-6 mb-6">
              <h3 className="text-base font-bold text-white/90 mb-4 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400 text-xs font-bold">7</span>
                Resume & Portfolio Tips
              </h3>
              <ul className="space-y-3">
                {c.resumeTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-teal-400/60" />
                    <p className="text-sm text-white/60">{tip}</p>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* 9. Networking Strategy */}
            <GlassCard className="p-6 mb-6">
              <h3 className="text-base font-bold text-white/90 mb-4 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold">8</span>
                Networking Strategy
              </h3>
              <ul className="space-y-3">
                {c.networkingTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400/60" />
                    <p className="text-sm text-white/60">{tip}</p>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* 10. Application Strategy */}
            <GlassCard className="p-6 mb-6">
              <h3 className="text-base font-bold text-white/90 mb-4 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400 text-xs font-bold">9</span>
                Application Strategy
              </h3>
              <ul className="space-y-3">
                {c.applicationTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-400/60" />
                    <p className="text-sm text-white/60">{tip}</p>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* 11. Fallback Options */}
            <GlassCard className="p-6 mb-6">
              <h3 className="text-base font-bold text-white/90 mb-4 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400 text-xs font-bold">10</span>
                Fallback Options
              </h3>
              <p className="text-xs text-white/30 mb-4">If your primary route stalls, consider these alternatives:</p>
              <div className="space-y-3">
                {c.fallbacks.map((fb, i) => (
                  <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5 h-6 w-6 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-orange-400">{String.fromCharCode(65 + i)}</span>
                      </div>
                      <p className="text-sm text-white/60">{fb}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* 12. Export Plan */}
            <div className="flex justify-center mt-8 mb-4">
              <button
                onClick={handleExport}
                className="rounded-xl border border-white/[0.1] bg-white/[0.06] px-8 py-3 text-sm font-semibold text-white/70 hover:bg-white/[0.1] hover:text-white transition-all"
              >
                Export Plan to Clipboard (Markdown)
              </button>
            </div>

            {/* Restart option */}
            <div className="flex justify-center mt-2">
              <button
                onClick={() => {
                  setStep(1);
                  setSelectedIds([]);
                  setMostInteresting(null);
                  setPreferredEnv("");
                  setEntryVsUpside(50);
                  setWorkTypes([]);
                  setIncomeTarget("");
                  setEducationWilling("");
                  setIncomeSpeed("");
                  setTopTwo([]);
                  setChosenId(null);
                }}
                className="text-sm text-white/30 hover:text-white/50 transition-colors"
              >
                Start Over
              </button>
            </div>
          </>
        );
      })()}
    </div>
  );
}
