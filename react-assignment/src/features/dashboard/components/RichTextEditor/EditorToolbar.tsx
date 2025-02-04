import {
  HStack,
  Button,
  IconButton,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { RefObject } from 'react';
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiSave,
} from 'react-icons/fi';

interface EditorToolbarProps {
  isEditing: boolean;
  onSave: () => void;
  editorRef: RefObject<HTMLDivElement>;
}

export const EditorToolbar = ({
  isEditing,
  onSave,
  editorRef,
}: EditorToolbarProps) => {
  const buttonBg = useColorModeValue('gray.100', 'gray.700');

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  return (
    <HStack spacing={2}>
      <Tooltip label="Bold">
        <IconButton
          aria-label="Bold"
          icon={<FiBold />}
          size="sm"
          onClick={() => execCommand('bold')}
          bg={buttonBg}
          isDisabled={!isEditing}
        />
      </Tooltip>
      <Tooltip label="Italic">
        <IconButton
          aria-label="Italic"
          icon={<FiItalic />}
          size="sm"
          onClick={() => execCommand('italic')}
          bg={buttonBg}
          isDisabled={!isEditing}
        />
      </Tooltip>
      <Tooltip label="Underline">
        <IconButton
          aria-label="Underline"
          icon={<FiUnderline />}
          size="sm"
          onClick={() => execCommand('underline')}
          bg={buttonBg}
          isDisabled={!isEditing}
        />
      </Tooltip>
      <Tooltip label="Align Left">
        <IconButton
          aria-label="Align Left"
          icon={<FiAlignLeft />}
          size="sm"
          onClick={() => execCommand('justifyLeft')}
          bg={buttonBg}
          isDisabled={!isEditing}
        />
      </Tooltip>
      <Tooltip label="Align Center">
        <IconButton
          aria-label="Align Center"
          icon={<FiAlignCenter />}
          size="sm"
          onClick={() => execCommand('justifyCenter')}
          bg={buttonBg}
          isDisabled={!isEditing}
        />
      </Tooltip>
      <Tooltip label="Align Right">
        <IconButton
          aria-label="Align Right"
          icon={<FiAlignRight />}
          size="sm"
          onClick={() => execCommand('justifyRight')}
          bg={buttonBg}
          isDisabled={!isEditing}
        />
      </Tooltip>

      {isEditing && (
        <Button
          leftIcon={<FiSave />}
          colorScheme="blue"
          size="sm"
          onClick={onSave}
          ml="auto"
        >
          Save Changes
        </Button>
      )}
    </HStack>
  );
};
