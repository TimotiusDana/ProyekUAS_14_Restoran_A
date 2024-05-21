const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
  },
];

const customers = [
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Dendi Anoma',
    address: 'Jalan Babarsari, Sleman ',
    image_url: '/customers/delba-de-oliveira.png',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Leonardo',
    address: 'Jalan Senopati 18, Yogyakarta',
    image_url: '/customers/lee-robinson.png',
  },
  {
    id: '3958dc9e-737f-4377-85e9-fec4b6a6442a',
    name: 'Heri Priadi',
    address: 'Jalan Parangtritis KM 5 ',
    image_url: '/customers/hector-simpson.png',
  },
  {
    id: '50ca3e18-62cd-11ee-8c99-0242ac120002',
    name: 'Kevin Sanjaya',
    address: 'Jalan Kaliurang km 10, Yogyakarta',
    image_url: '/customers/steven-tey.png',
  }
  
 
];

const invoices = [
  {
    customer_id: customers[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
    address: 'Sleman',
  },
  {
    customer_id: customers[1].id,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
    address: 'Gamping',
  },
  {
    customer_id: customers[2].id,
    amount: 3040,
    status: 'paid',
    date: '2022-10-29',
    address: 'Berbah',
  },

  {
    customer_id: customers[3].id,
    amount: 3040,
    status: 'paid',
    date: '2022-10-29',
    address: 'Berbah',
  },
];

const revenue = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
];const reservations = [
  {
    customer_id: customers[0].id,
    email: 'Jalan Parangtritis KM 5',
    amount: 25,
    status: 'pending',
    reservation_date: '2024-04-04',
  },

  {
    customer_id: customers[1].id,
    email: 'Jalan Senopati 18, Yogyakarta',
    amount: 25,
    status: 'pending',
    reservation_date: '2024-05-04',
  },

  {
    customer_id: customers[2].id,
    email: 'Jalan Babarsari, Sleman ',
    amount: 25,
    status: 'pending',
    reservation_date: '2024-03-04',
  },
];



module.exports = {
  users,
  customers,
  invoices,
  revenue,
  reservations
};