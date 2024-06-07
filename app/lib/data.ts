import { db, sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  LatestReservationRaw,
  User,
  Revenue,
  ReservationsTable,
  ReservationForm,
  MenuForm,
  CstmTable,
  CstmForm,
  MenuTable
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';


export async function fetchRevenue() {
  try {
    const data = await sql<Revenue>`SELECT * FROM revenue`;
    return data.rows;
  } catch (error: any) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.price, invoices.tax, invoices.payment_methods, invoices.status, invoices.invoice_date, customers.name, customers.image_url, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.invoice_date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      price: formatCurrency(invoice.price),
    }));
    return latestInvoices;
  } catch (error: any) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch the latest invoices. Reason: ${error.message}`);
  }
}


export async function fetchCardData() {
  try {
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN price ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN price ELSE 0 END) AS "pending"
         FROM invoices`;

    const [invoiceCount, customerCount, invoiceStatus] = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(invoiceCount.rows[0].count ?? '0');
    const numberOfCustomers = Number(customerCount.rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(invoiceStatus.rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(invoiceStatus.rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error: any) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch card data. Reason: ${error.message}`);
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.price,
        invoices.tax,
        invoices.payment_methods,
        invoices.status,
        invoices.invoice_date,
        customers.name,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        invoices.price::text ILIKE ${`%${query}%`} OR
        invoices.tax::text ILIKE ${`%${query}%`} OR
        invoices.payment_methods::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`} OR
        invoices.invoice_date::text ILIKE ${`%${query}%`}
      ORDER BY invoices.invoice_date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;

    return invoices.rows;
  } catch (error: any) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch invoices. Reason: ${error.message}`);
  }
}


export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        invoices.price::text ILIKE ${`%${query}%`} OR
        invoices.invoice_date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error: any) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch total number of invoices. Reason: ${error.message}`);
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.price,
        invoices.tax,
        invoices.payment_methods,
        invoices.status,
        invoices.invoice_date
      FROM invoices
      WHERE invoices.id = ${id}`;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      price: invoice.price / 100,
    }));

    return invoice[0];
  } catch (error: any) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch invoice. Reason: ${error.message}`);
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC`;

    return data.rows;
  } catch (err: any) {
    console.error('Database Error:', err);
    throw new Error(`Failed to fetch all customers. Reason: ${err.message}`);
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
      SELECT
        customers.id,
        customers.name,
        customers.email,
        customers.image_url,
        COUNT(invoices.id) AS total_invoices,
        SUM(CASE WHEN invoices.status = 'pending' THEN invoices.price ELSE 0 END) AS total_pending,
        SUM(CASE WHEN invoices.status = 'paid' THEN invoices.price ELSE 0 END) AS total_paid
      FROM customers
      LEFT JOIN invoices ON customers.id = invoices.customer_id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
      GROUP BY customers.id, customers.name, customers.email, customers.image_url
      ORDER BY customers.name ASC`;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err: any) {
    console.error('Database Error:', err);
    throw new Error(`Failed to fetch customer table. Reason: ${err.message}`);
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error: any) {
    console.error('Failed to fetch user:', error);
    throw new Error(`Failed to fetch user. Reason: ${error.message}`);
  }
}

export async function fetchLatestReservations() {
  try {
    const data = await sql<LatestReservationRaw>`
      SELECT reservations.address, reservations.price, reservations.special_request, reservations.reservation_date, reservations.email, customers.name, customers.image_url, reservations.id
      FROM reservations
      JOIN customers ON reservations.customer_id = customers.id
      ORDER BY reservations.reservation_date DESC
      LIMIT 5`;

    const latestReservations = data.rows.map((reservation) => ({
      ...reservation,
      price: formatCurrency(reservation.price),
    }));
    return latestReservations;
  } catch (error: any) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch the latest reservations. Reason: ${error.message}`);
  }
}




export async function fetchFilteredReservations(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const reservation = await db.query(`
      SELECT
        reservations.id,
        reservations.customer_id,
        reservations.price,
        reservations.special_request,
        reservations.reservation_date,
        reservations.email,
        customers.name,
        customers.image_url
      FROM reservations
      JOIN customers ON reservations.customer_id = customers.id
      WHERE
        customers.name ILIKE $1 OR
        reservations.email ILIKE $1 OR
        reservations.address ILIKE $1
      ORDER BY reservations.reservation_date DESC
      LIMIT $2 OFFSET $3
    `, [`%${query}%`, ITEMS_PER_PAGE, offset]);

    return reservation.rows;
  } catch (error: any) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch reservations. `);
  }
}

