'use client';

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { 
  Bot, Shield, Rocket, ArrowRight, Zap,
  Database, Lock, Globe, Cpu
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button as MovingButton } from "@/components/ui/moving-border";


export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden antialiased font-outfit">

      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      <BackgroundBeams />

      <main className="relative z-10 container mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default font-space"
        >
          <span className="opacity-40"><Bot className="w-4 h-4 text-white" /></span>
          <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
            Enterprise Intelligence v2.0
          </span>
        </motion.div>


        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-8xl font-black tracking-tight mb-8 max-w-6xl font-space leading-[0.95]"
        >
          THE FUTURE OF <br />
          <span className="bg-clip-text text-transparent bg-linear-to-b from-neutral-50 to-neutral-500">
            BUSINESS COGNITION
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-white/40 max-w-2xl mb-12 leading-relaxed"
        >
          Harness the power of autonomous AI specialized for the Mediasoft ecosystem. 
          Real-time POS, ERP, and distribution intelligence at your fingertips.
        </motion.p>


        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link href="/login" className="group/btn relative overflow-hidden rounded-xl">
            <MovingButton
              borderRadius="0.75rem"
              containerClassName="h-12 w-44"
              duration={3000}
              className="bg-primary text-primary-foreground font-bold tracking-tight flex items-center gap-2 border-none text-xs relative z-10"
            >
              <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out" />
              Get Started
              <Zap className="w-3.5 h-3.5 fill-current" />
            </MovingButton>
          </Link>
          
          <a
            href="https://github.com"
            target="_blank"
            className="group relative inline-flex items-center justify-center gap-3 h-12 w-44 rounded-xl font-bold border border-white/5 bg-white/2 hover:bg-white/5 transition-all text-white/60 hover:text-white shadow-xl active:scale-95 overflow-hidden text-xs"
          >
            <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            <FaGithub className="w-4 h-4 group-hover:scale-110 transition-transform relative z-10" />
            <span className="relative z-10">View Repository</span>
          </a>
        </motion.div>


        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-32 max-w-7xl w-full">
          {[
            { 
              icon: <Cpu className="w-5 h-5 text-current" />, 
              title: "Neural ERP", 
              desc: "Deep integration with Mediasoft core ERP systems." 
            },
            { 
              icon: <Globe className="w-5 h-5 text-current" />, 
              title: "Global Sync", 
              desc: "Multi-branch POS synchronization via real-time RAG." 
            },
            { 
              icon: <Lock className="w-5 h-5 text-current" />, 
              title: "Vault Secure", 
              desc: "Military-grade encryption for enterprise data assets." 
            },
            { 
              icon: <Zap className="w-5 h-5 text-current" />, 
              title: "Hyper Latency", 
              desc: "Sub-100ms response times for critical business queries." 
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
              className="p-6 rounded-2xl bg-white/2 border border-white/5 text-left hover:border-primary/20 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-white">
                {feature.icon}
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-6 text-white opacity-50 group-hover:opacity-100 group-hover:text-primary group-hover:scale-110 transition-all backdrop-blur-sm border border-white/5">
                {feature.icon}
              </div>
              <h3 className="text-sm font-bold mb-2 tracking-tight uppercase font-space text-white/90">{feature.title}</h3>
              <p className="text-white/30 leading-relaxed text-[11px] font-medium tracking-wide">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </main>


      <div className="absolute bottom-0 left-0 right-0 h-64 bg-linear-to-t from-background via-background/80 to-transparent pointer-events-none z-20" />
      

      <div className="fixed top-0 right-0 p-10 opacity-10 blur-3xl pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-primary" />
      </div>
    </div>
  );
}
