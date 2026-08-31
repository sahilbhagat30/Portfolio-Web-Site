"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, ChevronDown } from "lucide-react";

/* ── Sahil's knowledge base baked in as a system prompt ── */
const SYSTEM_PROMPT = `You are Sahil Bhagat's personal AI assistant embedded in his portfolio website. You represent Sahil professionally and help visitors learn about his experience, skills, and work.

Here is everything you know about Sahil:

PERSONAL INFO:
- Name: Sahil Bhagat
- Location: New York City, NY
- Email: sahilbhagat1497@gmail.com
- LinkedIn: linkedin.com/in/sahil-sanjay-bhagat
- GitHub: github.com/sahilbhagat30

EDUCATION:
- MS in Information Systems, Syracuse University (iSchool)
- Focus: Data Engineering, Analytics, Business Intelligence

EXPERIENCE:
1. Anywhere Real Estate (Most Recent)
   - Role: Data Engineer / Analytics Engineer
   - Built scalable data pipelines and automated operational reporting for vendor productivity
   - Designed data models that surfaced ~$400K in actionable cost-saving opportunities through optimized resource allocation
   - Technologies: Snowflake, dbt, Power BI, SQL, Python

2. iConsult Collaborative (Syracuse University)
   - Role: Data Engineer / Consultant
   - Engineered end-to-end data pipelines and performance measurement frameworks for healthcare workforce planning
   - Standardized disparate operational data into semantic layers for executive leadership visibility into provider efficiency
   - Technologies: SQL, Python, data pipelines, semantic modeling

3. United Nations
   - Role: Data Analytics Consultant
   - Unified clinical, financial, and operational data architectures across 183 global healthcare facilities
   - Built robust analytics engineering frameworks enabling leadership to reliably track international compliance
   - Technologies: Data architecture, analytics engineering, global data standards

4. Capgemini
   - Role: Data Engineer / BI Developer
   - Automated enterprise analytics by integrating complex data pipelines across financial, sales, and HR domains
   - Replaced manual workflows with scalable data infrastructure, saving ~40 hours per month
   - Technologies: Informatica, SQL, Power BI, Python, enterprise data integration

5. Tata Consultancy Services (TCS)
   - Role: Business Analyst / Data Analyst
   - Partnered with enterprise stakeholders to design modern data architectures and drive strategic insights
   - Standardized analytics methodologies and data models to optimize cross-functional operations
   - Technologies: SQL, data modeling, stakeholder communication, BI tools

SKILLS:
- Data & Cloud: Snowflake, BigQuery, AWS, dbt, Airflow, Databricks
- BI & Analytics: Power BI, DAX, Tableau, Looker, SQL
- Programming & Tools: Python, Pandas, Git, CI/CD, Informatica

PERSONAL PROJECTS:
1. Gestational Diabetes Early Prediction
   - ML + Deep Learning for early prediction of gestational diabetes
   - Developed in collaboration with Fetal Life
   - Technologies: Python, Scikit-learn, TensorFlow, Pandas, Healthcare AI

2. Medication Reminder Platform (Aetna)
   - Full-stack analytics platform for the Aetna Medication Reminder System
   - Built data telemetry pipelines for real-time admin tracking
   - Technologies: React 19, Node.js, PostgreSQL, Docker, BFF Architecture

PERSONALITY & PHILOSOPHY:
- Believes the real problem is rarely the data — it's that nobody can see it clearly
- Passionate about closing the gap between raw data and actionable insights
- Experienced at both building reliable pipelines AND creating digestible, beautiful dashboards
- Known for finding cost-saving opportunities and automating manual work
- Has worked across consulting, enterprise, and global/non-profit organizations

RESPONSE GUIDELINES:
- Be conversational, warm, and professional — like Sahil himself would answer
- Keep answers concise (2-4 sentences max for simple questions, longer for complex ones)
- If asked something you don't know about Sahil, say you're not sure but suggest they email him directly
- Never make up information not listed above
- Use first-person perspective when speaking as Sahil ("Sahil has..." or be reflective)
- If asked about availability or hiring, say Sahil is open to conversations about exciting opportunities
- For technical questions, be specific about the technologies and impact where possible`;

/* ── Suggested starter questions ── */
const STARTERS = [
  "What's your biggest achievement?",
  "What tech stack do you use?",
  "Tell me about your UN project",
  "Are you open to new opportunities?",
];

/* ── Message types ── */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/* ── Typing indicator ── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 0.15, 0.3].map((delay) => (
        <motion.div
          key={delay}
          className="w-1.5 h-1.5 rounded-full bg-white/40"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ── Individual message bubble ── */
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 mr-2"
          style={{ background: "linear-gradient(135deg, rgba(234,230,225,0.2), rgba(163,163,163,0.1))", border: "1px solid rgba(234,230,225,0.2)" }}
        >
          <Sparkles size={10} className="text-[#EAE6E1]" />
        </div>
      )}
      <div
        className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
        style={
          isUser
            ? {
                background: "rgba(234,230,225,0.12)",
                border: "1px solid rgba(234,230,225,0.2)",
                color: "rgba(255,255,255,0.9)",
                borderBottomRightRadius: "6px",
              }
            : {
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.8)",
                borderBottomLeftRadius: "6px",
              }
        }
      >
        {message.content}
      </div>
    </motion.div>
  );
}

