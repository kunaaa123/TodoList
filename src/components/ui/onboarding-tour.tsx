import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Command, HelpCircle, ArrowRight, Check, X } from 'lucide-react'
import { Button } from './button'
import { useDoneDayStore } from '../../store/useDoneDayStore'
import { useTranslation } from '../../lib/translations'

export const OnboardingTour: React.FC = () => {
  const { language } = useDoneDayStore()
  const { t } = useTranslation(language)
  
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    // Check if onboarding is completed previously
    const completed = localStorage.getItem('doneday-onboarding-completed')
    if (!completed) {
      // Trigger tour on first load with small delay
      const timer = setTimeout(() => setIsOpen(true), 2500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    localStorage.setItem('doneday-onboarding-completed', 'true')
    setIsOpen(false)
  }

  const handleSkip = () => {
    handleComplete()
  }

  const tourSteps = [
    {
      title: t('welcomeTourTitle'),
      description: t('welcomeTourDesc'),
      icon: <Sparkles className="h-6 w-6 text-priority-med" />,
    },
    {
      title: t('tour2Title'),
      description: t('tour2Desc'),
      icon: <Command className="h-6 w-6 text-charcoal" />,
    },
    {
      title: t('tour3Title'),
      description: t('tour3Desc'),
      icon: <HelpCircle className="h-6 w-6 text-priority-low" />,
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-40 max-w-sm">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-surface-elevated border-0.5 border-border-subtle p-5 rounded-md shadow-none font-sans text-xs"
          >
            {/* Header */}
            <div className="flex justify-between items-start gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-sand-light rounded-xs">
                  {tourSteps[step].icon}
                </div>
                <h4 className="font-serif text-sm font-semibold text-charcoal leading-tight">
                  {tourSteps[step].title}
                </h4>
              </div>
              <button
                onClick={handleSkip}
                className="text-charcoal-40 hover:text-charcoal transition-colors p-0.5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-charcoal-80 leading-relaxed mb-5">
              {tourSteps[step].description}
            </p>

            {/* Footer row */}
            <div className="flex justify-between items-center border-t-0.5 border-border-subtle pt-3">
              {/* Step indicator */}
              <div className="flex gap-1.5">
                {[0, 1, 2].map((s) => (
                  <span
                    key={s}
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                      step === s ? 'w-3 bg-charcoal' : 'bg-border-subtle'
                    }`}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={handleSkip}>
                  {t('skip')}
                </Button>
                <Button size="sm" variant="primary" onClick={handleNext}>
                  {step === 2 ? (
                    <span className="flex items-center gap-1">
                      {t('done')} <Check className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      {t('next')} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
