import {CustomersTableSkeleton, SearchSkeleton, CreateSkeleton} from '@/app/ui/skeletons';
import React from 'react'; 

export default function Loading() {
  return (
    <div>
      <SearchSkeleton />
      <CreateSkeleton />
      <CustomersTableSkeleton />
    </div>
  );
}