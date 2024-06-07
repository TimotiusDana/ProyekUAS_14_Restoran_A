import Form from '@/app/ui/menu/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchMenu } from '@/app/lib/data';

export default async function Page() {
  const menu = await fetchMenu(); 

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Menu', href: '/dashboard/menu' },
          {
            label: 'Create Menu',
            href: '/dashboard/menu/create',
            active: true,
          },
        ]}
      />
      <Form menu={menu} /> 
    </main>
  );
}
