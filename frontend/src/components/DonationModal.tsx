import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, CreditCard, Building2, Smartphone } from 'lucide-react';
import { toUrduNumerals } from '../utils/formatters';
import { saveDonation } from '../lib/saveDonation';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCampaign: string | null;
  isUrdu: boolean;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, initialCampaign, isUrdu }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 4 is success
  const [amount, setAmount] = useState<number | null>(5000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [fundType, setFundType] = useState<'zakat' | 'sadaqah' | 'general'>('general');
  const [campaign, setCampaign] = useState<string>(initialCampaign || 'General Fund');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [isAnon, setIsAnon] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep(1);
      setAmount(5000);
      setCustomAmount('');
      setFrequency('one-time');
      setFundType('general');
      setDonorName('');
      setDonorEmail('');
      setDonorPhone('');
      setIsAnon(false);
      setPaymentMethod(null);
    }
  }, [isOpen]);

  const presetAmounts = [1000, 2000, 5000, 10000];

  // Update campaign if prop changes
  useEffect(() => {
    if (initialCampaign) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCampaign(initialCampaign);
    }
  }, [initialCampaign]);

  // Handle Escape key and body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    // Focus the first element initially
    if (firstElement) {
      // Need a small timeout because of animations
      setTimeout(() => firstElement.focus(), 50);
    }

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen, step]);

  if (!isOpen) return null;

  const handleNext = async () => {
    if (step === 3) {
      const finalAmount = amount || parseInt(customAmount) || 0;
      const message = `${campaign} • ${fundType} • ${frequency}`;
      await saveDonation(isAnon ? 'Anonymous' : donorName, finalAmount, message);
    }
    setStep(s => (s < 4 ? s + 1 : s) as 1 | 2 | 3 | 4);
  };
  const handleBack = () => setStep(s => (s > 1 ? s - 1 : s) as 1 | 2 | 3 | 4);

  const displayNum = (num: number | string) => isUrdu ? toUrduNumerals(num) : num.toString();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-brand-navy/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div 
        ref={modalRef}
        className={`relative bg-brand-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${isUrdu ? 'font-urduBody rtl' : 'ltr'}`} 
        dir={isUrdu ? 'rtl' : 'ltr'}
      >
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-brand-navy/10 shrink-0">
          <h2 id="modal-title" className={`text-2xl font-bold text-brand-navy ${isUrdu ? 'font-urduHeading' : ''}`}>
            {step === 4 ? (isUrdu ? 'شکریہ' : 'Thank You') : (isUrdu ? 'اپنا عطیہ دیں' : 'Make a Donation')}
          </h2>
          <button 
            onClick={onClose}
            className="text-brand-navy/50 hover:text-brand-navy bg-brand-navy/5 hover:bg-brand-navy/10 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold"
            aria-label={isUrdu ? 'بند کریں' : 'Close modal'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress indicator */}
        {step < 4 && (
          <div className="w-full bg-brand-navy/5 h-1.5 shrink-0" aria-hidden="true">
            <div 
              className="bg-brand-gold h-full transition-all duration-500 ease-out" 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-grow">
          
          {/* STEP 1: AMOUNT & CAUSE */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Frequency */}
              <div className="flex bg-brand-navy/5 p-1 rounded-xl" role="group" aria-label={isUrdu ? 'عطیہ کی قسم' : 'Donation frequency'}>
                <button 
                  onClick={() => setFrequency('one-time')}
                  aria-pressed={frequency === 'one-time'}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold ${frequency === 'one-time' ? 'bg-white shadow-sm text-brand-navy' : 'text-brand-navy/60 hover:text-brand-navy'}`}
                >
                  {isUrdu ? 'ایک بار' : 'One Time'}
                </button>
                <button 
                  onClick={() => setFrequency('monthly')}
                  aria-pressed={frequency === 'monthly'}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold ${frequency === 'monthly' ? 'bg-white shadow-sm text-brand-navy' : 'text-brand-navy/60 hover:text-brand-navy'}`}
                >
                  {isUrdu ? 'ماہانہ' : 'Monthly'}
                </button>
              </div>

              {/* Amounts */}
              <div>
                <label className="block text-sm font-semibold text-brand-navy/80 mb-3" id="amount-label">
                  {isUrdu ? 'عطیہ کی رقم منتخب کریں (Rs)' : 'Select Amount (Rs)'}
                </label>
                <div className="grid grid-cols-2 gap-3" role="group" aria-labelledby="amount-label">
                  {presetAmounts.map(preset => (
                    <button
                      key={preset}
                      onClick={() => { setAmount(preset); setCustomAmount(''); }}
                      aria-pressed={amount === preset}
                      className={`py-3.5 rounded-xl font-bold border-2 transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold ${amount === preset ? 'border-brand-gold bg-brand-gold/5 text-brand-gold' : 'border-brand-navy/10 text-brand-navy hover:border-brand-navy/30'}`}
                    >
                      Rs {displayNum(preset.toLocaleString())}
                    </button>
                  ))}
                  <div className="col-span-2 relative">
                    <label htmlFor="custom-amount" className="sr-only">
                      {isUrdu ? 'اپنی رقم درج کریں' : 'Custom Amount'}
                    </label>
                    <span className="absolute top-1/2 -translate-y-1/2 start-4 text-brand-navy/50 font-bold" aria-hidden="true">Rs</span>
                    <input 
                      id="custom-amount"
                      type="number" 
                      min="100"
                      placeholder={isUrdu ? 'اپنی رقم درج کریں' : 'Custom Amount'}
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setAmount(null);
                      }}
                      className="w-full ps-12 pe-4 py-3.5 rounded-xl border-2 border-brand-navy/10 font-bold text-brand-navy focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Cause & Type */}
              <div className="space-y-4 pt-4 border-t border-brand-navy/10">
                <div>
                  <label htmlFor="campaign-select" className="block text-sm font-semibold text-brand-navy/80 mb-2">
                    {isUrdu ? 'کس مقصد کے لیے؟' : 'Designate to Cause'}
                  </label>
                  <select 
                    id="campaign-select"
                    value={campaign}
                    onChange={(e) => setCampaign(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-brand-navy/10 font-medium text-brand-navy focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/50 bg-white"
                  >
                    <option value="General Fund">{isUrdu ? 'جنرل فنڈ' : 'General Fund (Where needed most)'}</option>
                    <option value="Maternal Health Care">{isUrdu ? 'زچہ و بچہ کی صحت' : 'Maternal Health Care'}</option>
                    <option value="Girls Education Fund">{isUrdu ? 'لڑکیوں کی تعلیم' : 'Girls Education Fund'}</option>
                    <option value="Flood Relief & Rehab">{isUrdu ? 'سیلاب کی بحالی' : 'Flood Relief & Rehab'}</option>
                  </select>
                </div>
                
                <div className="flex gap-3" role="group" aria-label={isUrdu ? 'فنڈ کی قسم' : 'Fund type'}>
                  {(['general', 'zakat', 'sadaqah'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setFundType(type)}
                      aria-pressed={fundType === type}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-brand-gold ${fundType === type ? 'border-brand-navy bg-brand-navy text-white' : 'border-brand-navy/20 text-brand-navy hover:bg-brand-navy/5'}`}
                    >
                      {type === 'general' ? (isUrdu ? 'عطیہ' : 'General') : 
                       type === 'zakat' ? (isUrdu ? 'زکوٰۃ' : 'Zakat') : 
                       (isUrdu ? 'صدقہ' : 'Sadaqah')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-brand-gold/10 p-4 rounded-xl mb-6 border border-brand-gold/20">
                <p className="text-sm font-medium text-brand-navy flex justify-between items-center">
                  <span>{isUrdu ? 'آپ کا عطیہ:' : 'Your Donation:'}</span>
                  <span className="font-bold text-lg">Rs {displayNum((amount || customAmount || 0).toLocaleString())}</span>
                </p>
                <p className="text-xs text-brand-navy/70 mt-1 font-medium">
                  {campaign} • {fundType.charAt(0).toUpperCase() + fundType.slice(1)} • {frequency}
                </p>
              </div>

              <div>
                <label htmlFor="donor-name" className="block text-sm font-semibold text-brand-navy/80 mb-2">{isUrdu ? 'پورا نام' : 'Full Name'} *</label>
                <input id="donor-name" type="text" value={donorName} onChange={e => setDonorName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-brand-navy/20 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/50" />
              </div>
              
              <div>
                <label htmlFor="donor-email" className="block text-sm font-semibold text-brand-navy/80 mb-2">{isUrdu ? 'ای میل ایڈریس' : 'Email Address'} *</label>
                <input id="donor-email" type="email" value={donorEmail} onChange={e => setDonorEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-brand-navy/20 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/50" />
              </div>

              <div>
                <label htmlFor="donor-phone" className="block text-sm font-semibold text-brand-navy/80 mb-2">{isUrdu ? 'فون نمبر (اختیاری)' : 'Phone Number (Optional)'}</label>
                <input id="donor-phone" type="tel" value={donorPhone} onChange={e => setDonorPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-brand-navy/20 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/50" />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <input type="checkbox" id="anon" checked={isAnon} onChange={e => setIsAnon(e.target.checked)} className="w-5 h-5 accent-brand-gold rounded focus:ring-brand-gold focus:ring-offset-2" />
                <label htmlFor="anon" className="text-sm text-brand-navy/80 font-medium cursor-pointer">
                  {isUrdu ? 'میرا عطیہ گمنام رکھیں' : 'Make my donation anonymous'}
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <label className="block text-sm font-semibold text-brand-navy/80 mb-2" id="payment-label">
                {isUrdu ? 'ادائیگی کا طریقہ منتخب کریں' : 'Select Payment Method'}
              </label>
              
              <div className="space-y-3" role="group" aria-labelledby="payment-label">
                <button onClick={() => setPaymentMethod('card')} className={`w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all text-left focus:outline-none focus:ring-2 focus:ring-brand-gold ${paymentMethod === 'card' ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-navy/10 hover:border-brand-gold hover:bg-brand-gold/5'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-navy/5 rounded-full flex items-center justify-center text-brand-navy" aria-hidden="true">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-brand-navy">{isUrdu ? 'کریڈٹ / ڈیبٹ کارڈ' : 'Credit / Debit Card'}</span>
                  </div>
                </button>

                <button onClick={() => setPaymentMethod('easypaisa')} className={`w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all text-left focus:outline-none focus:ring-2 focus:ring-brand-gold ${paymentMethod === 'easypaisa' ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-navy/10 hover:border-brand-gold hover:bg-brand-gold/5'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#3eb149]/10 rounded-full flex items-center justify-center text-[#3eb149]" aria-hidden="true">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-brand-navy">EasyPaisa</span>
                  </div>
                </button>

                <button onClick={() => setPaymentMethod('jazzcash')} className={`w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all text-left focus:outline-none focus:ring-2 focus:ring-brand-gold ${paymentMethod === 'jazzcash' ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-navy/10 hover:border-brand-gold hover:bg-brand-gold/5'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#f7931e]/10 rounded-full flex items-center justify-center text-[#f7931e]" aria-hidden="true">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-brand-navy">JazzCash</span>
                  </div>
                </button>
                
                <button onClick={() => setPaymentMethod('bank')} className={`w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all text-left focus:outline-none focus:ring-2 focus:ring-brand-gold ${paymentMethod === 'bank' ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-navy/10 hover:border-brand-gold hover:bg-brand-gold/5'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-navy/5 rounded-full flex items-center justify-center text-brand-navy" aria-hidden="true">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-brand-navy">{isUrdu ? 'بینک ٹرانسفر' : 'Direct Bank Transfer'}</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-brand-navy/10 rounded-full flex items-center justify-center mb-6" aria-hidden="true">
                <CheckCircle2 className="w-10 h-10 text-brand-navy" />
              </div>
              <h3 className={`text-3xl font-black text-brand-navy mb-4 ${isUrdu ? 'font-urduHeading' : ''}`}>
                {isUrdu ? 'جزاک اللہ!' : 'Jazakallah Khair!'}
              </h3>
              <p className={`text-brand-navy/70 max-w-sm mx-auto leading-relaxed ${isUrdu ? 'font-urduBody' : ''}`}>
                {isUrdu 
                  ? 'آپ کا عطیہ کامیابی کے ساتھ وصول کر لیا گیا ہے۔ آپ کا تعاون معاشرے میں حقیقی تبدیلی لا رہا ہے۔' 
                  : 'Your generous donation has been securely processed. An electronic receipt has been sent to your email.'}
              </p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        {step < 4 ? (
          <div className="p-6 border-t border-brand-navy/10 bg-brand-gray/50 flex items-center gap-4 shrink-0">
            {step > 1 && (
              <button 
                onClick={handleBack}
                className="p-4 rounded-xl border border-brand-navy/20 text-brand-navy hover:bg-brand-navy/5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold"
                aria-label={isUrdu ? 'پچھلا قدم' : 'Previous step'}
              >
                <ArrowLeft className={`w-5 h-5 ${isUrdu ? 'rotate-180' : ''}`} />
              </button>
            )}
            <button 
              onClick={handleNext}
              disabled={(step === 1 && !amount && !customAmount) || (step === 2 && (!donorName || !donorEmail)) || (step === 3 && !paymentMethod)}
              className="flex-1 bg-brand-gold text-brand-navy py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-gold/20 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
            >
              {step === 3 ? (isUrdu ? 'ادائیگی مکمل کریں' : 'Complete Donation') : (isUrdu ? 'آگے بڑھیں' : 'Continue')}
              {step < 3 && <ArrowRight className={`w-5 h-5 ${isUrdu ? 'rotate-180' : ''}`} />}
            </button>
          </div>
        ) : (
          <div className="p-6 border-t border-brand-navy/10 bg-brand-gray/50 shrink-0">
            <button 
              onClick={onClose}
              className="w-full bg-brand-navy/5 text-brand-navy py-4 rounded-xl font-bold hover:bg-brand-navy/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold"
            >
              {isUrdu ? 'مرکزی صفحہ پر واپس جائیں' : 'Return to Home'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default DonationModal;
