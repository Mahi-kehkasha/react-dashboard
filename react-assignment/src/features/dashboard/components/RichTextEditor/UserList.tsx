import {
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Box,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { UserData } from '../../types';
import { FiEdit2 } from 'react-icons/fi';

interface UserListProps {
  onEditUser: (user: UserData) => void;
}

export const UserList = ({ onEditUser }: UserListProps) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const loadUsers = () => {
      const allUsersStr = localStorage.getItem('allUsers');
      if (allUsersStr) {
        const allUsers: UserData[] = JSON.parse(allUsersStr);
        setUsers(allUsers);
      }
    };

    loadUsers();
    // Set up interval to refresh users
    const interval = setInterval(loadUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <VStack spacing={3} align="stretch" maxH="400px" overflowY="auto">
      {users.map((user) => (
        <HStack
          key={user.id}
          p={3}
          bg={bgColor}
          borderRadius="md"
          border="1px"
          borderColor={borderColor}
          spacing={4}
        >
          <Avatar size="sm" name={user.name} />
          <Box flex={1}>
            <Text fontWeight="medium">{user.name}</Text>
            <Text fontSize="xs" color="gray.500">
              Last updated: {new Date(user.updatedAt).toLocaleString()}
            </Text>
          </Box>
          <Badge
            colorScheme={user.isActive ? 'green' : 'gray'}
            variant="subtle"
          >
            {user.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="blue"
            leftIcon={<FiEdit2 />}
            onClick={() => onEditUser(user)}
          >
            Edit
          </Button>
        </HStack>
      ))}
      {users.length === 0 && (
        <Text color="gray.500" textAlign="center" py={4}>
          No users found
        </Text>
      )}
    </VStack>
  );
};
