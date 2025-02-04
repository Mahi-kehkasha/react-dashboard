import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  Box,
  useColorModeValue,
  Text,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiUserCheck,
  FiUserX,
} from 'react-icons/fi';
import { UserData } from '../../dashboard/types';

export const UserList = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

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

  const handleStatusChange = (userId: string, isActive: boolean) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, isActive } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
  };

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      overflow="hidden"
    >
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>User</Th>
            <Th>Status</Th>
            <Th>Created</Th>
            <Th>Last Active</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>
                <HStack spacing={3}>
                  <Avatar size="sm" name={user.name} />
                  <Text fontWeight="medium">{user.name}</Text>
                </HStack>
              </Td>
              <Td>
                <Badge
                  colorScheme={user.isActive ? 'green' : 'gray'}
                  variant="subtle"
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Td>
              <Td>
                <Text fontSize="sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </Text>
              </Td>
              <Td>
                <Text fontSize="sm">
                  {new Date(user.updatedAt).toLocaleString()}
                </Text>
              </Td>
              <Td>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FiMoreVertical />}
                    variant="ghost"
                    size="sm"
                  />
                  <MenuList>
                    <MenuItem icon={<FiEdit2 />}>Edit User</MenuItem>
                    {user.isActive ? (
                      <MenuItem
                        icon={<FiUserX />}
                        onClick={() => handleStatusChange(user.id, false)}
                      >
                        Set Inactive
                      </MenuItem>
                    ) : (
                      <MenuItem
                        icon={<FiUserCheck />}
                        onClick={() => handleStatusChange(user.id, true)}
                      >
                        Set Active
                      </MenuItem>
                    )}
                    <MenuItem icon={<FiTrash2 />} color="red.400">
                      Delete User
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {users.length === 0 && (
        <Box p={8}>
          <Text color="gray.500" textAlign="center">
            No users found
          </Text>
        </Box>
      )}
    </Box>
  );
};
