'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { File, constants } from 'buffer';

// Form schemas
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  price: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
});

const MenuSchema = z.object({
  menuId: z.string(),
  price: z.coerce.number(),
  category: z.string(),
});

const piss = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  email: z.string(),
  image_url: z.string(),
});

// Define schemas for create and update operations
const CreateMenu = MenuSchema.omit({ menuId: true });
const UpdateMenu = MenuSchema.omit({ menuId: true });
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

export async function createInvoice(prevState: State, formData: FormData) {
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

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
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

export async function createReservation(formData: FormData) {
  const { customerId, amount, status } = CreateReservation.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
  try {
    await sql`
      INSERT INTO reservations (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Reservation.',
    };
  }

  revalidatePath('/dashboard/reservations');
  redirect('/dashboard/reservations');
}

export async function updateReservation(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateReservation.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

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
}

export async function deleteReservation(id: string) {
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

  const { name, email, image_url } = CreateCustomer.parse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: fileName,
  });

  await sql`
    INSERT INTO customers (name, email, image_url)
    VALUES (${name}, ${email}, ${image_url})
  `;

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

  console.log(name, email, image_url, id);
  await sql`
    UPDATE customers
    SET name = ${name}, email = ${email}, image_url = ${image_url}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');

  return { message: 'Customer updated successfully.' };
}

export async function deleteCustomer(id: string) {
  await sql`DELETE FROM customers WHERE id = ${id}`;
  revalidatePath('/dashboard/customers');
}

export async function createMenu(formData: FormData) {
  const validatedFields = MenuSchema.safeParse({
    menuId: formData.get('menuId'),
    price: formData.get('price'),
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Menu.',
    };
  }

  const { menuId, price, category } = validatedFields.data;
  const priceInCents = price * 100;

  try {
    await sql`
      INSERT INTO menu (menu_id, price, category)
      VALUES (${menuId}, ${priceInCents}, ${category})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Menu.',
    };
  }

  revalidatePath('/dashboard/menu');
  redirect('/dashboard/menu');
}

export async function updateMenu(id: string, formData: FormData) {
  const validatedFields = MenuSchema.safeParse({
    menuId: formData.get('menuId'),
    price: formData.get('price'),
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Menu.',
    };
  }

  const { menuId, price, category } = validatedFields.data;
  const priceInCents = price * 100;

  await sql`
    UPDATE menu
    SET menu_id = ${menuId}, price = ${priceInCents}, category = ${category}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/menu');
  redirect('/dashboard/menu');
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
  const img = formData.get('image') as File;
  let fileName = '';

  if (img instanceof File) {
    fileName = '/menu/' + img.name;
  }

  const validatedFields = CreateMenu.safeParse({
    name: formData.get('name'),
    category: formData.get('category'),
    price: parseFloat(formData.get('price') as string),
    image_url: fileName,
  });

  if (!validatedFields.success) {
    return { message: 'Validation Error: Invalid input data.' };
  }

  const { name, category, price, image_url } = validatedFields.data!;

  try {
    await sql`
      INSERT INTO menu (name, category, price, image_url)
      VALUES (${name}, ${category}, ${price}, ${image_url})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Menu item.',
    };
  }

  revalidatePath('/dashboard/menu');
  redirect('/dashboard/menu');

  return { message: 'Menu created successfully.' };
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
}
