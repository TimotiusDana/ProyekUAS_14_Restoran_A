'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { File } from 'buffer';
import { Console } from 'console';

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
  payment_method: z.enum(['qris', 'cash']),
  email: z.string(),
  image_url: z.string(),
});

const menuSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  price: z.coerce.number(),
  image_url: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const CreateReservation = ResSchema.omit({ id: true, date: true });
const UpdateReservation = ResSchema.omit({ id: true, date: true });
const date = new Date().toISOString().split('T')[0];

const CreateCustomer = piss.omit({ id: true });
const UpdateCustomer= piss.omit({ id: true });
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

export async function createInvoice(prevState: State, formData: FormData) {
  const { customerId, price, status, payment_method } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    price: formData.get('price'),
    status: formData.get('status'),
    payment_method: formData.get('payment_method'),
  });

  const priceInCents = price * 100;

  
    await sql`
      INSERT INTO invoices (customer_id, price, status, date)
      VALUES (${customerId}, ${priceInCents}, ${status}, ${payment_method}, ${date})
    `;
  
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');

 
}

export async function updateInvoice(id: string, formData: FormData){
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

export async function createReservation(formData: FormData){
  const { customerId, address, price, special_request } = CreateReservation.parse({
    customerId: formData.get('customerId'),
    address: formData.get('address'),
    price: formData.get('price') ,
    special_request: formData.get('special_request'),
    status: formData.get('status'),
  });

  const priceInCents = price * 100;

  try {
    await sql`
      INSERT INTO reservations (customer_id, price, status, date)
      VALUES (${customerId}, ${address}, ${priceInCents}, ${special_request}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Reservation.',
    };
  }

  revalidatePath('/dashboard/reservations');
  redirect('/dashboard/reservations');

}

export async function updateReservation(id: string, formData: FormData): Promise<{ message: string }> {
  const { customerId, price, special_request } = UpdateReservation.parse({
    customerId: formData.get('customerId'),
    price: parseFloat(formData.get('price') as string),
    status: formData.get('status'),
  });

  const priceInCents = price * 100;

  try {
    await sql`
      UPDATE reservations
      SET customer_id = ${customerId}, price = ${priceInCents}, status = ${special_request}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Reservation.' };
  }

  revalidatePath('/dashboard/reservations');
  redirect('/dashboard/reservations');

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

  const { name, address, payment_method, email, image_url } = CreateCustomer.parse({
    name: formData.get('name'),
    address: formData.get('address'),
    payment_method: formData.get('payment_method'),
    email: formData.get('email'),
    image_url: fileName,
  });
  await sql`
  INSERT INTO customers (name, address, payment_method, email, image_url)
  VALUES (${name}, ${address}, ${payment_method}, ${email}, ${image_url})
  `;
  
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');


}

export async function updateCustomer(id: string, formData: FormData): Promise<{ message: string }> {
  const img = formData.get('image');

  console.log(img);
  let fileName = '';
  if (img instanceof File) {
    fileName = '/customers/' + img.name;
    console.log(fileName);
  }

  const { name, address, email, image_url, payment_method } = UpdateCustomer.parse({
    name: formData.get('name'),
    address: formData.get('address'),
    email: formData.get('email'),
    image_url: fileName,
    payment_method: formData.get('payment_method'),
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
    return { message: 'Database Error: Failed to Delete customer.' };
  }
}

export async function deleteMenu(id: string): Promise<{ message: string }> {
  try {
    await sql`DELETE FROM menu WHERE id = ${id}`;
    revalidatePath('/dashboard/menu');
    return { message: 'Deleted menu item.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete menu item.' };
  }
}

export async function createMenu(formData: FormData): Promise<{ message: string }> {
  const img = formData.get('image');
  let fileName = '';

  if (img instanceof File) {
    fileName = '/menu/' + img.name;
  }

  const { name, category, price, image_url } = CreateMenu.parse({
    name: formData.get('name'),
    category: formData.get('category'),
    price: parseFloat(formData.get('price') as string),
    image_url: fileName,
  });

    await sql`
      INSERT INTO menu (name, category, price, image_url)
      VALUES (${name}, ${category}, ${price}, ${image_url})
    `;
 
  

  revalidatePath('/dashboard/menu');
  redirect('/dashboard/menu');

}

export async function updateMenu(id: string, formData: FormData): Promise<{ message: string }> {
  const validatedFields = UpdateMenu.safeParse({
    name: formData.get('name'),
    category: formData.get('category'),
    price: parseFloat(formData.get('price') as string),
    image_url: formData.get('image_url'),
  });

  if (!validatedFields.success) {
    return { message: 'Validation Error: Invalid input data.' };
  }

  const { name, category, price, image_url } = validatedFields.data!;

  try {
    await sql`
      UPDATE menu
      SET name = ${name}, category = ${category}, price = ${price}, image_url = ${image_url}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Menu item.' };
  }

  revalidatePath('/dashboard/menu');
  redirect('/dashboard/menu');

  return { message: 'Menu item updated successfully.' };
}

