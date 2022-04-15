import { Box } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { useWarnToast } from '../../hooks';
import { useAddAudios } from './hooks';

export type AudioDropzoneProps = {
  roomId: string;
};

export default function AudioDropzone({ roomId }: AudioDropzoneProps) {
  const [addAudios] = useAddAudios();
  const warnToast = useWarnToast();

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    accept: 'audio/*',
    async onDrop(acceptedFiles) {
      const result = await addAudios(roomId, acceptedFiles);
      if (!result.ok) {
        const hasOtherError = result.results.some(
          (result) => !result.ok && result.reason === 'other-error'
        );

        if (hasOtherError) {
          warnToast({
            description:
              '不明なエラーが発生しました。しばらく経ってから再度お試しください。',
          });
        } else {
          warnToast({
            description:
              '接続エラーが発生しました。しばらく経ってから再度お試しください。',
          });
        }
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
