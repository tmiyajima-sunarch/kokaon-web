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

export type CreateRoomModalProps = {} & Omit<ModalProps, 'children'>;

type FormValues = {
  name: string;
};

export default function CreateRoomModal({
  onClose,
  ...modalProps
}: CreateRoomModalProps) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<FormValues>();

  const navigate = useNavigate();

  const client = useApiClient();

  const onSubmit = useCallback(
    async ({ name }: FormValues) => {
      const { roomId, passcode } = await client.createRoom(name);
      navigate(`/room/${roomId}?p=${passcode}`);
    },
    [client, navigate]
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
            <FormControl isInvalid={errors.name !== undefined}>
              <FormLabel htmlFor="input-room-name">ルームの名前</FormLabel>
              <Input
                id="input-room-name"
                autoFocus
                {...register('name', {
                  required: '必須入力です',
                })}
              />
              {errors.name?.message && isSubmitted ? (
                <FormErrorMessage>{errors.name.message}</FormErrorMessage>
              ) : (
                <FormHelperText>
                  作成するルームの名前を入力してください
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
                作成する
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
