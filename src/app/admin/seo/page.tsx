import { redirect } from 'next/navigation';

/** SEO is not managed in the content CMS — defaults live in code / site settings seed. */
export default function Page() {
  redirect('/admin');
}
