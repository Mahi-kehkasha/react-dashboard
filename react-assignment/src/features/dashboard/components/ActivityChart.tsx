import { Box, useColorModeValue, HStack, Text } from '@chakra-ui/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
} from 'recharts';
import { ActivityData } from '../types';

interface ActivityChartProps {
  data: ActivityData[];
  height?: number | string;
}

export const ActivityChart = ({
  data,
  height = '300px',
}: ActivityChartProps) => {
  const chartColor = useColorModeValue('blue.500', 'blue.300');
  const secondaryChartColor = useColorModeValue('purple.500', 'purple.300');
  const chartGridColor = useColorModeValue('gray.200', 'gray.600');
  const chartTextColor = useColorModeValue('gray.600', 'gray.300');
  const tooltipBgColor = useColorModeValue('white', 'gray.800');
  const tooltipBorderColor = useColorModeValue('gray.200', 'gray.700');

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    return (
      <Box
        p={3}
        bg={tooltipBgColor}
        borderRadius="md"
        boxShadow="lg"
        border="1px solid"
        borderColor={tooltipBorderColor}
      >
        <Text fontWeight="bold" mb={2}>
          {label}
        </Text>
        {payload.map((entry, index) => (
          <HStack key={index} spacing={2}>
            <Box w={3} h={3} borderRadius="full" bg={entry.color} />
            <Text fontSize="sm">{entry.name}:</Text>
            <Text fontSize="sm" fontWeight="bold">
              {entry.value?.toLocaleString()}
            </Text>
          </HStack>
        ))}
      </Box>
    );
  };

  return (
    <Box h={height}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="green.400" stopOpacity={0.8} />
              <stop offset="95%" stopColor="green.400" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorActiveUsers" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={secondaryChartColor}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={secondaryChartColor}
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={chartGridColor}
            opacity={0.3}
          />
          <XAxis
            dataKey="name"
            stroke={chartTextColor}
            tickLine={false}
            fontSize={12}
            dy={10}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke={chartTextColor}
            tickLine={false}
            fontSize={12}
            dx={-10}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={CustomTooltip} />
          <Legend
            verticalAlign="top"
            height={36}
            content={({ payload }) => (
              <HStack spacing={4} justify="center" py={2}>
                {payload?.map((entry, index) => (
                  <HStack key={index} spacing={2}>
                    <Box w={3} h={3} borderRadius="full" bg={entry.color} />
                    <Text fontSize="sm">{entry.value}</Text>
                  </HStack>
                ))}
              </HStack>
            )}
          />
          <Area
            name="Activity"
            type="monotone"
            dataKey="activity"
            stroke={chartColor}
            fill="url(#colorActivity)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
          <Area
            name="New Users"
            type="monotone"
            dataKey="newUsers"
            stroke="green.400"
            fill="url(#colorNewUsers)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
          <Area
            name="Active Users"
            type="monotone"
            dataKey="activeUsers"
            stroke={secondaryChartColor}
            fill="url(#colorActiveUsers)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};
