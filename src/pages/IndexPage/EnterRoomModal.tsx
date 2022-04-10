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
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useApiClient } from '../../api';

export type EnterRoomModalProps = {} & Omit<ModalProps, 'children'>;

type FormValues = {
  roomId: string;
  passcode: string;
};

export default function EnterRoomModal({
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
  } = useForm<FormValues>();

  const navigate = useNavigate();

  const client = useApiClient();

  const onSubmit = useCallback(
    async ({ roomId, passcode }: FormValues) => {
      const ok = await client.validateRoom(roomId, passcode);
      if (ok) {
        navigate(`/room/${roomId}?p=${passcode}`);
      } else {
        setError('passcode', {
          type: 'manual',
          message: 'パスコードが違います',
        });
        setFocus('passcode');
      }
    },
    [client, navigate, setError, setFocus]
  );

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  return (
    <Modal {...modalProps} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>ルームを作る</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl isInvalid={errors.roomId !== undefined}>
              <FormLabel htmlFor="input-room-id">ルームのID</FormLabel>
              <Input
                id="input-room-id"
                autoFocus
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
