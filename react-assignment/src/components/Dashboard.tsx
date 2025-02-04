import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  useColorModeValue,
  Grid,
  GridItem,
  Text,
  VStack,
  Button,
  HStack,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  Flex,
  Spacer,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { UserForm, UserFormData } from './UserForm';
import { Counter } from './Counter';
import { RichTextEditor } from './RichTextEditor';
import {
  FiRefreshCw,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiActivity,
  FiFileText,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DashboardHeaderProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    lastUpdated: string;
  };
  onRefresh: () => void;
}

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

interface UserListProps {
  users: UserFormData[];
  onEdit: (user: UserFormData) => void;
  onDelete: (userId: string) => void;
}

interface ActivityData {
  date: string;
  activeUsers: number;
  totalUsers: number;
}

const DashboardHeader = ({ stats, onRefresh }: DashboardHeaderProps) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      py={3}
      px={6}
      shadow="sm"
      mb={4}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Heading size="md">Dashboard</Heading>
          <Text color="gray.500" fontSize="sm">
            Manage your users and monitor activity
          </Text>
        </Box>
        <HStack spacing={6}>
          <HStack spacing={4}>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500">
                Total Users
              </Text>
              <Text fontWeight="bold">{stats.totalUsers}</Text>
            </VStack>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500">
                Active Users
              </Text>
              <Text fontWeight="bold">{stats.activeUsers}</Text>
            </VStack>
          </HStack>
          <Button
            leftIcon={<FiRefreshCw />}
            size="sm"
            onClick={onRefresh}
            colorScheme="blue"
            variant="ghost"
          >
            Refresh
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

const StatsCard = ({ title, value, icon, color }: StatsCardProps) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      borderRadius="lg"
      shadow="sm"
      borderLeft="4px"
      borderLeftColor={color}
    >
      <HStack spacing={3}>
        <Box color={color} fontSize="xl">
          {icon}
        </Box>
        <VStack align="start" spacing={0}>
          <Text color="gray.500" fontSize="sm">
            {title}
          </Text>
          <Text fontWeight="bold" fontSize="lg">
            {value}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

