import Pagination from '@/app/ui/customers/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/menu/table';
import { lusitana } from '@/app/ui/fonts';
import { CreateMenu } from '@/app/ui/menu/buttons';
import { MenuTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchMenuPages, fetchFilteredMenu } from '@/app/lib/data';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchMenuPages(query);

  try {
    const menu = await fetchFilteredMenu(query);

    return (
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl`}>Menu</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search Menu..." />
          <CreateMenu />
        </div>
        <Suspense key={query + currentPage} fallback={<MenuTableSkeleton />}>
          <Table menu={menu} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return <div>Error loading menu. Please try again later.</div>;
  }
}