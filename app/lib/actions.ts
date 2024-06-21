'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { File } from 'buffer';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const FormSchema = z.object({

  customerId: z.string(),
  price: z.coerce.number(),
  tax: z.string(),
  status: z.enum(['pending', 'paid']),
  payment_methods: z.enum(['qris', 'cash']),
  invoice_date: z.date(),
});

const ResSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  address: z.string(),
  special_request: z.string(),
  res_date: z.string(),
  email: z.string(),
});

const piss = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  phone_number: z.string(),
  email: z.string(),
  image_url: z.string().url().nullable(),
});

const menuSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['makanan', 'minuman']),
  price: z.coerce.number(),
});


const EditSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  price: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
});

const CreateInvoice = FormSchema.omit({ id: true, invoice_date: true });
const UpdateInvoice = EditSchema.omit({ id: true, date: true });
const CreateReservation = ResSchema.omit({ id: true, reservation_date: true });
const UpdateReservation = ResSchema.omit({ id: true, date: true });
const date = new Date().toISOString().split('T')[0];

const CreateCustomer = piss.omit({ id: true });
const UpdateCustomer = piss.omit({ id: true });
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

export async function createInvoice(prevState: State, data: any) {
  try {
    const { customerId, price, tax, status, payment_methods } = CreateInvoice.parse({
      customerId: data.customerId,
      price: Number(data.price),
      tax: data.tax,
      status: data.status as 'pending' | 'paid',
      payment_methods: data.payment_methods as 'qris' | 'cash',
    });

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');

    await sql`
    INSERT INTO invoices (customer_id, price, tax,  status, payment_methods, invoice_date)
    VALUES (${customerId}, ${price}, ${tax}, ${status}, ${payment_methods}, ${date})
  `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create invoice',
    };
  }
}

export async function updateInvoice(id: string, formData: FormData) {
  const status = formData.get('status') as 'pending' | 'paid';

  try {
    await sql`
      UPDATE invoices
      SET status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice' };
  }
}

export async function createReservation(formData: FormData) {
  const { customerId, address, special_request, res_date, email } = CreateReservation.parse({
    customerId: formData.get('customerId'),
    address: formData.get('address'),
    special_request: formData.get('special_request'),
    email: formData.get('email'),
    res_date: formData.get('res_date') || new Date().toISOString(), // Set to current date if not provided
  });


  await sql`
    INSERT INTO reservations (customer_id, address, special_request, res_date, email)
    VALUES (${customerId}, ${address}, ${special_request}, ${res_date}, ${email})
  `;

  revalidatePath('/dashboard/reservations');
  redirect('/dashboard/reservations');
}

export async function updateReservation(id: string, formData: FormData): Promise<{ message: string }> {
  const { customerId, address, special_request } = UpdateReservation.parse({
    customerId: formData.get('customerId'),
    address: formData.get('address'),
    special_request: formData.get('special_request'),
  });


  try {
    await sql`
      UPDATE reservations
      SET customer_id = ${customerId}, address = ${address}, special_request = ${special_request}
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

  const { name, address, email, phone_number } = CreateCustomer.parse({
    name: formData.get('name'),
    address: formData.get('address'),
    email: formData.get('email'),
    phone_number: formData.get('phone_number'),
    image_url: imageURL, // Use the constructed URL
  });

  await sql`
    INSERT INTO customers (name, address, email, image_url, phone_number)
    VALUES (${name}, ${address}, ${email}, ${imageURL}, ${phone_number})
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

  const { name, address, email, image_url, phone_number } = UpdateCustomer.parse({
    name: formData.get('name'),
    address: formData.get('address'),
    email: formData.get('email'),
    image_url: fileName,
    phone_number: formData.get('')
  });

  await sql`
    UPDATE customers
    SET name =${name}, address = ${address}, email = ${email}, image_url = ${image_url}, phone_number = ${phone_number}
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
  console.log(img);



  const { name, category, price } = CreateMenu.parse({
    name: formData.get('name'),
    category: formData.get('category'),
    price: formData.get('price'),

  });

  await sql`
    INSERT INTO menu (name, category, price)
    VALUES (${name}, ${category}, ${price})
  `;

  revalidatePath('/dashboard/menu');
  redirect('/dashboard/menu');
}

export async function updateMenu(id: string, formData: FormData): Promise<{ message: string }> {
  const img = formData.get('image');
  let fileName = '';

  if (img instanceof File) {
    fileName = '/menu/' + img.name;
  }

  const { name, category, price } = UpdateMenu.parse({
    name: formData.get('name'),
    category: formData.get('category'),
    price: formData.get('price'),
    image_url: fileName || null,  // Ensure image_url is null if fileName is an empty string
  });


  await sql`
      UPDATE menu
      SET name = ${name}, category = ${category}, price = ${price}
      WHERE id = ${id}
    `;

  revalidatePath('/dashboard/menu');
  redirect('/dashboard/menu');

  return { message: 'Menu updated successfully.' };
}






export async function deleteMenu(id: string): Promise<{ message: string }> {
  try {
    await sql`DELETE FROM menu WHERE id = ${id}`;
    revalidatePath('/dashboard/menu');
    return { message: 'Deleted menu.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Menu.' };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}