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

  const onSubmit = useCallback(
    async (values: FormValues) => {
      const ok = await validateRomm(values);
      if (ok) {
        navigate(`/room/${values.roomId}`);
      } else {
        setError('passcode', {
          type: 'manual',
          message: 'パスコードが違います',
        });
        setFocus('passcode');
      }
    },
    [navigate, setError, setFocus]
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

async function validateRomm({
  roomId,
  passcode,
}: FormValues): Promise<boolean> {
  const res = await fetch(
    `http://localhost:8080/api/v1/room/${roomId}/validate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ passcode }),
    }
  );

  const { ok } = await res.json();

  return ok;
}
