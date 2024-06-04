'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { File } from 'buffer';

interface ValidatedFields {
  success: boolean;
  data?: {
    customerId: string;
    price: number;
    status: string;
  };
  error?: any;
}

const updateSchema = z.object({
  customerId: z.string(),
  price: z.number(),
  status: z.string(),
});

const createSchema = z.object({
  customerId: z.string(),
  price: z.number(),
  status: z.string(),
});

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  price: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const piss = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  image_url: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const CreateReservation = FormSchema.omit({ id: true, date: true });
const UpdateReservation = FormSchema.omit({ id: true, date: true });
const date = new Date().toISOString().split('T')[0];

const CreateCustomer = piss.omit({ id: true });
const UpdateCustomer = piss.omit({ id: true });

export type State = {
  errors?: {
    customerId?: string[];
    price?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData): Promise<{ errors?: any; message: string }> {
  // Validate form using Zod
  const validatedFields: ValidatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    price: parseFloat(formData.get('price') as string), // Ensure price is a number
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, price, status } = validatedFields.data!;
  const priceInCents = price * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, price, status, date)
      VALUES (${customerId}, ${priceInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');

  return {
    message: 'Invoice created successfully.',
  };
}

export async function updateInvoice(id: string, formData: FormData): Promise<{ message: string }> {
  const validatedFields: ValidatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    price: parseFloat(formData.get('price') as string), // Ensure price is a number
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return { message: 'Validation Error: Invalid input data.' };
  }

  const { customerId, price, status } = validatedFields.data!;
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

export async function deleteInvoice(id: string): Promise<{ message: string }> {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}

export async function createReservation(formData: FormData): Promise<{ message: string }> {
  const validatedFields: ValidatedFields = CreateReservation.safeParse({
    customerId: formData.get('customerId'),
    price: parseFloat(formData.get('price') as string), // Ensure price is a number
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return { message: 'Validation Error: Invalid input data.' };
  }

  const { customerId, price, status } = validatedFields.data!;
  const priceInCents = price * 100;

  try {
    await sql`
      INSERT INTO reservations (customer_id, price, status, date)
      VALUES (${customerId}, ${priceInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Reservation.',
    };
  }

  revalidatePath('/dashboard/reservations');
  redirect('/dashboard/reservations');

  return { message: 'Reservation created successfully.' };
}

export async function updateReservation(id: string, formData: FormData): Promise<{ message: string }> {
  const validatedFields: ValidatedFields = UpdateReservation.safeParse({
    customerId: formData.get('customerId'),
    price: parseFloat(formData.get('price') as string), // Ensure price is a number
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return { message: 'Validation Error: Invalid input data.' };
  }

  const { customerId, price, status } = validatedFields.data!;
  const priceInCents = price * 100;

  try {
    await sql`
      UPDATE reservations
      SET customer_id = ${customerId}, price = ${priceInCents}, status = ${status}, date = ${date}
      WHERE id = ${id}
    `;
  } catch (error) {
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

export async function createCustomer(formData: FormData): Promise<{ message: string }> {
  const img = formData.get('image');
  let fileName = '';

  if (img instanceof File) {
    fileName = '/customers/' + img.name;
  }

  const validatedFields = CreateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: fileName,
  });

  if (!validatedFields.success) {
    return { message: 'Validation Error: Invalid input data.' };
  }

  const { name, email, image_url } = validatedFields.data!;

  try {
    await sql`
      INSERT INTO customers (name, email, image_url)
      VALUES (${name}, ${email}, ${image_url})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Customer.',
    };
  }

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');

  return { message: 'Customer created successfully.' };
}

export async function updateCustomer(id: string, formData: FormData): Promise<{ message: string }> {
  const img = formData.get('image');
  let fileName = '';

  if (img instanceof File) {
    fileName = '/customers/' + img.name;
  }

  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: fileName,
  });

  if (!validatedFields.success) {
    return { message: 'Validation Error: Invalid input data.' };
  }

  const { name, email, image_url } = validatedFields.data!;

  try {
    await sql`
      UPDATE customers
      SET name = ${name}, email = ${email}, image_url = ${image_url}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Customer.' };
  }

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');

  return { message: 'Customer updated successfully.' };
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

export async function createCstm(prevState: State, formData: FormData): Promise<{ errors?: any; message: string }> {
  // Validate form using Zod
  const validatedFields: ValidatedFields = createSchema.safeParse({
    customerId: formData.get('customerId'),
    price: parseFloat(formData.get('price') as string), // Ensure price is a number
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Customer.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, price, status } = validatedFields.data!;
  const priceInCents = price * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO customers (customer_id, price, status, date)
      VALUES (${customerId}, ${priceInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Customer.',
    };
  }

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');

  return {
    message: 'Customer created successfully.',
  };
}

export async function deleteCstm(id: string): Promise<{ message: string }> {
  try {
    await sql`DELETE FROM cstms WHERE id = ${id}`;
    revalidatePath('/dashboard/customers');
    return { message: 'Deleted customer.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete customer.' };
  }
}

export async function updateCstm(id: string, formData: FormData): Promise<{ message: string }> {
  const validatedFields: ValidatedFields = updateSchema.safeParse({
    customerId: formData.get('customerId'),
    price: parseFloat(formData.get('price') as string),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return { message: 'Validation Error: Invalid input data.' };
  }

  const { customerId, price, status } = validatedFields.data!;
  const priceInCents = price * 100;

  try {
    await sql`
      UPDATE customers
      SET customer_id = ${customerId}, price = ${priceInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Customer.' };
  }

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');

  return { message: 'Customer updated successfully.' };
}
