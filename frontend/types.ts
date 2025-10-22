export enum TransportType {
  LOUAGE = 'louage',
  BUS = 'bus',
  TRANSPORTER = 'transporter',
}

export enum UserRole {
  USER = 'user',
  OPERATOR = 'operator',
  ADMIN = 'admin',
}

export interface Station {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
}

export interface BaseTrip {
  id: string;
  type: TransportType;
  operatorId: string;
  operatorName: string;
  fromCity: string;
  toCity: string;
  departureTime: string; // ISO 8601 format
  arrivalTime: string; // ISO 8601 format
}

export interface LouageTrip extends BaseTrip {
  type: TransportType.LOUAGE;
  station?: Station;
  stationId?: string | null;
  customStationName?: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  isFull: boolean;
  vehicleNumber?: string;
  contactInfo?: string;
}

export interface BusTrip extends BaseTrip {
  type: TransportType.BUS;
  departureStation?: Station;
  departureStationId?: string | null;
  arrivalStation?: Station;
  arrivalStationId?: string | null;
  customDepartureStationName?: string;
  customArrivalStationName?: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
}

export interface TransporterTrip extends BaseTrip {
  type: TransportType.TRANSPORTER;
  contactInfo: string;
  vehicleType: string;
  availableSpace: string; // e.g., '5 m³' or '2 tons'
  eta: string; // Estimated Time of Arrival, could be a date or duration
  route?: string[];
}

export type Trip = LouageTrip | BusTrip | TransporterTrip;

export type Language = 'ar' | 'fr' | 'en';

export type Translations = {
  [key: string]: {
    [key: string]: string | { [key: string]: string };
  };
};

export interface User {
  id: string;
  username: string;
  password?: string; // In a real app, this would be a hash
  role: UserRole;
  displayName: string;
}