import React from 'react'

interface IconWithGlowProps {
  icon: React.ReactNode
  label?: string
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  color?: 'navy' | 'orange' | 'cream'
}

export default function IconWithGlow({
  icon,
  label,
  onClick,
  size = 'md',
  color = 'orange',
}: IconWithGlowProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }
  
  const colorClasses = {
    navy: 'text-navy hover:text-orange-accent',
    orange: 'text-orange-accent hover:text-navy',
    cream: 'text-vanilla-cream hover:text-orange-accent',
  }
  
  return (
    <div
      onClick={onClick}
      className={`icon-glow cursor-pointer flex flex-col items-center gap-2 transition-all duration-300 ${
        onClick ? 'hover:scale-110' : ''
      }`}
    >
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} flex items-center justify-center rounded-full border-2 border-current p-2 transition-all duration-300`}
      >
        {icon}
      </div>
      {label && (
        <span className="text-xs font-medium text-navy">{label}</span>
      )}
    </div>
  )
}