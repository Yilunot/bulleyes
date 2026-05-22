/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  Sliders, 
  History, 
  Target, 
  ShieldAlert, 
  Cpu, 
  Database,
  Info,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getTacticalAdvice, Message } from '../services/geminiService';
import { ArcherProfile, Session, SightSetting, FormAnalysis } from '../types';
import { useTheme } from '../context/ThemeContext';

interface AIAssistantProps {
  profile: ArcherProfile | null;
  sessions: Session[];
  sightSettings: SightSetting[];
  analyses: FormAnalysis[];
}

export default function AIAssistant({ profile, sessions, sightSettings, analyses }: AIAssistantProps) {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: "Welcome, Archer. I am **Valkyrie**, your Tactical Archery Intelligence Coach. \n\nI have fully synchronized with your **Biometric Profile**, **Sight Registries**, **Training Logs**, and **Form Diagnostics**.\n\nChoose one of the **Tactical Audits** below, or ask me any question about bow tuning, form consistency, or sight predictions!" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = textToSend.trim();
    if (!customText) {
      setInput('');
    }
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await getTacticalAdvice(
        userMessage, 
        messages, 
        { profile, sessions, sightSettings, analyses }
      );
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "I encountered a processing anomaly when checking the tactical datasets. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Preset query prompts
  const presets = [
    {
      title: "📊 Consistency Audit",
      prompt: "Can you analyze my recent session scores and consistency trends to help me improve my arrow grouping?",
      color: "border-emerald-500/10 hover:border-emerald-500/40 text-emerald-400 bg-emerald-500/[0.02]"
    },
    {
      title: "🎯 Sight Tape Predictive Map",
      prompt: "Based on my registered sight marks, can you perform a parobolic/linear interpolation to calculate my custom sight tape elevations for intermediate distances?",
      color: "border-blue-500/10 hover:border-blue-500/40 text-blue-400 bg-blue-500/[0.02]"
    },
    {
      title: "🔧 Spine & Flight Balance",
      prompt: "Analyze my equipped arrow length, point weight, draw weight and bow type. Is my current static spine safely balanced or over/underspined?",
      color: "border-amber-500/10 hover:border-amber-500/40 text-amber-400 bg-amber-500/[0.02]"
    },
    {
      title: "🧘 Form Diagnostics",
      prompt: "Based on my form analyzer coach logs, what physical defects have been found in my anchor points or alignment, and how do I cure them?",
      color: "border-purple-500/10 hover:border-purple-500/40 text-purple-400 bg-purple-500/[0.02]"
    }
  ];

  // Derive stats for dossier
  const totalLoggedShots = sessions.reduce((acc, curr) => acc + (curr.shots || []).length, 0);
  const averageAllShots = (() => {
    let rawShots = sessions.flatMap(s => s.shots || []);
    if (rawShots.length === 0) return '0.0';
    const sum = rawShots.reduce((acc, s) => acc + s.score, 0);
    return (sum / rawShots.length).toFixed(1);
  })();

  const latestDistance = sessions.length > 0 ? sessions[sessions.length - 1].distance : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Valkyrie Tactical AI</h1>
          <p className="text-[var(--muted)] font-mono text-[10px] uppercase tracking-widest mt-1">
            Autonomous Archery Advisor & Ballistic Predictor
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#dcfc44]/10 border border-[#dcfc44]/30 rounded-xl">
          <Cpu size={14} className="text-[#dcfc44]" />
          <span className="text-[10px] uppercase font-mono font-bold text-[#dcfc44] tracking-wider animate-pulse">
            Active Telemetry Feed
          </span>
        </div>
      </header>

      {/* Main layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Comprehensive Chat Console */}
        <div className="lg:col-span-8 flex flex-col h-[650px] bg-[var(--card-bg)] border border-[var(--line)] rounded-3xl overflow-hidden shadow-md">
          {/* Console Header */}
          <div className="px-6 py-4 border-b border-[var(--line)] bg-[var(--line)]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#dcfc44] flex items-center justify-center shadow-sm">
                <Bot size={18} className="text-black" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--ink)] leading-none">Valkyrie Advisor</h3>
                <span className="text-[9px] font-mono text-[var(--muted)] uppercase tracking-wider">Synced Intelligence Agent</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase text-gray-500">
              <Database size={10} className="text-gray-400" />
              <span>Context Size: Fully Loaded</span>
            </div>
          </div>

          {/* Chat message flow */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide scroll-smooth bg-[var(--bg)]/10"
          >
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border ${
                    message.role === 'user' 
                      ? 'bg-neutral-500/10 border-neutral-500/20 text-neutral-400' 
                      : 'bg-[#dcfc44]/10 border-[#dcfc44]/20 text-[#dcfc44]'
                  }`}>
                    {message.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`px-5 py-4 rounded-3xl text-[13px] leading-relaxed shadow-sm ${
                    message.role === 'user' 
                      ? 'bg-[var(--accent)] text-[var(--bg)] font-bold rounded-tr-none' 
                      : 'bg-[var(--card-bg)] border border-[var(--line)] text-[var(--ink)] rounded-tl-none markdown-body'
                  }`}>
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#dcfc44]/10 border border-[#dcfc44]/20 flex items-center justify-center">
                    <Loader2 size={14} className="text-[#dcfc44] animate-spin" />
                  </div>
                  <div className="px-5 py-3.5 bg-[var(--card-bg)] border border-[var(--line)] rounded-3xl rounded-tl-none">
                    <div className="flex gap-1.5 items-center">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-1.5 h-1.5 bg-[#dcfc44] rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#dcfc44] rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#dcfc44] rounded-full" />
                      <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider ml-1">Analyzing cross-tab data</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick presets footer */}
          {messages.length === 1 && (
            <div className="p-6 pb-2 border-t border-[var(--line)] bg-[var(--line)]/5">
              <p className="text-[9px] font-mono uppercase tracking-widest text-[var(--muted)] mb-3">
                Run Contextual Diagnostic Audits
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(preset.prompt)}
                    className={`flex items-center justify-between text-left px-4 py-2.5 rounded-xl border text-xs font-mono transition-all duration-250 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${preset.color}`}
                  >
                    <span>{preset.title}</span>
                    <ChevronRight size={12} className="opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat input box */}
          <div className="p-6">
            <div className="relative group flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Valkyrie (e.g. 'How does my point weight affect arrow speeds?' or 'Calculate 40m sight elev')"
                className="flex-1 bg-[var(--line)] border border-transparent rounded-2xl px-5 py-4 text-xs font-mono placeholder:text-gray-500 focus:outline-none focus:border-[var(--accent)]/40 transition-all text-[var(--ink)]"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="px-5 rounded-2xl bg-[var(--accent)] text-[var(--bg)] hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-md flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Context Dossier Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[var(--card-bg)] border border-[var(--line)] rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <div>
                <h3 className="text-sm font-bold tracking-tight">Context dossier</h3>
                <p className="text-[9px] font-mono text-[var(--muted)] uppercase tracking-wider">
                  Live database parameters
                </p>
              </div>
              <Sparkles size={14} className="text-[#dcfc44]" />
            </div>

            {/* Config Profile Stats Section */}
            <div className="space-y-3.5">
              <h4 className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest flex items-center gap-2">
                <Sliders size={12} className="text-[var(--accent)]" />
                <span>1. Archer Profile Spec</span>
              </h4>
              {profile ? (
                <div className="bg-[var(--line)]/30 backdrop-blur-sm rounded-2xl p-4 space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500 uppercase">Bow Style</span>
                    <span className="font-bold uppercase text-[var(--ink)]">{profile.bow_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 uppercase">Draw Weight</span>
                    <span className="font-bold text-[var(--ink)]">{profile.draw_weight} lbs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 uppercase">Draw Length</span>
                    <span className="font-bold text-[var(--ink)]">{profile.draw_length}"</span>
                  </div>
                  {profile.arrow_length && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 uppercase">Arrow Length</span>
                      <span className="font-bold text-[var(--ink)]">{profile.arrow_length}"</span>
                    </div>
                  )}
                  {profile.arrow_spine && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 uppercase">Required Spine</span>
                      <span className="font-bold text-[#dcfc44]">{profile.arrow_spine}</span>
                    </div>
                  )}
                  {profile.point_weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 uppercase">Point Weight</span>
                      <span className="font-bold text-[var(--ink)]">{profile.point_weight} gr</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[var(--line)]/10 border border-dashed border-[var(--line)] text-center text-xs font-mono text-[var(--muted)]">
                  Profile data empty. Go to onboarding first!
                </div>
              )}
            </div>

            {/* Sight Settings Section */}
            <div className="space-y-3.5">
              <h4 className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest flex items-center gap-2">
                <Target size={12} className="text-blue-400" />
                <span>2. Sight Registry Feed</span>
              </h4>
              {sightSettings.length > 0 ? (
                <div className="bg-[var(--line)]/30 backdrop-blur-sm rounded-2xl p-4 max-h-36 overflow-y-auto space-y-2 font-mono text-xs scrollbar-hide">
                  {sightSettings.map(s => (
                    <div key={s.id} className="flex justify-between items-center border-b border-[var(--line)]/40 pb-1.5 last:border-b-0 last:pb-0">
                      <span className="font-bold text-[#dcfc44]">{s.distance} meters</span>
                      <div className="text-right">
                        <span className="text-gray-300">Elev {s.elevation}</span>
                        {s.windage !== 0 && (
                          <span className="text-blue-400 ml-1.5">W: {s.windage > 0 ? `L${s.windage}` : `R${Math.abs(s.windage)}`}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[var(--line)]/10 border border-dashed border-[var(--line)] text-center text-xs font-mono text-[var(--muted)]">
                  No sight marks calibrated yet.
                </div>
              )}
            </div>

            {/* Sessions Summary Section */}
            <div className="space-y-3.5">
              <h4 className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest flex items-center gap-2">
                <History size={12} className="text-emerald-400" />
                <span>3. Performance Logs</span>
              </h4>
              {sessions.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="bg-[var(--line)]/20 p-3 rounded-2xl">
                    <span className="text-[9px] text-gray-500 block uppercase">Total Sessions</span>
                    <span className="text-lg font-black text-emerald-400 mt-1 block">{sessions.length}</span>
                  </div>
                  <div className="bg-[var(--line)]/20 p-3 rounded-2xl">
                    <span className="text-[9px] text-gray-500 block uppercase">Log Count</span>
                    <span className="text-lg font-black text-[var(--ink)] mt-1 block">{totalLoggedShots} shots</span>
                  </div>
                  <div className="bg-[var(--line)]/20 col-span-2 p-3 rounded-2xl flex justify-between items-center px-4">
                    <span className="text-[9px] text-gray-500 uppercase">Average Shot Score</span>
                    <span className="text-sm font-black text-[var(--accent)]">{averageAllShots} / 10</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[var(--line)]/10 border border-dashed border-[var(--line)] text-center text-xs font-mono text-[var(--muted)]">
                  Shoot a session to feed analytics.
                </div>
              )}
            </div>

            {/* Form Analysis Diagnostics Section */}
            <div className="space-y-3.5">
              <h4 className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest flex items-center gap-2">
                <Award size={12} className="text-purple-400" />
                <span>4. Form Analysis Diagnostics</span>
              </h4>
              {analyses.length > 0 ? (
                <div className="bg-[var(--line)]/30 backdrop-blur-sm rounded-2xl p-4 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-gray-400">
                    <span>Uploaded Profiles</span>
                    <span className="font-bold text-[var(--ink)]">{analyses.length} scans</span>
                  </div>
                  {analyses[0].issues && analyses[0].issues.length > 0 && (
                    <div className="border-t border-[var(--line)]/40 pt-1.5 mt-1.5">
                      <span className="text-[9px] text-gray-500 uppercase">Latest Form Error</span>
                      <p className="text-red-400 text-[10px] truncate mt-0.5 font-bold">● {analyses[0].issues[0]}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[var(--line)]/10 border border-dashed border-[var(--line)] text-center text-xs font-mono text-[var(--muted)]">
                  No biometrics uploaded or scanned.
                </div>
              )}
            </div>

          </div>
          <div className="p-5 border border-amber-500/10 rounded-2xl bg-amber-500/[0.01] items-start flex gap-3 text-[11px] leading-relaxed text-gray-400">
            <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p>
              Valkyrie derives ballistic equations to calculate custom sight scale projections and equipment balance. Make changes in other tabs to instantly synchronize intelligence files.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
