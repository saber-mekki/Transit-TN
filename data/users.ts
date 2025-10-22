import { User, UserRole } from '../types';

export let mockUsers: User[] = [
  // Regular Users
  {
    id: 'user1',
    username: 'user',
    password: 'password123',
    role: UserRole.USER,
    displayName: 'Regular User'
  },
  {
    id: 'user2',
    username: 'ahmed',
    password: 'password123',
    role: UserRole.USER,
    displayName: 'Ahmed'
  },

  // Operators (match operatorIds from seed.ts)
  {
    id: 'op1',
    username: 'ali',
    password: 'password123',
    role: UserRole.OPERATOR,
    displayName: 'Ali\'s Louage'
  },
  {
    id: 'op2',
    username: 'fatma',
    password: 'password123',
    role: UserRole.OPERATOR,
    displayName: 'Fatma Express'
  },
   {
    id: 'op3',
    username: 'speedy',
    password: 'password123',
    role: UserRole.OPERATOR,
    displayName: 'Speedy Louage'
  },
   {
    id: 'op4',
    username: 'sahara',
    password: 'password123',
    role: UserRole.OPERATOR,
    displayName: 'Sahara Voyages'
  },
  {
    id: 'sntri',
    username: 'sntri_operator',
    password: 'password123',
    role: UserRole.OPERATOR,
    displayName: 'SNTRI'
  }
];