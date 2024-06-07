import Form from '@/app/ui/dashboard/menu/edit-form';
import Breadcrumbs from '@/app/ui/dashboard/menu/breadcrumbs';
import { fetchReservationById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';

 

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [reservations, customers] = await Promise.all([
        fetchReservationById(id),
        fetchCustomers(),
      ]);

      if (!reservations) {
        notFound();
      }
    
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Menu', href: '/dashboard/menu' },
          {
            label: 'Edit Reservation',
            href: `/dashboard/menu/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form menu={menu} customers={customers} />
    </main>
  );
}
//