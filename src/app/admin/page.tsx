import type { Metadata } from 'next';
import { AdminForm } from '@/components/AdminForm';
import { DocEditor } from '@/components/DocEditor';

export const metadata: Metadata = { title: 'Publish a review', robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <>
      <AdminForm />
      <DocEditor />
    </>
  );
}
