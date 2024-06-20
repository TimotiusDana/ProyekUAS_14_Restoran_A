const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',  // Ensure the ID is unique and in UUID format
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'adminpassword',  // Make sure to hash the password in real scenarios
    role: 'ADMIN',
  },
  {
    id: '410544b2-3002-4271-9855-fec4b6a6442a',  // Ensure the ID is unique and in UUID format
    name: 'Regular User',
    email: 'user@example.com',
    password: 'userpassword',  // Make sure to hash the password in real scenarios
    role: 'USER',
  }
];

const customers = [
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Dendi Anoma',
    address: 'Jalan Babarsari, Sleman',
    image_url: '/customers/delba-de-oliveira.png',  
    email: 'Asep21@gmail.com',
    phone_number: '08123456'
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Leonardo',
    address: 'Jalan Panembahan Senopati 15, Yogyakarta',
    image_url: '/customers/lee-robinson.png',
    email: 'Leonard32@gmail.com',
    phone_number: '08654321'
  },
  {
    id: '3958dc9e-737f-4377-85e9-fec4b6a6442a',
    name: 'Heri Priadi',
    address: 'Jalan Parangtritis KM 5',
    image_url: '/customers/hector-simpson.png',
    email: 'HeriPriadi@gmail.com',
    phone_number: '08231654'
  },
  {
    id: '50ca3e18-62cd-11ee-8c99-0242ac120002',
    name: 'Kevin Sanjaya',
    address: 'Jalan Kaliurang km 10, Yogyakarta',
    image_url: '/customers/steven-tey.png',
    email: 'kevinSA@gmail.com',
    phone_number: '08654123'
  },
  {
    id: '50ca3e18-62cd-11ee-8c99-0242ac120002',
    name: 'yusuf Sanjaya',
    address: 'Jalan Godean Km 14, Yogyakarta',
    image_url: '/customers/michael-novotny.png',
    email: 'Yusuf@gmail.com',
    phone_number: '08321456'
  },
  {
    id: '50ca3e18-62cd-11ee-8c99-0242ac120002',
    name: 'Susanti',
    address: 'Jalan Ks Tubun10, Yogyakarta',
    image_url: '/customers/jared-palmer.png',
    email: 'Susanti@gmail.com',
    phone_number: '08465213'
  },
  {
    id: '50ca3e18-62cd-11ee-8c99-0242ac120002',
    name: 'Wawan',
    address: 'Jalan Dongkelan, Bantul',
    image_url: '/customers/evil-rabbit.png',
    email: 'Wawan@gmail.com',
    phone_number: '08564231'
    
  },
  {
    id: '50ca3e18-62cd-11ee-8c99-0242ac120002',
    name: 'Putri',
    address: 'Jalan Kaliurang km 10, Yogyakarta',
    image_url: '/customers/amy-burns.png',
    email: 'Putri@gmail.com',
    phone_number: '08312546'
  },
  {
    id: '50ca3e18-62cd-11ee-8c99-0242ac120002',
    name: 'Santo',
    address: 'Jalan Sidoarum, Yogyakarta',
    image_url: '/customers/lee-robinson.png',
    email: 'Santo@gmail.com',
    phone_number: '08554232'
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
  {
    customer_id: customers[0].id,
    price: '32000',
    tax: '10',
    payment_methods: 'Qris',
    status: 'Paid',
    invoice_date: '2024-03-21',
  },
  {
    customer_id: customers[0].id,
    price: '92000',
    tax: '10',
    payment_methods: 'Qris',
    status: 'Paid',
    invoice_date: '2024-06-05',
  },
  {
    customer_id: customers[0].id,
    price: '27000',
    tax: '10',
    payment_methods: 'Cash',
    status: 'Paid',
    invoice_date: '2024-05-04',
  },
  {
    customer_id: customers[0].id,
    price: '70000',
    tax: '10',
    payment_methods: 'Qris',
    status: 'Paid',
    invoice_date: '2024-05-09',
  },
  {
    customer_id: customers[0].id,
    price: '60000',
    tax: '10',
    payment_methods: 'Cash',
    status: 'Paid',
    invoice_date: '2024-05-01',
  },
];

const reservations = [
  {
    customer_id: customers[0].id,
    address: 'Jalan Babarsari, Sleman',
    special_request: 'meja dekat lobby',
    res_date: '2024-03-04',
    email: 'asep23@gmail.com',
  },
  {
    customer_id: customers[1].id,
    address: 'Jalan Babarsari, Sleman',
    special_request: 'meja 4 dekat jendela',
    res_date: '2024-03-04',
    email: 'samsul21@gmail.com',
  },
  {
    customer_id: customers[2].id,
    address: 'Jalan Babarsari, Sleman',
    special_request: 'meja 3 VIP',
    res_date: '2024-03-04',
    email: 'arip242@gmail.com',
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
  ];

module.exports = {
  users,
  customers,
  invoices,
  menu,
  reservations,
  revenue
};