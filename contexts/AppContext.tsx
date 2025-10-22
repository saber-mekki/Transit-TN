import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { UserRole, TransportType, User } from '../types';
import type { Language, Trip, LouageTrip, BusTrip } from '../types';
import { mockTrips, stations } from '../data/seed';
import { mockUsers } from '../data/users';

interface SignUpData {
    displayName: string;
    username: string;
    password: string;
    role: UserRole;
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
  stations: typeof stations;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  
  const login = useCallback(async (username: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Simulate network delay
        const user = mockUsers.find(
          u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
        );
        if (user) {
          setCurrentUser(user);
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const signUp = useCallback(async (data: SignUpData): Promise<void> => {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              const usernameExists = mockUsers.some(
                  u => u.username.toLowerCase() === data.username.toLowerCase()
              );

              if (usernameExists) {
                  return reject(new Error('Username already exists'));
              }

              const newUser: User = {
                  id: `user_${Date.now()}`,
                  username: data.username,
                  password: data.password,
                  role: data.role,
                  displayName: data.displayName,
              };

              mockUsers.push(newUser);
              setCurrentUser(newUser); // Auto-login after sign up
              resolve();
          }, 500);
      });
  }, []);


  const updateTrip = (updatedTrip: Trip) => {
    setTrips(prevTrips =>
      prevTrips.map(trip => (trip.id === updatedTrip.id ? updatedTrip : trip))
    );
  };

  const addTrip = (tripData: Omit<Trip, 'id'| 'operatorId' | 'operatorName'>) => {
    if (currentUser?.role !== UserRole.OPERATOR) {
        console.error("Only operators can add trips.");
        return;
    }

    let newTrip: Trip = {
        ...tripData,
        id: `${tripData.type.charAt(0).toUpperCase()}${Date.now()}`,
        operatorId: currentUser.id,
        operatorName: currentUser.displayName,
    } as Trip;
    
    if (newTrip.type === TransportType.LOUAGE) {
        (newTrip as LouageTrip).availableSeats = (newTrip as LouageTrip).totalSeats;
        (newTrip as LouageTrip).isFull = false;
    }
    if (newTrip.type === TransportType.BUS) {
        (newTrip as BusTrip).availableSeats = (newTrip as BusTrip).totalSeats;
    }

    setTrips(prevTrips => [newTrip, ...prevTrips]);
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, currentUser, login, logout, signUp, trips, updateTrip, addTrip, stations }}>
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