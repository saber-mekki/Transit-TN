import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { UserRole, TransportType, User } from '../types';
import type { Language, Trip, Station } from '../types';

// This is a simplified version of the backend's location data structure
interface Governorate {
    name: string;
    delegations: string[];
}

interface SignUpData {
    displayName: string;
    username: string;
    password: string;
    role: UserRole;
}

interface LocationData {
    tunisianGovernorates: Governorate[];
    countries: string[];
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  signUp: (data: SignUpData) => Promise<void>;
  trips: Trip[];
  updateTrip: (updatedTrip: Trip) => void;
  addTrip: (tripData: Omit<Trip, 'id' | 'operatorId' | 'operatorName'>) => void;
  stations: { [key: string]: Station };
  locations: LocationData;
  isLoading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getApiUrl = () => 'http://localhost:3000/api';


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [stations, setStations] = useState<{ [key: string]: Station }>({});
  const [locations, setLocations] = useState<LocationData>({ tunisianGovernorates: [], countries: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Fetch initial data from the backend
  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [tripsRes, stationsRes, locationsRes] = await Promise.all([
                fetch(`${getApiUrl()}/trips`),
                fetch(`${getApiUrl()}/stations`),
                fetch(`${getApiUrl()}/locations`)
            ]);

            if (!tripsRes.ok || !stationsRes.ok || !locationsRes.ok) {
                throw new Error('Failed to fetch initial data from the server.');
            }

            const tripsData = await tripsRes.json();
            const stationsData = await stationsRes.json();
            const locationsData = await locationsRes.json();
            
            setTrips(tripsData);
            setLocations(locationsData);

            const stationsMap = stationsData.reduce((acc: any, station: Station) => {
                acc[station.id] = station;
                return acc;
            }, {});
            setStations(stationsMap);

        } catch (err) {
            console.error("Failed to fetch initial data:", err);
            setError("Could not connect to the server. Please make sure the backend is running and refresh the page.");
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, []);

  
  const login = useCallback(async (username: string, password: string): Promise<void> => {
    const response = await fetch(`${getApiUrl()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid credentials');
    }

    const user = await response.json();
    setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const signUp = useCallback(async (data: SignUpData): Promise<void> => {
     const response = await fetch(`${getApiUrl()}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign up failed');
    }

    const newUser = await response.json();
    setCurrentUser(newUser); // Auto-login after sign up
  }, []);


  const updateTrip = async (updatedTrip: Trip) => {
    try {
        const response = await fetch(`${getApiUrl()}/trips/${updatedTrip.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTrip),
        });
        if (!response.ok) throw new Error('Failed to update trip');

        // Refetch all trips to get the relations populated correctly for the UI
        const tripsRes = await fetch(`${getApiUrl()}/trips`);
        const tripsData = await tripsRes.json();
        setTrips(tripsData);
    } catch(err) {
        console.error("Error updating trip:", err);
    }
  };

  const addTrip = async (tripData: Omit<Trip, 'id'| 'operatorId' | 'operatorName'>) => {
    if (!currentUser || currentUser.role !== UserRole.OPERATOR) {
        console.error("Only operators can add trips.");
        return;
    }

    try {
        const response = await fetch(`${getApiUrl()}/trips`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...tripData, operatorId: currentUser.id }),
        });
        if (!response.ok) throw new Error('Failed to add trip');
        
        // Refetch all trips to get the relations populated correctly for the UI
        const tripsRes = await fetch(`${getApiUrl()}/trips`);
        const tripsData = await tripsRes.json();
        setTrips(tripsData);

    } catch(err) {
         console.error("Error adding trip:", err);
    }
  };

  const contextValue = { 
      language, setLanguage, currentUser, login, logout, signUp, 
      trips, updateTrip, addTrip, stations, locations, isLoading, error 
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};