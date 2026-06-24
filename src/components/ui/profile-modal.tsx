import React, { useState, useEffect } from 'react'
import { User, Shield, LogOut, Check, Wifi, Database, X } from 'lucide-react'
import { useDoneDayStore, Presence } from '../../store/useDoneDayStore'

export const ProfileModal: React.FC = () => {
  const {
    currentUser,
    isProfileModalOpen,
    setProfileModalOpen,
    updateProfile,
    logout,
    language,
  } = useDoneDayStore()

  // Form states
  const [name, setName] = useState('')
  const [initials, setInitials] = useState('')
  const [presence, setPresence] = useState<Presence>('online')
  const [avatarColor, setAvatarColor] = useState('#1A1A2E')
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Load user data on open
  useEffect(() => {
    if (isProfileModalOpen && currentUser) {
      setName(currentUser.name || '')
      setInitials(currentUser.initials || '')
      setPresence(currentUser.presence || 'online')
      setAvatarColor(currentUser.color || '#1A1A2E')
      setSaveSuccess(false)
    }
  }, [isProfileModalOpen, currentUser])

  if (!isProfileModalOpen || !currentUser) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({
      name,
      initials: initials.toUpperCase().slice(0, 2),
      presence,
      color: avatarColor,
    })
    setSaveSuccess(true)
    setTimeout(() => {
      setSaveSuccess(false)
      setProfileModalOpen(false)
    }, 1000)
  }

  // Beautiful minimalist color palette options
  const colorOptions = [
    '#1A1A2E', // Deep Charcoal
    '#7B8FA1', // Slate Blue
    '#C9843A', // Ochre Orange
    '#D4614A', // Terra Cotta
    '#16AD73', // Zen Green
    '#8B8A80', // Stone Gray
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/20 backdrop-blur-xs p-4 select-none">
      
      {/* Background click dismiss */}
      <div className="absolute inset-0" onClick={() => setProfileModalOpen(false)} />
      
      <div className="w-full max-w-[440px] rounded-md border-0.5 border-[#E2D0D5] bg-white p-6 md:p-8 flex flex-col gap-6 relative z-10 animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={() => setProfileModalOpen(false)}
          className="absolute right-4 top-4 p-1 text-charcoal-40 hover:text-charcoal transition-colors hover:bg-sand-light rounded-xs"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 border-b-0.5 border-border-subtle pb-4">
          <User className="h-5 w-5 text-charcoal shrink-0" />
          <h2 className="font-serif text-lg font-semibold text-charcoal leading-none">
            {language === 'th' ? 'ข้อมูลโปรไฟล์ผู้ใช้งาน' : 'User Account Profile'}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-5 text-left">
          
          {/* Avatar Preview & Color accents */}
          <div className="flex gap-4 items-center p-3 bg-surface-base rounded-xs border-0.5 border-border-subtle">
            
            {/* Avatar representation using editable color */}
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center text-white font-sans font-bold text-lg border-0.5 border-charcoal/10 transition-all shrink-0"
              style={{ backgroundColor: avatarColor }}
            >
              {initials || currentUser.initials}
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none">
                {language === 'th' ? 'เลือกสีประจำอวตารของคุณ' : 'Choose Avatar Color Accent'}
              </span>
              <div className="flex gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAvatarColor(c)}
                    className="h-5 w-5 rounded-full border-0.5 border-charcoal/10 relative flex items-center justify-center shrink-0 transition-transform active:scale-90"
                    style={{ backgroundColor: c }}
                  >
                    {avatarColor === c && (
                      <Check className="h-3 w-3 text-white stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Fields: Grid */}
          <div className="grid grid-cols-3 gap-4">
            
            {/* Initials field */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-charcoal-40 uppercase tracking-widest">
                {language === 'th' ? 'ตัวย่อชื่อ' : 'Initials'}
              </label>
              <input
                type="text"
                required
                maxLength={2}
                placeholder="HA"
                value={initials}
                onChange={(e) => setInitials(e.target.value.toUpperCase())}
                className="h-10 text-center bg-[#FDFCF9] font-sans text-xs text-charcoal outline-none border-0.5 border-border-subtle focus:border-charcoal rounded-xs uppercase"
              />
            </div>

            {/* Name field */}
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-[9px] font-bold text-charcoal-40 uppercase tracking-widest">
                {language === 'th' ? 'ชื่อเต็มแสดงผล' : 'Profile Name'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hanakko Abe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 px-3 bg-[#FDFCF9] font-sans text-xs text-charcoal outline-none border-0.5 border-border-subtle focus:border-charcoal rounded-xs"
              />
            </div>
          </div>

          {/* Presence state selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold text-charcoal-40 uppercase tracking-widest">
              {language === 'th' ? 'สถานะการทำงานปัจจุบัน' : 'Work Presence Status'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              
              {/* Online Option */}
              <button
                type="button"
                onClick={() => setPresence('online')}
                className={`h-9 border-0.5 rounded-xs font-semibold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 ${
                  presence === 'online'
                    ? 'border-charcoal bg-charcoal text-white'
                    : 'border-border-subtle bg-[#FDFCF9] text-charcoal-80 hover:bg-sand-light/20'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-presence-online" />
                <span>{language === 'th' ? 'พร้อมทำงาน' : 'Online'}</span>
              </button>

              {/* Away Option */}
              <button
                type="button"
                onClick={() => setPresence('away')}
                className={`h-9 border-0.5 rounded-xs font-semibold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 ${
                  presence === 'away'
                    ? 'border-charcoal bg-charcoal text-white'
                    : 'border-border-subtle bg-[#FDFCF9] text-charcoal-80 hover:bg-sand-light/20'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-presence-away" />
                <span>{language === 'th' ? 'ไม่อยู่ชั่วคราว' : 'Away'}</span>
              </button>

              {/* Offline Option */}
              <button
                type="button"
                onClick={() => setPresence('offline')}
                className={`h-9 border-0.5 rounded-xs font-semibold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 ${
                  presence === 'offline'
                    ? 'border-charcoal bg-charcoal text-white'
                    : 'border-border-subtle bg-[#FDFCF9] text-charcoal-80 hover:bg-sand-light/20'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-presence-offline" />
                <span>{language === 'th' ? 'ออฟไลน์' : 'Offline'}</span>
              </button>
            </div>
          </div>

          {/* Account Metrics Section */}
          <div className="border-t-0.5 border-border-subtle pt-4 flex flex-col gap-2 font-sans text-[10px] text-charcoal-80">
            <div className="flex items-center gap-1.5 justify-between">
              <span className="text-charcoal-40 font-semibold uppercase tracking-wider flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" /> Account tier
              </span>
              <span className="font-bold text-priority-med-text bg-priority-med-bg border-0.5 border-priority-med-text/20 px-1.5 py-0.5 rounded-[3px]">
                {language === 'th' ? 'สมาชิกพรีเมียม' : 'Premium Account Tier'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-charcoal-40 font-semibold uppercase tracking-wider flex items-center gap-1">
                <Wifi className="h-3.5 w-3.5" /> Synchronized status
              </span>
              <span className="font-semibold text-presence-online">
                {language === 'th' ? 'ซิงค์เรียลไทม์สำเร็จ' : 'Online Sync Active'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-charcoal-40 font-semibold uppercase tracking-wider flex items-center gap-1">
                <Database className="h-3.5 w-3.5" /> Offline storage size
              </span>
              <span className="font-semibold text-charcoal/80">
                1.42 KB (Zustand persists)
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-2.5 mt-2 border-t-0.5 border-border-subtle pt-4">
            
            {/* Logout button (Outlined red) */}
            <button
              type="button"
              onClick={() => {
                setProfileModalOpen(false)
                logout()
              }}
              className="px-3 border-0.5 border-priority-urgent bg-[#FDFCF9] hover:bg-priority-urgent-bg text-priority-urgent-text hover:border-priority-urgent-text/20 transition-all rounded-xs font-semibold text-xs flex items-center gap-1.5 active:scale-[0.98]"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>{language === 'th' ? 'ออกจากระบบ' : 'Logout'}</span>
            </button>

            {/* Cancel */}
            <button
              type="button"
              onClick={() => setProfileModalOpen(false)}
              className="flex-1 h-10 border-0.5 border-border-subtle hover:border-border-raised bg-[#FDFCF9] text-charcoal rounded-xs font-semibold text-xs transition-all active:scale-[0.98]"
            >
              {language === 'th' ? 'ยกเลิก' : 'Cancel'}
            </button>

            {/* Submit save button */}
            <button
              type="submit"
              disabled={saveSuccess}
              className={`flex-1 h-10 rounded-xs font-semibold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 text-white ${
                saveSuccess ? 'bg-presence-online border-presence-online' : 'bg-charcoal border-charcoal hover:bg-charcoal/90'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="h-4 w-4 stroke-[3]" />
                  <span>{language === 'th' ? 'บันทึกแล้ว!' : 'Saved!'}</span>
                </>
              ) : (
                <span>{language === 'th' ? 'บันทึกข้อมูล' : 'Save Changes'}</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}
