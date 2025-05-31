"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

function DataVisualizationPaths({ position }: { position: number }) {
  // Generate unified dashboard grid sections - smaller and further from center
  const gridSections = [
    { x: 10, y: 40, width: 140, height: 80 }, // Top-left: Conversion funnel
    { x: 620, y: 40, width: 140, height: 80 }, // Top-right: User metrics
    { x: 40, y: 300, width: 140, height: 60 }, // Bottom-left: Trend chart
    { x: 620, y: 300, width: 140, height: 60 }, // Bottom-right: Performance chart
  ]

  // Generate conversion funnel (top-left dashboard section)
  const funnelData = Array.from({ length: 4 }, (_, i) => {
    const section = gridSections[0]
    const stepWidth = section.width - i * 20
    const stepHeight = 12
    const yPos = section.y + 15 + i * 15
    const xPos = section.x + (section.width - stepWidth) / 2
    
    return {
      id: `funnel-${i}`,
      d: `M${xPos} ${yPos}L${xPos + stepWidth} ${yPos}L${xPos + stepWidth - 4} ${yPos + stepHeight}L${xPos + 4} ${yPos + stepHeight}Z`,
      value: 100 - i * 20, // Conversion percentages
    }
  })

  // Generate user metrics chart (top-right dashboard section)
  const userMetrics = Array.from({ length: 10 }, (_, i) => {
    const section = gridSections[1]
    const x = section.x + 15 + i * 11
    const baseY = section.y + section.height - 15
    const height = 15 + Math.sin(i * 0.5 + position) * 12
    
    return {
      id: `metric-${i}`,
      x,
      y: baseY - height,
      height,
      width: 6,
    }
  })

  // Generate trend lines (bottom-left dashboard section)
  const trendPoints = Array.from({ length: 6 }, (_, i) => {
    const section = gridSections[2]
    const x = section.x + 15 + i * 18
    const baseY = section.y + section.height / 2
    const y = baseY + Math.sin(i * 0.4 + position) * 15
    
    return { x, y }
  })

  // Generate performance bars (bottom-right dashboard section)
  const performanceBars = Array.from({ length: 5 }, (_, i) => {
    const section = gridSections[3]
    const x = section.x + 20 + i * 20
    const baseY = section.y + section.height - 12
    const height = 12 + Math.sin(i * 0.6 + position * 2) * 18
    
    return {
      id: `perf-${i}`,
      x,
      y: baseY - height,
      height,
      width: 12,
    }
  })

  // Generate connecting data flow lines between sections - more subtle
  const dataFlows = [
    // Funnel to metrics (top edge)
    { from: { x: 180, y: 80 }, to: { x: 620, y: 80 } },
    // Metrics to performance (right edge)
    { from: { x: 700, y: 120 }, to: { x: 700, y: 300 } },
    // Performance to trends (bottom edge)
    { from: { x: 620, y: 330 }, to: { x: 180, y: 330 } },
    // Trends to funnel (left edge)
    { from: { x: 110, y: 300 }, to: { x: 110, y: 120 } },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 800 400" fill="none">
        <title>Unified Analytics Dashboard</title>

        <defs>
          {/* Unified grid pattern */}
          <pattern id="dashboard-grid" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.04" />
          </pattern>
          
          {/* Dashboard section backgrounds */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Gradients for different chart types */}
          <linearGradient id="funnelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(59,130,246)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(59,130,246)" stopOpacity="0.08" />
          </linearGradient>
          
          <linearGradient id="metricGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgb(16,185,129)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(16,185,129)" stopOpacity="0.08" />
          </linearGradient>
          
          <linearGradient id="perfGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgb(168,85,247)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(168,85,247)" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        
        {/* Unified grid background */}
        <rect width="100%" height="100%" fill="url(#dashboard-grid)" className="text-slate-300 dark:text-slate-700" />

        {/* Dashboard section frames */}
        {gridSections.map((section, index) => (
          <motion.rect
            key={`section-${index}`}
            x={section.x - 8}
            y={section.y - 8}
            width={section.width + 16}
            height={section.height + 16}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeOpacity="0.12"
            rx="6"
            className="text-slate-400 dark:text-slate-600"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              delay: index * 0.2,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Data flow connections */}
        {dataFlows.map((flow, index) => (
          <motion.path
            key={`flow-${index}`}
            d={`M${flow.from.x} ${flow.from.y}L${flow.to.x} ${flow.to.y}`}
            stroke="currentColor"
            strokeWidth="0.8"
            strokeOpacity="0.15"
            strokeDasharray="3 3"
            className="text-blue-400 dark:text-blue-500"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1],
              opacity: [0, 0.2, 0.08],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: index * 0.8,
            }}
          />
        ))}

        {/* Conversion Funnel (Top-left) */}
        {funnelData.map((step, index) => (
          <motion.g key={step.id}>
            <motion.path
              d={step.d}
              fill="url(#funnelGrad)"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeOpacity="0.25"
              className="text-blue-500 dark:text-blue-400"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.5 + index * 0.15,
                ease: "easeOut",
              }}
            />
          </motion.g>
        ))}

        {/* User Metrics Chart (Top-right) */}
        {userMetrics.map((bar, index) => (
          <motion.rect
            key={bar.id}
            x={bar.x}
            y={bar.y}
            width={bar.width}
            height={bar.height}
            fill="url(#metricGrad)"
            rx="1.5"
            initial={{ height: 0, y: bar.y + bar.height }}
            animate={{ height: bar.height, y: bar.y }}
            transition={{
              duration: 1,
              delay: 1 + index * 0.08,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Trend Line Chart (Bottom-left) */}
        <motion.path
          d={`M${trendPoints.map((point, i) => `${i === 0 ? 'M' : 'L'}${point.x} ${point.y}`).join(' ')}`}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-orange-500 dark:text-orange-400"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1],
            opacity: [0, 0.7],
          }}
          transition={{
            duration: 2,
            delay: 1.5,
            ease: "easeInOut",
          }}
        />

        {/* Trend points */}
        {trendPoints.map((point, index) => (
          <motion.circle
            key={`trend-point-${index}`}
            cx={point.x}
            cy={point.y}
            r="1.5"
            fill="currentColor"
            className="text-orange-500 dark:text-orange-400"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.7 }}
            transition={{
              duration: 0.3,
              delay: 1.5 + index * 0.1,
            }}
          />
        ))}

        {/* Performance Bars (Bottom-right) */}
        {performanceBars.map((bar, index) => (
          <motion.rect
            key={bar.id}
            x={bar.x}
            y={bar.y}
            width={bar.width}
            height={bar.height}
            fill="url(#perfGrad)"
            rx="2"
            initial={{ height: 0, y: bar.y + bar.height }}
            animate={{ height: bar.height, y: bar.y }}
            transition={{
              duration: 1.2,
              delay: 2 + index * 0.12,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Floating data particles (very subtle, far from center) */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const radius = 240 + Math.sin(i * 0.3) * 15
          const centerX = 400
          const centerY = 200
          const x = centerX + Math.cos(angle) * radius
          const y = centerY + Math.sin(angle) * radius
          
          // Skip particles in expanded center text area
          if (x > 250 && x < 550 && y > 130 && y < 270) {
            return null
          }
          
          return (
            <motion.circle
              key={`particle-${i}`}
              cx={x}
              cy={y}
              r="0.8"
              className="text-blue-400 dark:text-blue-500"
              fill="currentColor"
              fillOpacity="0.3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0.7],
                opacity: [0, 0.4, 0.2],
                y: [y, y - 8, y],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          )
        }).filter(Boolean)}

        {/* Dashboard title indicators - smaller and more subtle */}
        <motion.text
          x={gridSections[0].x}
          y={gridSections[0].y - 3}
          fontSize="9"
          fill="currentColor"
          className="text-slate-500 dark:text-slate-500"
          fillOpacity="0.6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
        >
          Conversion
        </motion.text>
        
        <motion.text
          x={gridSections[1].x}
          y={gridSections[1].y - 3}
          fontSize="9"
          fill="currentColor"
          className="text-slate-500 dark:text-slate-500"
          fillOpacity="0.6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.7, duration: 0.5 }}
        >
          User Metrics
        </motion.text>
        
        <motion.text
          x={gridSections[2].x}
          y={gridSections[2].y - 3}
          fontSize="9"
          fill="currentColor"
          className="text-slate-500 dark:text-slate-500"
          fillOpacity="0.6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.9, duration: 0.5 }}
        >
          Trends
        </motion.text>
        
        <motion.text
          x={gridSections[3].x}
          y={gridSections[3].y - 3}
          fontSize="9"
          fill="currentColor"
          className="text-slate-500 dark:text-slate-500"
          fillOpacity="0.6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.1, duration: 0.5 }}
        >
          Performance
        </motion.text>
      </svg>
    </div>
  )
}

export function AnimatedBackground() {
  const [position, setPosition] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => prev + 0.01)
    }, 16)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <DataVisualizationPaths position={position} />
    </div>
  )
} 