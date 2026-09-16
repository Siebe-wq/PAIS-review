import { redirect } from 'next/navigation';

/** The guide now lives on the Methods page. Old links keep working. */
export default function GuidePage() {
  redirect('/methods#guide');
}
