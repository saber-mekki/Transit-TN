import { Station, Trip, TransportType } from '../types';
import { tunisianGovernorates } from './locations';

export const stations: { [key: string]: Station } = {
  // === Tunis & Greater Tunis ===
  // FIX: Flatten location property to match Station type
  tunisBebSaadoun: { id: 'tbs', name: 'Beb Saadoun (Nord)', city: 'Tunis', lat: 36.804, lng: 10.163 },
  // FIX: Flatten location property to match Station type
  tunisMoncefBey: { id: 'tmb', name: 'Moncef Bey (Sud)', city: 'Tunis', lat: 36.792, lng: 10.183 },
  // FIX: Flatten location property to match Station type
  arianaLouage: { id: 'arl', name: 'Station Louage Ariana', city: 'Ariana Ville', lat: 36.862, lng: 10.195 },
  // FIX: Flatten location property to match Station type
  benArousLouage: { id: 'bal', name: 'Station Louage Ben Arous', city: 'Ben Arous', lat: 36.750, lng: 10.229 },
  // FIX: Flatten location property to match Station type
  manoubaLouage: { id: 'mnl', name: 'Station Louage Manouba', city: 'Manouba', lat: 36.812, lng: 10.098 },

  // === North-East (Cap Bon) ===
  // FIX: Flatten location property to match Station type
  nabeulLouage: { id: 'nl', name: 'Station Louage Nabeul', city: 'Nabeul', lat: 36.456, lng: 10.734 },
  // FIX: Flatten location property to match Station type
  zaghouanLouage: { id: 'zgl', name: 'Station Louage Zaghouan', city: 'Zaghouan', lat: 36.405, lng: 10.144 },
  
  // === North-West ===
  // FIX: Flatten location property to match Station type
  bejaLouage: { id: 'bjl', name: 'Station Louage Béja', city: 'Béja', lat: 36.728, lng: 9.185 },
  // FIX: Flatten location property to match Station type
  bizerteLouage: { id: 'bzl', name: 'Station Louage Bizerte', city: 'Bizerte', lat: 37.270, lng: 9.863 },
  // FIX: Flatten location property to match Station type
  jendoubaLouage: { id: 'jnl', name: 'Station Louage Jendouba', city: 'Jendouba', lat: 36.502, lng: 8.781 },
  // FIX: Flatten location property to match Station type
  kefLouage: { id: 'kfl', name: 'Station Louage Le Kef', city: 'Le Kef', lat: 36.175, lng: 8.711 },
  // FIX: Flatten location property to match Station type
  silianaLouage: { id: 'sil', name: 'Station Louage Siliana', city: 'Siliana', lat: 36.084, lng: 9.372 },
  
  // === Center (Sahel) ===
  // FIX: Flatten location property to match Station type
  sousseLouage: { id: 'sl', name: 'Station Louage Sousse', city: 'Sousse', lat: 35.825, lng: 10.641 },
  // FIX: Flatten location property to match Station type
  monastirLouage: { id: 'mol', name: 'Station Louage Monastir', city: 'Monastir', lat: 35.775, lng: 10.825 },
  // FIX: Flatten location property to match Station type
  mahdiaLouage: { id: 'mhl', name: 'Station Louage Mahdia', city: 'Mahdia', lat: 35.503, lng: 11.061 },
  
  // === Center (West) ===
  // FIX: Flatten location property to match Station type
  kairouanLouage: { id: 'krl', name: 'Station Louage Kairouan', city: 'Kairouan', lat: 35.674, lng: 10.101 },
  // FIX: Flatten location property to match Station type
  kasserineLouage: { id: 'ksl', name: 'Station Louage Kasserine', city: 'Kasserine', lat: 35.168, lng: 8.835 },
  // FIX: Flatten location property to match Station type
  sidiBouzidLouage: { id: 'sbl', name: 'Station Louage Sidi Bouzid', city: 'Sidi Bouzid', lat: 35.037, lng: 9.485 },

  // === South-East ===
  // FIX: Flatten location property to match Station type
  sfaxLouage: { id: 'sfl', name: 'Sidi Mansour', city: 'Sfax', lat: 34.739, lng: 10.759 },
  // FIX: Flatten location property to match Station type
  gabesLouage: { id: 'gl', name: 'Station Louage Gabès', city: 'Gabès', lat: 33.881, lng: 10.098 },
  // FIX: Flatten location property to match Station type
  medenineLouage: { id: 'ml', name: 'Station Louage Medenine', city: 'Medenine', lat: 33.355, lng: 10.505 },
  // FIX: Flatten location property to match Station type
  tataouineLouage: { id: 'ttl', name: 'Station Louage Tataouine', city: 'Tataouine', lat: 32.929, lng: 10.451 },

  // === South-West ===
  // FIX: Flatten location property to match Station type
  gafsaLouage: { id: 'gfl', name: 'Station Louage Gafsa', city: 'Gafsa', lat: 34.425, lng: 8.785 },
  // FIX: Flatten location property to match Station type
  tozeurLouage: { id: 'tl', name: 'Station Louage Tozeur', city: 'Tozeur', lat: 33.918, lng: 8.133 },
  // FIX: Flatten location property to match Station type
  kebiliLouage: { id: 'kl', name: 'Station Louage Kébili', city: 'Kébili', lat: 33.705, lng: 8.968 },
  // FIX: Flatten location property to match Station type
  soukLahadLouage: { id: 'sll', name: 'Station Louage Souk Lahad', city: 'Souk Lahad', lat: 33.771, lng: 8.878 },
  // FIX: Flatten location property to match Station type
  douzLouage: { id: 'dl', name: 'Station Louage Douz', city: 'Douz', lat: 33.456, lng: 9.023 },
  // FIX: Flatten location property to match Station type
  faouarLouage: { id: 'fl', name: 'Station Louage El Faouar', city: 'El Faouar', lat: 33.435, lng: 8.761 },
  // FIX: Flatten location property to match Station type
  rjimMaatougLouage: { id: 'rml', name: 'Station Rjim Maatoug', city: 'Rjim Maatoug', lat: 33.568, lng: 8.188 },
};

