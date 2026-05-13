import { LinkForm } from '../components/links/link-form';
import { LinksList } from '../components/links/links-list';

export function HomePage() {
  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr] lg:items-start">
      <LinkForm />
      <LinksList />
    </div>
  );
}
