import { useState } from 'react';
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  useToast,
  Divider,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../store/authSlice';
import { FcGoogle } from 'react-icons/fc';
import { Icon } from '@chakra-ui/react';

const MotionBox = motion(Box);

export const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      // Mock Google authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const email = 'google.user@example.com';
      const mockGoogleUser = {
        id: 'google_123',
        name: email,
        email: email,
        photoURL: 'https://bit.ly/google-avatar',
      };

      dispatch(loginSuccess(mockGoogleUser));
      localStorage.setItem('auth', JSON.stringify({ user: mockGoogleUser }));

      toast({
        title: 'Google Sign-Up Successful',
        description: `Welcome ${email}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/dashboard');
    } catch {
      toast({
        title: 'Google Sign-Up Failed',
        description: 'Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (name && email && password) {
        const user = {
          id: Date.now().toString(),
          name: email,
          email: email,
          photoURL: 'https://bit.ly/default-avatar',
        };

        dispatch(loginSuccess(user));
        localStorage.setItem('auth', JSON.stringify({ user }));

        toast({
          title: 'Sign-up successful',
          description: `Welcome ${email}!`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        navigate('/dashboard');
      }
    } catch {
      toast({
        title: 'Sign-up failed',
        description: 'Please check your information and try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue('gray.50', 'gray.900')}
      py={{ base: '12', md: '16' }}
      px={{ base: '4', md: '8' }}
    >
      <Container
        maxW="lg"
        py={{ base: '12', md: '24' }}
        px={{ base: '0', sm: '8' }}
      >
        <Center>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            w="full"
            maxW="md"
          >
            <Box
              bg={bgColor}
              py="8"
              px={{ base: '4', md: '10' }}
              shadow="2xl"
              rounded={{ sm: 'lg' }}
            >
              <VStack spacing="6">
                <Heading
                  size="xl"
                  fontWeight="extrabold"
                  bgGradient="linear(to-r, brand.500, accent.500)"
                  bgClip="text"
                >
                  Create Account
                </Heading>
                <Text fontSize="md" color={textColor}>
                  Sign up to get started
                </Text>
              </VStack>

              <Button
                w="full"
                mt="8"
                size="lg"
                leftIcon={<Icon as={FcGoogle} boxSize="5" />}
                onClick={handleGoogleSignUp}
                isLoading={isGoogleLoading}
                variant="outline"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
              >
                Sign up with Google
              </Button>

              <HStack my="6">
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color={textColor}>
                  or sign up with email
                </Text>
                <Divider />
              </HStack>

              <Stack as="form" spacing="6" onSubmit={handleSignUp}>
                <FormControl id="name" isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    size="lg"
                    borderRadius="md"
                  />
                </FormControl>

                <FormControl id="email" isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="lg"
                    borderRadius="md"
                  />
                </FormControl>

                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    size="lg"
                    borderRadius="md"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  fontSize="md"
                  isLoading={isLoading}
                  w="full"
                  mt="6"
                  bgGradient="linear(to-r, brand.500, accent.500)"
                  _hover={{
                    bgGradient: 'linear(to-r, brand.600, accent.600)',
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  Create Account
                </Button>

                <HStack justify="center" spacing="1" mt="4">
                  <Text fontSize="sm" color={textColor}>
                    Already have an account?
                  </Text>
                  <Button
                    variant="link"
                    colorScheme="brand"
                    size="sm"
                    onClick={() => navigate('/login')}
                  >
                    Sign in
                  </Button>
                </HStack>
              </Stack>
            </Box>
          </MotionBox>
        </Center>
      </Container>
    </Box>
  );
};