export const mockTrips: Trip[] = [
  // Louages
  {
    id: 'L001', type: TransportType.LOUAGE, operatorId: 'op1', operatorName: 'Ali\'s Louage', fromCity: 'Tunis', toCity: 'Sousse',
    departureTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    arrivalTime: new Date(Date.now() + 130 * 60 * 1000).toISOString(),
    station: stations.tunisMoncefBey, price: 15, totalSeats: 8, availableSeats: 3, isFull: false, vehicleNumber: '123 TU 4567', contactInfo: '+216 21 111 222'
  },
  {
    id: 'L002', type: TransportType.LOUAGE, operatorId: 'op2', operatorName: 'Fatma Express', fromCity: 'Tunis', toCity: 'Sfax',
    departureTime: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
    arrivalTime: new Date(Date.now() + 205 * 60 * 1000).toISOString(),
    station: stations.tunisMoncefBey, price: 22, totalSeats: 8, availableSeats: 0, isFull: true, contactInfo: '+216 22 333 444'
  },
  {
    id: 'L003', type: TransportType.LOUAGE, operatorId: 'op1', operatorName: 'Ali\'s Louage', fromCity: 'Sousse', toCity: 'Tunis',
    departureTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    arrivalTime: new Date(Date.now() + 165 * 60 * 1000).toISOString(),
    station: stations.sousseLouage, price: 15, totalSeats: 8, availableSeats: 8, isFull: false, contactInfo: '+216 21 111 222'
  },
  {
    id: 'L004', type: TransportType.LOUAGE, operatorId: 'op3', operatorName: 'Speedy Louage', fromCity: 'Ariana Ville', toCity: 'Nabeul',
    departureTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    arrivalTime: new Date(Date.now() + 65 * 60 * 1000).toISOString(),
    station: stations.arianaLouage, price: 8, totalSeats: 8, availableSeats: 1, isFull: false, contactInfo: '+216 23 555 666'
  },
  {
    id: 'L005', type: TransportType.LOUAGE, operatorId: 'op4', operatorName: 'Sahara Voyages', fromCity: 'Gabès', toCity: 'Tunis',
    departureTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    arrivalTime: new Date(Date.now() + 300 * 60 * 1000).toISOString(),
    station: stations.gabesLouage, price: 30, totalSeats: 8, availableSeats: 5, isFull: false, contactInfo: '+216 24 777 888'
  },
  {
    id: 'L006', type: TransportType.LOUAGE, operatorId: 'op5', operatorName: 'Nefzaoua Louage', fromCity: 'Kébili', toCity: 'Douz',
    departureTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    arrivalTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    station: stations.kebiliLouage, price: 4, totalSeats: 8, availableSeats: 2, isFull: false, contactInfo: '+216 25 999 000'
  },
  {
    id: 'L007', type: TransportType.LOUAGE, operatorId: 'op6', operatorName: 'Gafsa Express', fromCity: 'Gafsa', toCity: 'Sfax',
    departureTime: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
    arrivalTime: new Date(Date.now() + 155 * 60 * 1000).toISOString(),
    station: stations.gafsaLouage, price: 18, totalSeats: 8, availableSeats: 7, isFull: false, contactInfo: '+216 26 123 456'
  },
  {
    id: 'L008', type: TransportType.LOUAGE, operatorId: 'op2', operatorName: 'Fatma Express', fromCity: 'Tunis', toCity: 'Gabès',
    departureTime: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    arrivalTime: new Date(Date.now() + 330 * 60 * 1000).toISOString(),
    station: stations.tunisMoncefBey, price: 30, totalSeats: 8, availableSeats: 8, isFull: false, contactInfo: '+216 22 333 444'
  },
  {
    id: 'L009', type: TransportType.LOUAGE, operatorId: 'op5', operatorName: 'Nefzaoua Louage', fromCity: 'Douz', toCity: 'Kébili',
    departureTime: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    arrivalTime: new Date(Date.now() + 50 * 60 * 1000).toISOString(),
    station: stations.douzLouage, price: 4, totalSeats: 8, availableSeats: 6, isFull: false, contactInfo: '+216 25 999 000'
  },
  {
    id: 'L010', type: TransportType.LOUAGE, operatorId: 'op7', operatorName: 'Bizerte Voyages', fromCity: 'Bizerte', toCity: 'Tunis',
    departureTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    arrivalTime: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    station: stations.bizerteLouage, price: 7, totalSeats: 8, availableSeats: 5, isFull: false, contactInfo: '+216 27 888 999'
  },
  {
    id: 'L011', type: TransportType.LOUAGE, operatorId: 'op8', operatorName: 'Kasserine Express', fromCity: 'Kasserine', toCity: 'Sousse',
    departureTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    arrivalTime: new Date(Date.now() + 240 * 60 * 1000).toISOString(),
    station: stations.kasserineLouage, price: 20, totalSeats: 8, availableSeats: 8, isFull: false, contactInfo: '+216 28 111 222'
  },
  
  // Buses
  {
    id: 'B001', type: TransportType.BUS, operatorId: 'sntri', operatorName: 'SNTRI', fromCity: 'Tunis', toCity: 'Sfax',
    departureTime: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
    arrivalTime: new Date(new Date().setHours(12, 30, 0, 0)).toISOString(),
    departureStation: stations.tunisMoncefBey, arrivalStation: stations.sfaxLouage, price: 20, totalSeats: 50, availableSeats: 15
  },
  {
    id: 'B002', type: TransportType.BUS, operatorId: 'private_co', operatorName: 'Capital Bus', fromCity: 'Tunis', toCity: 'Sousse',
    departureTime: new Date(new Date().setHours(9, 30, 0, 0)).toISOString(),
    arrivalTime: new Date(new Date().setHours(11, 45, 0, 0)).toISOString(),
    departureStation: stations.tunisMoncefBey, arrivalStation: stations.sousseLouage, price: 14, totalSeats: 45, availableSeats: 5
  },
  {
    id: 'B003', type: TransportType.BUS, operatorId: 'sntri', operatorName: 'SNTRI', fromCity: 'Gabès', toCity: 'Sousse',
    departureTime: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    arrivalTime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    departureStation: stations.gabesLouage, arrivalStation: stations.sousseLouage, price: 25, totalSeats: 50, availableSeats: 22
  },

  // Transporters
  {
    id: 'T001', type: TransportType.TRANSPORTER, operatorId: 'trans1', operatorName: 'Euro-Trans', fromCity: 'Tunis', toCity: 'Marseille, France',
    departureTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    arrivalTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    contactInfo: '+216 22 123 456', vehicleType: 'Semi-trailer truck', availableSpace: '10 m³', eta: '2 days',
    route: ['Ben Arous', 'Nabeul']
  },
  {
    id: 'T002', type: TransportType.TRANSPORTER, operatorId: 'trans2', operatorName: 'Med Cargo', fromCity: 'Sfax', toCity: 'Genoa, Italy',
    departureTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    arrivalTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    contactInfo: 'contact@medcargo.com', vehicleType: 'Refrigerated truck', availableSpace: '5 tons', eta: '3 days',
    route: ['Mahdia', 'Sousse', 'Nabeul']
  },
  {
    id: 'T003', type: TransportType.TRANSPORTER, operatorId: 'trans3', operatorName: 'Agri-Export', fromCity: 'Gabès', toCity: 'Naples, Italy',
    departureTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    arrivalTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    contactInfo: 'agri-export@contact.tn', vehicleType: 'Truck', availableSpace: '12 tons of dates', eta: '3 days'
  }
];

// Generate a flat list of cities from the new structured data for the main search bar
const allTunisianCities = tunisianGovernorates.flatMap(gov => gov.delegations);
export const cities = [...new Set(allTunisianCities)].sort();