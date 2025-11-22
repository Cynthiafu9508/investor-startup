
import React, { useState, useEffect } from 'react';
import { OracleMode, UserProfile } from './types';
import { Navigation } from './components/Navigation';
import { APP_NAME, APP_SUBTITLE } from './constants';
import { DailyService, NamingService, PartnerService, TimingService, FengShuiService, DivinationService } from './services/geminiService';
import { CyberButton } from './components/CyberButton';
import { ResultCard } from './components/ResultCard';
import { WoodenFish } from './components/WoodenFish';
import { RegistrationForm } from './components/RegistrationForm';
import { ShareModal } from './components/ShareModal';
import { DonationModal } from './components/DonationModal';
import { Scan, Upload, UserCheck, Lock, QrCode } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mode, setMode] = useState<OracleMode>(OracleMode.HOME);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [dailyFortune, setDailyFortune] = useState<string>('');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  // Form States
  const [namingForm, setNamingForm] = useState({ industry: '', targetAudience: '' });
  const [partnerForm, setPartnerForm] = useState({ partnerBirthDate: '', myRole: '', partnerRole: '' });
  const [timingType, setTimingType] = useState('');
  const [divinationQ, setDivinationQ] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Check for existing user session
  useEffect(() => {
    const storedUser = localStorage.getItem('startup_oracle_user_v2');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user profile", e);
      }
    }
  }, []);

  // Initialize Daily Fortune (only if user exists)
  useEffect(() => {
    if (!user) return;

    const fetchDaily = async () => {
      const today = new Date().toDateString();
      const cached = localStorage.getItem('daily_fortune');
      const cachedDate = localStorage.getItem('daily_fortune_date');
      const cachedUser = localStorage.getItem('daily_fortune_user');

      // Only use cache if it's the same day AND same user
      if (cached && cachedDate === today && cachedUser === user.name) {
        setDailyFortune(cached);
      } else {
        try {
          const res = await DailyService.getFortune(user);
          setDailyFortune(res);
          localStorage.setItem('daily_fortune', res);
          localStorage.setItem('daily_fortune_date', today);
          localStorage.setItem('daily_fortune_user', user.name);
        } catch (e) {
            console.error(e);
        }
      }
    };
    fetchDaily();
  }, [user]);

  const handleRegister = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('startup_oracle_user_v2', JSON.stringify(profile));
  };

  const clearResult = () => setResult('');

  const handleModeChange = (newMode: OracleMode) => {
    setMode(newMode);
    clearResult();
  };

  const handleNaming = async () => {
    if (!user || !namingForm.industry) return;
    setLoading(true);
    const res = await NamingService.consult(user, namingForm);
    setResult(res);
    setLoading(false);
  };

  const handlePartners = async () => {
    if (!user || !partnerForm.partnerBirthDate) return;
    setLoading(true);
    const res = await PartnerService.consult(user, partnerForm);
    setResult(res);
    setLoading(false);
  };

  const handleTiming = async () => {
    if (!user || !timingType) return;
    setLoading(true);
    const res = await TimingService.consult(user, timingType);
    setResult(res);
    setLoading(false);
  };

  const handleDivination = async () => {
    if (!user || !divinationQ) return;
    setLoading(true);
    const res = await DivinationService.consult(user, divinationQ);
    setResult(res);
    setLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFengShui = async () => {
    if (!user || !imagePreview) return;
    setLoading(true);
    // Extract base64 content
    const base64Data = imagePreview.split(',')[1];
    const res = await FengShuiService.consult(user, base64Data);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pb-24 flex flex-col bg-slate-950 text-green-400 font-sans selection:bg-green-900 selection:text-white">
      
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />

      {/* Header */}
      <header className="p-6 border-b border-green-900 bg-slate-900/50 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 neon-text font-mono">
                {APP_NAME}
                </h1>
                <p className="text-xs text-fuchsia-400 font-mono tracking-widest uppercase">{APP_SUBTITLE}</p>
            </div>
            <div className="flex items-center gap-3">
                {user && <span className="text-xs font-mono text-green-600 hidden sm:block">USR: {user.name}</span>}
                
                <button 
                  onClick={() => setIsShareOpen(true)}
                  className="p-2 rounded-full bg-green-900/30 hover:bg-green-800/50 border border-green-700 transition-all active:scale-95"
                  title="手机端访问"
                >
                  <QrCode size={20} className="text-green-400" />
                </button>
                
                <div className="text-2xl animate-pulse">☯</div>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-2xl mx-auto w-full">
        
        {!user ? (
          <RegistrationForm onRegister={handleRegister} />
        ) : (
          <>
            {/* HOME MODE */}
            {mode === OracleMode.HOME && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="p-6 border border-green-800 bg-slate-900/40 rounded-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-20">
                     <UserCheck size={48} />
                   </div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-fuchsia-400">
                    <Scan size={20} />
                    今日运势 (TODAY'S ORACLE)
                  </h2>
                  <div className="mb-4 text-xs text-gray-500 font-mono border-l-2 border-green-800 pl-2">
                    命主: {user.name} <br/>
                    八字: {user.birthDate} {user.birthTime}
                  </div>
                  {dailyFortune ? (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300 font-mono">
                        <ResultCard 
                            content={dailyFortune} 
                            title={`DAILY LOG: ${user.name.toUpperCase()}`} 
                            onDonate={() => setIsDonationOpen(true)}
                        />
                    </div>
                  ) : (
                    <div className="animate-pulse text-xs font-mono text-green-500">
                        正在连接天道服务器，排盘中... (CALCULATING BAZI...)
                    </div>
                  )}
                </section>
                
                <WoodenFish onDonate={() => setIsDonationOpen(true)} />

                <div className="text-center text-xs text-gray-600 font-mono mt-12">
                   v1.3.0 // CHINESE_METAPHYSICS_CORE
                </div>
              </div>
            )}

            {/* NAMING MODE */}
            {mode === OracleMode.NAMING && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-green-400 mb-6 font-mono border-b border-green-800 pb-2">起名殿 (NAMING)</h2>
                
                <div className="space-y-4">
                  <div className="p-3 bg-green-900/20 border border-green-800/50 text-xs text-gray-400 font-mono flex items-center gap-2">
                    <Lock size={12} /> 
                    系统已锁定命主八字: {user.birthDate} (将根据喜用神起名)
                  </div>
                  
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-1">所属行业 (Industry)</label>
                    <input 
                      type="text" 
                      placeholder="例如: 人工智能, 奶茶, 跨境电商..."
                      className="w-full bg-slate-900 border border-green-800 p-3 text-white focus:border-green-400 outline-none"
                      value={namingForm.industry}
                      onChange={(e) => setNamingForm({...namingForm, industry: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-1">目标受众 (Target Audience)</label>
                    <input 
                      type="text" 
                      placeholder="例如: 00后, 企业高管, 极客..."
                      className="w-full bg-slate-900 border border-green-800 p-3 text-white focus:border-green-400 outline-none"
                      value={namingForm.targetAudience}
                      onChange={(e) => setNamingForm({...namingForm, targetAudience: e.target.value})}
                    />
                  </div>
                  <CyberButton onClick={handleNaming} isLoading={loading} className="w-full">
                    启动起名阵法 (GENERATE)
                  </CyberButton>
                </div>
                
                <ResultCard content={result} onDonate={() => setIsDonationOpen(true)} />
              </div>
            )}

            {/* PARTNERS MODE */}
            {mode === OracleMode.PARTNERS && (
                <div className="space-y-6">
                <h2 className="text-2xl font-bold text-green-400 mb-6 font-mono border-b border-green-800 pb-2">合伙宫 (TEAM)</h2>
                
                <div className="space-y-4">
                  <div className="p-3 bg-green-900/20 border border-green-800/50 text-xs text-gray-400 font-mono flex items-center gap-2">
                     <Lock size={12} /> 
                     己方命盘已锁定 (Founder A)
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-1">我的角色 (My Role)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. CEO, CTO"
                      className="w-full bg-slate-900 border border-green-800 p-3 text-white focus:border-green-400 outline-none"
                      value={partnerForm.myRole}
                      onChange={(e) => setPartnerForm({...partnerForm, myRole: e.target.value})}
                    />
                  </div>

                  <div className="border-t border-green-900 pt-4 mt-4">
                    <h3 className="text-sm text-fuchsia-400 font-bold mb-3">对方信息 (Partner B)</h3>
                    
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-1">对方生日 (公历)</label>
                            <input 
                            type="date" 
                            className="w-full bg-slate-900 border border-green-800 p-3 text-white focus:border-green-400 outline-none"
                            value={partnerForm.partnerBirthDate}
                            onChange={(e) => setPartnerForm({...partnerForm, partnerBirthDate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-1">对方角色</label>
                            <input 
                            type="text" 
                            placeholder="e.g. CMO, Sales Head"
                            className="w-full bg-slate-900 border border-green-800 p-3 text-white focus:border-green-400 outline-none"
                            value={partnerForm.partnerRole}
                            onChange={(e) => setPartnerForm({...partnerForm, partnerRole: e.target.value})}
                            />
                        </div>
                    </div>
                  </div>

                  <CyberButton onClick={handlePartners} isLoading={loading} className="w-full" variant="secondary">
                    开始八字合盘 (CALCULATE)
                  </CyberButton>
                </div>
                
                <ResultCard content={result} onDonate={() => setIsDonationOpen(true)} />
              </div>
            )}

            {/* TIMING MODE */}
            {mode === OracleMode.TIMING && (
              <div className="space-y-6">
              <h2 className="text-2xl font-bold text-green-400 mb-6 font-mono border-b border-green-800 pb-2">择时塔 (TIMING)</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">拟办事项 (Event Type)</label>
                  <select 
                    className="w-full bg-slate-900 border border-green-800 p-3 text-white focus:border-green-400 outline-none appearance-none"
                    value={timingType}
                    onChange={(e) => setTimingType(e.target.value)}
                  >
                    <option value="">请选择事项...</option>
                    <option value="Product Launch">产品发布 (Product Launch)</option>
                    <option value="Fundraising">融资签约 (Fundraising)</option>
                    <option value="Server Migration">服务器迁移/上线 (Deploy)</option>
                    <option value="Layoffs">裁员/组织优化 (Layoffs)</option>
                    <option value="Office Relocation">搬迁办公室 (Relocation)</option>
                    <option value="Register Company">注册公司 (Incorporation)</option>
                  </select>
                </div>
                
                <CyberButton onClick={handleTiming} isLoading={loading} className="w-full">
                  查阅黄历 & 运势 (CONSULT)
                </CyberButton>
              </div>
              
              <ResultCard content={result} onDonate={() => setIsDonationOpen(true)} />
            </div>
            )}

            {/* FENG SHUI MODE */}
            {mode === OracleMode.FENGSHUI && (
                <div className="space-y-6">
                <h2 className="text-2xl font-bold text-green-400 mb-6 font-mono border-b border-green-800 pb-2">风水局 (FENG SHUI)</h2>
                
                <div className="space-y-4 p-4 border-2 border-dashed border-gray-700 bg-slate-900/30 text-center">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="fengshui-upload"
                    />
                    <label htmlFor="fengshui-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2 py-8">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="max-h-64 object-contain border border-green-500 shadow-[0_0_10px_#22c55e]" />
                        ) : (
                            <>
                                <Upload size={40} className="text-gray-500" />
                                <span className="text-sm text-gray-400">上传办公室/工位照片</span>
                                <span className="text-xs text-gray-600">AI 视觉识别风水煞气</span>
                            </>
                        )}
                    </label>
                </div>
                
                <CyberButton onClick={handleFengShui} isLoading={loading} className="w-full" disabled={!imagePreview}>
                  分析环境磁场 (ANALYZE)
                </CyberButton>
                
                <ResultCard content={result} onDonate={() => setIsDonationOpen(true)} />
              </div>
            )}

            {/* DIVINATION MODE */}
            {mode === OracleMode.DIVINATION && (
                <div className="space-y-6">
                <h2 className="text-2xl font-bold text-green-400 mb-6 font-mono border-b border-green-800 pb-2">决策卦 (DIVINATION)</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-1">心中疑惑 (Question)</label>
                    <textarea 
                      rows={4}
                      placeholder="例如：这个TS该不该签？要不要转型做AI应用？"
                      className="w-full bg-slate-900 border border-green-800 p-3 text-white focus:border-green-400 outline-none resize-none"
                      value={divinationQ}
                      onChange={(e) => setDivinationQ(e.target.value)}
                    />
                  </div>
                  
                  <CyberButton onClick={handleDivination} isLoading={loading} className="w-full" variant="secondary">
                    诚心起卦 (CAST HEXAGRAM)
                  </CyberButton>
                </div>
                
                <ResultCard content={result} onDonate={() => setIsDonationOpen(true)} />
              </div>
            )}
          </>
        )}

      </main>

      {user && <Navigation currentMode={mode} setMode={handleModeChange} />}
    </div>
  );
}
