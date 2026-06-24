import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { clsx } from 'clsx'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  width?: 'task' | 'room' | 'default'
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  width = 'default',
  children,
}) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const widthClasses = {
    task: 'max-w-[420px]', // Task modal width: 420px
    room: 'max-w-[480px]', // Room modal width: 480px
    default: 'max-w-[500px]',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with 120ms fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal/20 backdrop-blur-[2px]"
          />

          {/* Modal box with scale transition (180ms ease-out) */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{
              type: 'spring',
              duration: 0.18,
              bounce: 0,
            }}
            className={clsx(
              'relative z-10 w-full rounded-lg border-0.5 border-border-subtle bg-surface-elevated p-8 shadow-none',
              widthClasses[width]
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              {title && (
                <h3 className="font-serif text-2xl font-normal text-charcoal tracking-tight">
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                className="text-charcoal-40 hover:text-charcoal transition-colors p-1"
              >
                <X className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Content */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
