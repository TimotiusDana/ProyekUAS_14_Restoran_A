import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/reservations/table';
import { CreateReservations } from '@/app/ui/reservations/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { CreateSkeleton, ReservationsTableSkeleton, SearchSkeleton } from '@/app/ui/skeletons';
import { fetchReservationsPages } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reservations',
};

export default async function Page({ searchParams }) {
  const searchQuery = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const [totalPages, setTotalPages] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTotalPages = await fetchReservationsPages(searchQuery);
        setTotalPages(fetchedTotalPages);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [searchQuery]);

  if (error) {
    return <div>Error fetching reservations: {error.message}</div>;
  }

  if (!totalPages) {
    return <Suspense fallback={<CreateSkeleton />} />;
  }

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Reservations</h1>
      </div>
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl flex-col justify center`}>
          221711940 <br /> Timotius Dana Sutanto
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Suspense fallback={<SearchSkeleton />}>
          <Search placeholder="Search Reservations..." query={searchQuery} />
        </Suspense>

        <Suspense fallback={<CreateSkeleton />}>
          <CreateReservations />
        </Suspense>
      </div>
      <Suspense key={searchQuery + currentPage} fallback={<ReservationsTableSkeleton />}>
        <Table query={searchQuery} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
