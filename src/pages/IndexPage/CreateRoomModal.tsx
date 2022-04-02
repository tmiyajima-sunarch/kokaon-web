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

  const onSubmit = useCallback(
    async (values: FormValues) => {
      const roomId = await createRoom(values);
      navigate(`/room/${roomId}`);
    },
    [navigate]
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
              <FormLabel htmlFor="input-room-for">ルームの名前</FormLabel>
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

async function createRoom({ name }: FormValues): Promise<string> {
  const res = await fetch('http://localhost:8080/api/v1/room', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  const { roomId } = await res.json();

  return roomId;
}
