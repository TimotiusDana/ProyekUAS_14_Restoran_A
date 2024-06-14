export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Reservation = {
id: string;
  customer_id: string;
  name: string;
  image_url: string;
  price: number;
  special_request: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  payment_methods: string;
  address: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  price: number;
  tax: number;
  payment_methods: 'qris' | 'cash';
  invoice_date: string;
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  price: number;
  tax: number;
  payment_methods: string;
  status: 'pending' | 'paid';
  invoice_date: string;
  email: string;
};

export type Menu = {
  id: string;
  name: string;
  category: 'makanan' | 'minuman';
  price: number;
};

export type LatestInvoiceRaw = Omit<LatestInvoice, 'price'> & {
  price: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  image_url: string;
  invoice_date: string;
  price: number;
  payment_methods: 'qris' | 'cash';
  tax: number;
  email: string;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  address: string;
  payment_methods: string;
  image_url: string;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  address: string;
  payment_methods: string;
  image_url: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  price: number;
  tax: number;
  status: 'pending' | 'paid';
  payment_methods: 'qris' | 'cash';
};

export type LatestReservation = {
  id: string;
  customer_id: string;
  address: string;
  price: number;
  special_request: string;
  reservation_date: string;
  email: string;
};

export type ReservationsTable = {
  id: string;
  customer_id: string;
  name: string;
  image_url: string;
  price: number;
  special_request: string;
  address: string;
  email: string;
  res_date: string;
};

export type ReservationForm = {
  id: string;
  customer_id: string;
  price: number;
  special_request: string;
};

export type LatestReservationRaw = Omit<LatestReservation, 'price'> & {
  price: number;
};



export type MenuForm = {
  id: string;
  name: string;
  category: 'makanan' | 'minuman' ;
  price: number;
}

export type MenuTable = {
  id: string;
  name: string;
  category: 'makanan' | 'minuman';
  price: number;

}

export type MenuField = {
  id: string;
  name: string;
  category: 'makanan' | 'minuman';
}
