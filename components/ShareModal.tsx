
import React from 'react';
import { X, AlertTriangle, Smartphone } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Use current window location, or a placeholder if running in a non-browser env
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://your-app-url.com';
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}&color=4ade80&bgcolor=020617`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border-2 border-green-500 p-6 shadow-[0_0_30px_rgba(74,222,128,0.3)]">
        
        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-green-500 -translate-x-1 -translate-y-1"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-green-500 translate-x-1 -translate-y-1"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-green-500 -translate-x-1 translate-y-1"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-green-500 translate-x-1 translate-y-1"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-green-600 hover:text-green-400 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-green-400 neon-text font-mono flex items-center justify-center gap-2">
            <Smartphone size={20} />
            移动端接入 (MOBILE)
          </h3>
          <p className="text-xs text-gray-500 font-mono mt-1">SCAN TO SYNC KARMA</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="p-2 bg-slate-950 border border-green-800 rounded-lg relative group">
            <img 
              src={qrApiUrl} 
              alt="QR Code" 
              className="w-48 h-48 object-contain image-pixelated"
            />
            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-green-500/10 to-transparent animate-scan"></div>
          </div>
        </div>

        {/* WeChat Warning */}
        <div className="bg-fuchsia-900/20 border border-fuchsia-500/50 p-3 rounded text-left mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-fuchsia-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-fuchsia-400">微信防拦截指南:</p>
              <ol className="text-[10px] text-gray-300 list-decimal pl-3 space-y-1 font-sans">
                <li>截图保存此二维码或直接扫码。</li>
                <li>若微信提示“无法打开”或页面排版错乱。</li>
                <li>请点击右上角 <span className="font-bold text-white">...</span> 选择 <span className="font-bold text-white">“在浏览器打开”</span>。</li>
              </ol>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-2 bg-green-900/30 border border-green-600 text-green-400 font-mono text-sm hover:bg-green-800/50 transition-colors"
        >
          [ 关 闭 窗 口 ]
        </button>

      </div>
    </div>
  );
};
