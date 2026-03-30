"use client"
import React, { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export const BackgroundBeams = ({ 
  className,
  interactive = true 
}: { 
  className?: string;
  interactive?: boolean;
}) => {
  const [gradientSettings, setGradientSettings] = useState({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (event: MouseEvent) => {
      setGradientSettings({
        x: event.clientX,
        y: event.clientY,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [interactive])

  return (
    <div
      className={cn(
        "absolute inset-0 z-0 h-full w-full overflow-hidden mask-[radial-gradient(ellipse_at_center,white,transparent)]",
        className
      )}
    >
      {interactive && (
        <div
          className="absolute inset-0 z-[-1] opacity-[0.1]"
          style={{
            background: `radial-gradient(600px circle at ${gradientSettings.x}px ${gradientSettings.y}px, var(--color-brand-primary), transparent 80%)`,
          }}
        />
      )}
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="beam-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="white"
              strokeOpacity="0.05"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#beam-pattern)" />
      </svg>
    </div>
  )
}