/* ── Main chatbot component ── */
export default function AskMeAnything() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey! I'm Sahil's AI assistant. Ask me anything about his experience, skills, or projects — I'm here to help! 👋",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  useEffect(() => {
    if (!apiKey) setHasApiKey(false);
  }, [apiKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // If no API key, show fallback
    if (!apiKey) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: "I'd love to answer that, but my AI key isn't configured yet! In the meantime, feel free to reach out to Sahil directly at sahilbhagat1497@gmail.com 📧",
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
      }, 800);
      return;
    }

    try {
      // Build conversation history for Gemini
      const conversationHistory = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        }));

      conversationHistory.push({
        role: "user",
        parts: [{ text: text.trim() }],
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: SYSTEM_PROMPT }],
            },
            contents: conversationHistory,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 300,
              topP: 0.9,
            },
          }),
        }
      );

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      const assistantText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "I had trouble processing that. Try rephrasing or contact Sahil directly!";

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: assistantText,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I hit a snag! Feel free to reach out to Sahil directly at sahilbhagat1497@gmail.com",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, apiKey]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <>
      {/* Floating bubble trigger */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium cursor-pointer select-none"
        style={{
          background: "var(--background)",
          border: "1px solid rgba(234,230,225,0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(234,230,225,0.05)",
          color: "rgba(234,230,225,0.8)",
        }}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: isOpen ? 0 : 1, y: isOpen ? 20 : 0, scale: isOpen ? 0.9 : 1, pointerEvents: isOpen ? "none" : "auto" }}
        whileHover={{ scale: 1.04, borderColor: "rgba(234,230,225,0.4)" }}
        whileTap={{ scale: 0.97, transition: { type: "spring", bounce: 0, duration: 0.3 } }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        aria-label="Open AI chat"
        id="ask-me-anything-trigger"
      >
        <motion.div
          animate={{ rotate: [0, 15, -10, 15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
        >
          <Sparkles size={16} />
        </motion.div>
        Ask me anything
        {/* Pulsing dot */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EAE6E1] opacity-50" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EAE6E1]" />
        </span>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed bottom-6 right-6 z-[60] flex flex-col overflow-hidden"
            style={{
              width: "min(380px, calc(100vw - 32px))",
              height: "min(560px, calc(100vh - 48px))",
              borderRadius: "24px",
              background: "rgba(3, 5, 15, 0.85)",
              backdropFilter: "blur(32px) saturate(160%)",
              WebkitBackdropFilter: "blur(32px) saturate(160%)",
              border: "1px solid rgba(234,230,225,0.12)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(234,230,225,0.04), inset 0 1px 0 rgba(234,230,225,0.05)",
            }}
            id="ask-me-anything-window"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(234,230,225,0.15), rgba(163,163,163,0.08))",
                    border: "1px solid rgba(234,230,225,0.2)",
                  }}
                >
                  <Sparkles size={14} className="text-[#EAE6E1]" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-none mb-0.5">Ask Sahil</p>
                  <p className="text-white/35 text-[10px] tracking-widest uppercase">AI Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!hasApiKey && (
                  <span className="text-[10px] text-amber-400/60 uppercase tracking-widest">Demo mode</span>
                )}
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close chat"
                >
                  <ChevronDown size={16} />
                </motion.button>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close chat"
                >
                  <X size={14} />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div
                    className="rounded-2xl rounded-bl-md"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <TypingDots />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Starter prompts (shown only at start) */}
            {messages.length === 1 && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="px-4 pb-2 flex flex-wrap gap-2"
              >
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-1.5 rounded-full transition-all"
                    style={{
                      background: "rgba(234,230,225,0.05)",
                      border: "1px solid rgba(234,230,225,0.12)",
                      color: "rgba(234,230,225,0.6)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(234,230,225,0.1)";
                      (e.currentTarget as HTMLElement).style.color = "rgba(234,230,225,0.9)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(234,230,225,0.05)";
                      (e.currentTarget as HTMLElement).style.color = "rgba(234,230,225,0.6)";
                    }}
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Input area */}
            <div
              className="px-4 py-3 shrink-0"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="flex items-end gap-2 rounded-xl px-3 py-2"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about experience, skills, projects…"
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-white/80 placeholder:text-white/25 resize-none focus:outline-none leading-relaxed"
                  style={{ maxHeight: "80px", scrollbarWidth: "none" }}
                  disabled={isLoading}
                  id="ask-me-anything-input"
                />
                <motion.button
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5 transition-all disabled:opacity-30"
                  style={{
                    background: inputValue.trim() ? "rgba(234,230,225,0.15)" : "transparent",
                    border: "1px solid rgba(234,230,225,0.2)",
                  }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Send message"
                  id="ask-me-anything-send"
                >
                  <Send size={12} className="text-[#EAE6E1]" />
                </motion.button>
              </div>
              <p className="text-center text-white/15 text-[9px] tracking-widest uppercase mt-2">
                Powered by Gemini AI · Knowledge based on Sahil's experience
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
