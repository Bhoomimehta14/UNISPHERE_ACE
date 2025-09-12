import React from 'react'

interface GlowButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  disabled?: boolean
}

export default function GlowButton({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}: GlowButtonProps) {
  const baseClasses = 'btn-glow relative font-semibold rounded-full transition-all duration-300 transform hover:scale-105'
  
  const variantClasses = {
    primary: 'bg-navy text-vanilla-cream hover:shadow-navy/50',
    secondary: 'bg-vanilla-cream text-navy hover:shadow-vanilla-cream/50',
    accent: 'bg-orange-accent text-white hover:shadow-orange-accent/50',
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <span className="relative z-10">{children}</span>
    </button>
  )
}