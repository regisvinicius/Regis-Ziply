import { LinkForm } from '../components/links/link-form';
import { LinksList } from '../components/links/links-list';
import { SectionHeading } from '../components/section-heading';

export function HomePage() {
  return (
    <>
      <SectionHeading
        num="01"
        title="Criar link."
        description="Cole uma URL longa, escolha um código curto e gere seu link em segundos."
      >
        <LinkForm />
      </SectionHeading>

      <SectionHeading
        num="02"
        title="Seus links."
        description="Acompanhe os links criados, copie, abra ou remova quando quiser."
      >
        <LinksList />
      </SectionHeading>
    </>
  );
}
