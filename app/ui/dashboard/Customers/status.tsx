import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function CstmsPayment({ payment }: { payment: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100 text-gray-500': payment === 'qris',
          'bg-green-500 text-white': payment === 'cash',
        },
      )}
    >
      {payment === 'qris' ? (
        <>
          QRIS
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {payment === 'cash' ? (
        <>
          Cash
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}