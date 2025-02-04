import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  FormErrorMessage,
  useColorModeValue,
  HStack,
  Badge,
  Divider,
  InputGroup,
  InputLeftElement,
  Grid,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  FiSave,
  FiUserPlus,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
} from 'react-icons/fi';

export interface UserFormData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  role?: string;
  department?: string;
  profileImage?: string;
}

interface UserFormProps {
  initialData?: UserFormData;
  onEdit?: (data: UserFormData) => void;
  onSubmit: (data: UserFormData) => void;
  isEditing?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onEdit,
  onSubmit,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<
    Omit<UserFormData, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>
  >({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    role: initialData?.role || '',
    department: initialData?.department || '',
    profileImage: initialData?.profileImage || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    // Handle browser close/refresh with unsaved changes
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (
      formData.phone &&
      !/^\d{10}$/.test(formData.phone.replace(/[-()\s]/g, ''))
    ) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please check the form for errors',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSaving(true);

    try {
      const timestamp = new Date().toISOString();

      if (isEditing && initialData && onEdit) {
        const updatedUser: UserFormData = {
          ...initialData,
          ...formData,
          updatedAt: timestamp,
        };
        onEdit(updatedUser);
      } else {
        const newUser: UserFormData = {
          ...formData,
          id: uuidv4(),
          createdAt: timestamp,
          updatedAt: timestamp,
          isActive: true,
        };
        onSubmit(newUser);
      }

      if (!isEditing) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          role: '',
          department: '',
          profileImage: '',
        });
      }
      setIsDirty(false);

      toast({
        title: 'Success',
        description: isEditing
          ? 'Profile updated successfully'
          : 'Profile created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Operation failed',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={3} align="stretch">
        <HStack justify="space-between">
          <Badge colorScheme={isDirty ? 'orange' : 'green'}>
            {isDirty ? 'Unsaved Changes' : 'All Saved'}
          </Badge>
          {isEditing && <Badge colorScheme="blue">Editing Profile</Badge>}
        </HStack>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={3}>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel fontSize="sm">Name</FormLabel>
            <InputGroup size="sm">
              <InputLeftElement>
                <FiUser />
              </InputLeftElement>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                bg={bgColor}
                borderColor={borderColor}
              />
            </InputGroup>
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.email}>
            <FormLabel fontSize="sm">Email</FormLabel>
            <InputGroup size="sm">
              <InputLeftElement>
                <FiMail />
              </InputLeftElement>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                bg={bgColor}
                borderColor={borderColor}
              />
            </InputGroup>
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.phone}>
            <FormLabel fontSize="sm">Phone</FormLabel>
            <InputGroup size="sm">
              <InputLeftElement>
                <FiPhone />
              </InputLeftElement>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                bg={bgColor}
                borderColor={borderColor}
              />
            </InputGroup>
            <FormErrorMessage>{errors.phone}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Department</FormLabel>
            <InputGroup size="sm">
              <InputLeftElement>
                <FiMapPin />
              </InputLeftElement>
              <Input
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter department"
                bg={bgColor}
                borderColor={borderColor}
              />
            </InputGroup>
          </FormControl>
        </Grid>

        <FormControl isInvalid={!!errors.address}>
          <FormLabel fontSize="sm">Address</FormLabel>
          <InputGroup size="sm">
            <InputLeftElement>
              <FiMapPin />
            </InputLeftElement>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              bg={bgColor}
              borderColor={borderColor}
            />
          </InputGroup>
          <FormErrorMessage>{errors.address}</FormErrorMessage>
        </FormControl>

        <Divider />

        <HStack justify="space-between" pt={2}>
          <Button
            leftIcon={<FiUserPlus />}
            onClick={() => {
              setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                role: '',
                department: '',
                profileImage: '',
              });
              setIsDirty(false);
            }}
            size="sm"
            variant="ghost"
            isDisabled={!isDirty}
          >
            Clear
          </Button>
          <HStack spacing={2}>
            <Button
              type="submit"
              colorScheme="blue"
              leftIcon={<FiSave />}
              isLoading={isSaving}
              loadingText="Saving..."
              isDisabled={!isDirty}
              size="sm"
            >
              {isEditing ? 'Update Profile' : 'Save Profile'}
            </Button>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};
