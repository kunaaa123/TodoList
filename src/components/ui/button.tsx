import React from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-sans font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
          {
            // Primary state: Charcoal `#1A1A2E`, text white, height 40px (md)
            'bg-charcoal text-surface-elevated hover:bg-charcoal/90 border-none':
              variant === 'primary',
            // Secondary state: bg `#FFFFFF`, border 0.5px `#E2D0D5`, hover bg `#FDFCF9`
            'bg-surface-elevated text-charcoal border-0.5 border-border-subtle hover:bg-surface-base':
              variant === 'secondary',
            // Outline state: transparent, border 0.5px `#E2D0D5`, hover `#F2EBD9`
            'bg-transparent text-charcoal border-0.5 border-border-subtle hover:bg-sand-light':
              variant === 'outline',
            // Ghost state: transparent, no border
            'bg-transparent text-charcoal hover:bg-sand-light border-none':
              variant === 'ghost',
          },
          {
            'h-8 px-3 text-xs rounded-xs': size === 'sm',
            'h-10 px-4 text-sm rounded-sm': size === 'md',
            'h-12 px-6 text-base rounded-md': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
