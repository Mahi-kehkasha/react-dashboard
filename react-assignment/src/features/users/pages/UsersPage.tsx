import {
  Box,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Flex,
  Icon,
  Divider,
  Text,
  Card,
  CardBody,
  Avatar,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiUsers, FiUserCheck, FiClock } from 'react-icons/fi';
import { UserData } from '../../dashboard/types';
import { AllUsers } from '../components/AllUsers';
import { UserList } from '../components/UserList';

interface CurrentUserProps {
  user: UserData;
}

const CurrentUser = ({ user }: CurrentUserProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Flex align="center" gap={4}>
            <Avatar size="xl" name={user.name} />
            <Box>
              <Heading size="md">{user.name}</Heading>
              <Text color="gray.500">{user.email}</Text>
            </Box>
            <Badge colorScheme={user.isActive ? 'green' : 'gray'} ml="auto">
              {user.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </Flex>
          <SimpleGrid columns={2} spacing={4}>
            <Box>
              <Text fontWeight="bold">Phone</Text>
              <Text>{user.phone}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Address</Text>
              <Text>{user.address}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Created</Text>
              <Text>{new Date(user.createdAt).toLocaleString()}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Last Updated</Text>
              <Text>{new Date(user.updatedAt).toLocaleString()}</Text>
            </Box>
          </SimpleGrid>
        </VStack>
      </CardBody>
    </Card>
  );
};

export const UsersPage = () => {
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    lastUpdated: new Date().toLocaleString(),
  });
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('blue.500', 'blue.300');

  useEffect(() => {
    const updateUserStats = () => {
      const allUsersStr = localStorage.getItem('allUsers');
      if (allUsersStr) {
        const allUsers: UserData[] = JSON.parse(allUsersStr);
        setUserStats({
          total: allUsers.length,
          active: allUsers.filter((user) => user.isActive).length,
          lastUpdated: new Date().toLocaleString(),
        });
        // Set first user as current user if none selected
        if (!currentUser && allUsers.length > 0) {
          setCurrentUser(allUsers[0]);
        }
      }
    };

    updateUserStats();
    const interval = setInterval(updateUserStats, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg">User Management</Heading>
            <Text color="gray.500" mt={1}>
              Manage and monitor user activity
            </Text>
          </Box>
        </Flex>

        <Divider />

        {/* User Statistics */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Stat
            bg={bgColor}
            p={6}
            borderRadius="lg"
            border="1px"
            borderColor={borderColor}
            position="relative"
          >
            <Box position="absolute" top={4} right={4}>
              <Icon as={FiUsers} boxSize={6} color={iconColor} />
            </Box>
            <StatLabel>Total Users</StatLabel>
            <StatNumber>{userStats.total}</StatNumber>
            <StatHelpText>All registered users</StatHelpText>
          </Stat>
          <Stat
            bg={bgColor}
            p={6}
            borderRadius="lg"
            border="1px"
            borderColor={borderColor}
            position="relative"
          >
            <Box position="absolute" top={4} right={4}>
              <Icon as={FiUserCheck} boxSize={6} color={iconColor} />
            </Box>
            <StatLabel>Active Users</StatLabel>
            <StatNumber>{userStats.active}</StatNumber>
            <StatHelpText>Currently active</StatHelpText>
          </Stat>
          <Stat
            bg={bgColor}
            p={6}
            borderRadius="lg"
            border="1px"
            borderColor={borderColor}
            position="relative"
          >
            <Box position="absolute" top={4} right={4}>
              <Icon as={FiClock} boxSize={6} color={iconColor} />
            </Box>
            <StatLabel>Last Updated</StatLabel>
            <StatNumber fontSize="lg">{userStats.lastUpdated}</StatNumber>
            <StatHelpText>Auto-updates every 5s</StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* User Management Tabs */}
        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList>
            <Tab>Current User</Tab>
            <Tab>All Users</Tab>
            <Tab>User List</Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={4}>
              {currentUser ? (
                <CurrentUser user={currentUser} />
              ) : (
                <Text color="gray.500" textAlign="center">
                  No user selected
                </Text>
              )}
            </TabPanel>
            <TabPanel p={4}>
              <AllUsers />
            </TabPanel>
            <TabPanel p={4}>
              <UserList />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};
