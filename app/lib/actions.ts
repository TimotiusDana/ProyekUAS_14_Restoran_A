'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { File } from 'buffer';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  price: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  payment_method: z.enum(['qris', 'cash']),
  date: z.string(),
});

const ResSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  address: z.string(),
  price: z.coerce.number(),
  special_request: z.string(),
  res_date: z.string(),
  email: z.string(),
});

const piss = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  payment_methods: z.enum(['Qris', 'cash']),
  email: z.string(),
  image_url: z.string().url().nullable(),
});

const menuSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['makanan', 'minuman']),
  price: z.coerce.number(),
  image_url: z.string().url().nullable(),
});

const UpdateCust = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string().nullable().default(''), // Allow null and provide default empty string
  email: z.string(),
  image_url: z.string(), // Allow null and provide default null
  payment_method: z.enum(['qris', 'cash']), // Enum validation for payment_method
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const CreateReservation = ResSchema.omit({ id: true, date: true });
const UpdateReservation = ResSchema.omit({ id: true, date: true });
const date = new Date().toISOString().split('T')[0];

const CreateCustomer = piss.omit({ id: true });
const UpdateCustomer = UpdateCust.omit({ id: true });
const CreateMenu = menuSchema.omit({ id: true });
const UpdateMenu = menuSchema.omit({ id: true });

export type State = {
  errors?: {
    customerId?: string[];
    price?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(formData: FormData) {
  const img = formData.get('image_url');
  console.log(img);

  let fileName = '';
  if (img instanceof File) {
    fileName = '/invoices/' + img.name;
    console.log(fileName);
  }

  const baseURL = 'http://localhost:3000'; // Adjust to your actual base URL
  const imageURL = fileName ? new URL(fileName, baseURL).toString() : null;

  const { name, price, status, payment_method } = CreateInvoice.parse({
    name: formData.get('name'),
    price: formData.get('price'),
    status: formData.get('status'),
    payment_method: formData.get('payment_method'),
    image_url: imageURL, // Use the constructed URL
  });

  const priceInCents = price * 100;

  await sql`
    INSERT INTO invoices (name, price, status, payment_method, image_url, date)
    VALUES (${name}, ${priceInCents}, ${status}, ${payment_method}, ${imageURL}, NOW())
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, price, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    price: formData.get('price'),
    status: formData.get('status'),
  });

  const priceInCents = price * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, price = ${priceInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');

  return { message: 'Invoice updated successfully.' };
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Invoice deleted successfully.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}

export async function createReservation(formData: FormData) {
  const { customerId, address, price, special_request, res_date, email } = ResSchema.parse({
    customerId: formData.get('customerId'),
    address: formData.get('address'),
    price: formData.get('price'),
    special_request: formData.get('special_request'),
    email: formData.get('email'),
    res_date: formData.get('res_date') || new Date().toISOString(), // Set to current date if not provided
  });

  const priceInCents = price * 100;

  await sql`
    INSERT INTO reservations (customer_id, address, price, special_request, res_date, email)
    VALUES (${customerId}, ${address}, ${priceInCents}, ${special_request}, ${res_date}, ${email})
  `;

  revalidatePath('/dashboard/reservations');
  redirect('/dashboard/reservations');
}

export async function updateReservation(id: string, formData: FormData): Promise<{ message: string }> {
  const { customerId, address, price, special_request } = UpdateReservation.parse({
    customerId: formData.get('customerId'),
    address: formData.get('address'),
    price: parseFloat(formData.get('price') as string),
    special_request: formData.get('special_request'),
  });

  const priceInCents = price * 100;

  try {
    await sql`
      UPDATE reservations
      SET customer_id = ${customerId}, address = ${address}, price = ${priceInCents}, special_request = ${special_request}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Reservation.' };
  }

  revalidatePath('/dashboard/reservations');
  redirect('/dashboard/reservations');

  return { message: 'Reservation updated successfully.' };
}

export async function deleteReservation(id: string): Promise<{ message: string }> {
  try {
    await sql`DELETE FROM reservations WHERE id = ${id}`;
    revalidatePath('/dashboard/reservations');
    return { message: 'Deleted Reservation.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Reservation.' };
  }
}

export async function createCustomer(formData: FormData) {
  const img = formData.get('image');
  console.log(img);

  let fileName = '';
  if (img instanceof File) {
    fileName = '/customers/' + img.name;
    console.log(fileName);
  }

  const baseURL = 'http://localhost:3000'; // Adjust to your actual base URL
  const imageURL = fileName ? new URL(fileName, baseURL).toString() : null;

  const { name, address, payment_methods, email } = CreateCustomer.parse({
    name: formData.get('name'),
    address: formData.get('address'),
    payment_methods: formData.get('payment_methods'),
    email: formData.get('email'),
    image_url: imageURL, // Use the constructed URL
  });

  await sql`
    INSERT INTO customers (name, address, payment_methods, email, image_url)
    VALUES (${name}, ${address}, ${payment_methods}, ${email}, ${imageURL})
  `;

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}


export async function updateCustomer(id: string, formData: FormData) {
  const img = formData.get('image');
  console.log(img);

  let fileName = '';
  if (img instanceof File) {
    fileName = '/customers/' + img.name;
    console.log(fileName);
  }

  // Get payment_method and log its value for debugging
  const paymentMethod = formData.get('payment_method');
  console.log('Payment method:', paymentMethod);



  const { name, address, email, payment_method, image_url } = UpdateCustomer.parse({
    name: formData.get('name'),
    address: formData.get('address'),
    email: formData.get('email'),
    image_url: fileName,
    payment_method: paymentMethod,
  });

  await sql`
    UPDATE customers
    SET name = ${name}, address = ${address}, email = ${email}, image_url = ${image_url}, payment_method = ${payment_method}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

export async function deleteCustomer(id: string): Promise<{ message: string }> {
  try {
    await sql`DELETE FROM customers WHERE id = ${id}`;
    revalidatePath('/dashboard/customers');
    return { message: 'Deleted customer.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Customer.' };
  }
}

export async function createMenu(formData: FormData) {
  const img = formData.get('image');
  let fileName = '';

  if (img instanceof File) {
    fileName = '/menus/' + img.name;
  }

  const { name, category, price, image_url } = CreateMenu.parse({
    name: formData.get('name'),
    category: formData.get('category'),
    price: formData.get('price'),
    image_url: fileName,
  });

  try {
    await sql`
      INSERT INTO menus (name, category, price, image_url)
      VALUES (${name}, ${category}, ${price}, ${image_url})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Menu.',
    };
  }

  revalidatePath('/dashboard/menus');
  redirect('/dashboard/menus');
}

export async function updateMenu(id: string, formData: FormData): Promise<{ message: string }> {
  const img = formData.get('image');
  let fileName = '';

  if (img instanceof File) {
    fileName = '/menus/' + img.name;
  }

  const { name, category, price, image_url } = UpdateMenu.parse({
    name: formData.get('name'),
    category: formData.get('category'),
    price: formData.get('price'),
    image_url: fileName || null,  // Ensure image_url is null if fileName is an empty string
  });

  try {
    await sql`
      UPDATE menus
      SET name = ${name}, category = ${category}, price = ${price}, image_url = ${image_url}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Update Menu.' };
  }

  revalidatePath('/dashboard/menus');
  redirect('/dashboard/menus');

  return { message: 'Menu updated successfully.' };
}

export async function deleteMenu(id: string): Promise<{ message: string }> {
  try {
    await sql`DELETE FROM menus WHERE id = ${id}`;
    revalidatePath('/dashboard/menus');
    return { message: 'Deleted menu.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Menu.' };
  }
}
