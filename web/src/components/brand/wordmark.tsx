import { cn } from '../../lib/cn';

interface WordmarkProps {
  className?: string;
  ariaLabel?: string;
  text?: string;
}

export function Wordmark({ className, ariaLabel, text = 'av/url' }: WordmarkProps) {
  const [head, tail] = splitWordmark(text);
  return (
    <span
      className={cn(
        'inline-flex items-baseline font-medium leading-none tracking-tight',
        className,
      )}
      aria-label={ariaLabel ?? text}
      role="img"
    >
      <span style={{ letterSpacing: '-0.04em', color: 'var(--foreground)' }}>{head}</span>
      {tail ? (
        <>
          <span aria-hidden style={{ display: 'inline-block', width: '0.14em' }} />
          <span
            style={{
              fontWeight: 300,
              color: 'var(--av-gray-500)',
              letterSpacing: '-0.01em',
            }}
          >
            {tail}
          </span>
        </>
      ) : null}
    </span>
  );
}

function splitWordmark(text: string): [string, string | null] {
  const slash = text.indexOf('/');
  if (slash >= 0) return [text.slice(0, slash), text.slice(slash + 1)];
  const space = text.indexOf(' ');
  if (space >= 0) return [text.slice(0, space), text.slice(space + 1)];
  return [text, null];
}
