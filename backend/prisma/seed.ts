// FIX: Changed import to handle module resolution issues with Prisma Client.
import { PrismaClient, UserRole, TransportType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

    // --- SEED STATIONS ---
    const stationsData = {
      tunisBebSaadoun: { name: 'Beb Saadoun (Nord)', city: 'Tunis', lat: 36.804, lng: 10.163 },
      tunisMoncefBey: { name: 'Moncef Bey (Sud)', city: 'Tunis', lat: 36.792, lng: 10.183 },
      arianaLouage: { name: 'Station Louage Ariana', city: 'Ariana Ville', lat: 36.862, lng: 10.195 },
      sousseLouage: { name: 'Station Louage Sousse', city: 'Sousse', lat: 35.825, lng: 10.641 },
      sfaxLouage: { name: 'Sidi Mansour', city: 'Sfax', lat: 34.739, lng: 10.759 },
      gabesLouage: { name: 'Station Louage Gabès', city: 'Gabès', lat: 33.881, lng: 10.098 },
      nabeulLouage: { name: 'Station Louage Nabeul', city: 'Nabeul', lat: 36.456, lng: 10.734 },
      bizerteLouage: { name: 'Station Louage Bizerte', city: 'Bizerte', lat: 37.270, lng: 9.863 },
      kasserineLouage: { name: 'Station Louage Kasserine', city: 'Kasserine', lat: 35.168, lng: 8.835 },
      gafsaLouage: { name: 'Station Louage Gafsa', city: 'Gafsa', lat: 34.425, lng: 8.785 },
      kebiliLouage: { name: 'Station Louage Kébili', city: 'Kébili', lat: 33.705, lng: 8.968 },
      douzLouage: { name: 'Station Louage Douz', city: 'Douz', lat: 33.456, lng: 9.023 },
    };
    
    await prisma.station.deleteMany();
    const createdStations: { [key: string]: { id: string } } = {};
    for (const [key, station] of Object.entries(stationsData)) {
      const newStation = await prisma.station.create({ data: station });
      createdStations[key] = { id: newStation.id };
    }
    console.log('Seeded stations');

    // --- SEED USERS ---
    // Delete trips first due to relation constraints
    await prisma.louageTrip.deleteMany();
    await prisma.busTrip.deleteMany();
    await prisma.transporterTrip.deleteMany();
    await prisma.trip.deleteMany(); 
    await prisma.user.deleteMany();
    
    const op1 = await prisma.user.create({ data: { username: 'ali', password: 'password123', role: UserRole.OPERATOR, displayName: 'Ali\'s Louage' } });
    const op2 = await prisma.user.create({ data: { username: 'fatma', password: 'password123', role: UserRole.OPERATOR, displayName: 'Fatma Express' } });
    const sntri = await prisma.user.create({ data: { username: 'sntri_operator', password: 'password123', role: UserRole.OPERATOR, displayName: 'SNTRI' } });
    const trans1 = await prisma.user.create({ data: { username: 'eurotrans', password: 'password123', role: UserRole.OPERATOR, displayName: 'Euro-Trans' } });
    const trans2 = await prisma.user.create({ data: { username: 'medcargo', password: 'password123', role: UserRole.OPERATOR, displayName: 'Med Cargo' } });
    await prisma.user.create({ data: { username: 'user', password: 'password123', role: UserRole.USER, displayName: 'Regular User' } });
    console.log('Seeded users');

    // --- SEED TRIPS ---
    
    // LOUAGES
    await prisma.trip.create({ data: { type: TransportType.LOUAGE, operatorId: op1.id, operatorName: op1.displayName, fromCity: 'Tunis', toCity: 'Sousse', departureTime: new Date(Date.now() + 10 * 60 * 1000), arrivalTime: new Date(Date.now() + 130 * 60 * 1000), louageTrip: { create: { stationId: createdStations.tunisMoncefBey.id, price: 15, totalSeats: 8, availableSeats: 3, isFull: false, vehicleNumber: '123 TU 4567', contactInfo: '+216 21 111 222' } } } });
    await prisma.trip.create({ data: { type: TransportType.LOUAGE, operatorId: op2.id, operatorName: op2.displayName, fromCity: 'Tunis', toCity: 'Sfax', departureTime: new Date(Date.now() + 25 * 60 * 1000), arrivalTime: new Date(Date.now() + 205 * 60 * 1000), louageTrip: { create: { stationId: createdStations.tunisMoncefBey.id, price: 22, totalSeats: 8, availableSeats: 0, isFull: true, contactInfo: '+216 22 333 444' } } } });
    await prisma.trip.create({ data: { type: TransportType.LOUAGE, operatorId: op1.id, operatorName: op1.displayName, fromCity: 'Sousse', toCity: 'Tunis', departureTime: new Date(Date.now() + 45 * 60 * 1000), arrivalTime: new Date(Date.now() + 165 * 60 * 1000), louageTrip: { create: { stationId: createdStations.sousseLouage.id, price: 15, totalSeats: 8, availableSeats: 8, isFull: false, contactInfo: '+216 21 111 222' } } } });

    // BUSES
    await prisma.trip.create({ data: { type: TransportType.BUS, operatorId: sntri.id, operatorName: sntri.displayName, fromCity: 'Tunis', toCity: 'Sfax', departureTime: new Date(new Date().setHours(8, 0, 0, 0)), arrivalTime: new Date(new Date().setHours(12, 30, 0, 0)), busTrip: { create: { departureStationId: createdStations.tunisMoncefBey.id, arrivalStationId: createdStations.sfaxLouage.id, price: 20, totalSeats: 50, availableSeats: 15 } } } });
    await prisma.trip.create({ data: { type: TransportType.BUS, operatorId: sntri.id, operatorName: sntri.displayName, fromCity: 'Gabès', toCity: 'Sousse', departureTime: new Date(new Date().setHours(10, 0, 0, 0)), arrivalTime: new Date(new Date().setHours(14, 0, 0, 0)), busTrip: { create: { departureStationId: createdStations.gabesLouage.id, arrivalStationId: createdStations.sousseLouage.id, price: 25, totalSeats: 50, availableSeats: 22 } } } });
    
    // TRANSPORTERS
    await prisma.trip.create({ data: { type: TransportType.TRANSPORTER, operatorId: trans1.id, operatorName: trans1.displayName, fromCity: 'Tunis', toCity: 'Marseille, France', departureTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), arrivalTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), transporterTrip: { create: { contactInfo: '+216 22 123 456', vehicleType: 'Semi-trailer truck', availableSpace: '10 m³', eta: '2 days', route: ['Ben Arous', 'Nabeul'] } } } });
    await prisma.trip.create({ data: { type: TransportType.TRANSPORTER, operatorId: trans2.id, operatorName: trans2.displayName, fromCity: 'Sfax', toCity: 'Genoa, Italy', departureTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), arrivalTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), transporterTrip: { create: { contactInfo: 'contact@medcargo.com', vehicleType: 'Refrigerated truck', availableSpace: '5 tons', eta: '3 days', route: ['Mahdia', 'Sousse', 'Nabeul'] } } } });

    console.log('Seeded trips');
    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        // FIX: Cast `process` to `any` to work around TypeScript type error.
        (process as any).exit(1);
    });