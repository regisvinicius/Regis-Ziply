import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCreateLink } from '../../hooks/use-links';
import { useToast } from '../../hooks/use-toast';
import { ApiHttpError } from '../../lib/api';
import { type CreateLinkInput, createLinkSchema } from '../../lib/validators';
import { Button } from '../ui/button';
import { Card, CardBody } from '../ui/card';
import { Input } from '../ui/input';

const FRONTEND_URL = (import.meta.env.VITE_FRONTEND_URL ?? 'http://localhost:5173').replace(
  /\/+$/,
  '',
);
const SHORT_PREFIX = `${FRONTEND_URL.replace(/^https?:\/\//, '')}/`;

export function LinkForm() {
  const { show } = useToast();
  const createLink = useCreateLink();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLinkInput>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: { shortPath: '', originalUrl: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const link = await createLink.mutateAsync(data);
      show({
        title: 'Link criado',
        description: `${SHORT_PREFIX}${link.shortPath} agora redireciona para ${link.originalUrl}`,
        variant: 'success',
      });
      reset();
    } catch (err) {
      if (err instanceof ApiHttpError) {
        show({
          title:
            err.code === 'short-path-already-exists'
              ? 'Código curto já está em uso'
              : 'Não foi possível criar o link',
          description: err.message,
          variant: 'error',
        });
        return;
      }
      show({ title: 'Erro de conexão', description: 'Tente novamente em instantes.', variant: 'error' });
    }
  });

  const isBusy = isSubmitting || createLink.isPending;

  return (
    <Card>
      <CardBody>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input
            label="URL original"
            type="url"
            placeholder="https://example.com/a-very-long-link"
            autoComplete="url"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={isBusy}
            error={errors.originalUrl?.message}
            {...register('originalUrl')}
          />
          <Input
            label="Código curto"
            leadingAddon={SHORT_PREFIX}
            placeholder="meu-link"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={isBusy}
            error={errors.shortPath?.message}
            {...register('shortPath')}
          />
          <Button type="submit" loading={isBusy} fullWidth>
            Criar link
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
