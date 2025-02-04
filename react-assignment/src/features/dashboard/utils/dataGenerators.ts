import { ActivityData } from '../types';

export const generateMonthlyData = (): ActivityData[] => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const currentMonth = new Date().getMonth();

  return Array.from({ length: 12 }, (_, i) => {
    const monthIndex = (currentMonth - i + 12) % 12;
    return {
      name: months[monthIndex],
      activity: Math.floor(Math.random() * 1000) + 500,
      newUsers: Math.floor(Math.random() * 200) + 50,
      activeUsers: Math.floor(Math.random() * 800) + 200,
      timestamp: new Date(
        new Date().getFullYear(),
        monthIndex,
        1
      ).toISOString(),
    };
  }).reverse();
};
