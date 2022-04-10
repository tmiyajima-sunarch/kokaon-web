import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useApiClient } from '../../api';

export type EnterRoomModalValues = {
  roomId: string;
  passcode: string;
  nickname: string;
};

export type EnterRoomModalProps = {
  defaultValues: EnterRoomModalValues;
  onSubmit: (values: EnterRoomModalValues) => void;
} & Omit<ModalProps, 'children'>;

export default function EnterRoomModal({
  defaultValues,
  onSubmit,
  onClose,
  ...modalProps
}: EnterRoomModalProps) {
  const {
    handleSubmit,
    register,
    reset,
    setError,
    setFocus,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<EnterRoomModalValues>({
    defaultValues,
  });

  const autoFocusField = useMemo(
    () => determineAutoFocusField(defaultValues),
    [defaultValues]
  );

  const client = useApiClient();

  const _onSubmit = useCallback(
    async (values: EnterRoomModalValues) => {
      const ok = await client.validateRoom(values.roomId, values.passcode);
      if (ok) {
        onSubmit(values);
      } else {
        setError('passcode', {
          type: 'manual',
          message: 'パスコードが違います',
        });
        setFocus('passcode');
      }
    },
    [client, onSubmit, setError, setFocus]
  );

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  return (
    <Modal {...modalProps} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>ルームに参加する</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(_onSubmit)}>
          <ModalBody>
            <FormControl isInvalid={errors.roomId !== undefined}>
              <FormLabel htmlFor="input-room-id">ルームのID</FormLabel>
              <Input
                id="input-room-id"
                autoFocus={autoFocusField === 'roomId'}
                {...register('roomId', {
                  required: '必須入力です',
                })}
              />
              {errors.roomId?.message && isSubmitted ? (
                <FormErrorMessage>{errors.roomId.message}</FormErrorMessage>
              ) : (
                <FormHelperText>
                  参加するルームのIDを入力してください
                </FormHelperText>
              )}
            </FormControl>
            <FormControl isInvalid={errors.passcode !== undefined}>
              <FormLabel htmlFor="input-passcode">パスコード</FormLabel>
              <Input
                id="input-passcode"
                type="password"
                autoFocus={autoFocusField === 'passcode'}
                autoComplete="off"
                {...register('passcode', {
                  required: '必須入力です',
                })}
              />
              {errors.passcode?.message && isSubmitted ? (
                <FormErrorMessage>{errors.passcode.message}</FormErrorMessage>
              ) : (
                <FormHelperText>
                  ルームのパスコードを入力してください
                </FormHelperText>
              )}
            </FormControl>
            <FormControl isInvalid={errors.roomId !== undefined}>
              <FormLabel htmlFor="input-nickname">ニックネーム</FormLabel>
              <Input
                id="input-nickname"
                autoFocus={autoFocusField === 'nickname'}
                {...register('nickname', {
                  required: '必須入力です',
                })}
              />
              {errors.nickname?.message && isSubmitted ? (
                <FormErrorMessage>{errors.nickname.message}</FormErrorMessage>
              ) : (
                <FormHelperText>
                  あなたのニックネームを指定してください
                </FormHelperText>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button variant="ghost" onClick={handleClose}>
                キャンセル
              </Button>
              <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
                参加する
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

function determineAutoFocusField(
  defaultValues: EnterRoomModalValues
): keyof EnterRoomModalValues {
  if (!defaultValues.roomId) {
    return 'roomId';
  }
  if (!defaultValues.passcode) {
    return 'passcode';
  }
  return 'nickname';
}
