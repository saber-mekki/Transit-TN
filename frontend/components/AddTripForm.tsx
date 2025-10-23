import React, { useState, FormEvent, useMemo, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useI18n } from '../hooks/useI18n';
import { TransportType } from '../types';
import type { Trip, LouageTrip, BusTrip, TransporterTrip, Station } from '../types';


interface AddTripFormProps {
  isOpen: boolean;
  onClose: () => void;
  tripToEdit?: Trip | null;
}

const initialFormState = {
    type: TransportType.LOUAGE,
    fromCity: '',
    fromCountry: '',
    toCity: '',
    toCountry: '',
    departureTime: '',
    arrivalTime: '',
    // Louage/Bus specific
    stationId: '',
    customStationName: '',
    departureStationId: '',
    customDepartureStationName: '',
    arrivalStationId: '',
    customArrivalStationName: '',
    price: '',
    totalSeats: '8',
    vehicleNumber: '',
    // Transporter specific
    contactInfo: '',
    vehicleType: '',
    availableSpace: '',
    eta: '',
    route: [] as string[],
};

export const AddTripForm: React.FC<AddTripFormProps> = ({ isOpen, onClose, tripToEdit }) => {
    const { t } = useI18n();
    const { addTrip, updateTrip, stations: stationsData, locations } = useAppContext();
    const [formData, setFormData] = useState(initialFormState);
    
    const [fromGovernorate, setFromGovernorate] = useState('');
    const [toGovernorate, setToGovernorate] = useState('');
    const [fromDelegations, setFromDelegations] = useState<string[]>([]);
    const [toDelegations, setToDelegations] = useState<string[]>([]);

    const [isManualStation, setIsManualStation] = useState(false);
    const [isManualDepartureStation, setIsManualDepartureStation] = useState(false);
    const [isManualArrivalStation, setIsManualArrivalStation] = useState(false);

    const isEditMode = !!tripToEdit;
    
    const { tunisianGovernorates, countries } = locations;

    const stationsEntries = useMemo(() => Object.values(stationsData), [stationsData]);

    const cityToGovernorateMap = useMemo(() => {
        const map = new Map<string, string>();
        for (const gov of tunisianGovernorates) {
            for (const del of gov.delegations) {
                map.set(del, gov.name);
            }
        }
        return map;
    }, [tunisianGovernorates]);

    useEffect(() => {
        if (!isOpen) return;

        if (isEditMode && tripToEdit) {
            const { type, fromCity, toCity, departureTime, arrivalTime } = tripToEdit;

            const parseLocation = (locationString: string): { city: string; country: string } => {
                const parts = locationString.split(', ').map(s => s.trim());
                if (parts.length === 2 && countries.includes(parts[1])) {
                    return { city: parts[0], country: parts[1] };
                }
                return { city: locationString, country: '' };
            };

            let populatedState: any = {
                ...initialFormState,
                type: type.toLowerCase(),
                departureTime: new Date(new Date(departureTime).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
                arrivalTime: new Date(new Date(arrivalTime).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
            };
            
            if (type.toLowerCase() === TransportType.TRANSPORTER) {
                const parsedFrom = parseLocation(fromCity);
                const parsedTo = parseLocation(toCity);
                populatedState.fromCity = parsedFrom.city;
                populatedState.fromCountry = parsedFrom.country;
                populatedState.toCity = parsedTo.city;
                populatedState.toCountry = parsedTo.country;
            } else {
                populatedState.fromCity = fromCity;
                populatedState.toCity = toCity;
                const fromGov = cityToGovernorateMap.get(fromCity) || '';
                const toGov = cityToGovernorateMap.get(toCity) || '';
                setFromGovernorate(fromGov);
                setToGovernorate(toGov);
            }

            switch (type.toLowerCase()) {
                case TransportType.LOUAGE: {
                    const louageTrip = tripToEdit as LouageTrip;
                    setIsManualStation(!!louageTrip.customStationName);
                    populatedState.stationId = louageTrip.stationId || '';
                    populatedState.customStationName = louageTrip.customStationName || '';
                    populatedState.price = String(louageTrip.price);
                    populatedState.totalSeats = String(louageTrip.totalSeats);
                    populatedState.contactInfo = louageTrip.contactInfo || '';
                    populatedState.vehicleNumber = louageTrip.vehicleNumber || '';
                    break;
                }
                case TransportType.BUS: {
                    const busTrip = tripToEdit as BusTrip;
                    setIsManualDepartureStation(!!busTrip.customDepartureStationName);
                    setIsManualArrivalStation(!!busTrip.customArrivalStationName);
                    populatedState.departureStationId = busTrip.departureStationId || '';
                    populatedState.customDepartureStationName = busTrip.customDepartureStationName || '';
                    populatedState.arrivalStationId = busTrip.arrivalStationId || '';
                    populatedState.customArrivalStationName = busTrip.customArrivalStationName || '';
                    populatedState.price = String(busTrip.price);
                    populatedState.totalSeats = String(busTrip.totalSeats);
                    break;
                }
                case TransportType.TRANSPORTER: {
                    const transTrip = tripToEdit as TransporterTrip;
                    populatedState.contactInfo = transTrip.contactInfo;
                    populatedState.vehicleType = transTrip.vehicleType;
                    populatedState.availableSpace = transTrip.availableSpace;
                    populatedState.eta = transTrip.eta;
                    populatedState.route = transTrip.route || [];
                    break;
                }
            }
            setFormData(populatedState);
        } else {
            setFormData(initialFormState);
            setFromGovernorate('');
            setToGovernorate('');
            setIsManualStation(false);
            setIsManualDepartureStation(false);
            setIsManualArrivalStation(false);
        }
    }, [isOpen, tripToEdit, cityToGovernorateMap, stationsData, isEditMode, countries]);

    const filteredFromStations = useMemo(() => {
        if (!fromGovernorate) return [];
        return stationsEntries.filter((station) => {
            const govOfStation = cityToGovernorateMap.get(station.city);
            return govOfStation === fromGovernorate;
        });
    }, [fromGovernorate, stationsEntries, cityToGovernorateMap]);

    const filteredToStations = useMemo(() => {
        if (!toGovernorate) return [];
        return stationsEntries.filter((station) => {
            const govOfStation = cityToGovernorateMap.get(station.city);
            return govOfStation === toGovernorate;
        });
    }, [toGovernorate, stationsEntries, cityToGovernorateMap]);

    useEffect(() => {
        const selectedGov = tunisianGovernorates.find(g => g.name === fromGovernorate);
        setFromDelegations(selectedGov ? selectedGov.delegations : []);
        if(!isEditMode || (tripToEdit && cityToGovernorateMap.get(tripToEdit.fromCity) !== fromGovernorate)) {
             setFormData(prev => ({ ...prev, fromCity: '', stationId: '', departureStationId: '' }));
        }
    }, [fromGovernorate, isEditMode, tripToEdit, cityToGovernorateMap, tunisianGovernorates]);

    useEffect(() => {
        const selectedGov = tunisianGovernorates.find(g => g.name === toGovernorate);
        setToDelegations(selectedGov ? selectedGov.delegations : []);
        if(!isEditMode || (tripToEdit && cityToGovernorateMap.get(tripToEdit.toCity) !== toGovernorate)) {
            setFormData(prev => ({ ...prev, toCity: '', arrivalStationId: '' }));
        }
    }, [toGovernorate, isEditMode, tripToEdit, cityToGovernorateMap, tunisianGovernorates]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (newType: TransportType) => {
        if (!isEditMode) {
            setFormData(prev => ({ ...initialFormState, type: newType }));
        }
    };

    const handleManualToggle = (type: 'station' | 'departure' | 'arrival') => {
        switch(type) {
            case 'station':
                setIsManualStation(prev => {
                    const isSwitchingToManual = !prev;
                    setFormData(f => ({ ...f, stationId: '', customStationName: isSwitchingToManual ? f.customStationName : '' }));
                    return isSwitchingToManual;
                });
                break;
            case 'departure':
                setIsManualDepartureStation(prev => {
                    const isSwitchingToManual = !prev;
                    setFormData(f => ({ ...f, departureStationId: '', customDepartureStationName: isSwitchingToManual ? f.customDepartureStationName : '' }));
                    return isSwitchingToManual;
                });
                break;
            case 'arrival':
                setIsManualArrivalStation(prev => {
                    const isSwitchingToManual = !prev;
                    setFormData(f => ({ ...f, arrivalStationId: '', customArrivalStationName: isSwitchingToManual ? f.customArrivalStationName : '' }));
                    return isSwitchingToManual;
                });
                break;
        }
    };
    
    const handleRouteChange = (value: string, index: number) => {
        const newRoute = [...formData.route];
        newRoute[index] = value;
        setFormData(prev => ({ ...prev, route: newRoute }));
    };

    const addRoutePoint = () => {
        setFormData(prev => ({ ...prev, route: [...prev.route, ''] }));
    };

    const removeRoutePoint = (index: number) => {
        setFormData(prev => ({
            ...prev,
            route: prev.route.filter((_, i) => i !== index)
        }));
    };


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        let tripDataPayload: Partial<Trip> = {};
        
        const commonData = {
            departureTime: new Date(formData.departureTime).toISOString(),
            arrivalTime: new Date(formData.arrivalTime).toISOString(),
        };

        switch(formData.type) {
            case TransportType.LOUAGE: {
                const louageSpecifics: any = {};
                if (isManualStation) {
                    if (formData.customStationName) louageSpecifics.customStationName = formData.customStationName;
                    louageSpecifics.stationId = null;
                } else if (formData.stationId) {
                    louageSpecifics.stationId = formData.stationId;
                    louageSpecifics.customStationName = null;
                }
                tripDataPayload = {
                    ...commonData,
                    fromCity: formData.fromCity,
                    toCity: formData.toCity,
                    type: TransportType.LOUAGE,
                    ...louageSpecifics,
                    price: Number(formData.price),
                    totalSeats: Number(formData.totalSeats),
                    contactInfo: formData.contactInfo,
                    vehicleNumber: formData.vehicleNumber,
                };
                break;
            }
            case TransportType.BUS: {
                const busSpecifics: any = {};
                if (isManualDepartureStation) {
                    if(formData.customDepartureStationName) busSpecifics.customDepartureStationName = formData.customDepartureStationName;
                    busSpecifics.departureStationId = null;
                } else if (formData.departureStationId) {
                    busSpecifics.departureStationId = formData.departureStationId;
                    busSpecifics.customDepartureStationName = null;
                }
                 if (isManualArrivalStation) {
                    if(formData.customArrivalStationName) busSpecifics.customArrivalStationName = formData.customArrivalStationName;
                     busSpecifics.arrivalStationId = null;
                } else if (formData.arrivalStationId) {
                    busSpecifics.arrivalStationId = formData.arrivalStationId;
                    busSpecifics.customArrivalStationName = null;
                }
                tripDataPayload = {
                    ...commonData,
                    fromCity: formData.fromCity,
                    toCity: formData.toCity,
                    type: TransportType.BUS,
                    ...busSpecifics,
                    price: Number(formData.price),
                    totalSeats: Number(formData.totalSeats),
                };
                break;
            }
            case TransportType.TRANSPORTER: {
                const fromLocation = formData.fromCountry
                    ? `${formData.fromCity}, ${formData.fromCountry}`
                    : formData.fromCity;
                const toLocation = formData.toCountry
                    ? `${formData.toCity}, ${formData.toCountry}`
                    : formData.toCity;

                tripDataPayload = {
                    ...commonData,
                    fromCity: fromLocation,
                    toCity: toLocation,
                    type: TransportType.TRANSPORTER,
                    contactInfo: formData.contactInfo,
                    vehicleType: formData.vehicleType,
                    availableSpace: formData.availableSpace,
                    eta: formData.eta,
                    route: formData.route.filter(p => p.trim() !== ''),
                };
                break;
            }
        }

        if (isEditMode && tripToEdit) {
            updateTrip({ ...tripToEdit, ...tripDataPayload } as Trip);
        } else {
            addTrip(tripDataPayload as Omit<Trip, 'id' | 'operatorId' | 'operatorName'>);
        }
        
        onClose();
    };
    
    if (!isOpen) return null;
    
    const typeOptions = [
        { type: TransportType.LOUAGE, icon: 'fa-car-side', label: t('louage') },
        { type: TransportType.BUS, icon: 'fa-bus', label: t('bus') },
        { type: TransportType.TRANSPORTER, icon: 'fa-truck-moving', label: t('transporter') },
    ];


    const renderLocationSelectors = () => {
        if (formData.type === TransportType.TRANSPORTER) {
            const isCountry = (loc: string) => !!loc && countries.includes(loc);

            const handleSwap = () => {
                setFormData(prev => ({
                    ...prev,
                    fromCity: prev.toCity,
                    fromCountry: prev.toCountry,
                    toCity: prev.fromCity,
                    toCountry: prev.fromCountry,
                }));
            };

            const locationOptions = (
                <>
                    <option value="">{t('country')} / {t('governorate')}</option>
                    <optgroup label={t('governorate')}>
                        {tunisianGovernorates.map(gov => <option key={gov.name} value={gov.name}>{gov.name}</option>)}
                    </optgroup>
                    <optgroup label={t('country')}>
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                </>
            );

            return (
                <div className="md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-5 items-end gap-4">
                    {/* From Section */}
                    <div className={`md:col-span-2 grid gap-2 ${isCountry(formData.fromCountry) ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        <div className={isCountry(formData.fromCountry) ? 'col-span-1' : 'col-span-full'}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('from')}</label>
                            <select
                                value={formData.fromCountry || formData.fromCity}
                                onChange={(e) => {
                                    const { value } = e.target;
                                    if (isCountry(value)) {
                                        setFormData(prev => ({ ...prev, fromCountry: value, fromCity: '' }));
                                    } else {
                                        setFormData(prev => ({ ...prev, fromCountry: '', fromCity: value }));
                                    }
                                }}
                                className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                required
                            >
                                {locationOptions}
                            </select>
                        </div>
                        {isCountry(formData.fromCountry) && (
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('toCityLabel')}</label>
                                <input
                                    type="text"
                                    name="fromCity"
                                    value={formData.fromCity}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Paris"
                                    className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center items-center">
                        <button type="button" onClick={handleSwap} title={t('swapLocations')} className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-500 transition-colors">
                            <i className="fas fa-exchange-alt text-gray-600 dark:text-gray-200"></i>
                        </button>
                    </div>

                    {/* To Section */}
                    <div className={`md:col-span-2 grid gap-2 ${isCountry(formData.toCountry) ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        <div className={isCountry(formData.toCountry) ? 'col-span-1' : 'col-span-full'}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('to')}</label>
                            <select
                                value={formData.toCountry || formData.toCity}
                                onChange={(e) => {
                                    const { value } = e.target;
                                    if (isCountry(value)) {
                                        setFormData(prev => ({ ...prev, toCountry: value, toCity: '' }));
                                    } else {
                                        setFormData(prev => ({ ...prev, toCountry: '', toCity: value }));
                                    }
                                }}
                                className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                required
                            >
                                {locationOptions}
                            </select>
                        </div>
                        {isCountry(formData.toCountry) && (
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('toCityLabel')}</label>
                                <input
                                    type="text"
                                    name="toCity"
                                    value={formData.toCity}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Marseille"
                                    className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                    required
                                />
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <>
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('from')} ({t('governorate')})</label>
                    <select value={fromGovernorate} onChange={(e) => setFromGovernorate(e.target.value)} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white" required>
                        <option value="">{t('governorate')}</option>
                        {tunisianGovernorates.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
                    </select>
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('from')} ({t('delegation')})</label>
                    <select name="fromCity" value={formData.fromCity} onChange={handleInputChange} disabled={!fromGovernorate} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white disabled:bg-gray-700" required>
                        <option value="">{t('delegation')}</option>
                        {fromDelegations.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div className="col-span-1">
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('to')} ({t('governorate')})</label>
                    <select value={toGovernorate} onChange={(e) => setToGovernorate(e.target.value)} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white" required>
                        <option value="">{t('governorate')}</option>
                        {tunisianGovernorates.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
                    </select>
                </div>
                 <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('to')} ({t('delegation')})</label>
                    <select name="toCity" value={formData.toCity} onChange={handleInputChange} disabled={!toGovernorate} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white disabled:bg-gray-700" required>
                        <option value="">{t('delegation')}</option>
                        {toDelegations.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </>
        )
    };

    const renderTypeSpecificFields = () => {
        switch (formData.type) {
            case TransportType.LOUAGE:
                return <>
                    <div className="md:col-span-2 lg:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('station')}</label>
                        <div className="flex items-center space-x-2 mt-1">
                            <input id="manualStation" type="checkbox" checked={isManualStation} onChange={() => handleManualToggle('station')} className="rounded" />
                            <label htmlFor="manualStation" className="text-sm text-gray-600 dark:text-gray-400">{t('enterManually')}</label>
                        </div>
                        {isManualStation ? (
                            <input type="text" name="customStationName" value={formData.customStationName} onChange={handleInputChange} placeholder={t('customStationName')} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                        ) : (
                            <select name="stationId" value={formData.stationId} onChange={handleInputChange} disabled={!fromGovernorate} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white disabled:bg-gray-700">
                                <option value="">Select a station</option>
                                {filteredFromStations.map((s) => <option key={s.id} value={s.id}>{s.name} - {s.city}</option>)}
                            </select>
                        )}
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('price')}</label>
                        <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="e.g. 15" className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" required />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('seats')}</label>
                        <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white" required />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('contactInfoFieldLabel')}</label>
                        <input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleInputChange} placeholder={t('contactInfoPlaceholder')} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('vehicleNumber')}</label>
                        <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} placeholder="123 TU 4567" className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                    </div>
                </>;
            case TransportType.BUS:
                return <>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('departure')}</label>
                         <div className="flex items-center space-x-2 mt-1">
                            <input id="manualDepartureStation" type="checkbox" checked={isManualDepartureStation} onChange={() => handleManualToggle('departure')} className="rounded" />
                            <label htmlFor="manualDepartureStation" className="text-sm text-gray-600 dark:text-gray-400">{t('enterManually')}</label>
                        </div>
                         {isManualDepartureStation ? (
                            <input type="text" name="customDepartureStationName" value={formData.customDepartureStationName} onChange={handleInputChange} placeholder={t('customStationName')} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                        ) : (
                            <select name="departureStationId" value={formData.departureStationId} onChange={handleInputChange} disabled={!fromGovernorate} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white disabled:bg-gray-700">
                                <option value="">Select a station</option>
                                {filteredFromStations.map((s) => <option key={s.id} value={s.id}>{s.name} - {s.city}</option>)}
                            </select>
                        )}
                    </div>
                     <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('arrival')}</label>
                        <div className="flex items-center space-x-2 mt-1">
                            <input id="manualArrivalStation" type="checkbox" checked={isManualArrivalStation} onChange={() => handleManualToggle('arrival')} className="rounded" />
                            <label htmlFor="manualArrivalStation" className="text-sm text-gray-600 dark:text-gray-400">{t('enterManually')}</label>
                        </div>
                        {isManualArrivalStation ? (
                             <input type="text" name="customArrivalStationName" value={formData.customArrivalStationName} onChange={handleInputChange} placeholder={t('customStationName')} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                        ) : (
                            <select name="arrivalStationId" value={formData.arrivalStationId} onChange={handleInputChange} disabled={!toGovernorate} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white disabled:bg-gray-700">
                                <option value="">Select a station</option>
                                {filteredToStations.map((s) => <option key={s.id} value={s.id}>{s.name} - {s.city}</option>)}
                            </select>
                        )}
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('price')}</label>
                        <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white" required/>
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('seats')}</label>
                        <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white" required />
                    </div>
                </>;
            case TransportType.TRANSPORTER:
                return <>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('contactInfoFieldLabel')}</label>
                        <input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleInputChange} placeholder={t('contactInfoPlaceholder')} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" required />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vehicle Type</label>
                        <input type="text" name="vehicleType" value={formData.vehicleType} onChange={handleInputChange} placeholder="e.g. Refrigerated Truck" className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" required />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('availableSpace')}</label>
                        <div className="relative mt-1">
                            <div className="pointer-events-none absolute inset-y-0 ltr:left-0 rtl:right-0 flex items-center pl-3 rtl:pr-3">
                                <i className="fas fa-box text-gray-400"></i>
                            </div>
                            <input type="text" name="availableSpace" value={formData.availableSpace} onChange={handleInputChange} placeholder="e.g. 5 tons" className="block w-full p-2 ltr:pl-10 rtl:pr-10 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" required />
                        </div>
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('eta')}</label>
                        <input type="text" name="eta" value={formData.eta} onChange={handleInputChange} placeholder="e.g. 3 days" className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" required />
                    </div>
                    <div className="md:col-span-2 lg:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('routeLabel')}</label>
                        <div className="space-y-2 mt-1">
                            {formData.route.map((point, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={point}
                                        onChange={(e) => handleRouteChange(e.target.value, index)}
                                        placeholder={t('routePlaceholder')}
                                        className="flex-grow p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeRoutePoint(index)}
                                        className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                                        aria-label="Remove route point"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addRoutePoint}
                            className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                           + {t('addRoutePoint')}
                        </button>
                    </div>
                </>;
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh] text-gray-900 dark:text-gray-100" onClick={e => e.stopPropagation()}>
                <div className="p-6 pb-4 border-b dark:border-gray-700 flex-shrink-0 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800 dark:hover:text-white">&times;</button>
                    <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{isEditMode ? t('editTrip') : t('addTrip')}</h2>
                </div>
                
                <div className="overflow-y-auto flex-grow">
                    <form id="tripForm" onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Trip Type</label>
                             <div className="mt-1 grid grid-cols-3 gap-2">
                                {typeOptions.map(({ type, icon, label }) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => handleTypeChange(type as TransportType)}
                                        disabled={isEditMode}
                                        className={`flex flex-col items-center justify-center p-3 rounded-md border-2 transition-all duration-200
                                            ${formData.type === type 
                                                ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500 dark:border-indigo-400' 
                                                : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'}
                                            ${isEditMode ? 'cursor-not-allowed opacity-60' : ''}
                                        `}
                                    >
                                        <i className={`fas ${icon} text-2xl mb-2 ${formData.type === type ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}></i>
                                        <span className={`text-sm font-semibold ${formData.type === type ? 'text-indigo-800 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300'}`}>{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-t dark:border-gray-700 pt-4">
                            
                            {renderLocationSelectors()}
                            
                            <div className="md:col-span-1 lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('departure')}</label>
                                <input type="datetime-local" name="departureTime" value={formData.departureTime} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white" required />
                            </div>
                            <div className="md:col-span-1 lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('arrival')}</label>
                                <input type="datetime-local" name="arrivalTime" value={formData.arrivalTime} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white" required />
                            </div>
                            
                            {renderTypeSpecificFields()}
                        </div>
                    </form>
                </div>
                
                <div className="p-6 pt-4 border-t dark:border-gray-700 flex-shrink-0">
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors mr-2">{t('close')}</button>
                        <button type="submit" form="tripForm" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">{isEditMode ? t('updateTrip') : t('addTrip')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};