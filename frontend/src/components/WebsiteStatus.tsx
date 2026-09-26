import type { Website } from '../types/website.ts';
import linkIcon from '../assets/square-arrow-out-up-right.svg'

const statusColors = {
  up: 'bg-green-500',
  degraded: 'bg-yellow-500',
  down: 'bg-red-500',
};

function WebsiteStatus(website: Website) {
  return (
    <div className='group flex items-center justify-between p-2 rounded-md'>
      <div className='flex gap-5 items-center'>
        <span
          className={`h-5 w-5 rounded-full ${
            statusColors[website.currentStatus]
          }`}
        />

        <div className='flex-col'>
          <div className='flex gap-2'>
            <header className='text-xl font-bold'>
              {website.name}
            </header>

            <a
              href={website.url}
              target='_blank'
              rel='noopener noreferrer'
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='h-6 w-6 text-(--text)'
              >
                <path d='M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6' />
                <path d='m21 3-9 9' />
                <path d='M15 3h6v6' />
              </svg>
            </a>
          </div>
          <p className='text-md'>
            Current Latency: {website.currentLatency} ms
          </p>
        </div>
      </div>

      <span
        className={`w-0 h-0
          border-t-15 border-t-transparent
          border-b-15 border-b-transparent
          border-r-20
          ${
            website.isSelected
              ? 'border-r-(--accent)'
              : 'border-r-transparent group-hover:border-r-(--accent-border)'
          }
        `}
      />
    </div>
  );
}

export default WebsiteStatus;

//   <span
//   className='w-0 h-0
//                border-t-15 border-t-transparent
//                border-b-15 border-b-transparent
//                border-r-20 border-r-(--accent)'
//   />