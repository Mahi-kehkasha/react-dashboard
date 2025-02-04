import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  Avatar,
  Flex,
  Badge,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Button,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {
  FiUsers,
  FiUserCheck,
  FiClock,
  FiRefreshCcw,
  FiTrash2,
} from 'react-icons/fi';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  photoURL?: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    lastUpdated: new Date().toLocaleString(),
  });
  const [isLoading, setIsLoading] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('blue.500', 'blue.300');

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const allUsersStr = localStorage.getItem('allUsers');
      if (allUsersStr) {
        const allUsers = JSON.parse(allUsersStr) as UserData[];
        setUsers(allUsers);
        setStats({
          total: allUsers.length,
          active: allUsers.filter((user) => user.isActive).length,
          lastUpdated: new Date().toLocaleString(),
        });
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    const interval = setInterval(loadUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteUser = (userId: string) => {
    try {
      const allUsersStr = localStorage.getItem('allUsers');
      if (allUsersStr) {
        const allUsers = JSON.parse(allUsersStr) as UserData[];
        const updatedUsers = allUsers.filter((u) => u.id !== userId);
        localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
        loadUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const UserCard = ({ user }: { user: UserData }) => (
    <Card bg={bgColor} borderColor={borderColor} borderWidth="1px" shadow="md">
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Flex align="center" gap={4}>
            <Avatar
              size="lg"
              name={user.name}
              src={user.photoURL}
              bg={user.isActive ? 'green.500' : 'gray.500'}
            />
            <Box flex={1}>
              <Heading size="md">{user.name}</Heading>
              <Text color="gray.500">{user.email}</Text>
              <HStack spacing={4} mt={2}>
                <Badge
                  colorScheme={user.isActive ? 'green' : 'gray'}
                  px={2}
                  py={0.5}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  ID: {user.id.slice(0, 8)}...
                </Text>
              </HStack>
            </Box>
            <IconButton
              aria-label="Delete user"
              icon={<FiTrash2 />}
              size="sm"
              colorScheme="red"
              variant="ghost"
              onClick={() => handleDeleteUser(user.id)}
            />
          </Flex>
          <SimpleGrid columns={2} spacing={4}>
            <Box>
              <Text fontWeight="bold" fontSize="sm" color="gray.500">
                Contact Info
              </Text>
              <Text>Phone: {user.phone}</Text>
              <Text>Address: {user.address}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" fontSize="sm" color="gray.500">
                Timestamps
              </Text>
              <Text fontSize="sm">
                Created: {new Date(user.createdAt).toLocaleString()}
              </Text>
              <Text fontSize="sm">
                Updated: {new Date(user.updatedAt).toLocaleString()}
              </Text>
            </Box>
          </SimpleGrid>
        </VStack>
      </CardBody>
    </Card>
  );

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg">User Management</Heading>
            <Text color="gray.500" mt={2}>
              View and manage user accounts
            </Text>
          </Box>
          <Button
            leftIcon={<FiRefreshCcw />}
            onClick={loadUsers}
            isLoading={isLoading}
            variant="outline"
            size="sm"
          >
            Refresh
          </Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Stat
            bg={bgColor}
            p={6}
            borderRadius="lg"
            border="1px"
            borderColor={borderColor}
            shadow="sm"
          >
            <Box position="absolute" top={4} right={4}>
              <Icon as={FiUsers} boxSize={6} color={iconColor} />
            </Box>
            <StatLabel>Total Users</StatLabel>
            <StatNumber>{stats.total}</StatNumber>
            <StatHelpText>All registered users</StatHelpText>
          </Stat>
          <Stat
            bg={bgColor}
            p={6}
            borderRadius="lg"
            border="1px"
            borderColor={borderColor}
            shadow="sm"
          >
            <Box position="absolute" top={4} right={4}>
              <Icon as={FiUserCheck} boxSize={6} color={iconColor} />
            </Box>
            <StatLabel>Active Users</StatLabel>
            <StatNumber>{stats.active}</StatNumber>
            <StatHelpText>Currently active</StatHelpText>
          </Stat>
          <Stat
            bg={bgColor}
            p={6}
            borderRadius="lg"
            border="1px"
            borderColor={borderColor}
            shadow="sm"
          >
            <Box position="absolute" top={4} right={4}>
              <Icon as={FiClock} boxSize={6} color={iconColor} />
            </Box>
            <StatLabel>Last Updated</StatLabel>
            <StatNumber fontSize="lg">{stats.lastUpdated}</StatNumber>
            <StatHelpText>Auto-updates every 5s</StatHelpText>
          </Stat>
        </SimpleGrid>

        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList>
            <Tab>All Users ({users.length})</Tab>
            <Tab>Active Users ({users.filter((u) => u.isActive).length})</Tab>
            <Tab>
              Inactive Users ({users.filter((u) => !u.isActive).length})
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {users.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </SimpleGrid>
              {users.length === 0 && (
                <Text color="gray.500" textAlign="center" py={8}>
                  No users found
                </Text>
              )}
            </TabPanel>

            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {users
                  .filter((user) => user.isActive)
                  .map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
              </SimpleGrid>
              {users.filter((user) => user.isActive).length === 0 && (
                <Text color="gray.500" textAlign="center" py={8}>
                  No active users found
                </Text>
              )}
            </TabPanel>

            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {users
                  .filter((user) => !user.isActive)
                  .map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
              </SimpleGrid>
              {users.filter((user) => !user.isActive).length === 0 && (
                <Text color="gray.500" textAlign="center" py={8}>
                  No inactive users found
                </Text>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};
