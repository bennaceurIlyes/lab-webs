import { Link } from 'react-router-dom';

export default function SectionTitle({ title, subtitle, centered = false, rightLink, rightLinkText }) {
  const isExternal = rightLink && (rightLink.startsWith('http') || rightLink.startsWith('#'));

  return (
    <div className={`border-l-4 border-primary pl-4 mb-8 ${centered ? 'text-center border-l-0 pl-0' : ''} rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-4`}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 flex-row-reverse-rtl">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-foreground tracking-tight">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-xs md:text-sm mt-1">{subtitle}</p>}
        </div>
        {rightLink && (
          isExternal ? (
            <a href={rightLink} className="text-xs font-semibold text-primary hover:underline self-start md:self-end">
              {rightLinkText}
            </a>
          ) : (
            <Link to={rightLink} className="text-xs font-semibold text-primary hover:underline self-start md:self-end">
              {rightLinkText}
            </Link>
          )
        )}
      </div>
    </div>
  );
}
