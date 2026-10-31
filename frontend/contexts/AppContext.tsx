import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { UserRole, TransportType, User } from "../types";
import type { Language, Trip, Station } from "../types";
import { countries } from "../../backend/src/data/locations";

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
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  currentUser: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  signUp: (data: SignUpData) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  trips: Trip[];
  updateTrip: (updatedTrip: Trip) => Promise<void>;
  addTrip: (
    tripData: Omit<Trip, "id" | "operatorId" | "operatorName">,
  ) => Promise<void>;
  deleteTrip: (tripId: string) => Promise<void>;
  stations: { [key: string]: Station };
  addStation: (stationData: Omit<Station, "id">) => Promise<void>;
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

declare global {
  interface Window {
    APP_CONFIG?: {
      API_URL?: string;
    };
  }
}

const getApiUrl = () => {
  // The backend URL is configured in `frontend/config.js`.
  // It defaults to the hosted transit-tn-backend if the config file is missing or the value is not set.
  const baseUrl = (
    window.APP_CONFIG?.API_URL || "http://localhost:3001"
  ).replace(/\/$/, "");
  return `${baseUrl}/api`;
};

const TOKEN_KEY = "authToken";

// Adds the JWT returned by /auth/login and /auth/signup to authenticated requests
const authFetch = (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem(TOKEN_KEY);
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

// transit-tn-backend returns { user, token } with an uppercase role
const handleAuthResponse = (data: any): User => {
  const user = data.user ?? data;
  if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
  user.role =
    typeof user.role === "string" ? user.role.toLowerCase() : UserRole.USER;
  return user;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language");
    return savedLanguage === "fr" || savedLanguage === "en" ? savedLanguage : "ar";
  });
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) return savedTheme;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    )
      return "dark";
    return "light";
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [stations, setStations] = useState<{ [key: string]: Station }>({});
  const [locations, setLocations] = useState<LocationData>({
    tunisianGovernorates: [],
    countries: [],
  });
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tripsRes, stationsRes, locationsRes] = await Promise.all([
        // The backend paginates (20 by default); search is done client-side, so load everything
        fetch(`${getApiUrl()}/trips?limit=1000`),
        fetch(`${getApiUrl()}/stations`),
        fetch(`${getApiUrl()}/locations`),
      ]);

      if (!tripsRes.ok || !stationsRes.ok || !locationsRes.ok) {
        throw new Error("Failed to fetch initial data from the server.");
      }

      const tripsData = await tripsRes.json();
      const stationsData = await stationsRes.json();
      const locationsData = await locationsRes.json();

      // transit-tn-backend returns { trips: [...] }; the old backend returned a plain array
      setTrips(Array.isArray(tripsData) ? tripsData : (tripsData.trips ?? []));
      // transit-tn-backend returns only the governorates array (no countries list)
      setLocations(
        Array.isArray(locationsData)
          ? { tunisianGovernorates: locationsData, countries }
          : locationsData,
      );

      const stationsMap = stationsData.reduce((acc: any, station: Station) => {
        acc[station.id] = station;
        return acc;
      }, {});
      setStations(stationsMap);
    } catch (err) {
      console.error("Failed to fetch initial data:", err);
      setError(
        "Could not connect to the server. Please make sure the backend is running and refresh the page.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Restore the session after a page refresh using the saved token
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    authFetch(`${getApiUrl()}/auth/me`)
      .then(async (res) => {
        if (res.ok) {
          setCurrentUser(handleAuthResponse(await res.json()));
        } else if (res.status === 401 || res.status === 404) {
          // Token expired/invalid or user deleted
          localStorage.removeItem(TOKEN_KEY);
        }
      })
      .catch((err) => console.error("Failed to restore session:", err));
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await authFetch(`${getApiUrl()}/users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const usersData = await res.json();
      const formattedUsers = usersData.map((user: any) => ({
        ...user,
        role:
          typeof user.role === "string"
            ? user.role.toLowerCase()
            : UserRole.USER,
      }));
      setAllUsers(formattedUsers);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role === UserRole.ADMIN) {
      fetchUsers();
    }
  }, [currentUser, fetchUsers]);

  const login = useCallback(
    async (username: string, password: string): Promise<void> => {
      const response = await fetch(`${getApiUrl()}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The backend's `email` field accepts either an email or a username
        body: JSON.stringify({ email: username, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid credentials");
      }
      setCurrentUser(handleAuthResponse(await response.json()));
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setCurrentUser(null);
    setAllUsers([]); // Clear admin-only data on logout
  }, []);

  const signUp = useCallback(async (data: SignUpData): Promise<void> => {
    const response = await fetch(`${getApiUrl()}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // The backend requires `email` and an uppercase role
      body: JSON.stringify({
        displayName: data.displayName,
        email: data.username,
        password: data.password,
        role: data.role.toUpperCase(),
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Sign up failed");
    }
    setCurrentUser(handleAuthResponse(await response.json()));
  }, []);

  // Step 1 of password reset: the backend emails a 6-digit code
  const requestPasswordReset = useCallback(async (email: string): Promise<void> => {
    const response = await fetch(`${getApiUrl()}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send reset code");
    }
  }, []);

  // Step 2 of password reset: the emailed code authorizes the new password
  const resetPassword = useCallback(
    async (email: string, code: string, newPassword: string): Promise<void> => {
      const response = await fetch(`${getApiUrl()}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Password reset failed");
      }
    },
    [],
  );

  const updateTrip = useCallback(
    async (updatedTrip: Trip) => {
      await authFetch(`${getApiUrl()}/trips/${updatedTrip.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTrip),
      });
      await fetchAllData();
    },
    [fetchAllData],
  );

  const addTrip = useCallback(
    async (tripData: Omit<Trip, "id" | "operatorId" | "operatorName">) => {
      if (!currentUser || currentUser.role !== UserRole.OPERATOR) {
        console.error(
          "Only operators can add trips. Current role:",
          currentUser?.role,
        );
        return;
      }
      await authFetch(`${getApiUrl()}/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...tripData, operatorId: currentUser.id }),
      });
      await fetchAllData();
    },
    [currentUser, fetchAllData],
  );

  const deleteTrip = useCallback(
    async (tripId: string) => {
      await authFetch(`${getApiUrl()}/trips/${tripId}`, { method: "DELETE" });
      await fetchAllData();
    },
    [fetchAllData],
  );

  const updateUserRole = useCallback(
    async (userId: string, role: UserRole) => {
      await authFetch(`${getApiUrl()}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      await fetchUsers();
    },
    [fetchUsers],
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      await authFetch(`${getApiUrl()}/users/${userId}`, { method: "DELETE" });
      await fetchUsers();
    },
    [fetchUsers],
  );

  const addStation = useCallback(
    async (stationData: Omit<Station, "id">) => {
      await authFetch(`${getApiUrl()}/stations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stationData),
      });
      await fetchAllData();
    },
    [fetchAllData],
  );

  const updateStation = useCallback(
    async (stationData: Station) => {
      await authFetch(`${getApiUrl()}/stations/${stationData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stationData),
      });
      await fetchAllData();
    },
    [fetchAllData],
  );

  const deleteStation = useCallback(
    async (stationId: string) => {
      await authFetch(`${getApiUrl()}/stations/${stationId}`, { method: "DELETE" });
      await fetchAllData();
    },
    [fetchAllData],
  );

  const contextValue = {
    language,
    setLanguage,
    theme,
    setTheme,
    currentUser,
    login,
    logout,
    signUp,
    requestPasswordReset,
    resetPassword,
    trips,
    updateTrip,
    addTrip,
    deleteTrip,
    stations,
    addStation,
    updateStation,
    deleteStation,
    locations,
    allUsers,
    updateUserRole,
    deleteUser,
    isLoading,
    error,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
