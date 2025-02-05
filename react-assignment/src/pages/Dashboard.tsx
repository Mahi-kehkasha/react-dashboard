import {
  Box,
  Container,
  Heading,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
  Text,
  HStack,
  Grid,
  GridItem,
  useBreakpointValue,
  VStack,
  Badge,
  ButtonGroup,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { UserForm, UserFormData } from '../components/UserForm';
import { RichTextEditor } from '../components/RichTextEditor';
import { Counter } from '../components/Counter';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FiEdit } from 'react-icons/fi';

const MotionCard = motion(Card);

interface TooltipPayload {
  value: number;
  name: string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  bgColor: string;
  borderColor: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  bgColor,
  borderColor,
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <Box
      p={3}
      bg={bgColor}
      borderRadius="md"
      boxShadow="lg"
      border="1px solid"
      borderColor={borderColor}
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

const generateMonthlyData = () => {
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

interface ActivityData {
  name: string;
  activity: number;
  newUsers: number;
  activeUsers: number;
  timestamp: string;
}

interface UserContent {
  id: string;
  userId: string;
  userName: string;
  content: string;
  lastEdited: string;
}

export const Dashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isSmallScreen = useBreakpointValue({ base: true, lg: false });
  const [currentEditingId, setCurrentEditingId] = useState<string | null>(null);
  const [activityData, setActivityData] = useState<ActivityData[]>(
    generateMonthlyData()
  );
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    lastUpdated: new Date().toISOString(),
  });
  const [userContent, setUserContent] = useState<UserContent[]>(() => {
    const savedContent = localStorage.getItem('userContent');
    return savedContent ? JSON.parse(savedContent) : [];
  });
  const [users, setUsers] = useState<UserFormData[]>([]);

  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const chartColor = useColorModeValue('blue.500', 'blue.300');
  const secondaryChartColor = useColorModeValue('purple.500', 'purple.300');
  const chartGridColor = useColorModeValue('gray.200', 'gray.600');
  const chartTextColor = useColorModeValue('gray.600', 'gray.300');
  const tooltipBgColor = useColorModeValue('white', 'gray.800');
  const tooltipBorderColor = useColorModeValue('gray.200', 'gray.700');
  const contentBgColor = useColorModeValue('gray.50', 'gray.700');
  const contentBorderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const updateStats = () => {
      const allUsersStr = localStorage.getItem('allUsers');
      if (allUsersStr) {
        const allUsers = JSON.parse(allUsersStr) as { isActive: boolean }[];
        const activeUsers = allUsers.filter((user) => user.isActive).length;
        setStats({
          totalUsers: allUsers.length,
          activeUsers,
          lastUpdated: new Date().toISOString(),
        });
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update monthly activity data
  useEffect(() => {
    const updateMonthlyData = () => {
      setActivityData(generateMonthlyData());
    };

    updateMonthlyData();
    const interval = setInterval(updateMonthlyData, 3600000); // Update every hour
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedUsers = localStorage.getItem('allUsers');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  const handleSaveContent = (content: string) => {
    if (currentEditingId) {
      // Update existing content
      const updatedContent = userContent.map((item) =>
        item.id === currentEditingId
          ? { ...item, content, lastEdited: new Date().toISOString() }
          : item
      );
      setUserContent(updatedContent);
      localStorage.setItem('userContent', JSON.stringify(updatedContent));
      setCurrentEditingId(null);
    } else {
      // Create new content
      const newContent: UserContent = {
        id: uuidv4(),
        userId: user?.id || 'anonymous',
        userName: user?.name || 'Anonymous',
        content,
        lastEdited: new Date().toISOString(),
      };
      const updatedContent = [...userContent, newContent];
      setUserContent(updatedContent);
      localStorage.setItem('userContent', JSON.stringify(updatedContent));
    }
  };

  return (
    <Container maxW="container.xl" py={4} h="calc(100vh - 32px)">
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(4, 1fr)' }}
        gap={4}
        h="100%"
      >
        {/* Main Header with Stats */}
        <GridItem colSpan={{ base: 1, lg: 4 }}>
          <Grid
            templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
            gap={4}
          >
            {/* Total Users */}
            <Box
              p={4}
              bg={bgColor}
              borderRadius="lg"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={contentBorderColor}
              position="relative"
              overflow="hidden"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                bg: 'blue.500',
              }}
            >
              <HStack justify="space-between" align="start" mb={2}>
                <VStack align="start" spacing={1}>
                  <Text color="gray.500" fontSize="sm">
                    Total Users
                  </Text>
                  <Heading size="lg">{stats.totalUsers}</Heading>
                </VStack>
                <Badge colorScheme="blue" fontSize="sm">
                  Total
                </Badge>
              </HStack>
              <Text fontSize="sm" color="gray.500">
                Overall registered users
              </Text>
            </Box>

            {/* Active Users */}
            <Box
              p={4}
              bg={bgColor}
              borderRadius="lg"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={contentBorderColor}
              position="relative"
              overflow="hidden"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                bg: 'green.500',
              }}
            >
              <HStack justify="space-between" align="start" mb={2}>
                <VStack align="start" spacing={1}>
                  <Text color="gray.500" fontSize="sm">
                    Active Users
                  </Text>
                  <Heading size="lg">{stats.activeUsers}</Heading>
                </VStack>
                <Badge colorScheme="green" fontSize="sm">
                  Active
                </Badge>
              </HStack>
              <Text fontSize="sm" color="gray.500">
                Currently online
              </Text>
            </Box>

            {/* System Status */}
            <Box
              p={4}
              bg={bgColor}
              borderRadius="lg"
              boxShadow="sm"
              borderWidth="1px"
              borderColor={contentBorderColor}
              position="relative"
              overflow="hidden"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                bg: 'purple.500',
              }}
            >
              <HStack justify="space-between" align="start" mb={2}>
                <VStack align="start" spacing={1}>
                  <Text color="gray.500" fontSize="sm">
                    System Status
                  </Text>
                  <Heading size="lg">
                    {stats.activeUsers > 0 ? 'Active' : 'Idle'}
                  </Heading>
                </VStack>
                <Badge
                  colorScheme={stats.activeUsers > 0 ? 'green' : 'gray'}
                  fontSize="sm"
                >
                  {new Date(stats.lastUpdated).toLocaleTimeString()}
                </Badge>
              </HStack>
              <Text fontSize="sm" color="gray.500">
                Last updated: {new Date(stats.lastUpdated).toLocaleDateString()}
              </Text>
            </Box>
          </Grid>
        </GridItem>

        {/* Counter Component */}
        <GridItem
          colSpan={{ base: 1, lg: 2 }}
          maxH={{ base: 'auto', lg: '400px' }}
        >
          <MotionCard
            bg={bgColor}
            boxShadow="lg"
            borderRadius="lg"
            whileHover={{ y: -2, boxShadow: '2xl' }}
            transition={{ duration: 0.2 }}
            h="100%"
          >
            <CardHeader
              borderBottomWidth="1px"
              bg={useColorModeValue('gray.50', 'gray.700')}
              py={2}
              px={4}
            >
              <Heading size="sm">Interactive Counter</Heading>
            </CardHeader>
            <CardBody p={4}>
              <Counter />
            </CardBody>
          </MotionCard>
        </GridItem>

        {/* User Form */}
        <GridItem
          colSpan={{ base: 1, lg: 2 }}
          maxH={{ base: 'auto', lg: '400px' }}
        >
          <MotionCard
            bg={bgColor}
            boxShadow="lg"
            borderRadius="lg"
            whileHover={{ y: -2, boxShadow: '2xl' }}
            transition={{ duration: 0.2 }}
            h="100%"
          >
            <CardHeader
              borderBottomWidth="1px"
              bg={useColorModeValue('gray.50', 'gray.700')}
              py={2}
              px={4}
            >
              <Heading size="sm">User Profile Form</Heading>
            </CardHeader>
            <CardBody p={4}>
              <UserForm
                onSubmit={(userData) => {
                  const updatedUsers = [...users, userData];
                  localStorage.setItem(
                    'allUsers',
                    JSON.stringify(updatedUsers)
                  );
                  setUsers(updatedUsers);
                }}
              />
            </CardBody>
          </MotionCard>
        </GridItem>

        {/* Activity Chart */}
        <GridItem
          colSpan={{ base: 1, lg: 4 }}
          maxH={{ base: '300px', lg: '400px' }}
        >
          <MotionCard
            bg={bgColor}
            boxShadow="lg"
            borderRadius="lg"
            whileHover={{ y: -2, boxShadow: '2xl' }}
            transition={{ duration: 0.2 }}
            overflow="hidden"
          >
            <CardHeader
              borderBottomWidth="1px"
              bg={useColorModeValue('gray.50', 'gray.700')}
              py={2}
              px={4}
            >
              <Heading size="sm">User Activity Trends</Heading>
            </CardHeader>
            <CardBody p={4}>
              <Box h={isSmallScreen ? '200px' : '300px'}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={activityData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorActivity"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={chartColor}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={chartColor}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorNewUsers"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="green.400"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="green.400"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorActiveUsers"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
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
                    />
                    <YAxis
                      stroke={chartTextColor}
                      tickLine={false}
                      fontSize={12}
                      dx={-10}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => (
                        <CustomTooltip
                          active={active}
                          payload={payload as TooltipPayload[]}
                          label={label}
                          bgColor={tooltipBgColor}
                          borderColor={tooltipBorderColor}
                        />
                      )}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      content={({ payload }) => (
                        <HStack spacing={4} justify="center" py={2}>
                          {payload?.map((entry, index) => (
                            <HStack key={index} spacing={2}>
                              <Box
                                w={3}
                                h={3}
                                borderRadius="full"
                                bg={entry.color}
                              />
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
            </CardBody>
          </MotionCard>
        </GridItem>

        {/* User Content List */}
        <GridItem
          colSpan={{ base: 1, lg: 4 }}
          overflowY="auto"
          maxH={{ base: '400px', lg: '500px' }}
        >
          <MotionCard
            bg={bgColor}
            boxShadow="lg"
            borderRadius="lg"
            whileHover={{ y: -2, boxShadow: '2xl' }}
            transition={{ duration: 0.2 }}
            h="100%"
          >
            <CardHeader
              borderBottomWidth="1px"
              bg={contentBgColor}
              py={3}
              px={4}
            >
              <Grid templateColumns="1fr auto" gap={4} alignItems="center">
                <Box>
                  <Heading size="sm">User Content History</Heading>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    View and edit user content entries
                  </Text>
                </Box>
                <Badge colorScheme="blue" fontSize="sm">
                  {userContent.length} Entries
                </Badge>
              </Grid>
            </CardHeader>
            <CardBody p={4}>
              <VStack spacing={4} align="stretch">
                {userContent.map((content) => (
                  <Box
                    key={content.id}
                    p={4}
                    bg={contentBgColor}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor={contentBorderColor}
                    transition="all 0.2s"
                    _hover={{
                      boxShadow: 'md',
                      borderColor: 'blue.400',
                    }}
                  >
                    <Grid templateColumns="1fr auto" gap={4} mb={3}>
                      <Box>
                        <HStack spacing={2} mb={1}>
                          <Text fontWeight="bold">{content.userName}</Text>
                          <Badge
                            colorScheme={
                              content.userId === user?.id ? 'blue' : 'gray'
                            }
                            fontSize="xs"
                          >
                            {content.userId === user?.id ? 'You' : 'Other User'}
                          </Badge>
                        </HStack>
                        <Text fontSize="sm" color="gray.500">
                          Last edited:{' '}
                          {new Date(content.lastEdited).toLocaleString()}
                        </Text>
                      </Box>
                      <ButtonGroup size="sm" variant="ghost">
                        <Button
                          colorScheme="blue"
                          onClick={() => {
                            setCurrentEditingId(content.id);
                          }}
                          leftIcon={<FiEdit />}
                        >
                          Edit
                        </Button>
                      </ButtonGroup>
                    </Grid>
                    <Box
                      dangerouslySetInnerHTML={{ __html: content.content }}
                      className="rich-text-content"
                      bg={bgColor}
                      p={3}
                      borderRadius="md"
                    />
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </MotionCard>
        </GridItem>

        {/* Rich Text Editor */}
        <GridItem
          colSpan={{ base: 1, lg: 4 }}
          maxH={{ base: 'auto', lg: '500px' }}
        >
          <MotionCard
            bg={bgColor}
            boxShadow="lg"
            borderRadius="lg"
            whileHover={{ y: -2, boxShadow: '2xl' }}
            transition={{ duration: 0.2 }}
            h="100%"
          >
            <CardHeader
              borderBottomWidth="1px"
              bg={contentBgColor}
              py={2}
              px={4}
            >
              <Heading size="sm">
                {currentEditingId ? 'Edit Content' : 'Create New Content'}
              </Heading>
            </CardHeader>
            <CardBody p={4}>
              <RichTextEditor
                userName={user?.name}
                onSave={handleSaveContent}
                content={
                  userContent.find((item) => item.id === currentEditingId)
                    ?.content
                }
              />
            </CardBody>
          </MotionCard>
        </GridItem>
      </Grid>
    </Container>
  );
};
