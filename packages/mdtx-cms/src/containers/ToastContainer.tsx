import { createContainer } from 'unstated-next';
import { useState } from 'react';
import { v4 } from 'uuid';
import { Uuid } from '@typed/uuid';
import { ErrorIcon, Message, Success, Warning } from '../assets';

export enum ToastType {
  SUCCESS = 'success',
  WARNING = 'warning',
  MESSAGE = 'message',
  ERROR = 'error',
}

type ToastItem = {
  id: string;
  type: ToastType;
  content: string;
};

const selectToast = (type: ToastType) => {
  switch (type) {
    case ToastType.SUCCESS:
      return { color: '', icon: <Success /> };
    case ToastType.WARNING:
      return { color: '', icon: <Warning /> };
    case ToastType.ERROR:
      return { color: '', icon: <ErrorIcon /> };
    case ToastType.MESSAGE:
      return { color: '', icon: <Message /> };
  }
};

const Toast: React.FC<ToastItem> = ({ id, type, content }) => {
  const { removeToast } = useToasts();
  return (
    <div
      onClick={() => removeToast(id as Uuid)}
      className={`${selectToast(type).color} `}
    >
      <div className="min-w-[2.4rem] min-h-[2.4rem] flex justify-center items-center">
        {selectToast(type).icon}
      </div>
      <p>{content}</p>
    </div>
  );
};

const useToastsContainer = createContainer(() => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = (id: Uuid) => {
    setToasts((prevToasts) => prevToasts.filter((item) => item.id !== id));
  };

  const createToast = async (type: ToastType, content: string) => {
    const id = v4();
    const toast = {
      id,
      type,
      content,
    };
    let shouldPass = true;
    toasts.forEach((item) => {
      if (item.type === type && item.content === content) {
        shouldPass = false;
      }
    });
    if (shouldPass) setToasts([...toasts, toast]);
    setTimeout(() => {
      removeToast(id as Uuid);
    }, 2500);
  };

  return {
    toasts,
    removeToast,
    createToast,
  };
});

export const useToasts = useToastsContainer.useContainer;

const Toasts: React.FC = () => {
  const { toasts } = useToasts();
  return (
    <div>
      {toasts?.map(({ id, type, content }) => (
        <Toast key={id} id={id} content={content} type={type} />
      ))}
    </div>
  );
};

export const ToastsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <useToastsContainer.Provider>
    <Toasts />
    {children}
  </useToastsContainer.Provider>
);
