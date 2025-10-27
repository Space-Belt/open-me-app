import { IModalButton, useModalStore } from "@/store/modalStore";

export const showOneButtonModal = (
  title: string,
  message: string,
  onPress: () => void
) => {
  useModalStore.getState().openModal({
    title,
    message,
    buttons: [
      {
        label: "확인",
        onPress,
        variant: "primary",
      },
    ],
  });
};

export const showTwoButtonModal = (
  title: string,
  message: string,
  buttons: IModalButton[]
) => {
  useModalStore.getState().openModal({
    title,
    message,
    buttons: buttons,
  });
};
