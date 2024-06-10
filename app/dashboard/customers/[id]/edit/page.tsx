import Form from '@/app/ui/customers/edit-form';
import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
import { fetchCstmsById } from '@/app/lib/data';
import { Metadata } from 'next';
import { CstmForm } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Edit Customer',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const customer = await fetchCstmsById(id);

  // Ensure the customer object includes the `bind` method
  const customerWithBind: CstmForm = {
    ...customer,
    bind: (arg0: null, id: string) => {
      // Provide the actual implementation of the bind method or a mock function if necessary
      return null;
    },
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: 'Edit Customer',
            href: `/dashboard/customers`,
            active: true,
          },
        ]}
      />
      <Form cstms={customerWithBind} />
    </main>
  );
}
