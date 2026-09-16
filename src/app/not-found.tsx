import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="lede">
      <h1>Not found</h1>
      <p>
        There is no page here. <Link href="/">Back to the reviews</Link>.
      </p>
    </div>
  );
}
