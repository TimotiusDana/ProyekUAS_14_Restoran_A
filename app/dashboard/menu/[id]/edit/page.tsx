import Form from '@/app/ui/menu/edit-menu';
import Breadcrumbs from '@/app/ui/menu/breadcrumbs';
import { fetchMenuById } from '@/app/lib/data';
import { notFound } from 'next/navigation'; 
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Edit Menu',
};

export default async function Page({ params }: { params: {id: string }}) {
    const id = params.id;
    const [menu] = await Promise.all([
        fetchMenuById(id),
      ]);
      
      if (!menu) {
        notFound();
      }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Menu', href: '/dashboard/menu' },
          {
            label: 'Edit Menu',
            href: `/dashboard/menu/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form menu={menu} />
    </main>
  );
}