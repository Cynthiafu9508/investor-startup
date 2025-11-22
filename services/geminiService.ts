
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import { UserProfile, NamingRequest, PartnerRequest } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please select a paid plan or provide a key.");
  }
  return new GoogleGenAI({ apiKey });
};

// Generic generator
const generateOracleResponse = async (userPrompt: string, imageBase64?: string): Promise<string> => {
  try {
    const ai = getClient();
    const modelId = imageBase64 ? 'gemini-2.5-flash' : 'gemini-2.5-flash';
    
    const contents = [];
    
    if (imageBase64) {
      contents.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64
        }
      });
    }
    
    contents.push({ text: userPrompt });

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{ parts: contents }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.8, 
      }
    });

    return response.text || "天机混沌，请稍后再试。";
  } catch (error) {
    console.error("Oracle Error:", error);
    return "云端连接中断，请检查网络Karma值。 (API Error)";
  }
};

// Helper to format user Bazi string
const formatUserBazi = (user: UserProfile) => {
  return `
  【命主信息 (Founder Identity)】
  姓名: ${user.name}
  性别: ${user.gender === 'male' ? '男 (乾造)' : '女 (坤造)'}
  公历生日: ${user.birthDate} ${user.birthTime}
  出生地点: ${user.birthPlace}
  
  **核心指令 - 降低认知门槛**: 
  用户觉得“四柱八字”和“格局”太难懂。请在分析时：
  1. **真太阳时校对**: 隐式进行，无需展示复杂计算过程。
  2. **翻译术语**: 提到“喜用神”、“五行强弱”时，**必须**立刻用商业白话解释。
     - 例: 此时不应说“喜火”，而应说“你的命局偏寒，商业上需要‘火’的能量，比如进军AI、媒体行业，或需要一个充满激情的合伙人”。
     - 例: 不应只说“七杀格”，而应说“你天生适合在动荡的市场中开疆拓土 (七杀格)，而非安稳守成”。
  3. **避免天书**: 不要堆砌《三命通会》的古文，除非你随后立即解释了它对创业的具体启示。
  `;
};

export const NamingService = {
  consult: async (user: UserProfile, data: NamingRequest) => {
    const baziInfo = formatUserBazi(user);
    const prompt = `
    ${baziInfo}
    
    【起名殿请求】
    行业属性: ${data.industry}
    目标受众: ${data.targetAudience}
    
    请结合命主的【八字喜用神】与【行业五行属性】进行生旺：
    1. 提供 5 个符合数理吉凶的名字。
    2. **翻译解释**: 用通俗的商业语言解释为何这个名字好 (如：“‘智火科技’，补足了你命局缺火的短板，有助于提升品牌传播力”)。
    `;
    return generateOracleResponse(prompt);
  }
};

export const PartnerService = {
  consult: async (user: UserProfile, data: PartnerRequest) => {
    const baziInfo = formatUserBazi(user);
    const prompt = `
    ${baziInfo}
    
    【合伙宫请求】
    我是命主 (角色: ${data.myRole})。
    
    潜在合伙人信息:
    公历生日: ${data.partnerBirthDate}
    角色: ${data.partnerRole}
    
    请进行【深度八字合盘】：
    1. 分析两人性格是“互补”还是“内耗” (用MBTI或管理学术语类比玄学术语)。
    2. 紫微斗数角度：谁适合掌印 (CEO/管理)，谁适合冲锋 (Sales/产品)。
    3. 给出股权结构建议，解释为何这样分更有利于公司长治久安。
    `;
    return generateOracleResponse(prompt);
  }
};

export const TimingService = {
  consult: async (user: UserProfile, eventType: string) => {
    const baziInfo = formatUserBazi(user);
    const prompt = `
    ${baziInfo}
    
    【择时塔请求】
    拟办事件: ${eventType}
    
    请结合《通胜》、命主八字流年运势：
    1. 预测未来 30 天内最适合命主做这件事的 3 个吉日。
    2. **白话解释**: 为什么选这一天？(例：“这一天是你的‘财星’高照日，适合融资签约，容易谈出好价格”)。
    3. 避开冲煞之日，并解释后果 (例：“避免在下周二发布，那天冲你的‘官星’，容易遭遇监管或公关危机”)。
    `;
    return generateOracleResponse(prompt);
  }
};

export const FengShuiService = {
  consult: async (user: UserProfile, imageBase64: string) => {
    const baziInfo = formatUserBazi(user);
    const prompt = `
    ${baziInfo}
    
    【风水局请求】
    请分析这张办公室/工位图片。
    1. 识别环境中的“形煞” (穿堂风、横梁等) 并解释其对工作效率的影响 (如：注意力不集中、容易疲劳)。
    2. 结合命主喜忌，给出简单的调整方案 (如：你五行喜木，建议在显示器左侧放一盆绿植来增强‘青龙位’的贵人运)。
    `;
    return generateOracleResponse(prompt, imageBase64);
  }
};

export const DivinationService = {
  consult: async (user: UserProfile, question: string) => {
    const baziInfo = formatUserBazi(user);
    const prompt = `
    ${baziInfo}
    
    【决策卦请求】
    命主心中的商业困惑: "${question}"
    
    请起一卦 (梅花易数或六爻)：
    1. 解析卦象，将“爻辞”翻译成现代创业场景 (如：“潜龙勿用”意为目前产品PMF尚未验证，不宜大规模投放)。
    2. 结合 Lean Startup (精益创业) 理论给出建议。
    `;
    return generateOracleResponse(prompt);
  }
};

export const DailyService = {
  getFortune: async (user: UserProfile) => {
    const baziInfo = formatUserBazi(user);
    const prompt = `
    ${baziInfo}
    
    【创始人每日运势】
    今天是 ${new Date().toLocaleDateString()}。
    
    请根据命主的八字与今日干支的关系：
    1. 用通俗有趣的语言给出 3个宜、3个忌 (结合写代码、见投资人、开会等场景)。
    2. 今日幸运色 (Hex Code) & 幸运方位。
    3. 财运指数 (0-100) & Bug指数 (0-100)。
    4. 每日箴言：一句结合玄学与科技的“骚话”。
    `;
    return generateOracleResponse(prompt);
  }
};