export async function fetchReservationsPages(query: string) {
  try {
    const result = await db.query(`
      SELECT COUNT(*)
      FROM reservations
      JOIN customers ON reservations.customer_id = customers.id
      WHERE
        customers.name ILIKE $1 OR
        reservations.email ILIKE $1 OR
        reservations.address ILIKE $1
    `, [`%${query}%`]);

    const totalPages = Math.ceil(result.rows[0].count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error: any) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch total number of reservations. Reason: ${error.message}`);
  }
}



export async function fetchReservationById(id: string) {
  try {
    const data = await sql<ReservationForm>`
      SELECT
        reservations.id,
        reservations.customer_id,
        reservations.price,
        reservations.tax,
        reservations.payment_methods,
        reservations.status,
        reservations.reservation_date,
        reservations.address
      FROM reservations
      WHERE reservations.id = ${id}`;

    const reservation = data.rows.map((reservation) => ({
      ...reservation,
      price: reservation.price / 100,
    }));

    return reservation[0];
  } catch (error: any) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch reservation. Reason: ${error.message}`);
  }
}

export async function fetchCustomersPages(query: string) {
noStore();

  try {
    const count = await sql`SELECT COUNT(*)
    FROM customers`;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }
}

export async function fetchMenuPages(query: string){
  try {
    const count = await sql `SELECT COUNT (*)
    from menu
    
   WHERE
    
    menu.name::text ILIKE ${`%${query}%`} OR
    menu.category::text ILIKE ${`%${query}%`} OR
    menu.price::text ILIKE ${`%${query}%`} 
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error: any) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch total number of menu. Reason: ${error.message}`);
  }
}

export async function fetchFilteredMenu (id: string) {
  try{
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const data = await sql <MenuForm>`
    SELECT
    menu.id,
    menu.name
    menu.category
    menu.price
    FROM menu
    WHERE menu.id = ${id}`;

    const menu = data.rows.map((menu) => ({
      ...menu,
      price: menu.price / 100,
    }));

    return menu[0];
  } catch (error: any) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch menu. Reason: ${error.message}`);


  }
}



export async function fetchMenuById (id: string) {
  try{
    const data = await sql <MenuForm>`
    SELECT
    menu.id,
    menu.name
    menu.category
    menu.price
    FROM menu
    WHERE menu.id = ${id}`;

    const menu = data.rows.map((menu) => ({
      ...menu,
      price: menu.price / 100,
    }));

    return menu[0];
  } catch (error: any) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch menu. Reason: ${error.message}`);


  }
}

export async function fetchFilteredCstms(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  noStore();

  try {
    console.log('Fetching customers data...');
    await new Promise((resolve) => setTimeout(resolve, 4000));

    const cstms = await sql<CstmTable>`
      SELECT
      cstms.id,
      cstms.name,
      cstms.address,
      cstms.payment_methods,
      cstms.email,
      cstms.price,
      cstms.date,
      cstms.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM cstms
      JOIN customers ON cstms.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        cstms.name::text ILIKE ${`%${query}%`} OR
        cstms.address::text ILIKE ${`%${query}%`} OR
        cstms.payment_methods::text ILIKE ${`%${query}%`} OR
        cstms.price::text ILIKE ${`%${query}%`} OR
        cstms.date::text ILIKE ${`%${query}%`} OR
        cstms.status ILIKE ${`%${query}%`}
      ORDER BY cstms.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    console.log('Data fetch completed after 3 seconds.'); // Added message

    return cstms.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customers.');
  }
}

export async function fetchCstmsPages(query: string) {
  noStore();
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const count = await sql`SELECT COUNT(*)
    FROM cstms
    JOIN customers ON cstms.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      cstms.price::text ILIKE ${`%${query}%`} OR
      cstms.date::text ILIKE ${`%${query}%`} OR
      cstms.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }
}

export async function fetchCstmsById(id: string) {
  noStore();
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const data = await sql<CstmForm>`
      SELECT
        cstms.id,
        cstms.customer_id,
        cstms.price,
        cstms.status
      FROM cstms
      WHERE cstms.id = ${id};
    `;

    const customer = data.rows.map((customer) => ({
      ...customer,
      // Convert amount from cents to dollars
      amount: customer.price / 100,
    }));
    console.log(customer);
    return customer[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer.');
  }
}

