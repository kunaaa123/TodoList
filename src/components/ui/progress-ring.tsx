import React from 'react'
import { clsx } from 'clsx'

interface ProgressRingProps {
  progress: number // value from 0 to 100
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 'md',
  className,
}) => {
  const sizeMap = {
    sm: { dimension: 32, strokeWidth: 2.5, radius: 13.5 },
    md: { dimension: 48, strokeWidth: 3, radius: 21 },
    lg: { dimension: 64, strokeWidth: 3.5, radius: 28.5 },
  }

  const { dimension, strokeWidth, radius } = sizeMap[size]
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(Math.max(progress, 0), 100) / 100) * circumference

  return (
    <div
      className={clsx('relative inline-flex items-center justify-center', className)}
      style={{ width: dimension, height: dimension }}
    >
      <svg className="rotate-[-90deg]" width={dimension} height={dimension}>
        {/* Track circle */}
        <circle
          className="stroke-border-subtle"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={dimension / 2}
          cy={dimension / 2}
        />
        {/* Progress circle */}
        <circle
          className="stroke-charcoal transition-all duration-300 ease-out-quad"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={dimension / 2}
          cy={dimension / 2}
        />
      </svg>
      {/* Center text showing percentage */}
      <span className="absolute font-sans text-[10px] font-bold text-charcoal">
        {Math.round(progress)}%
      </span>
    </div>
  )
}
