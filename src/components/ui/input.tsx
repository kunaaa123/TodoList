import React from 'react'
import { clsx } from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="font-sans text-[11px] font-semibold text-charcoal-80 uppercase tracking-wider leading-none">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full h-10 px-3 bg-surface-elevated font-sans text-sm text-charcoal outline-none transition-all duration-150',
            'border-0.5 border-border-subtle rounded-xs placeholder:text-charcoal-40',
            // Focused state: border 1px #1A1A2E
            'focus:border-[1px] focus:border-charcoal',
            // Error state: border 1px #D4614A
            {
              'border-[1px] border-priority-high-text': error,
            },
            className
          )}
          {...props}
        />
        {error && (
          <span className="font-sans text-[11px] text-priority-high-text mt-0.5 leading-none">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="font-sans text-[11px] font-semibold text-charcoal-80 uppercase tracking-wider leading-none">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            'w-full p-3 bg-surface-elevated font-sans text-sm text-charcoal outline-none transition-all duration-150 resize-none min-h-[80px]',
            'border-0.5 border-border-subtle rounded-xs placeholder:text-charcoal-40',
            // Focused state: border 1px #1A1A2E
            'focus:border-[1px] focus:border-charcoal',
            // Error state: border 1px #D4614A
            {
              'border-[1px] border-priority-high-text': error,
            },
            className
          )}
          {...props}
        />
        {error && (
          <span className="font-sans text-[11px] text-priority-high-text mt-0.5 leading-none">
            {error}
          </span>
        )}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
