'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
<<<<<<< HEAD
import { File } from 'buffer';
import { reservations } from './placeholder-data';




const CreateReservationSchema = z.object({
  customerId: z.string(),
  address: z.string(),
  price: z.number().min(0),
  special_request: z.string(),
  email: z.string().email(),
  reservation_date: z.string().optional(),
});

=======
import { File, constants } from 'buffer';
>>>>>>> origin/DanielChristianJap


const FormSchema = z.object({
  id: z.string(),
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
  reservation_date: z.string(),
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

<<<<<<< HEAD
const menuSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['makanan', 'minuman']),
  price: z.coerce.number(),
});

const UpdateCust = z.object({
  customer_id: z.string(),
  name: z.string(),
  address: z.string(),
  email: z.string(),
  phone_number: z.string(),
  image_url: z.string(),
});

const EditSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  price: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
});
=======
// Define schemas for create and update operations
const CreateMenu = MenuSchema.omit({ menuId: true });
const UpdateMenu = MenuSchema.omit({ menuId: true });
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const CreateReservation = FormSchema.omit({ id: true, date: true });
const UpdateReservation = FormSchema.omit({ id: true, date: true });
>>>>>>> origin/DanielChristianJap

const CreateInvoice = FormSchema.omit({ id: true, invoice_date: true });
const UpdateInvoice = EditSchema.omit({ id: true, date: true });
const CreateReservation = ResSchema.omit({ id: true, reservation_date: true });
const UpdateReservation = ResSchema.omit({ id: true, date: true });
const date = new Date().toISOString().split('T')[0];

const CreateCustomer = piss.omit({ id: true });
<<<<<<< HEAD
const UpdateCustomer = UpdateCust.omit({ id: true });
const CreateMenu = menuSchema.omit({ id: true });
const UpdateMenu = menuSchema.omit({ id: true });
=======
const UpdateCustomer = piss.omit({ id: true });
>>>>>>> origin/DanielChristianJap

export type State = {
  errors?: {
    customerId?: string[];
    price?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
<<<<<<< HEAD
  const { customerId, price, tax, status, payment_methods } = CreateInvoice.parse({
    customerId: formData.get('customerId') as string,
    price: Number(formData.get('price')),
    tax: formData.get('tax'),
    status: formData.get('status') as 'pending' | 'paid',
    payment_methods: formData.get('payment_methods') as 'qris' | 'cash',
  });

try{
  await sql`
    INSERT INTO invoices (customer_id, price, tax,  status, payment_methods, invoice_date)
    VALUES (${customerId}, ${price}, ${tax}, ${status}, ${payment_methods}, ${date})
  `;
} catch (error){
  return{
    message: 'Database Error: Failed to Create invoice',
=======
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    price: parseFloat(formData.get('price') as string), // Ensure price is a number
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
>>>>>>> origin/DanielChristianJap
  };
}
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
}

export async function deleteInvoice(id: string) {
<<<<<<< HEAD
  throw new Error('Failed to Delete Invoice');
 
=======
>>>>>>> origin/DanielChristianJap
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice' };
  }
}

export async function createReservation(formData: FormData) {
  const { customerId, address, special_request, reservation_date, email } = CreateReservation.parse({
    customerId: formData.get('customerId'),
    address: formData.get('address'),
    special_request: formData.get('special_request'),
    email: formData.get('email'),
    reservation_date: formData.get('reservation_date') || new Date().toISOString(), // Set to current date if not provided
  });


<<<<<<< HEAD
  await sql`
    INSERT INTO reservations (customer_id, address, special_request, reservation_date, email)
    VALUES (${customerId}, ${address}, ${special_request}, ${reservation_date}, ${email})
  `;
=======
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
>>>>>>> origin/DanielChristianJap

  revalidatePath('/dashboard/reservations');
  redirect('/dashboard/reservations');
}

<<<<<<< HEAD

