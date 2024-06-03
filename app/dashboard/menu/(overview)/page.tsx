import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/menu/table';
import { CreateMenu } from '@/app/ui/menu/buttons';
import { lusitana } from '@/app/ui/fonts';
import { MenuTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchMenuPages } from '@/app/lib/data';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchMenuPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Menu</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateMenu />
      </div>
      <Suspense key={query + currentPage} fallback={<MenuTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}