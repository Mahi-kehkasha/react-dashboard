import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Tooltip,
  useColorModeValue,
  VStack,
  Heading,
  Text,
  HStack,
  Badge,
  Grid,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  FiBold,
  FiItalic,
  FiList,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiUnderline,
  FiCode,
  FiRotateCcw,
  FiRotateCw,
  FiSave,
} from 'react-icons/fi';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useCallback, useState } from 'react';

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  userName?: string;
  lastEdited?: string;
  onSave?: (content: string) => void;
}

export const RichTextEditor = ({
  content = '',
  onChange,
  userName = 'Anonymous',
  lastEdited,
  onSave,
}: RichTextEditorProps) => {
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(lastEdited);
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'rich-text-editor',
      },
    },
    onUpdate: ({ editor }) => {
      setIsDirty(true);
      onChange?.(editor.getHTML());
    },
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBgColor = useColorModeValue('gray.50', 'gray.700');
  const subHeaderBgColor = useColorModeValue('gray.50', 'gray.700');

  const handleSave = () => {
    if (editor && onSave) {
      const content = editor.getHTML();
      onSave(content);
      setIsDirty(false);
      setLastSaved(new Date().toISOString());
    }
  };

  const MenuButton = useCallback(
    ({
      isActive,
      icon,
      onClick,
      title,
    }: {
      isActive?: boolean;
      icon: React.ReactElement;
      onClick: () => void;
      title: string;
    }) => (
      <Tooltip label={title}>
        <IconButton
          aria-label={title}
          icon={icon}
          onClick={onClick}
          isActive={isActive}
          variant="ghost"
          colorScheme="blue"
          size={buttonSize}
        />
      </Tooltip>
    ),
    [buttonSize]
  );

  if (!editor) {
    return null;
  }

  const isEditorActive = editor.isFocused;

  return (
    <VStack
      spacing={2}
      align="stretch"
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
    >
      {/* Professional Header */}
      <Box bg={headerBgColor} borderBottomWidth="1px">
        <Box p={4} borderBottomWidth="1px" borderColor={borderColor}>
          <Grid
            templateColumns={{ base: '1fr', md: '1fr auto' }}
            gap={4}
            alignItems="center"
          >
            <Box>
              <Heading size="sm" mb={1}>
                Content Management System
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Create and edit rich content with advanced formatting options
              </Text>
            </Box>
            <Badge
              colorScheme={isDirty ? 'orange' : 'green'}
              px={3}
              py={1}
              borderRadius="full"
              fontSize="xs"
              textTransform="none"
            >
              {isDirty ? 'Unsaved Changes' : 'All Changes Saved'}
            </Badge>
          </Grid>
        </Box>
        <Grid
          templateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }}
          gap={4}
          p={3}
          bg={subHeaderBgColor}
          fontSize="sm"
        >
          <HStack>
            <Text color="gray.500" fontWeight="medium">
              Editor:
            </Text>
            <Text>{userName}</Text>
          </HStack>
          {lastSaved && (
            <HStack>
              <Text color="gray.500" fontWeight="medium">
                Last saved:
              </Text>
              <Text>{new Date(lastSaved).toLocaleString()}</Text>
            </HStack>
          )}
          <HStack>
            <Text color="gray.500" fontWeight="medium">
              Status:
            </Text>
            <Badge
              colorScheme={isEditorActive ? 'blue' : 'gray'}
              variant="subtle"
              fontSize="xs"
            >
              {isEditorActive ? 'Active' : 'Idle'}
            </Badge>
          </HStack>
        </Grid>
      </Box>

      <Box p={4}>
        <ButtonGroup spacing={1} flexWrap="wrap" mb={4}>
          <MenuButton
            title="Bold"
            icon={<FiBold />}
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
          />
          <MenuButton
            title="Italic"
            icon={<FiItalic />}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
          />
          <MenuButton
            title="Underline"
            icon={<FiUnderline />}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
          />
          <MenuButton
            title="Code"
            icon={<FiCode />}
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
          />
          <MenuButton
            title="Bullet List"
            icon={<FiList />}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
          />
          <MenuButton
            title="Align Left"
            icon={<FiAlignLeft />}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
          />
          <MenuButton
            title="Align Center"
            icon={<FiAlignCenter />}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
          />
          <MenuButton
            title="Align Right"
            icon={<FiAlignRight />}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
          />
        </ButtonGroup>

        <Box
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="md"
          p={4}
          minH="200px"
          className="editor-content"
          _focus={{
            outline: 'none',
            borderColor: 'blue.500',
            boxShadow: 'outline',
          }}
        >
          <EditorContent editor={editor} />
        </Box>

        <ButtonGroup spacing={2} mt={4} justifyContent="flex-end" width="full">
          <Button
            leftIcon={<FiRotateCcw />}
            onClick={() => editor.chain().focus().undo().run()}
            isDisabled={!editor.can().undo()}
            size={buttonSize}
            variant="ghost"
          >
            Undo
          </Button>
          <Button
            leftIcon={<FiRotateCw />}
            onClick={() => editor.chain().focus().redo().run()}
            isDisabled={!editor.can().redo()}
            size={buttonSize}
            variant="ghost"
          >
            Redo
          </Button>
          <Button
            leftIcon={<FiSave />}
            onClick={handleSave}
            isDisabled={!isDirty || !onSave}
            colorScheme="blue"
            size={buttonSize}
          >
            Save Changes
          </Button>
        </ButtonGroup>
      </Box>

      <style>{`
        .rich-text-editor {
          > * + * {
            margin-top: 0.75em;
          }
          
          ul,
          ol {
            padding: 0 1rem;
          }

          h1 {
            font-size: 2em;
            font-weight: bold;
          }

          h2 {
            font-size: 1.5em;
            font-weight: bold;
          }

          h3 {
            font-size: 1.17em;
            font-weight: bold;
          }

          code {
            background-color: rgba(97, 97, 97, 0.1);
            color: #616161;
            padding: 0.25em;
            border-radius: 0.25em;
          }

          pre {
            background: #0d0d0d;
            color: #fff;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            
            code {
              color: inherit;
              padding: 0;
              background: none;
            }
          }

          img {
            max-width: 100%;
            height: auto;
          }

          hr {
            margin: 1rem 0;
          }

          blockquote {
            padding-left: 1rem;
            border-left: 2px solid rgba(13, 13, 13, 0.1);
          }
        }

        @media (max-width: 480px) {
          .rich-text-editor {
            font-size: 14px;
          }
        }
      `}</style>
    </VStack>
  );
};
