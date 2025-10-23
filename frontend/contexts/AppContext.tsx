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
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  currentUser: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  signUp: (data: SignUpData) => Promise<void>;
  trips: Trip[];
  updateTrip: (updatedTrip: Trip) => Promise<void>;
  addTrip: (tripData: Omit<Trip, 'id' | 'operatorId' | 'operatorName'>) => Promise<void>;
  deleteTrip: (tripId: string) => Promise<void>;
  stations: { [key: string]: Station };
  addStation: (stationData: Omit<Station, 'id'>) => Promise<void>;
  updateStation: (stationData: Station) => Promise<void>;
  deleteStation: (stationId: string) => Promise<void>;
  locations: LocationData;
  allUsers: User[];
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getApiUrl = () => 'http://localhost:3000/api';


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) return savedTheme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [stations, setStations] = useState<{ [key: string]: Station }>({});
  const [locations, setLocations] = useState<LocationData>({ tunisianGovernorates: [], countries: [] });
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const fetchAllData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${getApiUrl()}/users`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const usersData = await res.json();
      // FIX: The backend sends uppercase roles, but the frontend User type expects lowercase.
      // Convert roles to lowercase to match the frontend type definition.
      const formattedUsers = usersData.map((user: any) => ({
        ...user,
        role: user.role.toLowerCase(),
      }));
      setAllUsers(formattedUsers);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  }, []);

  useEffect(() => {
    // FIX: Simplified role check after ensuring currentUser.role is always lowercase.
    if (currentUser?.role === UserRole.ADMIN) {
      fetchUsers();
    }
  }, [currentUser, fetchUsers]);
  
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
    // FIX: The backend sends uppercase roles, but the frontend User type expects lowercase.
    // Convert the role to lowercase to match the frontend type definition.
    if (user.role) {
      user.role = user.role.toLowerCase();
    }
    setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setAllUsers([]); // Clear admin-only data on logout
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
    // FIX: The backend sends uppercase roles, but the frontend User type expects lowercase.
    // Convert the role to lowercase to match the frontend type definition for auto-login.
    if (newUser.role) {
      newUser.role = newUser.role.toLowerCase();
    }
    setCurrentUser(newUser);
  }, []);

  const updateTrip = useCallback(async (updatedTrip: Trip) => {
    await fetch(`${getApiUrl()}/trips/${updatedTrip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTrip),
    });
    await fetchAllData();
  }, [fetchAllData]);

  const addTrip = useCallback(async (tripData: Omit<Trip, 'id'| 'operatorId' | 'operatorName'>) => {
    if (!currentUser) return;
    // FIX: Simplified role check after ensuring currentUser.role is always lowercase.
    if (currentUser.role !== UserRole.OPERATOR) {
        console.error("Only operators can add trips. Current role:", currentUser?.role);
        return;
    }
    await fetch(`${getApiUrl()}/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tripData, operatorId: currentUser.id }),
    });
    await fetchAllData();
  }, [currentUser, fetchAllData]);
  
  const deleteTrip = useCallback(async (tripId: string) => {
    await fetch(`${getApiUrl()}/trips/${tripId}`, { method: 'DELETE' });
    await fetchAllData();
  }, [fetchAllData]);
  
  const updateUserRole = useCallback(async (userId: string, role: UserRole) => {
    await fetch(`${getApiUrl()}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
    });
    await fetchUsers();
  }, [fetchUsers]);

  const deleteUser = useCallback(async (userId: string) => {
    await fetch(`${getApiUrl()}/users/${userId}`, { method: 'DELETE' });
    await fetchUsers();
  }, [fetchUsers]);
  
  const addStation = useCallback(async (stationData: Omit<Station, 'id'>) => {
      await fetch(`${getApiUrl()}/stations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stationData)
      });
      await fetchAllData();
  }, [fetchAllData]);

  const updateStation = useCallback(async (stationData: Station) => {
      await fetch(`${getApiUrl()}/stations/${stationData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stationData)
      });
      await fetchAllData();
  }, [fetchAllData]);
  
  const deleteStation = useCallback(async (stationId: string) => {
      await fetch(`${getApiUrl()}/stations/${stationId}`, { method: 'DELETE' });
      await fetchAllData();
  }, [fetchAllData]);


  const contextValue = { 
      language, setLanguage, theme, setTheme, currentUser, login, logout, signUp, 
      trips, updateTrip, addTrip, deleteTrip,
      stations, addStation, updateStation, deleteStation,
      locations, allUsers, updateUserRole, deleteUser,
      isLoading, error 
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