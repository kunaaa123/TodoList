import React, { useState } from 'react'
import { CheckCircle2, Mail, Chrome, ArrowRight, Loader2, KeyRound } from 'lucide-react'
import { useDoneDayStore } from '../../store/useDoneDayStore'

export const LoginView: React.FC = () => {
  const { setLoggedIn, language } = useDoneDayStore()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)

    // Simulate real Supabase Magic Link and store sync (Tranquil delay)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 1800)
  }

  const handleQuickLogin = (emailAddress: string) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setLoggedIn(emailAddress)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F6F0] p-6 font-sans relative overflow-hidden w-full select-none">
      
      {/* Decorative Subtle Japanese Zen circles in background */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full border-0.5 border-[#E2D0D5]/40 pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full border-0.5 border-[#E2D0D5]/40 pointer-events-none" />
      
      <div className="w-full max-w-[420px] rounded-md border-0.5 border-[#E2D0D5] bg-white p-8 md:p-10 flex flex-col gap-8 relative z-10 transition-all duration-300">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2.5 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xs bg-charcoal text-[#F8F6F0]">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-charcoal mt-1">DoneDay</h2>
          <p className="text-[10px] text-charcoal-40 uppercase tracking-widest leading-none font-bold">
            {language === 'th' ? 'ระบบจัดตารางงานสไตล์ญี่ปุ่นอันเงียบสงบ' : 'Serene Productivity Environment'}
          </p>
        </div>

        {sent ? (
          /* Success Magic Link Screen */
          <div className="flex flex-col items-center gap-5 text-center py-4 transition-all">
            <div className="h-10 w-10 rounded-full bg-sand text-charcoal flex items-center justify-center border-0.5 border-charcoal/10 relative">
              <ArrowRight className="h-5 w-5 rotate-[-45deg]" />
            </div>
            
            <div className="space-y-2">
              <span className="text-sm font-bold text-charcoal block">
                {language === 'th' ? 'ส่งลิงก์ล็อกอินแล้ว!' : 'Magic Link Dispatched!'}
              </span>
              <p className="text-[11px] text-charcoal-80 leading-relaxed max-w-[280px] mx-auto">
                {language === 'th'
                  ? 'ตรวจสอบกล่องข้อความในอีเมล'
                  : 'We have sent a serene login token to:'}{' '}
                <span className="font-semibold text-charcoal block break-all mt-0.5">{email}</span>
              </p>
            </div>

            {/* Quick Demo Enter Button */}
            <button
              onClick={() => setLoggedIn(email)}
              className="mt-4 px-5 py-2 bg-charcoal hover:bg-charcoal/90 text-[#F8F6F0] rounded-xs font-semibold text-[11px] uppercase tracking-wider transition-all active:scale-[0.98] flex items-center gap-1.5"
            >
              <span>{language === 'th' ? 'เข้าชมเดโมแอพทันที (ข้ามการส่ง)' : 'Enter Demo Directly'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          /* Form Content */
          <div className="flex flex-col gap-6">
            
            {/* Standard Magic Link Form */}
            <form onSubmit={handleMagicLinkLogin} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none">
                  {language === 'th' ? 'อีเมลสำหรับการใช้งาน' : 'Work Email Address'}
                </label>
                <div className="relative flex items-center w-full">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 bg-[#FDFCF9] font-sans text-xs text-charcoal outline-none border-0.5 border-border-subtle focus:border-charcoal rounded-xs transition-all placeholder:text-charcoal-40"
                  />
                  <Mail className="absolute left-3.5 h-4 w-4 text-charcoal-40" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-charcoal hover:bg-charcoal/90 text-[#F8F6F0] rounded-xs font-semibold text-xs transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#F8F6F0]" />
                    <span>{language === 'th' ? 'กำลังส่งรหัสลงทะเบียน...' : 'Syncing with tranquil spaces...'}</span>
                  </>
                ) : (
                  <>
                    <span>{language === 'th' ? 'รับ Magic Link เข้าใช้งาน' : 'Request Passwordless Magic Link'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-1">
              <div className="absolute w-full h-[0.5px] bg-[#E2D0D5]" />
              <span className="relative bg-white px-3 text-[9px] font-bold text-charcoal-40 uppercase tracking-widest leading-none">
                {language === 'th' ? 'หรือใช้งานรวดเร็ว' : 'Or Quick Login'}
              </span>
            </div>

            {/* Social Oauth / Quick Profiles selection */}
            <div className="flex flex-col gap-2">
              
              {/* Google Button */}
              <button
                onClick={() => handleQuickLogin('demo.google@doneday.co')}
                disabled={loading}
                className="w-full h-10 border-0.5 border-border-subtle hover:border-border-raised bg-[#FDFCF9] text-charcoal rounded-xs font-semibold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:bg-sand-light/30"
              >
                <Chrome className="h-4 w-4 text-charcoal-80" />
                <span>{language === 'th' ? 'เข้าสู่ระบบด้วยบัญชี Google' : 'Continue with Google Account'}</span>
              </button>

              {/* Demo Hanakko Profile login */}
              <button
                onClick={() => handleQuickLogin('hanakko.abe@doneday.co')}
                disabled={loading}
                className="w-full h-10 border-0.5 border-border-subtle hover:border-border-raised bg-[#FDFCF9] text-charcoal rounded-xs font-semibold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:bg-sand-light/30"
              >
                <KeyRound className="h-4 w-4 text-charcoal-80" />
                <span>{language === 'th' ? 'ลงชื่อเข้าใช้ด้วยบัญชีเดโม' : 'Log in as Demo Account'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Policy */}
        <div className="text-center text-[9px] text-charcoal-40 font-medium border-t-0.5 border-[#E2D0D5] pt-4 leading-normal">
          {language === 'th'
            ? 'การใช้งานแสดงว่ายอมรับ เงื่อนไขบริการ และ นโยบายดูแลข้อมูลส่วนบุคคล'
            : 'By continuing, you agree to DoneDay\'s Terms of Service and Privacy Policy.'}
        </div>

      </div>
    </div>
  )
}
