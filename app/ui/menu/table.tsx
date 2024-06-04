import Image from 'next/image';
import { UpdateMenu, DeleteMenu} from '@/app/ui/menu/buttons';
import { fetchFilteredMenu } from '@/app/lib/data';

export default function Table({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  // Ensure menus is initialized as an empty array if fetchFilteredMenu returns undefined or null
  const fetchedMenus = fetchFilteredMenu(query, currentPage);
  const menus = Array.isArray(fetchedMenus) ? fetchedMenus : []; 

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {menus.map((menu) => (
              <div
                key={menu.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={menu.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${menu.name}'s profile picture`}
                      />
                      <p>{menu.name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {menu.category}
                    </p>
                    <p>{menu.price}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateMenu id={menu.id} />
                    <DeleteMenu id={menu.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Category
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Price
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {menus.map((menu) => (
                <tr
                  key={menu.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={menu.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${menu.name}'s profile picture`}
                      />
                      <p>{menu.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {menu.category}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {menu.price}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateMenu id={menu.id} />
                      <DeleteMenu id={menu.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
