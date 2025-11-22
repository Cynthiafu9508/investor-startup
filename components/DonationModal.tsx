
import React, { useState } from 'react';
import { X, CreditCard, QrCode, Smartphone } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [method, setMethod] = useState<'wechat' | 'alipay'>('wechat');

  if (!isOpen) return null;

  // Generate a QR code based on selected method (Mocking real payment codes with text for demo)
  // In a real app, you would put your actual payment QR code image URLs here.
  const qrData = method === 'wechat' 
    ? "wxp://f2f09cb89f3d... (Mock WeChat Pay)" 
    : "https://qr.alipay.com/... (Mock Alipay)";
    
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}&color=000000&bgcolor=ffffff`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border-2 border-yellow-600 p-6 shadow-[0_0_40px_rgba(234,179,8,0.2)]">
        
        {/* Traditional/Cyber header */}
        <div className="text-center mb-6 border-b border-yellow-600/30 pb-4">
          <h3 className="text-2xl font-bold text-yellow-500 font-serif tracking-widest mb-1">
            功德箱
          </h3>
          <p className="text-[10px] text-yellow-700 font-mono uppercase">
            CYBER MERIT BOX v2.0
          </p>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-yellow-700 hover:text-yellow-500 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Payment Method Tabs */}
        <div className="flex mb-6 border border-yellow-800 rounded overflow-hidden">
          <button 
            onClick={() => setMethod('wechat')}
            className={`flex-1 py-2 text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
              method === 'wechat' 
                ? 'bg-green-700 text-white' 
                : 'bg-slate-950 text-gray-500 hover:bg-slate-900'
            }`}
          >
            <Smartphone size={14} /> 微信 (WeChat)
          </button>
          <button 
            onClick={() => setMethod('alipay')}
            className={`flex-1 py-2 text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
              method === 'alipay' 
                ? 'bg-blue-700 text-white' 
                : 'bg-slate-950 text-gray-500 hover:bg-slate-900'
            }`}
          >
            <CreditCard size={14} /> 支付宝 (Alipay)
          </button>
        </div>

        {/* QR Code Area */}
        <div className="flex flex-col items-center justify-center mb-6 space-y-4">
          <div className="p-3 bg-white rounded-lg shadow-inner">
            <img 
              src={qrUrl} 
              alt="Payment QR" 
              className="w-48 h-48 object-contain mix-blend-multiply"
            />
          </div>
          <p className="text-xs text-gray-400 font-mono text-center">
            扫码随喜，金额不限<br/>
            <span className="text-yellow-600">助印代码经文，服务器香火不断</span>
          </p>
        </div>

        {/* Quick Amounts */}
        <div className="grid grid-cols-3 gap-2 mb-4">
            {[6.66, 8.88, 18.88].map((amt) => (
                <button key={amt} className="py-2 border border-yellow-800 text-yellow-500 text-xs hover:bg-yellow-900/20 transition-colors font-mono">
                    ¥{amt}
                </button>
            ))}
        </div>

        <button 
          onClick={onClose}
          className="w-full py-3 bg-yellow-900/20 border border-yellow-600 text-yellow-500 font-bold text-sm hover:bg-yellow-800/30 transition-colors"
        >
          [ 施舍完毕 · 功德 +∞ ]
        </button>

      </div>
    </div>
  );
};
