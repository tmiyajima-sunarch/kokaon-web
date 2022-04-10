import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useApiClient } from '../../api';

export type AddAudioFormProps = {
  roomId: string;
};

type FormValues = {
  file: FileList;
  name: string;
};

export default function AddAudioForm({ roomId }: AddAudioFormProps) {
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<FormValues>();

  const client = useApiClient();

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files === null || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      setValue('name', file.name);
    },
    [setValue]
  );

  const onSubmit = useCallback(
    async (values: FormValues) => {
      await client.addAudio(roomId, values.file[0], values.name);
      reset();
    },
    [client, reset, roomId]
  );

  return (
    <VStack
      as="form"
      spacing="4"
      alignItems="start"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormControl isInvalid={errors.file !== undefined}>
        <FormLabel htmlFor="input-audio-file">ファイル</FormLabel>
        <Input
          id="input-audio-file"
          type="file"
          accept="audio/mp3"
          {...register('file', {
            required: '必須入力です',
            onChange: handleFileChange,
          })}
        />
        {errors.file?.message && isSubmitted ? (
          <FormErrorMessage>{errors.file.message}</FormErrorMessage>
        ) : (
          <FormHelperText>
            登録するオーディオファイルを指定してください
          </FormHelperText>
        )}
      </FormControl>
      <FormControl isInvalid={errors.name !== undefined}>
        <FormLabel htmlFor="input-audio-name">名前</FormLabel>
        <Input
          id="input-audio-name"
          type="text"
          {...register('name', {
            required: '必須入力です',
          })}
        />
        {errors.name?.message && isSubmitted ? (
          <FormErrorMessage>{errors.name.message}</FormErrorMessage>
        ) : (
          <FormHelperText>
            オーディオファイルにつける名前を指定してください
          </FormHelperText>
        )}
      </FormControl>
      <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
        オーディオを追加する
      </Button>
    </VStack>
  );
}
