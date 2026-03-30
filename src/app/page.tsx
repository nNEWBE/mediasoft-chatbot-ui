'use client';

import Link from "next/link";
import { motion } from "motion/react";
import { Bot, Sparkles, Shield, Rocket, ArrowRight, Github } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary opacity-5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-secondary opacity-5 blur-[120px]" />
      </div>

      <main className="relative z-10 container mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 glass-effect bg-white/5 mb-8"
        >
          <Sparkles className="w-4 h-4 text-brand-secondary" />
          <span className="text-xs font-medium tracking-wide text-white/70 uppercase">New: MCP Context Protocol Integrated</span>
        </motion.div>

        {/* Hero Section */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl"
        >
          Elevate Your Business with <span className="gradient-text">Mediasoft BD</span> AI Assistant
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-white/50 max-w-2xl mb-12 leading-relaxed"
        >
          A high-performance AI companion trained specifically on Mediasoft's ecosystem.
          Streamline your workflow with real-time context-aware business intelligence.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/login"
            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary px-8 py-3.5 rounded-xl font-semibold text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(79,172,254,0.3)]"
          >
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold border border-white/10 hover:bg-white/5 transition-all text-white/90 shadow-inner"
          >
            <Github className="w-5 h-5" />
            View Repository
          </a>
        </motion.div>

        {/* Small Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-5xl w-full">
          {[
            { icon: <Bot className="w-6 h-6" />, title: "Intelligent Assistant", desc: "Expert in Mediasoft POS, ERP, and distribution systems." },
            { icon: <Shield className="w-6 h-6" />, title: "Secure Context", desc: "Enterprise-grade auth and session isolation for your data." },
            { icon: <Rocket className="w-6 h-6" />, title: "High Consistency", desc: "Built using strict MCP-style system protocols for reliability." }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
              className="p-8 rounded-2xl glass-effect border border-white/5 text-left hover:border-brand-primary/20 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-6 text-brand-primary group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/40 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </div>
  );
}
