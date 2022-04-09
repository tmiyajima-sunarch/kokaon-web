import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

export type SetNicknameModalValues = {
  nickname: string;
};

export type SetNicknameModalProps = {
  defaultValues: SetNicknameModalValues;
  onSubmit: (values: SetNicknameModalValues) => void;
} & Omit<ModalProps, 'children'>;

export default function SetNicknameModal({
  defaultValues,
  onSubmit,
  ...modalProps
}: SetNicknameModalProps) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitted },
  } = useForm<SetNicknameModalValues>({
    defaultValues,
  });

  return (
    <Modal {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>ニックネームを設定する</ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl isInvalid={errors.nickname !== undefined}>
              <FormLabel htmlFor="input-nickname">ルームの名前</FormLabel>
              <Input
                id="input-nickname"
                autoFocus
                {...register('nickname', {
                  required: '必須入力です',
                })}
              />
              {errors.nickname?.message && isSubmitted ? (
                <FormErrorMessage>{errors.nickname.message}</FormErrorMessage>
              ) : (
                <FormHelperText>
                  ルーム内でのあたなのニックネームを入力してください
                </FormHelperText>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" type="submit">
              設定する
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
