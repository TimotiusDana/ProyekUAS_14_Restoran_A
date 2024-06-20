'use client';

import { CustomerField, ReservationForm } from '@/app/lib/definitions';
import Link from 'next/link';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { updateReservation } from '@/app/lib/actions';



export default function Form({ reservation, customers }: { reservation: ReservationForm, customers: CustomerField[] }) {
  const updateReservationWithId = updateReservation.bind(null, reservation.id);
  return (
    <form action={updateReservationWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">Nama Customer</label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
            >
              <option value="" disabled>Masukkan Nama Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>{customer.name}</option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>


        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">Masukkan Email</label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Masukkan email"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="mb-2 block text-sm font-medium">Masukkan Alamat</label>
          <div className="relative">
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Masukkan Alamat"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="special_request" className="mb-2 block text-sm font-medium">Masukkan Permintaan Khusus</label>
          <div className="relative">
            <input
              id="special_request"
              name="special_request"
              type="text"
              placeholder="Masukkan Permintaan Khusus"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link href="/dashboard/reservations" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Cancel
        </Link>
        <Button type="submit">Ubah Reservasi</Button>
      </div>
    </form>
  );
}
