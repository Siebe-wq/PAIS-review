import { getSiteText } from '@/lib/site-text';
import { RichText } from '@/components/RichText';

export default function NotFound() {
  return (
    <div className="lede">
      <h1>Not found</h1>
      <RichText text={getSiteText()['site.notFound']} />
    </div>
  );
}
