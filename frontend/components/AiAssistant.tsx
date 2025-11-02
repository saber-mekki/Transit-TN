import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { useAppContext } from '../contexts/AppContext';
import { useI18n } from '../hooks/useI18n';
import type { Trip } from '../types';

const schema = {
  type: Type.OBJECT,
  properties: {
    fromCity: { type: Type.STRING, description: 'The city, delegation, or governorate of origin mentioned by the user.' },
    toCity: { type: Type.STRING, description: 'The city, delegation, or governorate of destination mentioned by the user.' },
    transportType: {
      type: Type.STRING,
      description: 'The mode of transport requested. Must be one of: louage, bus, or transporter.'
    },
    conversationalResponse: { type: Type.STRING, description: 'A friendly, short, conversational response to the user, acknowledging their request.' }
  },
  propertyOrdering: ["conversationalResponse", "fromCity", "toCity", "transportType"],
};

export const Chatbot: React.FC = () => {
    const { t, language } = useI18n();
    const { trips, locations } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState<{ role: 'user' | 'model' | 'system', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && history.length === 0) {
            setHistory([{ role: 'system', text: t('chatbotWelcome') }]);
        }
    }, [isOpen, history.length, t]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user' as const, text: input };
        setHistory(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const langMap = { ar: 'Arabic', fr: 'French', en: 'English' };
            const currentLang = langMap[language] || 'English';

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are a helpful travel assistant for a Tunisian transit app. Analyze the user's request and extract the origin, destination, and desired mode of transport (louage, bus, or transporter). The user is writing in ${currentLang}. Provide a short, friendly conversational response in the same language. User's request: "${input}"`,
                config: { responseMimeType: "application/json", responseSchema: schema },
            });

            const jsonStr = response.text.trim();
            const parsed = JSON.parse(jsonStr);
            
            const modelMessage = { role: 'model' as const, text: parsed.conversationalResponse || t('aiError') };
            setHistory(prev => [...prev, modelMessage]);

            const { fromCity, toCity, transportType } = parsed;
            
            const governorateMap = new Map<string, string[]>();
            locations.tunisianGovernorates.forEach(gov => {
                governorateMap.set(gov.name.toLowerCase(), gov.delegations.map(d => d.toLowerCase()));
            });

            const results = trips.filter(trip => {
                let typeMatch = true;
                if (transportType) typeMatch = trip.type.toLowerCase() === transportType.toLowerCase();

                let fromMatch = true;
                if (fromCity) {
                    const fromLower = fromCity.toLowerCase();
                    const govDelegations = governorateMap.get(fromLower);
                    if (govDelegations) {
                        fromMatch = govDelegations.includes(trip.fromCity.toLowerCase());
                    } else {
                        fromMatch = trip.fromCity.toLowerCase().includes(fromLower) || fromLower.includes(trip.fromCity.toLowerCase());
                    }
                }

                let toMatch = true;
                if (toCity) {
                    const toLower = toCity.toLowerCase();
                    const govDelegations = governorateMap.get(toLower);
                     if (govDelegations) {
                        toMatch = govDelegations.includes(trip.toCity.toLowerCase());
                    } else {
                        toMatch = trip.toCity.toLowerCase().includes(toLower) || toLower.includes(trip.toCity.toLowerCase());
                    }
                }
                
                return typeMatch && fromMatch && toMatch;
            });

            if (results.length > 0) {
                const resultsText = results.slice(0, 5).map(trip => {
                    const time = new Date(trip.departureTime).toLocaleTimeString(language === 'ar' ? 'ar-TN' : 'fr-FR', { hour: '2-digit', minute: '2-digit' });
                    let details = `${trip.operatorName}: ${trip.fromCity} → ${trip.toCity} @ ${time}`;
                    if ('price' in trip) details += ` (${trip.price} TND)`;
                    return `- ${details}`;
                }).join('\n');
                
                const fullResultsMessage = `${t('aiFoundResults').replace('{count}', String(results.length))}\n${resultsText}`;
                setHistory(prev => [...prev, { role: 'model', text: fullResultsMessage }]);
            } else {
                setHistory(prev => [...prev, { role: 'model', text: t('aiNoResults') }]);
            }

        } catch (error) {
            console.error("Chatbot Error:", error);
            setHistory(prev => [...prev, { role: 'system', text: t('aiError') }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSendMessage();
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                title={t('chatbot')}
                aria-label={t('chatbot')}
                className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <i className="fas fa-robot text-2xl"></i>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-40 w-full max-w-sm h-[65vh] max-h-[40rem] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700">
            <header className="flex-shrink-0 p-3 flex justify-between items-center bg-indigo-600 text-white rounded-t-xl">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <i className="fas fa-robot"></i> {t('chatbot')}
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-2xl hover:opacity-80">&times;</button>
            </header>
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {history.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <i className="fas fa-robot text-indigo-400 mb-2"></i>}
                        <div className={`p-3 rounded-lg max-w-xs shadow-sm whitespace-pre-wrap ${
                            msg.role === 'user' ? 'bg-indigo-500 text-white rounded-br-none' : 
                            msg.role === 'system' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 text-center w-full text-sm' :
                            'bg-gray-200 dark:bg-gray-700 rounded-bl-none'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                        <i className="fas fa-robot text-indigo-400 mb-2"></i>
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
            <div className="flex-shrink-0 p-2 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                <form onSubmit={handleFormSubmit} className="flex space-x-2 rtl:space-x-reverse">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('aiPlaceholder')}
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