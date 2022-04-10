import { Box } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { useApiClient } from '../../api';

export type AudioDropzoneProps = {
  roomId: string;
};

export default function AudioDropzone({ roomId }: AudioDropzoneProps) {
  const client = useApiClient();

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    accept: 'audio/*',
    async onDrop(acceptedFiles) {
      const file = acceptedFiles[0];
      if (file) {
        await client.addAudio(roomId, file, file.name);
      }
    },
  });

  return (
    <Box
      {...getRootProps()}
      borderWidth="1px"
      borderColor={isDragAccept ? 'blue.500' : 'gray.200'}
      borderRadius="md"
      p="4"
      textAlign="center"
      bgColor="gray.50"
      color="gray.400"
    >
      <input {...getInputProps()} />
      <p>
        効果音を追加するには、
        <br />
        このエリアにファイルをドラッグ&ドロップしてください
      </p>
    </Box>
  );
}
