import { useTranslation } from '../../hooks/useTranslation';

const partners = [
  { name: 'MESRS Algeria', id: 'mesrs' },
  { name: 'DGRSDT', id: 'dgrsdt' },
  { name: 'Univ. Béchar', id: 'utmb' },
  { name: 'CDER', id: 'cder' },
  { name: 'APRUE', id: 'aprue' },
];

export default function PartnersStrip() {
  const { t } = useTranslation();

  return (
    <section className="py-8 bg-background border-b border-border" aria-label={t('partnerLogos')}>
      <div className="container-custom">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 block flex-row-reverse-rtl">{t('partnerLogos')}</span>
        <div className="flex items-center justify-around gap-6 flex-wrap flex-row-reverse-rtl">
          {partners.map(p => (
            <div key={p.id} className="px-4 py-2 border border-border rounded-sm bg-background" title={p.name}>
              <span className="text-sm font-semibold text-muted-foreground">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
