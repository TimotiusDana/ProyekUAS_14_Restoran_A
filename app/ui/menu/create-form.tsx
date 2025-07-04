
import { MenuField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  CakeIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createMenu } from '@/app/lib/actions';




export default function Form({ menu }: { menu: MenuField[] }) {
  return (
    
    <form action={createMenu}>
       <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Nama
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Masukkan Nama"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CakeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the menu category
          </legend>
          <div className="rounded-md border border-green-800 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="makanan"
                  name="category"
                  type="radio"
                  value="makanan"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="makanan"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-yellow-500 px-3 py-1.5 text-xs font-medium text-white-700"
                >
                  Makanan <CheckIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="minuman"
                  name="category"
                  type="radio"
                  value="minuman"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="minuman"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-700 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Minuman <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>  
          </div>
        </fieldset>
         {/* Invoice Amount */}
      <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Input the price
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="price"
                name="price"
                type="number"
                placeholder="Enter the price"
                className="peer block w-full rounded-md border border-blue-400 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
      </div>


      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/menu"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Menu</Button>
      </div>
    </form>
  );
}