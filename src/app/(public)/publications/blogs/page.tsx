import { redirect } from 'next/navigation';

/** Legacy Blog route — revised to Opinions per Publications.docx */
export default function Page() {
  redirect('/publications/opinions');
}