const UserList = ({ users, onEdit, onDelete }: UserListProps) => {
  const bgHover = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      borderRadius="lg"
      shadow="sm"
      overflow="hidden"
    >
      <Flex p={3} borderBottomWidth="1px" align="center">
        <Heading size="sm">User List</Heading>
        <Spacer />
        <Badge colorScheme="blue">{users.length} Users</Badge>
      </Flex>
      <Box overflowX="auto" maxH="400px">
        <Table variant="simple" size="sm">
          <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Status</Th>
              <Th width="100px">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id} _hover={{ bg: bgHover }}>
                <Td fontWeight="medium">{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <Badge colorScheme={user.isActive ? 'green' : 'gray'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={1}>
                    <IconButton
                      aria-label="Edit user"
                      icon={<FiEdit2 />}
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      onClick={() => onEdit(user)}
                    />
                    <IconButton
                      aria-label="Delete user"
                      icon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => onDelete(user.id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

const UserActivityChart = ({ data }: { data: ActivityData[] }) => {
  return (
    <Box h="300px" w="full">
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="activeUsers"
            stroke="#48BB78"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="totalUsers" stroke="#4299E1" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

const Dashboard: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<UserFormData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState<UserFormData[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    lastUpdated: new Date().toISOString(),
  });
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [selectedContent, setSelectedContent] = useState<string>('');

  const toast = useToast();
  const contentBgColor = useColorModeValue('gray.50', 'gray.900');

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    setUsers(storedUsers);
    setStats({
      totalUsers: storedUsers.length,
      activeUsers: storedUsers.filter((u: UserFormData) => u.isActive).length,
      lastUpdated: new Date().toISOString(),
    });
  };

  useEffect(() => {
    loadUsers();
    const interval = setInterval(loadUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Generate mock activity data
    const generateActivityData = () => {
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toLocaleDateString();
      }).reverse();

      return dates.map((date) => ({
        date,
        activeUsers: Math.floor(Math.random() * 50) + 20,
        totalUsers: Math.floor(Math.random() * 100) + 50,
      }));
    };

    setActivityData(generateActivityData());
  }, []);

  const handleEditUser = (user: UserFormData) => {
    const updatedUsers = users.map((u) => (u.id === user.id ? user : u));
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setSelectedUser(null);
    setIsEditing(false);
    toast({
      title: 'Success',
      description: 'User updated successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter((u) => u.id !== userId);
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    toast({
      title: 'Success',
      description: 'User deleted successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUserSubmit = (userData: UserFormData) => {
    const updatedUsers = [...users, userData];
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    toast({
      title: 'Success',
      description: 'User added successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box minH="100vh" bg={contentBgColor} overflow="hidden">
      <DashboardHeader stats={stats} onRefresh={loadUsers} />

      <Box px={{ base: 2, md: 4 }} maxW="100vw">
        <VStack spacing={3} align="stretch">
          {/* Stats Cards */}
          <Grid
            templateColumns={{
              base: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            }}
            gap={3}
          >
            <StatsCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<FiUsers />}
              color="blue.500"
            />
            <StatsCard
              title="Active Users"
              value={stats.activeUsers}
              icon={<FiActivity />}
              color="green.500"
            />
            <StatsCard
              title="Last Updated"
              value={new Date(stats.lastUpdated).toLocaleTimeString()}
              icon={<FiRefreshCw />}
              color="purple.500"
            />
          </Grid>

          {/* Main Content */}
          <Grid
            templateColumns={{
              base: '1fr',
              lg: 'minmax(300px, 350px) 1fr',
            }}
            gap={3}
          >
            {/* Left Column */}
            <GridItem w="100%">
              <Box
                bg={useColorModeValue('white', 'gray.800')}
                p={3}
                borderRadius="lg"
                shadow="sm"
                h="fit-content"
              >
                <Tabs variant="soft-rounded" colorScheme="blue" size="sm">
                  <TabList mb={3}>
                    <Tab>
                      <HStack spacing={1}>
                        <FiUsers />
                        <Text>Profile</Text>
                      </HStack>
                    </Tab>
                    <Tab>
                      <HStack spacing={1}>
                        <FiActivity />
                        <Text>Counter</Text>
                      </HStack>
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel p={0}>
                      <UserForm
                        initialData={selectedUser || undefined}
                        onEdit={handleEditUser}
                        onSubmit={handleUserSubmit}
                        isEditing={isEditing}
                      />
                    </TabPanel>
                    <TabPanel p={0}>
                      <Counter />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </GridItem>

            {/* Right Column */}
            <GridItem w="100%">
              <VStack spacing={3} h="100%">
                <Box
                  bg={useColorModeValue('white', 'gray.800')}
                  p={3}
                  borderRadius="lg"
                  shadow="sm"
                  w="100%"
                >
                  <VStack spacing={3}>
                    <Heading size="sm">User Activity Trends</Heading>
                    <Box h={{ base: '200px', md: '250px' }} w="100%">
                      <ResponsiveContainer width="100%" height="100%">
                        <UserActivityChart data={activityData} />
                      </ResponsiveContainer>
                    </Box>
                  </VStack>
                </Box>

                <Box
                  bg={useColorModeValue('white', 'gray.800')}
                  borderRadius="lg"
                  shadow="sm"
                  w="100%"
                  overflow="hidden"
                  flex="1"
                >
                  <Tabs
                    variant="soft-rounded"
                    colorScheme="blue"
                    size="sm"
                    p={3}
                  >
                    <TabList mb={3}>
                      <Tab>
                        <HStack spacing={1}>
                          <FiUsers />
                          <Text>Users</Text>
                        </HStack>
                      </Tab>
                      <Tab>
                        <HStack spacing={1}>
                          <FiFileText />
                          <Text>Rich Text</Text>
                        </HStack>
                      </Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel p={0}>
                        <Box
                          maxH={{ base: '400px', lg: '600px' }}
                          overflowY="auto"
                        >
                          <UserList
                            users={users}
                            onEdit={(user: UserFormData) => {
                              setSelectedUser(user);
                              setIsEditing(true);
                              setSelectedContent(JSON.stringify(user, null, 2));
                            }}
                            onDelete={handleDeleteUser}
                          />
                        </Box>
                      </TabPanel>
                      <TabPanel p={0}>
                        <Box
                          maxH={{ base: '400px', lg: '600px' }}
                          overflowY="auto"
                        >
                          <RichTextEditor
                            content={selectedContent}
                            onSave={(content) => setSelectedContent(content)}
                            userName={selectedUser?.name || 'Anonymous'}
                            lastEdited={selectedUser?.updatedAt}
                          />
                        </Box>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Box>
    </Box>
  );
};

export default Dashboard;
