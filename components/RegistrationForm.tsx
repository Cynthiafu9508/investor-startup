
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { CyberButton } from './CyberButton';
import { ShieldCheck, Terminal, User, Phone, Calendar, Clock, Fingerprint, MapPin } from 'lucide-react';

interface RegistrationFormProps {
  onRegister: (profile: UserProfile) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    phone: '',
    gender: 'male',
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.birthDate && formData.birthTime && formData.birthPlace) {
      onRegister(formData);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[60vh] animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="w-full max-w-md p-8 border border-green-800 bg-slate-900/60 backdrop-blur-md relative overflow-hidden group">
        
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-500"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-500"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-500"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-500"></div>

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mb-4 border border-green-500/50">
            <ShieldCheck className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-green-400 font-mono tracking-wider mb-2">
            身份认证 & 命盘录入
          </h2>
          <p className="text-xs text-green-600/80 font-mono uppercase">
            IDENTITY & KARMIC DATA ENTRY
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-green-500/70 flex items-center gap-2">
                <User size={12} /> 姓名 (Name)
              </label>
              <input
                type="text"
                required
                placeholder="张三"
                className="w-full bg-black/50 border border-green-800 p-2 text-green-300 focus:border-green-400 outline-none font-mono"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-green-500/70 flex items-center gap-2">
                <Phone size={12} /> 手机号 (Mobile)
              </label>
              <input
                type="tel"
                required
                placeholder="登录凭证"
                className="w-full bg-black/50 border border-green-800 p-2 text-green-300 focus:border-green-400 outline-none font-mono"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
             <label className="text-xs font-mono text-green-500/70 flex items-center gap-2">
                <Fingerprint size={12} /> 性别 (Gender) - 定阴阳
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="male" 
                    checked={formData.gender === 'male'} 
                    onChange={() => setFormData({...formData, gender: 'male'})}
                    className="accent-green-500"
                  />
                  <span className="text-green-300 text-sm font-mono">男 (乾造)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="female" 
                    checked={formData.gender === 'female'} 
                    onChange={() => setFormData({...formData, gender: 'female'})}
                    className="accent-green-500"
                  />
                  <span className="text-green-300 text-sm font-mono">女 (坤造)</span>
                </label>
              </div>
          </div>

          {/* Birth Place (New) */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-green-500/70 flex items-center gap-2">
              <MapPin size={12} /> 出生地点 (用于校对真太阳时)
            </label>
            <input
              type="text"
              required
              placeholder="例如: 北京市朝阳区 / 广东深圳"
              className="w-full bg-black/50 border border-green-800 p-2 text-white focus:border-green-400 outline-none font-mono"
              value={formData.birthPlace}
              onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
            />
          </div>

          {/* Birth Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-green-500/70 flex items-center gap-2">
                <Calendar size={12} /> 出生日期 (公历)
              </label>
              <input
                type="date"
                required
                className="w-full bg-black/50 border border-green-800 p-2 text-white focus:border-green-400 outline-none font-mono"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-green-500/70 flex items-center gap-2">
                <Clock size={12} /> 出生时间
              </label>
              <input
                type="time"
                required
                className="w-full bg-black/50 border border-green-800 p-2 text-white focus:border-green-400 outline-none font-mono"
                value={formData.birthTime}
                onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4">
            <CyberButton type="submit" className="w-full group-invalid:opacity-50 group-invalid:cursor-not-allowed">
              <span className="flex items-center justify-center gap-2">
                <Terminal size={16} />
                启动命运计算 (INIT)
              </span>
            </CyberButton>
            <p className="text-[10px] text-center text-gray-600 mt-4 font-mono">
              点击即代表您同意将生辰八字上传至赛博天道服务器
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
