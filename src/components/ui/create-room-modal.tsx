import React, { useState } from 'react'
import { Modal } from './modal'
import { Input, TextArea } from './input'
import { Button } from './button'
import { useDoneDayStore, RoomCategory } from '../../store/useDoneDayStore'
import { useTranslation } from '../../lib/translations'

export const CreateRoomModal: React.FC = () => {
  const {
    isCreateRoomModalOpen,
    setCreateRoomModalOpen,
    addRoom,
    members,
    language,
    currentUser,
  } = useDoneDayStore()

  const { t } = useTranslation(language)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#7B8FA1') // Defaults to Slate
  const [invitees, setInvitees] = useState<string[]>([])
  const [isPrivate, setIsPrivate] = useState(false)
  const [category, setCategory] = useState<RoomCategory>('work')

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
    if (!name.trim()) return

    addRoom({
      name: name.trim(),
      color,
      description: description.trim(),
      invitees: category === 'work' ? [currentUser.id] : invitees,
      isPrivate,
      category,
    })

    // Reset fields & close
    setName('')
    setDescription('')
    setColor('#7B8FA1')
    setInvitees([])
    setIsPrivate(false)
    setCategory('work')
    setCreateRoomModalOpen(false)
  }

  return (
    <Modal
      isOpen={isCreateRoomModalOpen}
      onClose={() => setCreateRoomModalOpen(false)}
      title={t('createRoom')}
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
        <div className="flex justify-end gap-3 pt-4 border-t-0.5 border-border-subtle">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setCreateRoomModalOpen(false)}
          >
            {t('cancel')}
          </Button>
          <Button type="submit" variant="primary">
            {t('createRoom')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
