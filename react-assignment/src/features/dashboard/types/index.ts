import { UseToastOptions } from '@chakra-ui/react';

export interface UserData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface ActivityData {
  name: string;
  activity: number;
  newUsers: number;
  activeUsers: number;
  timestamp: string;
}

export interface HeaderProps {
  user: {
    name?: string;
    photoURL?: string;
  };
  notifications: number;
  toast: (options: UseToastOptions) => void;
}

export interface ActivityStats {
  hourly: {
    newUsers: number;
    activeUsers: number;
    totalActivity: number;
    lastUpdate: string;
  };
  daily: {
    newUsers: number;
    activeUsers: number;
    totalActivity: number;
    lastUpdate: string;
  };
  monthly: {
    newUsers: number;
    activeUsers: number;
    totalActivity: number;
    lastUpdate: string;
  };
}

export interface UserList {
  newUsers: UserData[];
  existingUsers: UserData[];
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  lastUpdated: string;
}
