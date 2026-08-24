import React, { useState } from 'react';
import { 
  Bot, Send, Sparkles, User, HelpCircle, CheckCircle2, 
  ArrowRight, ShieldCheck, RefreshCw, MessageSquare 
} from 'lucide-react';
import { UserFinancialProfile, LoanScheme } from '../types';

interface AiAssistantProps {
  profile: UserFinancialProfile;
  selectedScheme: LoanScheme;
  isHindi: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  profile,
  selectedScheme,
  isHindi
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: isHindi
        ? `नमस्ते ${profile.name || 'लाभार्थी'} जी! मैं **जन ऋण सेतु एआई सलाहकार** हूँ। मैं आपको सरकारी ऋण योजनाओं (NSFDC, NBCFDC, NSKFDC, मुद्रा, स्टैंड-अप इंडिया), पात्रता नियमों, आवश्यक दस्तावेजों, और आपके शहर (${profile.district || 'गिरिडीह'}) में सही चैनल पार्टनर के बारे में सटीक जानकारी दे सकता हूँ। आप मुझसे कोई भी प्रश्न पूछ सकते हैं!`
        : `Hello ${profile.name || 'Beneficiary'}! I am your **Jan Loan Setu AI Advisor**. I am here to help you navigate government concessional loans (NSFDC, NBCFDC, NSKFDC, MUDRA, Stand-Up India), calculate interest and EMIs, prepare documentation, and connect with authorized channel partners in ${profile.district || 'Giridih'}. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const QUICK_QUESTIONS = [
    isHindi
      ? 'गिरिडीह में ₹1 लाख के किराना दुकान ऋण के लिए कौन सा बैंक/एजेंसी जाना चाहिए?'
      : 'Which bank or agency in Giridih processes small shop loans under ₹1.4 Lakh?',
    isHindi
      ? 'महिला समृद्धि योजना (MSY) में महिलाओं को क्या विशेष रियायत और 3.5% ब्याज मिलता है?'
      : 'What are the special benefits and 3.5% interest rate for women in Mahila Samriddhi Yojana?',
    isHindi
      ? 'परिवार की ₹3 लाख आय प्रमाण पत्र और जाति प्रमाण पत्र कहां से बनवाना होता है?'
      : 'What documents are required to prove SC caste category and family income under ₹3 Lakh?',
    isHindi
      ? 'स्टेट चैनलिंग एजेंसी (SCA) और सामान्य कमर्शियल बैंक में क्या अंतर है?'
      : 'How does State Channelizing Agency (SCA) channel finance work vs regular bank loans?'
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text
          })),
          userContext: {
            applicantName: profile.name,
            category: profile.category,
            gender: profile.gender,
            income: profile.annualFamilyIncome,
            purpose: profile.purpose,
            businessIdea: profile.businessIdea,
            projectCost: profile.projectCost,
            district: profile.district,
            state: profile.state,
            selectedScheme: selectedScheme?.title
          }
        })
      });

      const data = await response.json();
      const aiText = data.reply || (isHindi ? 'क्षमा करें, उत्तर प्राप्त करने में समस्या हुई।' : 'Sorry, could not process request.');

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('AI Advisor Error:', err);
      const errorMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: isHindi
          ? 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें अथवा सीधे चैनल पार्टनर सूची देखें।'
          : 'Failed to communicate with AI server. You can still use the Scheme Recommender & Channel Partner locator directly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-advisor-view" className="space-y-6 max-w-5xl mx-auto">
      {/* Advisor Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-slate-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900">
                  {isHindi ? 'जन ऋण सेतु - एआई योजना सलाहकार' : 'Jan Loan Setu AI Scheme Assistant'}
                </span>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {isHindi 
                  ? 'सरकारी ऋण नियमों, पात्रता, ईएमआई और चैनल पार्टनर से संबंधित कोई भी सवाल पूछें।' 
                  : 'Ask any question regarding schemes, channel finance rules, documents, or bank procedures in any language.'}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
            <span>📍 {profile.district || 'Giridih'}</span>
            <span>•</span>
            <span className="text-indigo-700 font-bold">{profile.category} ({profile.gender})</span>
          </div>
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[520px]">
        {/* Messages Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 no-scrollbar">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 mt-1 border border-indigo-200 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-900 text-white font-medium shadow-xs rounded-tr-none'
                    : 'bg-slate-50 text-slate-800 border border-slate-200 shadow-xs rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <span className={`text-[10px] block mt-1.5 ${msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-500'}`}>
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center shrink-0 mt-1 border border-indigo-200 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-slate-500 text-xs py-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center animate-pulse border border-indigo-200">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>{isHindi ? 'एआई सलाहकार विश्लेषण कर रहा है...' : 'AI Advisor is analyzing scheme guidelines...'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Quick Questions */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-600 whitespace-nowrap flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-amber-600" />
              {isHindi ? 'सुझाए गए प्रश्न:' : 'Suggested Questions:'}
            </span>
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 px-2.5 py-1 rounded-lg text-[11px] border border-slate-200 whitespace-nowrap transition shadow-xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Box */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="input-ai-chat-query"
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder={isHindi ? 'योजना, ब्याज दर, कागजात या बैंक के बारे में पूछें...' : 'Ask about loan eligibility, interest rates, documents or channel partners...'}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition placeholder:text-slate-400"
            />
            <button
              id="btn-ai-chat-send"
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-xs transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
