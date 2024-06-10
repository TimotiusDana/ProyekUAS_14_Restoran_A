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
  menuId: z.string(),
  category: z.enum(['makanan', 'minuman']),
});

const piss = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  email: z.string(),
  image_url: z.string(),
});

const MenuSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.coerce.number(),
  category: z.enum(['makanan', 'minuman']),
});

const CreateMenu = z.object({
  name: z.string(),
  price: z.coerce.number(),
  category: z.enum(['makanan', 'minuman']),
});

const UpdateMenu = z.object({
  name: z.string(),
  price: z.coerce.number(),
  category: z.enum(['makanan', 'minuman']),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const CreateReservation = FormSchema.omit({ id: true, date: true });
const UpdateReservation = FormSchema.omit({ id: true, date: true });
const date = new Date().toISOString().split('T')[0];

const CreateCstm = piss.omit({ id: true });
const UpdateCstm = piss.omit({ id: true });

export type State = {
  errors?: {
    customerId?: string[];
    price?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData): Promise<{ errors?: any; message: string }> {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    price: parseFloat(formData.get('price') as string),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, price, status } = validatedFields.data!;
  const priceInCents = price * 100;

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
  const validatedFields = UpdateInvoice.safeParse({
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

export async function createReservation(formData: FormData): Promise<{ message: string }> {
  const validatedFields = CreateReservation.safeParse({
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
  const validatedFields = UpdateReservation.safeParse({
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
      UPDATE reservations
      SET customer_id = ${customerId}, price = ${priceInCents}, status = ${status}
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
  const img = formData.get('image') as File;
  let fileName = '';

  if (img instanceof File) {
    fileName = '/customers/' + img.name;
  }

  const validatedFields = CreateCstm.safeParse({
    name: formData.get('name'),
    address: formData.get('address'),
    email: formData.get('email'),
    image_url: fileName,
  });

  if (!validatedFields.success) {
    return { message: 'Validation Error: Invalid input data.' };
  }

  const { name, address, email, image_url } = validatedFields.data!;

  try {
    await sql`
      INSERT INTO customers (name, address, email, image_url)
      VALUES (${name}, ${address}, ${email}, ${image_url})
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
  const img = formData.get('image') as File;
  let fileName = '';

  if (img instanceof File) {
    fileName = '/customers/' + img.name;
  }

  const validatedFields = UpdateCstm.safeParse({
    name: formData.get('name'),
    address: formData.get('address'),
    email: formData.get('email'),
    image_url: fileName,
  });

  if (!validatedFields.success) {
    return { message: 'Validation Error: Invalid input data.' };
  }

  const { name, address, email, image_url } = validatedFields.data!;

  try {
    await sql`
      UPDATE customers
      SET name = ${name}, address = ${address}, email = ${email}, image_url = ${image_url}
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

export async function createMenu(formData: FormData): Promise<{ errors?: any; message: string }> {
  const name = formData.get('name') as string | null;
  const price = formData.get('price') as string | null;
  const category = formData.get('category') as string | null;

  if (!name || !price || !category) {
    return {
      message: 'Missing Fields. Failed to Create Menu.',
    };
  }

  const validatedFields = MenuSchema.safeParse({
    name,
    price: parseFloat(price),
    category,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid Fields. Failed to Create Menu.',
    };
  }

  const { name: validName, price: validPrice, category: validCategory } = validatedFields.data;

  try {
    await sql`
      INSERT INTO menu (name, price, category)
      VALUES (${validName}, ${validPrice}, ${validCategory})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Menu.',
    };
  }

  revalidatePath('/dashboard/menu');
  redirect('/dashboard/menu');

  return {
    message: 'Menu created successfully.',
  };
}

export async function updateMenu(id: string, formData: FormData): Promise<{ message: string }> {
  const validatedFields = UpdateMenu.safeParse({
    name: formData.get('name'),
    price: parseFloat(formData.get('price') as string),
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    return { message: 'Validation Error: Invalid input data.' };
  }

  const { name, category, price } = validatedFields.data!;

  try {
    await sql`
      UPDATE menu
      SET name = ${name}, category = ${category}, price = ${price}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Menu item.' };
  }

  revalidatePath('/dashboard/menu');
  redirect('/dashboard/menu');

  return { message: 'Menu item updated successfully.' };
}

export async function createCstm(formData: FormData): Promise<{ message: string }> {
  const img = formData.get('image') as File;
  let fileName = '';

  if (img instanceof File) {
    fileName = '/customers/' + img.name;
  }

  const validatedFields = CreateCstm.safeParse({
    name: formData.get('name'),
    address: formData.get('address'),
    email: formData.get('email'),
    image_url: fileName,
  });

  if (!validatedFields.success) {
    return { message: 'Validation Error: Invalid input data.' };
  }

  const { name, address, email, image_url } = validatedFields.data!;

  try {
    await sql`
      INSERT INTO customers (name, address, email, image_url)
      VALUES (${name}, ${address}, ${email}, ${image_url})
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

export async function updateCstm(id: string, formData: FormData): Promise<{ message: string }> {
  const img = formData.get('image') as File;
  let fileName = '';

  if (img instanceof File) {
    fileName = '/customers/' + img.name;
  }

  const validatedFields = UpdateCstm.safeParse({
    name: formData.get('name'),
    address: formData.get('address'),
    email: formData.get('email'),
    image_url: fileName,
  });

  if (!validatedFields.success) {
    return { message: 'Validation Error: Invalid input data.' };
  }

  const { name, address, email, image_url } = validatedFields.data!;

  try {
    await sql`
      UPDATE customers
      SET name = ${name}, address = ${address}, email = ${email}, image_url = ${image_url}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Customer.' };
  }

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');

  return { message: 'Customer updated successfully.' };
}

export async function deleteCstm(id: string): Promise<{ message: string }> {
  try {
    await sql`DELETE FROM customers WHERE id = ${id}`;
    revalidatePath('/dashboard/customers');
    return { message: 'Deleted customer.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete customer.' };
  }
}
