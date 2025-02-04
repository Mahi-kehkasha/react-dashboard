import {
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  Avatar,
  Text,
  Badge,
  HStack,
  Box,
  useColorModeValue,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FiSearch, FiEdit2 } from 'react-icons/fi';
import { UserData } from '../../dashboard/types';

export const AllUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const loadUsers = () => {
      const allUsersStr = localStorage.getItem('allUsers');
      if (allUsersStr) {
        const allUsers: UserData[] = JSON.parse(allUsersStr);
        setUsers(allUsers);
      }
    };

    loadUsers();
    const interval = setInterval(loadUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <VStack spacing={6} align="stretch">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <FiSearch color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {filteredUsers.map((user) => (
          <Card key={user.id} bg={bgColor}>
            <CardBody>
              <HStack spacing={4}>
                <Avatar size="md" name={user.name} />
                <Box flex={1}>
                  <Text fontWeight="bold">{user.name}</Text>
                  <HStack spacing={2}>
                    <Badge
                      colorScheme={user.isActive ? 'green' : 'gray'}
                      variant="subtle"
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Text fontSize="xs" color="gray.500">
                      Last active: {new Date(user.updatedAt).toLocaleString()}
                    </Text>
                  </HStack>
                </Box>
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  leftIcon={<FiEdit2 />}
                >
                  Edit
                </Button>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {filteredUsers.length === 0 && (
        <Text color="gray.500" textAlign="center">
          No users found
        </Text>
      )}
    </VStack>
  );
};
