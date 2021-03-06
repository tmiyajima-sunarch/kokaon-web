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
  VStack,
} from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useWarnToast } from '../../hooks';
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

  const warnToast = useWarnToast();

  const validateRoom = useValidateRoom();

  const random = useCallback((min: number, max: number) => {
    const range = max - min;
    const random = Math.random();
    return random * range + min;
  }, []);

  const sleep = useCallback(async (timeout: number) => {
    console.log('sleep:', timeout);
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
          await sleep(random(500, 1000));
          setFieldError('roomId', '???????????????????????????');
          break;
        case 'invalid-passcode':
          await sleep(random(500, 1000));
          setFieldError('passcode', '??????????????????????????????');
          break;
        case 'connection-error':
          warnToast({
            description:
              '????????????????????????????????????????????????????????????????????????????????????????????????',
          });
          break;
        case 'other-error':
          warnToast({
            description:
              '???????????????????????????????????????????????????????????????????????????????????????????????????',
          });
          break;
      }
    },
    [onSubmit, random, setFieldError, sleep, validateRoom, warnToast]
  );

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  return (
    <Modal {...modalProps} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>????????????????????????</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(_onSubmit)}>
          <ModalBody>
            <VStack spacing="8">
              <FormControl isInvalid={errors.roomId !== undefined}>
                <FormLabel htmlFor="input-room-id">????????????ID</FormLabel>
                <Input
                  id="input-room-id"
                  autoFocus={autoFocusField === 'roomId'}
                  disabled={isSubmitting}
                  {...register('roomId', {
                    required: '??????????????????',
                  })}
                />
                {errors.roomId?.message && isSubmitted ? (
                  <FormErrorMessage>{errors.roomId.message}</FormErrorMessage>
                ) : (
                  <FormHelperText>
                    ????????????????????????ID???????????????????????????
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl isInvalid={errors.passcode !== undefined}>
                <FormLabel htmlFor="input-passcode">???????????????</FormLabel>
                <Input
                  id="input-passcode"
                  type="password"
                  autoFocus={autoFocusField === 'passcode'}
                  autoComplete="off"
                  disabled={isSubmitting}
                  {...register('passcode', {
                    required: '??????????????????',
                  })}
                />
                {errors.passcode?.message && isSubmitted ? (
                  <FormErrorMessage>{errors.passcode.message}</FormErrorMessage>
                ) : (
                  <FormHelperText>
                    ??????????????????????????????????????????????????????
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl isInvalid={errors.nickname !== undefined}>
                <FormLabel htmlFor="input-nickname">??????????????????</FormLabel>
                <Input
                  id="input-nickname"
                  autoFocus={autoFocusField === 'nickname'}
                  disabled={isSubmitting}
                  {...register('nickname', {
                    required: '??????????????????',
                  })}
                />
                {errors.nickname?.message && isSubmitted ? (
                  <FormErrorMessage>{errors.nickname.message}</FormErrorMessage>
                ) : (
                  <FormHelperText>
                    ?????????????????????????????????????????????????????????
                  </FormHelperText>
                )}
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button variant="ghost" onClick={handleClose}>
                ???????????????
              </Button>
              <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
                ????????????
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