export async function updateReservation(id: string, formData: FormData): Promise<{ message: string }> {
  const { customerId, address, special_request } = UpdateReservation.parse({
    customerId: formData.get('customerId'),
    address: formData.get('address'),
    special_request: formData.get('special_request'),
  });

=======
export async function updateReservation(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateReservation.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;
>>>>>>> origin/DanielChristianJap

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
<<<<<<< HEAD

  return { message: 'Reservation updated successfully.' };
}

export async function deleteReservation(id: string): Promise<{ message: string }> {
=======
}

export async function deleteReservation(id: string) {
>>>>>>> origin/DanielChristianJap
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
<<<<<<< HEAD
  console.log(img);

  let fileName = '';
  if (img instanceof File) {
    fileName = '/customers/' + img.name;
    console.log(fileName);
  }

  const baseURL = 'http://localhost:3000'; // Adjust to your actual base URL
  const imageURL = fileName ? new URL(fileName, baseURL).toString() : null;

  const { name, address, email } = CreateCustomer.parse({
    name: formData.get('name'),
    address: formData.get('address'),
    email: formData.get('email'),
    image_url: imageURL, // Use the constructed URL
  });

  await sql`
    INSERT INTO customers (name, address, email, image_url)
    VALUES (${name}, ${address}, ${email}, ${imageURL})
=======
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
>>>>>>> origin/DanielChristianJap
  `;

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
<<<<<<< HEAD
=======

  return { message: 'Customer created successfully.' };
>>>>>>> origin/DanielChristianJap
}


export async function updateCustomer(id: string, formData: FormData) {
  const img = formData.get('image');
  console.log(img);

  let fileName = '';
  if (img instanceof File) {
    fileName = '/customers/' + img.name;
    console.log(fileName);
  }

  const { customer_id, name, address, email, image_url, phone_number } = UpdateCust.parse({
    customer_id: formData.get('id'),
    name: formData.get('name'),
    address: formData.get('address'),
    email: formData.get('email'),
    image_url: fileName,
    phone_number: formData.get('')
  });

<<<<<<< HEAD
=======
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

>>>>>>> origin/DanielChristianJap
  await sql`
    UPDATE customers
    SET name = $ {customer_id}, ${name}, address = ${address}, email = ${email}, image_url = ${image_url}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}
<<<<<<< HEAD



export async function deleteCustomer(id: string): Promise<{ message: string }> {
  try {
    await sql`DELETE FROM customers WHERE id = ${id}`;
    revalidatePath('/dashboard/customers');
    return { message: 'Deleted customer.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Customer.' };
  }
}
=======
>>>>>>> origin/DanielChristianJap

export async function createMenu(formData: FormData) {
  const img = formData.get('image');
  console.log(img);

  

  const { name, category, price} = CreateMenu.parse({
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

  const { name, category, price} = UpdateMenu.parse({
    name: formData.get('name'),
    category: formData.get('category'),
    price: formData.get('price'),
    image_url: fileName || null,  // Ensure image_url is null if fileName is an empty string
  });

<<<<<<< HEAD
  
=======
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
      message: 'Database Error: Failed to Create Customer.',
    };
  }

  revalidatePath('/dashboard/menu');
  redirect('/dashboard/menu');

  return { message: 'Menu baru berhasil ditambahkan.' };
}

export async function updateMenu(id: string, formData: FormData): Promise<{ message: string }> {
  const validatedFields = UpdateMenu.safeParse({
    name: formData.get('name'),
    category: formData.get('description'),
    price: parseFloat(formData.get('price') as string), // Ensure price is a number
  });

  if (!validatedFields.success) {
    return { message: 'Validation Error: Invalid input data.' };
  }

  const { name, category, price } = validatedFields.data!;

  try {
>>>>>>> origin/DanielChristianJap
    await sql`
      UPDATE menu
      SET name = ${name}, category = ${category}, price = ${price}
      WHERE id = ${id}
    `;
  
  revalidatePath('/dashboard/menu');
<<<<<<< HEAD
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
=======
}
>>>>>>> origin/DanielChristianJap
