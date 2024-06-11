import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/reservations/table';
import { CreateReservations } from '@/app/ui/reservations/buttons';
import { lusitana } from '@/app/ui/fonts';
import { ReservationsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchReservationsPages } from '@/app/lib/data';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  try {
    const totalPages = await fetchReservationsPages(query);

    return (
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl`}>Reservations</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search Reservations..." />
          <CreateReservations />
        </div>
        <Suspense key={query + currentPage} fallback={<ReservationsTableSkeleton />}>
          <Table query={query} currentPage={currentPage} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
        <div className="mt-2 flex w-full justify-center">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl`}>Reservations</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search Reservations..." />
          <CreateReservations />
        </div>
        <div className="mt-5 flex w-full justify-center">
          <p className="text-sm text-red-600">Failed to load reservations.</p>
        </div>
      </div>
    );
  }
}