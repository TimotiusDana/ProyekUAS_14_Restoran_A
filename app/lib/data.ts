import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

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
      ORDER BY invoice.date DESC
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

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

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
        invoice.id,
        invoice.price,
        invoice.tax,
        invoice.payment_methods,
        invoice.status,
        invoice.invoice_date,
        customers.name,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        invoice.price::text ILIKE ${`%${query}%`} OR
        invoice.tax::text ILIKE ${`%${query}%`} OR
        invoice.payment_methods::text ILIKE ${`%${query}%`} OR
        invoice.status ILIKE ${`%${query}%`} OR
        invoice.invoice_date ILIKE ${`%${query}%`}
      ORDER BY invoice.invoice_date DESC
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
        customers.email ILIKE ${`%${query}%`} OR
        invoice.price::text ILIKE ${`%${query}%`} OR
        invoice.date::text ILIKE ${`%${query}%`} OR
        invoice.status ILIKE ${`%${query}%`}
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
    const data = await sql<LatestInvoiceRaw>`
      SELECT reservations.address, reservations.price, reservations.special_request, reservations.reservation_date, reservations_email, customers.name, customers.image_url, reservations.id
      FROM reservations
      JOIN customers ON reservations.customer_id = customers.id
      ORDER BY invoice.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      price: formatCurrency(invoice.price),
    }));
    return latestReservations;
  } catch (error: any) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch the latest reservations. Reason: ${error.message}`);
  }
}

export async function fetchFilteredReservations(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const reservations = await sql<ReservationsTable>`
      SELECT
        reservation.id,
        reservation.price,
        reservation.tax,
        reservation.payment_methods,
        reservation.status,
        reservation.reservation_date,
        customers.name,
        customers.image_url
      FROM reservations
      JOIN customers ON reservations.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        reservation.price::text ILIKE ${`%${query}%`} OR
        reservation.tax::text ILIKE ${`%${query}%`} OR
        reservation.payment_methods::text ILIKE ${`%${query}%`} OR
        reservation.status ILIKE ${`%${query}%`} OR
        reservation.reservation_date ILIKE ${`%${query}%`}
      ORDER BY reservation.reservation_date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;

    return reservations.rows;
  } catch (error: any) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch reservations. Reason: ${error.message}`);
  }
}

export async function fetchReservationsPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
      FROM reservations
      JOIN customers ON reservations.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        reservation.price::text ILIKE ${`%${query}%`} OR
        reservation.date::text ILIKE ${`%${query}%`} OR
        reservation.status ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
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
        reservations.reservation_date
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
