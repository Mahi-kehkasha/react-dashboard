import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, Button, HStack, useColorModeValue, Text } from '@chakra-ui/react';
import { FiSave, FiCopy } from 'react-icons/fi';

export const RichTextEditor = () => {
  const [value, setValue] = React.useState('');
  const [wordCount, setWordCount] = React.useState(0);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  const handleChange = (content: string) => {
    setValue(content);
    // Calculate word count
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/);
    setWordCount(words[0] === '' ? 0 : words.length);
  };

  const handleSave = () => {
    localStorage.setItem('editorContent', value);
  };

  const handleCopy = () => {
    const text = value.replace(/<[^>]*>/g, '');
    navigator.clipboard.writeText(text);
  };

  React.useEffect(() => {
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
      setValue(savedContent);
      handleChange(savedContent);
    }
  }, []);

  return (
    <Box>
      <Box
        bg={bgColor}
        borderRadius="lg"
        border="1px"
        borderColor={borderColor}
        p={4}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          style={{
            height: '300px',
            marginBottom: '50px',
          }}
        />
      </Box>
      <HStack justify="space-between" mt={4} align="center">
        <Text fontSize="sm" color="gray.500">
          Words: {wordCount}
        </Text>
        <HStack spacing={4}>
          <Button
            leftIcon={<FiCopy />}
            size="sm"
            variant="outline"
            onClick={handleCopy}
          >
            Copy Text
          </Button>
          <Button
            leftIcon={<FiSave />}
            size="sm"
            colorScheme="blue"
            onClick={handleSave}
          >
            Save
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
};
