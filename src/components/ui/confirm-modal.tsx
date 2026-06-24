import React from 'react'
import { Modal } from './modal'
import { Button } from './button'
import { useDoneDayStore } from '../../store/useDoneDayStore'

export const ConfirmModal: React.FC = () => {
  const { confirmModal, closeConfirm, language } = useDoneDayStore()

  if (!confirmModal.isOpen) return null

  const handleConfirm = () => {
    confirmModal.onConfirm()
    closeConfirm()
  }

  return (
    <Modal
      isOpen={confirmModal.isOpen}
      onClose={closeConfirm}
      title={confirmModal.title}
      width="room" // compact width
    >
      <div className="space-y-4 font-sans text-xs pt-1">
        <p className="text-charcoal-80 text-sm font-medium leading-relaxed">
          {confirmModal.message}
        </p>
        <div className="flex justify-end gap-3 pt-4 border-t-0.5 border-border-subtle">
          <Button type="button" variant="ghost" onClick={closeConfirm}>
            {language === 'th' ? 'ยกเลิก' : 'Cancel'}
          </Button>
          <Button 
            type="button" 
            variant="primary" 
            onClick={handleConfirm}
            className="bg-priority-urgent border-priority-urgent hover:bg-priority-urgent/85 text-surface-elevated font-semibold"
          >
            {language === 'th' ? 'ยืนยันการลบ' : 'Confirm'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
