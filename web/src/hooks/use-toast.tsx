import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { type ToastItem, ToastViewport } from '../components/ui/toast';

type ShowToastOptions = {
  title: string;
  description?: string;
  variant?: ToastItem['variant'];
  durationMs?: number;
};

type ToastContextValue = {
  show(options: ShowToastOptions): void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (options: ShowToastOptions) => {
      counterRef.current += 1;
      const id = counterRef.current;
      const toast: ToastItem = {
        id,
        title: options.title,
        description: options.description,
        variant: options.variant ?? 'info',
      };
      setToasts((prev) => [...prev, toast]);
      const duration = options.durationMs ?? 4500;
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
