import React, { useState, useEffect } from 'react'
import { Modal } from './modal'
import { Input, TextArea } from './input'
import { Button } from './button'
import { useDoneDayStore, RoomCategory } from '../../store/useDoneDayStore'
import { useTranslation } from '../../lib/translations'
import { Trash2 } from 'lucide-react'

export const EditRoomModal: React.FC = () => {
  const {
    isEditRoomModalOpen,
    setEditRoomModalOpen,
    editingRoom,
    setEditingRoom,
    updateRoom,
    deleteRoom,
    setCurrentRoomId,
    members,
    language,
    triggerConfirm,
    currentUser,
  } = useDoneDayStore()

  const { t } = useTranslation(language)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#7B8FA1')
  const [invitees, setInvitees] = useState<string[]>([])
  const [isPrivate, setIsPrivate] = useState(false)
  const [category, setCategory] = useState<RoomCategory>('work')

  // Pre-populate when modal opens with editingRoom
  useEffect(() => {
    if (isEditRoomModalOpen && editingRoom) {
      setName(editingRoom.name)
      setDescription(editingRoom.description)
      setColor(editingRoom.color)
      setInvitees(editingRoom.invitees)
      setIsPrivate(editingRoom.isPrivate)
      setCategory(editingRoom.category || 'work')
    }
  }, [isEditRoomModalOpen, editingRoom])

  // Color Swatches from spec sheet
  const colorSwatches = [
    '#1A1A2E', // Charcoal
    '#F0D5B7', // Sand
    '#C9843A', // Amber
    '#D4614A', // Coral
    '#7B8FA1', // Slate
    '#6A8B7A', // Muted sage/green
  ]

  const categoriesList: { id: RoomCategory; label: string; emoji: string }[] = [
    { id: 'work', label: t('workCategory'), emoji: '💼' },
    { id: 'routine', label: t('routineCategory'), emoji: '🔄' },
    { id: 'shared', label: t('sharedCategory'), emoji: '👥' },
  ]

  const handleToggleInvitee = (memberId: string) => {
    if (invitees.includes(memberId)) {
      setInvitees(invitees.filter((id) => id !== memberId))
    } else {
      setInvitees([...invitees, memberId])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !editingRoom) return

    updateRoom(editingRoom.id, {
      name: name.trim(),
      description: description.trim(),
      color,
      invitees: category === 'work' ? [currentUser.id] : invitees,
      isPrivate,
      category,
    })

    setEditRoomModalOpen(false)
    setEditingRoom(null)
  }

  const handleDelete = () => {
    if (!editingRoom) return
    triggerConfirm(
      language === 'th' ? 'ลบห้องทำงาน' : 'Delete Room',
      language === 'th'
        ? `คุณต้องการลบห้อง "${editingRoom.name}" ใช่หรือไม่?`
        : `Are you sure you want to delete room "${editingRoom.name}"?`,
      () => {
        deleteRoom(editingRoom.id)
        setCurrentRoomId(null)
        setEditRoomModalOpen(false)
        setEditingRoom(null)
      }
    )
  }

  return (
    <Modal
      isOpen={isEditRoomModalOpen}
      onClose={() => {
        setEditRoomModalOpen(false)
        setEditingRoom(null)
      }}
      title={language === 'th' ? 'แก้ไขห้องทำงาน' : 'Edit Room'}
      width="room"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
        {/* Room Colors Swatches */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-charcoal-80 uppercase tracking-wider leading-none">
            {t('roomColor')}
          </label>
          <div className="flex gap-3">
            {colorSwatches.map((c) => {
              const isSelected = color === c
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-6 w-6 rounded-full transition-transform duration-150 hover:scale-[1.15] ${
                    isSelected ? 'ring-2 ring-charcoal ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              )
            })}
          </div>
        </div>

        {/* Room Category */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-charcoal-80 uppercase tracking-wider leading-none">
            {t('roomCategory')}
          </label>
          <div className="grid grid-cols-2 gap-2 bg-[#FDFCF9] border-0.5 border-border-subtle p-2 rounded-xs">
            {categoriesList.map((cat) => {
              const isSelected = category === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center justify-center gap-2 p-2 rounded-xs border-0.5 transition-all text-xs font-semibold ${
                    isSelected
                      ? 'bg-charcoal text-surface-elevated border-charcoal'
                      : 'bg-transparent text-charcoal border-border-subtle hover:bg-sand-light'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Room Name */}
        <Input
          label={t('roomName')}
          placeholder={t('roomNamePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Description */}
        <TextArea
          label={t('description')}
          placeholder={t('roomDescPlaceholder')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Invite Members */}
        {category !== 'work' && (
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-charcoal-80 uppercase tracking-wider leading-none">
              {t('inviteMembers')}
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#FDFCF9] border-0.5 border-border-subtle p-3 rounded-xs max-h-[120px] overflow-y-auto">
              {members.map((member) => {
                const isInvited = invitees.includes(member.id)
                return (
                  <label
                    key={member.id}
                    className="flex items-center gap-2 p-1 hover:bg-sand-light rounded-xs cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isInvited}
                      onChange={() => handleToggleInvitee(member.id)}
                      className="h-3.5 w-3.5 accent-charcoal border-border-subtle text-surface-elevated"
                    />
                    <span className="font-medium text-charcoal leading-none">
                      {member.name}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )}

        {/* Privacy Toggle */}
        <div className="flex items-center justify-between p-3 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-xs">
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-charcoal">{t('privateRoom')}</span>
            <span className="text-[10px] text-charcoal-40 leading-none">
              {t('privateRoomDesc')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsPrivate(!isPrivate)}
            className={`w-[44px] h-[24px] rounded-full p-[3px] transition-colors duration-200 outline-none flex items-center ${
              isPrivate ? 'bg-sand' : 'bg-border-subtle'
            }`}
          >
            <div
              className={`w-[18px] h-[18px] rounded-full bg-surface-elevated transition-transform duration-200 ${
                isPrivate ? 'translate-x-[20px]' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t-0.5 border-border-subtle">
          {/* Delete Room button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleDelete}
            className="text-priority-high border-priority-high/20 hover:bg-priority-high-bg hover:text-priority-high-text hover:border-priority-high-text/20"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            {language === 'th' ? 'ลบห้องทำงาน' : 'Delete Room'}
          </Button>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setEditRoomModalOpen(false)
                setEditingRoom(null)
              }}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" variant="primary">
              {language === 'th' ? 'บันทึกการแก้ไข' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
