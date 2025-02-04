import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Radio,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, displayName: string) => void;
}

// Mock email list - in real app, this would come from Google OAuth
const mockGoogleEmails = [
  'user.work@gmail.com',
  'user.personal@gmail.com',
  'user.business@gmail.com',
];

export const GoogleSignInModal = ({
  isOpen,
  onClose,
  onSubmit,
}: GoogleSignInModalProps) => {
  const [selectedEmail, setSelectedEmail] = useState('');
  const [displayName, setDisplayName] = useState('');

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'whiteAlpha.900');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');

  const handleSubmit = () => {
    if (selectedEmail && displayName) {
      onSubmit(selectedEmail, displayName);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor}>
        <ModalHeader color={textColor}>Complete Your Sign In</ModalHeader>
        <ModalBody>
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel color={textColor}>Select Email</FormLabel>
              <RadioGroup value={selectedEmail} onChange={setSelectedEmail}>
                <VStack align="start" spacing={3}>
                  {mockGoogleEmails.map((email) => (
                    <Radio
                      key={email}
                      value={email}
                      borderColor={borderColor}
                      _checked={{
                        borderColor: 'brand.500',
                      }}
                    >
                      <Text color={textColor}>{email}</Text>
                    </Radio>
                  ))}
                </VStack>
              </RadioGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={textColor}>Display Name</FormLabel>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                color={textColor}
                borderColor={borderColor}
                _hover={{
                  borderColor: useColorModeValue('gray.300', 'whiteAlpha.400'),
                }}
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: 'outline',
                }}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleSubmit}
            isDisabled={!selectedEmail || !displayName}
            bgGradient="linear(to-r, brand.500, accent.500)"
            _hover={{
              bgGradient: 'linear(to-r, brand.600, accent.600)',
            }}
          >
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
