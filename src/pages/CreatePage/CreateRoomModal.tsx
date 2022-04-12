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

export type CreateRoomModalValues = {
  name: string;
};

export type CreateRoomModalProps = {
  onSubmit: (values: CreateRoomModalValues) => Promise<void>;
} & Omit<ModalProps, 'children'>;

export default function CreateRoomModal({
  onSubmit,
  onClose,
  ...modalProps
}: CreateRoomModalProps) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<CreateRoomModalValues>();

  const _onSubmit = useCallback(
    async (values: CreateRoomModalValues) => {
      await onSubmit(values);
    },
    [onSubmit]
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
        <form onSubmit={handleSubmit(_onSubmit)}>
          <ModalBody>
            <FormControl isInvalid={errors.name !== undefined}>
              <FormLabel htmlFor="input-room-name">ルームの名前</FormLabel>
              <Input
                id="input-room-name"
                autoFocus
                disabled={isSubmitting}
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
