import React, { useState, useMemo, useEffect } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { useI18n } from './hooks/useI18n';
import type { Trip, Language } from './types';
import { TransportType, UserRole } from './types';
import { TripCard } from './components/TripCard';
import { TripDetailsModal } from './components/TripDetailsModal';
import { OperatorView } from './components/OperatorView';
import { LoginModal } from './components/LoginModal';
import { SignUpModal } from './components/SignUpModal';
import { SplashScreen } from './components/SplashScreen';
import { Logo } from './components/icons/Logo';
import { LiveBusMap } from './components/LiveBusMap';
import { AdminDashboard } from './components/AdminDashboard';


const Header: React.FC<{ isAdminView: boolean; onToggleAdminView: () => void; }> = ({ isAdminView, onToggleAdminView }) => {
    const { t, language } = useI18n();
    const { setLanguage, currentUser, logout, theme, setTheme } = useAppContext();
    const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    const handleThemeToggle = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };


    return (
        <>
            <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center relative">
                <Logo size="sm" />
                
                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-4">
                    {currentUser?.role === UserRole.ADMIN && (
                        <button onClick={onToggleAdminView} className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm">
                           <i className={`fas ${isAdminView ? 'fa-arrow-left' : 'fa-user-shield'} mr-2`}></i>
                           {isAdminView ? t('backToApp') : t('adminPanel')}
                        </button>
                    )}
                    {currentUser ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700 dark:text-gray-200">{t('welcome').replace('{name}', currentUser.displayName)}</span>
                            <button onClick={logout} className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition-colors text-sm">
                                {t('logout')}
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <button onClick={() => setAuthModal('login')} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                                {t('login')}
                            </button>
                             <button onClick={() => setAuthModal('signup')} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-700 transition-colors">
                                {t('signUp')}
                            </button>
                        </div>
                    )}
                    <div className="flex items-center space-x-4 ml-2 pl-4 border-l border-gray-200 dark:border-gray-700">
                        <button
                            onClick={handleThemeToggle}
                            title={t('toggleTheme')}
                            aria-label={t('toggleTheme')}
                            className="text-xl text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                        >
                            {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
                        </button>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setLanguage('ar')}
                                className={`text-2xl transition-all duration-200 ease-in-out hover:scale-125 ${language === 'ar' ? 'opacity-100 scale-110' : 'opacity-60'}`}
                                title="العربية"
                            >
                                🇹🇳
                            </button>
                            <button
                                onClick={() => setLanguage('fr')}
                                className={`text-2xl transition-all duration-200 ease-in-out hover:scale-125 ${language === 'fr' ? 'opacity-100 scale-110' : 'opacity-60'}`}
                                title="Français"
                            >
                                🇫🇷
                            </button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`text-2xl transition-all duration-200 ease-in-out hover:scale-125 ${language === 'en' ? 'opacity-100 scale-110' : 'opacity-60'}`}
                                title="English"
                            >
                                🇬🇧
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 dark:text-gray-300 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                        </svg>
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg p-4 z-20 border dark:border-gray-700">
                        <div className="flex flex-col space-y-4">
                            {currentUser?.role === UserRole.ADMIN && (
                                <button onClick={() => { onToggleAdminView(); setIsMenuOpen(false); }} className="w-full text-left bg-green-600 text-white font-bold py-2 px-3 rounded-md hover:bg-green-700 transition-colors text-sm">
                                   {isAdminView ? t('backToApp') : t('adminPanel')}
                                </button>
                            )}
                            {currentUser ? (
                                <div className="flex flex-col space-y-2 items-start">
                                    <span className="text-gray-700 dark:text-gray-200 w-full pb-2 border-b dark:border-gray-600">{t('welcome').replace('{name}', currentUser.displayName)}</span>
                                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full text-left bg-red-500 text-white font-bold py-2 px-3 rounded-md hover:bg-red-600 transition-colors text-sm">
                                        {t('logout')}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-2">
                                    <button onClick={() => { setAuthModal('login'); setIsMenuOpen(false); }} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                                        {t('login')}
                                    </button>
                                     <button onClick={() => { setAuthModal('signup'); setIsMenuOpen(false); }} className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-700 transition-colors">
                                        {t('signUp')}
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center justify-around pt-4 border-t dark:border-gray-600">
                                <button
                                    onClick={() => { handleThemeToggle(); setIsMenuOpen(false); }}
                                    title={t('toggleTheme')}
                                    aria-label={t('toggleTheme')}
                                    className="text-2xl text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                                >
                                    {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
                                </button>
                                <button
                                    onClick={() => { setLanguage('ar'); setIsMenuOpen(false); }}
                                    className={`text-3xl transition-all duration-200 ease-in-out hover:scale-125 ${language === 'ar' ? 'opacity-100 scale-110' : 'opacity-60'}`}
                                    title="العربية"
                                >
                                    🇹🇳
                                </button>
                                <button
                                    onClick={() => { setLanguage('fr'); setIsMenuOpen(false); }}
                                    className={`text-3xl transition-all duration-200 ease-in-out hover:scale-125 ${language === 'fr' ? 'opacity-100 scale-110' : 'opacity-60'}`}
                                    title="Français"
                                >
                                    🇫🇷
                                </button>
                                <button
                                    onClick={() => { setLanguage('en'); setIsMenuOpen(false); }}
                                    className={`text-3xl transition-all duration-200 ease-in-out hover:scale-125 ${language === 'en' ? 'opacity-100 scale-110' : 'opacity-60'}`}
                                    title="English"
                                >
                                    🇬🇧
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>
            <LoginModal 
                isOpen={authModal === 'login'}
                onClose={() => setAuthModal(null)}
                onSwitchToSignUp={() => setAuthModal('signup')}
            />
            <SignUpModal
                isOpen={authModal === 'signup'}
                onClose={() => setAuthModal(null)}
                onSwitchToLogin={() => setAuthModal('login')}
            />
        </>
    );
};

const MainContent: React.FC<{ isAdminView: boolean; }> = ({ isAdminView }) => {
    const { t } = useI18n();
    const { trips, currentUser, locations, isLoading, error } = useAppContext();
    const [activeTab, setActiveTab] = useState<TransportType | 'live'>(TransportType.LOUAGE);
    const [searchResults, setSearchResults] = useState<Trip[]>([]);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

    // Domestic search state
    const [fromGovernorate, setFromGovernorate] = useState('');
    const [fromDelegation, setFromDelegation] = useState('');
    const [toGovernorate, setToGovernorate] = useState('');
    const [toDelegation, setToDelegation] = useState('');
    const [fromDelegations, setFromDelegations] = useState<string[]>([]);
    const [toDelegations, setToDelegations] = useState<string[]>([]);
    
    // Transporter search state
    const [transporterLocA, setTransporterLocA] = useState('');
    const [transporterLocB, setTransporterLocB] = useState('');

    // Filter state
    const [maxPrice, setMaxPrice] = useState('');
    const [departAfter, setDepartAfter] = useState('');
    const [minSeats, setMinSeats] = useState('');
    
    const { tunisianGovernorates, countries } = locations;

    const governorateMap = useMemo(() => {
        const map = new Map<string, string[]>();
        tunisianGovernorates.forEach(gov => {
            map.set(gov.name, gov.delegations);
        });
        return map;
    }, [tunisianGovernorates]);

    useEffect(() => {
        const gov = tunisianGovernorates.find(g => g.name === fromGovernorate);
        setFromDelegations(gov ? gov.delegations : []);
        setFromDelegation('');
    }, [fromGovernorate, tunisianGovernorates]);

    useEffect(() => {
        const gov = tunisianGovernorates.find(g => g.name === toGovernorate);
        setToDelegations(gov ? gov.delegations : []);
        setToDelegation('');
    }, [toGovernorate, tunisianGovernorates]);
    
    useEffect(() => {
        // Clear location state when changing tabs
        setFromGovernorate(''); setFromDelegation('');
        setToGovernorate(''); setToDelegation('');
        setTransporterLocA(''); setTransporterLocB('');
        setSearchResults([]);
    }, [activeTab]);
    
    if (isAdminView) {
        return <AdminDashboard />;
    }

    const handleSearch = () => {
        const results = trips.filter(trip => {
            if (activeTab === 'live') return false;

            const typeMatch = trip.type === activeTab;
            if (!typeMatch) return false;

            if (activeTab === TransportType.TRANSPORTER) {
                if (!transporterLocA && !transporterLocB) return true;
                const isGovernorate = (loc: string) => tunisianGovernorates.some(g => g.name === loc);

                const tripFrom = trip.fromCity;
                const tripTo = trip.toCity;

                const locAIsGov = transporterLocA && isGovernorate(transporterLocA);
                const locAIsCountry = transporterLocA && !locAIsGov;
                const locBIsGov = transporterLocB && isGovernorate(transporterLocB);
                const locBIsCountry = transporterLocB && !locBIsGov;

                const fromMatchesA = locAIsGov && tripFrom === transporterLocA;
                const fromMatchesB = locBIsGov && tripFrom === transporterLocB;
                const toMatchesA = locAIsCountry && tripTo.toLowerCase().includes(transporterLocA.toLowerCase());
                const toMatchesB = locBIsCountry && tripTo.toLowerCase().includes(transporterLocB.toLowerCase());

                if (transporterLocA && transporterLocB) return (fromMatchesA && toMatchesB) || (fromMatchesB && toMatchesA);
                else if (transporterLocA) return fromMatchesA || toMatchesA;
                else if (transporterLocB) return fromMatchesB || toMatchesB;
                return true;
            } else { // Louage or Bus
                let fromMatch = true;
                if (fromGovernorate) {
                    if (fromDelegation) fromMatch = trip.fromCity === fromDelegation;
                    else {
                        const delegations = governorateMap.get(fromGovernorate);
                        fromMatch = delegations ? delegations.includes(trip.fromCity) : false;
                    }
                }

                let toMatch = true;
                if (toGovernorate) {
                    if (toDelegation) toMatch = trip.toCity === toDelegation;
                    else {
                        const delegations = governorateMap.get(toGovernorate);
                        toMatch = delegations ? delegations.includes(trip.toCity) : false;
                    }
                }
                
                return fromMatch && toMatch;
            }
        });
        setSearchResults(results);
    };

    const filteredResults = useMemo(() => {
        return searchResults.filter(trip => {
            if (maxPrice && (trip.type === TransportType.LOUAGE || trip.type === TransportType.BUS)) {
                if ('price' in trip && (trip as any).price > Number(maxPrice)) return false;
            }
            if (departAfter) {
                const tripTime = new Date(trip.departureTime);
                const [hours, minutes] = departAfter.split(':').map(Number);
                const tripHours = tripTime.getHours();
                const tripMinutes = tripTime.getMinutes();
                if (tripHours < hours || (tripHours === hours && tripMinutes < minutes)) return false;
            }
            if (minSeats && (trip.type === TransportType.LOUAGE || trip.type === TransportType.BUS)) {
                if ('availableSeats' in trip && (trip as any).availableSeats < Number(minSeats)) return false;
            }
            return true;
        });
    }, [searchResults, maxPrice, departAfter, minSeats]);

    const clearFilters = () => { setMaxPrice(''); setDepartAfter(''); setMinSeats(''); };
    
    const handleSwap = () => {
        if (activeTab === TransportType.TRANSPORTER) {
            setTransporterLocA(transporterLocB); setTransporterLocB(transporterLocA);
        } else {
            setFromGovernorate(toGovernorate); setToGovernorate(fromGovernorate);
            setFromDelegation(toDelegation); setToDelegation(fromDelegation);
        }
    };

    const TabButton = ({ type, label, icon }: { type: TransportType | 'live'; label: string; icon: string; }) => (
        <button
            onClick={() => setActiveTab(type)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 ${ activeTab === type ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-600' }`}
        >
            <i className={`fas ${icon} text-2xl mb-2 ${activeTab === type ? 'text-white' : 'text-indigo-500 dark:text-indigo-400'}`}></i>
            <span className={`text-xs font-bold uppercase tracking-wider ${activeTab === type ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>{label}</span>
        </button>
    );

    const renderSearchForm = () => {
        if (activeTab === TransportType.TRANSPORTER) {
             const locationOptions = (
                <>
                    <option value="">{t('country')} / {t('governorate')}</option>
                    <optgroup label={t('governorate')}>
                        {tunisianGovernorates.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
                    </optgroup>
                    <optgroup label={t('country')}>
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                </>
            );
            return (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('from')}</label>
                        <select value={transporterLocA} onChange={e => setTransporterLocA(e.target.value)} className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1">{locationOptions}</select>
                    </div>
                     <div className="flex justify-center items-center">
                        <button onClick={handleSwap} title={t('swapLocations')} className="p-3 bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-500 transition-colors">
                            <i className="fas fa-exchange-alt text-gray-600 dark:text-gray-200"></i>
                        </button>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('to')}</label>
                        <select value={transporterLocB} onChange={e => setTransporterLocB(e.target.value)} className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1">{locationOptions}</select>
                    </div>
                </div>
            );
        }

        return (
            <div className="grid md:grid-cols-5 gap-4 mb-4 items-end">
                <div className="md:col-span-2 grid grid-cols-2 gap-2">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('from')} ({t('governorate')})</label>
                        <select value={fromGovernorate} onChange={e => setFromGovernorate(e.target.value)} className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1">
                            <option value="">{t('governorate')}</option>
                            {tunisianGovernorates.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('delegation')}</label>
                        <select value={fromDelegation} onChange={e => setFromDelegation(e.target.value)} disabled={!fromGovernorate} className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1 disabled:bg-gray-700">
                             <option value="">{t('delegation')}</option>
                             {fromDelegations.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <button onClick={handleSwap} title={t('swapLocations')} className="p-3 bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-500 transition-colors">
                        <i className="fas fa-exchange-alt text-gray-600 dark:text-gray-200"></i>
                    </button>
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('to')} ({t('governorate')})</label>
                        <select value={toGovernorate} onChange={e => setToGovernorate(e.target.value)} className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1">
                            <option value="">{t('governorate')}</option>
                            {tunisianGovernorates.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('delegation')}</label>
                        <select value={toDelegation} onChange={e => setToDelegation(e.target.value)} disabled={!toGovernorate} className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1 disabled:bg-gray-700">
                             <option value="">{t('delegation')}</option>
                             {toDelegations.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <main className="p-4 md:p-6">
            {currentUser?.role === UserRole.OPERATOR ? (
                 <OperatorView />
            ) : (
                <>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                        <div className="grid grid-cols-4 gap-4 mb-4">
                            <TabButton type={TransportType.LOUAGE} label={t('louage')} icon="fa-car-side" />
                            <TabButton type={TransportType.BUS} label={t('bus')} icon="fa-bus" />
                            <TabButton type={TransportType.TRANSPORTER} label={t('transporter')} icon="fa-truck-moving" />
                            <TabButton type={'live'} label={t('liveMap')} icon="fa-map-marked-alt" />
                        </div>
                        
                        {activeTab !== 'live' ? (
                            <>
                                {renderSearchForm()}
                                <button onClick={handleSearch} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors">{t('findTrips')}</button>
                             </>
                        ) : ( <LiveBusMap /> )}
                    </div>

                    {activeTab !== 'live' && searchResults.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mt-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">{t('filters')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                                {(activeTab === TransportType.LOUAGE || activeTab === TransportType.BUS) && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('maxPrice')}</label>
                                        <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="TND" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1 dark:placeholder-gray-400" />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('departAfter')}</label>
                                    <input type="time" value={departAfter} onChange={e => setDepartAfter(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1" />
                                </div>
                                {(activeTab === TransportType.LOUAGE || activeTab === TransportType.BUS) && (
                                     <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('minSeats')}</label>
                                        <input type="number" value={minSeats} onChange={e => setMinSeats(e.target.value)} placeholder="1" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1 dark:placeholder-gray-400" />
                                    </div>
                                )}
                                <button onClick={clearFilters} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">{t('clearFilters')}</button>
                            </div>
                        </div>
                    )}

                    {activeTab !== 'live' && (
                         <div className="mt-6">
                            {isLoading ? (<p className="text-center text-gray-500 dark:text-gray-400 mt-8">Loading trips...</p>) 
                            : error ? (<p className="text-center text-red-500 mt-8">{error}</p>) 
                            : searchResults.length > 0 ? (
                                filteredResults.length > 0 ? (
                                    filteredResults.map(trip => ( <TripCard key={trip.id} trip={trip} onSelect={setSelectedTrip} /> ))
                                ) : ( <p className="text-center text-gray-500 dark:text-gray-400 mt-8">{t('noResults')}</p> )
                            ) : ( <p className="text-center text-gray-500 dark:text-gray-400 mt-8">Please start a search to see trips.</p> )}
                        </div>
                    )}
                </>
            )}

            {selectedTrip && <TripDetailsModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />}
        </main>
    );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => { setShowSplash(false); }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppProvider>
        <AppContent showSplash={showSplash} isAdminView={isAdminView} setIsAdminView={setIsAdminView} />
    </AppProvider>
  );
}

const AppContent: React.FC<{showSplash: boolean, isAdminView: boolean, setIsAdminView: (isAdmin: boolean) => void}> = ({ showSplash, isAdminView, setIsAdminView }) => {
    const { currentUser } = useAppContext();

    useEffect(() => {
        if (currentUser?.role !== UserRole.ADMIN && isAdminView) {
            setIsAdminView(false);
        }
    }, [currentUser, isAdminView, setIsAdminView]);
    
    return (
         <div className={`min-h-screen font-sans transition-opacity duration-500 ${showSplash ? 'opacity-0' : 'opacity-100'} bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}>
            <SplashScreen isVisible={showSplash} />
            <Header isAdminView={isAdminView} onToggleAdminView={() => setIsAdminView(!isAdminView)} />
            <MainContent isAdminView={isAdminView} />
        </div>
    )
}

export default App;
