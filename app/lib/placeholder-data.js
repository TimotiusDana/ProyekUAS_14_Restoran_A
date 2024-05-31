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
    address: 'Jalan Babarsari, Sleman',
    image_url: '/customers/delba-de-oliveira.png',
    payment_methods: 'cash',  
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Leonardo',
    address: 'Jalan Senopati 18, Yogyakarta',
    image_url: '/customers/lee-robinson.png',
    payment_methods: 'Qris',
  },
  {
    id: '3958dc9e-737f-4377-85e9-fec4b6a6442a',
    name: 'Heri Priadi',
    address: 'Jalan Parangtritis KM 5',
    image_url: '/customers/hector-simpson.png',
    payment_methods: 'Qris',
  },
  {
    id: '50ca3e18-62cd-11ee-8c99-0242ac120002',
    name: 'Kevin Sanjaya',
    address: 'Jalan Kaliurang km 10, Yogyakarta',
    image_url: '/customers/steven-tey.png',
    payment_methods: 'Cash',
  }
];

const invoices = [
  {
    customer_id: customers[0].id,
    price: '42000',
    tax: '10',
    payment_methods: 'Cash',
    status: 'Paid',
    invoice_date: '2024-05-04',
  },
  {
    customer_id: customers[1].id,
    price: '50000',
    tax: '10',
    payment_methods: 'Qris',
    status: 'Pending',
    invoice_date: '2024-05-10',
  },
  {
    customer_id: customers[2].id,
    price: '25000',
    tax: '10',
    payment_methods: 'Cash',
    status: 'Pending',
    invoice_date: '2024-05-20',
  },
  {
    customer_id: customers[3].id,
    price: '54000',
    tax: '10',
    payment_methods: 'Qris',
    status: 'Paid',
    invoice_date: '2024-05-12',
  },
];

const reservations = [
  {
    customer_id: customers[0].id,
    address: 'Jalan Babarsari, Sleman',
    price: '92000',
    special_request: 'meja dekat lobby',
    reservation_date: '2024-03-04',
    email: 'Asep23@gmail.com',
  },
  {
    customer_id: customers[1].id,
    address: 'Jalan Babarsari, Sleman',
    price: '100000',
    special_request: 'meja 4 dekat jendela',
    reservation_date: '2024-03-04',
    email: 'Samsul21@gmail.com',
  },
  {
    customer_id: customers[2].id,
    address: 'Jalan Babarsari, Sleman',
    price: '340000',
    special_request: 'meja 3 VIP',
    reservation_date: '2024-03-04',
    email: 'Arip242@gmail.com',
  },
];

const menu = [
  {
    name: 'mie ayam biasa',
    category: 'makanan',
    price: '12000',
  },
  {
    name: 'mie ayam bakso',
    category: 'makanan',
    price: '15000',
  },
  {
    name: 'mie ayam bakso Jumbo',
    category: 'makanan',
    price: '24000',
  },
  {
    name: 'esteh',
    category: 'minuman',
    price: '5000',
  },
  {
    name: 'es jeruk',
    category: 'minuman',
    price: '7000',
  },
];

module.exports = {
  users,
  customers,
  invoices,
  menu,
  reservations
};