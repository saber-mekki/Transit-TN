import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useI18n } from '../hooks/useI18n';

export const AiTourGuide: React.FC = () => {
    const { t, language } = useI18n();
    const [history, setHistory] = useState<{ role: 'user' | 'model' | 'system', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    const hasWelcomed = useRef(false);

    useEffect(() => {
        if (!hasWelcomed.current) {
            setHistory([{ role: 'system', text: t('aiTourGuideWelcome') }]);
            hasWelcomed.current = true;
        }
    }, [t]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user' as const, text: input };
        setHistory(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
//window.APP_CONFIG?.GEMINI_API_KEY
        try {
            const apiKey = "AIzaSyA6fvy79JhyJZGx2O-Sk-FulfG_QoIeqx4";
            if (!apiKey) {
                throw new Error("An API Key must be set. It is missing from the application configuration.");
            }
            const ai = new GoogleGenAI({ apiKey });
            
            const langMap = { ar: 'Arabic', fr: 'French', en: 'English' };
            const currentLang = langMap[language] || 'English';

            const systemInstruction = `You are an expert tour guide for Tunisia. A user will ask for a travel plan. Create a detailed, helpful, and exciting travel itinerary based on their request. Include suggestions for places to visit, activities, food to try, and potential travel routes between cities. Format the response clearly using paragraphs and bullet points. The user is asking in ${currentLang}, so you MUST respond in ${currentLang}.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: input,
                config: {
                    systemInstruction: systemInstruction,
                }
            });

            const modelResponseText = response.text;
            
            const modelMessage = { role: 'model' as const, text: modelResponseText };
            setHistory(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error("AI Tour Guide Error:", error);
            const errorMessage = { role: 'system' as const, text: t('aiError') };
            setHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSendMessage();
    };

    return (
        <div className="flex flex-col h-[32rem] border border-gray-200 dark:border-gray-700 rounded-md">
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {history.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <i className="fas fa-compass text-indigo-400 mt-2"></i>}
                        <div className={`p-3 rounded-lg max-w-xs sm:max-w-md lg:max-w-lg shadow-sm ${
                            msg.role === 'user' ? 'bg-indigo-500 text-white rounded-br-none' : 
                            msg.role === 'system' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 text-center w-full text-sm' :
                            'bg-gray-200 dark:bg-gray-700 rounded-bl-none'
                        }`}>
                            <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-2 justify-start">
                        <i className="fas fa-compass text-indigo-400 mt-2"></i>
                        <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 rounded-bl-none">
                             <div className="flex items-center space-x-1">
                                <span className="h-2 w-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-gray-500 rounded-full animate-pulse"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={endOfMessagesRef} />
            </div>
            <div className="p-2 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-md">
                <form onSubmit={handleFormSubmit} className="flex space-x-2 rtl:space-x-reverse">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('aiTourGuidePlaceholder')}
                        className="flex-grow p-2 border rounded-md bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="bg-indigo-600 text-white font-bold w-12 h-10 flex items-center justify-center rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed">
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};