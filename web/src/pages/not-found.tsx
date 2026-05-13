type Props = {
  variant?: 'page-not-found' | 'link-not-found';
  shortPath?: string;
};

export function NotFoundPage({ variant = 'page-not-found', shortPath }: Props) {
  const isLink = variant === 'link-not-found';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#d9dbe1] p-4">
      <div className="w-full max-w-[540px] rounded-xl bg-[#f3f3f6] px-8 py-12 text-center">
        <h1 className="mb-4 text-6xl font-bold tracking-[0.14em] text-[#2f46b9]">404</h1>
        <h2 className="mb-3 text-3xl font-semibold text-[#23242f]">Link não encontrado</h2>
        <p className="mx-auto max-w-md text-sm text-[#6d7287]">
          O link que você está tentando acessar não existe, foi removido ou é uma URL inválida.
          {isLink && shortPath ? ` (${shortPath})` : ''} Saiba mais em <a href="/" className="text-[#2f46b9] underline">brev.ly</a>.
        </p>
      </div>
    </div>
  );
}
