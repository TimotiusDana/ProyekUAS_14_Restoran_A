import { DevicePhoneMobileIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function PaymentMethod({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-blue-500 text-white': status === 'qris',
          'bg-green-500 text-white': status === 'cash',
        },
      )}
    >
      {status === 'qris' ? (
        <>
          QRIS
          <DevicePhoneMobileIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === 'cash' ? (
        <>
          Cash
          <CurrencyDollarIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
