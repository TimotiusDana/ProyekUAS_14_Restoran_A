
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
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
  payment_methods: string;
  invoice_date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
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
  status: string;
  invoice_date: string;
  email: string;
};

export type Menu = {
id: string;
name: string;
category: string;
price: number;

}



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
  payment_methods: string;
  tax: number;
  email: string;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  adress: string;
  payment_methods: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  address: string;
  payment_methods: string;
  image_url: string;
  // total_invoices: number;
  // total_pending: string;
  // total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  price: number;
  status: 'pending' | 'paid';
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
  invoice_date: string;
  price: number;
  payment_methods: string;
  tax: number;
  status: 'pending' | 'paid';
};

export type ReservationForm = {
  id: string;
  customer_id: string;
  price: number;
  status: 'pending' | 'paid';
};

export type LatestReservationRaw = Omit<LatestReservation, 'amount'> & {
  amount: number;
};



export type MenuForm ={
  id: string;
  name: string;
  category: string;
  price: number;
  status: 'pending' | 'paid';
  }

  export type MenuTable ={
    id: string;
    name: string;
    category: string;
  price: number;
  
  }

  export type MenuField ={
    id: string;
    name: string;
    category: string;
    price: number;
  
  }