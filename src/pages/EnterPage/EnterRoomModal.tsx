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
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useValidateRoom } from './hooks';

export type EnterRoomModalValues = {
  roomId: string;
  passcode: string;
  nickname: string;
};

export type EnterRoomModalProps = {
  defaultValues: EnterRoomModalValues;
  onSubmit: (values: EnterRoomModalValues) => Promise<void>;
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

  const setFieldError = useCallback(
    (field: keyof EnterRoomModalValues, message: string) => {
      setError(field, {
        type: 'manual',
        message,
      });
      setFocus(field);
    },
    [setError, setFocus]
  );

  const autoFocusField = useMemo(
    () => determineAutoFocusField(defaultValues),
    [defaultValues]
  );

  const toast = useToast();

  const showWarnMessage = useCallback(
    (message: string) => {
      toast({
        description: message,
        status: 'warning',
        duration: 10000,
        isClosable: true,
      });
    },
    [toast]
  );

  const validateRoom = useValidateRoom();

  const random = useCallback((min: number, max: number) => {
    const range = max - min;
    const random = Math.random();
    return random * range + min;
  }, []);

  const sleep = useCallback(async (timeout: number) => {
    await new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }, []);

  const _onSubmit = useCallback(
    async (values: EnterRoomModalValues) => {
      const result = await validateRoom(values);
      switch (result) {
        case 'success':
          await onSubmit(values);
          break;
        case 'room-not-found':
          await sleep(random(3000, 5000));
          setFieldError('roomId', 'ルームがありません');
          break;
        case 'invalid-passcode':
          await sleep(random(3000, 5000));
          setFieldError('passcode', 'パスコードが違います');
          break;
        case 'connection-error':
          showWarnMessage(
            '接続エラーが発生しました。しばらく経ってから再度お試しください。'
          );
          break;
        case 'other-error':
          showWarnMessage(
            '不明なエラーが発生しました。しばらく経ってから再度お試しください。'
          );
          break;
      }
    },
    [onSubmit, random, setFieldError, showWarnMessage, sleep, validateRoom]
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
            <VStack spacing="8">
              <FormControl isInvalid={errors.roomId !== undefined}>
                <FormLabel htmlFor="input-room-id">ルームのID</FormLabel>
                <Input
                  id="input-room-id"
                  autoFocus={autoFocusField === 'roomId'}
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
              <FormControl isInvalid={errors.nickname !== undefined}>
                <FormLabel htmlFor="input-nickname">ニックネーム</FormLabel>
                <Input
                  id="input-nickname"
                  autoFocus={autoFocusField === 'nickname'}
                  disabled={isSubmitting}
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
            </VStack>
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
