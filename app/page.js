// Trang gốc — redirect về /documents

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/documents');
}
