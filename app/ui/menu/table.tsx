import Image from 'next/image';
import { UpdateMenu, DeleteMenuButton } from './buttons'
import { lusitana } from '@/app/ui/fonts';
import { fetchMenu } from '@/app/lib/data';

export default async function MenuTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const menu = await fetchMenu(query, currentPage);

  return (
    
      <div className="mt-6 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {menu?.map((menu) => (
                  <div
                    key={menu.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          
                          <div className="flex items-center gap-3">
                            <p>{menu.name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {menu.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div>
                      </div>
                      <div>
                      </div>
                      <UpdateMenu id={menu.id} />
                      <DeleteMenuButton id={menu.id} />
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md text-left text-sm font-bold">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-bold sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-bold">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-5 font-bold">
                      Price
                    </th>  
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {menu?.map((menu) => (
                    <tr key={menu.id} className="group">
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{menu.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm">
                        {menu.category}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm">
                        {menu.price}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm">
                        <div className="flex justify-end gap-2 whitespace-nowrap px-6 py-4 text-sm">
                          <UpdateMenu id={menu.id} />
                          <DeleteMenuButton id={menu.id} />
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