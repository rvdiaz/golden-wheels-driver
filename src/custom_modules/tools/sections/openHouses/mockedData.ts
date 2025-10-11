export interface OpenHouse {
  id: number;
  userId: string;
  address: string;
  mlsNumber: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publisherName: string;
}

export interface OpenHouseBooking {
  id: number;
  openHouseId: number;
  requesterId: string;
  requestedDate: string;
  requestedTime: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  responseMessage?: string;
  createdAt: string;
  updatedAt: string;
  address: string;
  requesterName: string;
  publisherName?: string;
}

export const mockOpenHouses: OpenHouse[] = [
  {
    id: 1,
    userId: 'user-123',
    address: '456 Oak Avenue, Springfield, IL 62701',
    mlsNumber: 'MLS789012',
    description:
      'Beautiful 3-bedroom colonial with updated kitchen and hardwood floors throughout.',
    isActive: true,
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-01T10:00:00Z',
    publisherName: 'Sarah Johnson',
  },
  {
    id: 2,
    userId: 'user-456',
    address: '789 Maple Drive, Chicago, IL 60601',
    mlsNumber: 'MLS345678',
    description: 'Modern downtown condo with stunning city views and luxury amenities.',
    isActive: true,
    createdAt: '2025-10-02T14:30:00Z',
    updatedAt: '2025-10-02T14:30:00Z',
    publisherName: 'Michael Chen',
  },
  {
    id: 3,
    userId: 'user-789',
    address: '321 Pine Street, Naperville, IL 60540',
    mlsNumber: 'MLS901234',
    description: 'Spacious family home in excellent school district with large backyard.',
    isActive: true,
    createdAt: '2025-10-03T09:15:00Z',
    updatedAt: '2025-10-03T09:15:00Z',
    publisherName: 'Emily Rodriguez',
  },
];

export const mockMyListings: OpenHouse[] = [
  {
    id: 4,
    userId: 'current-user',
    address: '123 Elm Street, Aurora, IL 60505',
    mlsNumber: 'MLS567890',
    description: 'Charming starter home with recent renovations and private patio.',
    isActive: true,
    createdAt: '2025-09-28T11:00:00Z',
    updatedAt: '2025-09-28T11:00:00Z',
    publisherName: 'You',
  },
];

export const mockMyBookings: OpenHouseBooking[] = [
  {
    id: 1,
    openHouseId: 1,
    requesterId: 'current-user',
    requestedDate: '2025-10-15',
    requestedTime: '14:00',
    status: 'approved',
    message: 'I would like to show this property to my clients on Sunday afternoon.',
    responseMessage: 'Approved! Looking forward to seeing you then.',
    createdAt: '2025-10-05T10:30:00Z',
    updatedAt: '2025-10-06T09:15:00Z',
    address: '456 Oak Avenue, Springfield, IL 62701',
    requesterName: 'You',
    publisherName: 'Sarah Johnson',
  },
  {
    id: 2,
    openHouseId: 2,
    requesterId: 'current-user',
    requestedDate: '2025-10-20',
    requestedTime: '10:00',
    status: 'pending',
    message: 'Interested in scheduling a showing for my buyers.',
    createdAt: '2025-10-07T08:45:00Z',
    updatedAt: '2025-10-07T08:45:00Z',
    address: '789 Maple Drive, Chicago, IL 60601',
    requesterName: 'You',
    publisherName: 'Michael Chen',
  },
  {
    id: 3,
    openHouseId: 3,
    requesterId: 'current-user',
    requestedDate: '2025-10-18',
    requestedTime: '16:30',
    status: 'rejected',
    message: 'Could we schedule an evening viewing?',
    responseMessage: 'Sorry, that time slot is already booked. Please choose another time.',
    createdAt: '2025-10-04T15:20:00Z',
    updatedAt: '2025-10-05T11:30:00Z',
    address: '321 Pine Street, Naperville, IL 60540',
    requesterName: 'You',
    publisherName: 'Emily Rodriguez',
  },
];

export const mockIncomingRequests: OpenHouseBooking[] = [
  {
    id: 4,
    openHouseId: 4,
    requesterId: 'user-111',
    requestedDate: '2025-10-22',
    requestedTime: '13:00',
    status: 'pending',
    message: 'My clients are very interested. Can we view this Saturday?',
    createdAt: '2025-10-07T12:00:00Z',
    updatedAt: '2025-10-07T12:00:00Z',
    address: '123 Elm Street, Aurora, IL 60505',
    requesterName: 'David Martinez',
  },
  {
    id: 5,
    openHouseId: 4,
    requesterId: 'user-222',
    requestedDate: '2025-10-25',
    requestedTime: '15:00',
    status: 'pending',
    message: 'First-time homebuyers looking to schedule a tour.',
    createdAt: '2025-10-06T16:45:00Z',
    updatedAt: '2025-10-06T16:45:00Z',
    address: '123 Elm Street, Aurora, IL 60505',
    requesterName: 'Jennifer Lee',
  },
  {
    id: 6,
    openHouseId: 4,
    requesterId: 'user-333',
    requestedDate: '2025-10-12',
    requestedTime: '11:00',
    status: 'approved',
    message: 'Bringing international buyers who are relocating.',
    responseMessage: 'Perfect! See you then.',
    createdAt: '2025-09-30T09:00:00Z',
    updatedAt: '2025-10-01T10:20:00Z',
    address: '123 Elm Street, Aurora, IL 60505',
    requesterName: 'Robert Kim',
  },
];
