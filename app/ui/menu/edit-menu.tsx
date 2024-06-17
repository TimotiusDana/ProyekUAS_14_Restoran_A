'use client';

import { Menu } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateMenu } from '@/app/lib/actions';
import { usePathname } from 'next/navigation';

export default function EditMenuForm({ menu }: { menu: Menu }) {
  const path = usePathname();
  const parts = path.split('/');
  const uuid = parts[parts.length - 2];
  const updateMenuWithId = updateMenu.bind(null, uuid);

  return (
    <form action={updateMenuWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Menu Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Nama Menu
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={menu.name}
            placeholder="Masukkan Nama Menu"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          />
          <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>

        {/* Menu Price */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Ubah Harga
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={menu.price}
                placeholder="Masukkan harga dalam Rupiah."
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Menu Category */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">Pilih Kategori Menu</legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="makanan"
                  name="category"
                  type="radio"
                  value="makanan"
                  defaultChecked={menu.category === 'makanan'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="makanan"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Makanan <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="minuman"
                  name="category"
                  type="radio"
                  value="minuman"
                  defaultChecked={menu.category === 'minuman'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="minuman"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Minuman <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/menu"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Edit Menu</Button>
        </div>
      </div>
    </form>
  );
}
