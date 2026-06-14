export default function PageHero({ title, subtitle, children }) {
  return (
    <section className="bg-secondary/20 border-b border-border py-12 md:py-16" aria-labelledby="page-hero-title">
      <div className="container-custom">
        {children && (
          <nav className="text-xs uppercase tracking-wider text-primary font-semibold mb-4 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
            {children}
          </nav>
        )}
        <h1 id="page-hero-title" className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-foreground tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && <p className="text-muted-foreground text-sm md:text-base mt-4 max-w-2xl leading-relaxed">{subtitle}</p>}
      </div>
    </section>
  );
}
