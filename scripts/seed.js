const { db } = require('@vercel/postgres');
const {
  invoices,
  customers,
  users,
  menu,
  reservations,
  revenue,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');


async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role VARCHAR(50) NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password, role)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.role})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedInvoices(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "invoices" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      price INT NOT NULL,
      tax VARCHAR(225) NOT NULL,
      status VARCHAR(255) NOT NULL,
      payment_methods VARCHAR(225) NOT NULL,
      invoice_date DATE NOT NULL
    );
    `;

    console.log(`Created "invoices" table`);

    // Insert data into the "invoices" table
    const insertedInvoices = await Promise.all(
      invoices.map(
        (invoice) => client.sql`
        INSERT INTO invoices (customer_id, price, tax, status, payment_methods, invoice_date)
        VALUES (${invoice.customer_id}, ${invoice.price}, ${invoice.tax}, ${invoice.status}, ${invoice.payment_methods}, ${invoice.invoice_date})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      createTable,
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}


async function seedCustomers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "customers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        email VARCHAR(225) NOT NULL,
        phone_number INT NOT NULL
      );
    `;

    console.log(`Created "customers" table`);

    // Insert data into the "customers" table
    const insertedCustomers = await Promise.all(
      customers.map(
        (customer) => client.sql`
        INSERT INTO customers (id, name, address, image_url, email, phone_number)
        VALUES (${customer.id}, ${customer.name}, ${customer.address}, ${customer.image_url}, ${customer.email}, ${customer.phone_number})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      createTable,
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}


async function seedMenu(client) {
  try {
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS menu (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(225) NOT NULL,
        price INT NOT NULL
      );
    `;

    console.log(`Created "menu" table`);

    const insertedMenu = await Promise.all(
      menu.map(
        (item) => client.sql`
        INSERT INTO menu (name, category, price)
        VALUES (${item.name}, ${item.category}, ${item.price})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedMenu.length} menu items`);

    return {
      createTable,
      menu: insertedMenu,
    };
  } catch (error) {
    console.error('Error seeding menu:', error);
    throw error;
  }
}

async function seedRevenue(client) {
  try {
    // Create the "revenue" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `;

    console.log(`Created "revenue" table`);

    // Insert data into the "revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function seedReservations(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS reservations (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      address VARCHAR(255) NOT NULL,
      special_request VARCHAR(255) NOT NULL,
      reservation_date DATE NOT NULL,
      email VARCHAR(225) NOT NULL
    );
    `;

    console.log(`Created "reservations" table`);

    const insertedReservations = await Promise.all(
      reservations.map(
        (reservation) => client.sql`
        INSERT INTO reservations (customer_id, address, special_request, reservation_date, email)
       VALUES (${reservation.customer_id}, ${reservation.address}, ${reservation.special_request}, ${reservation.reservation_date}, ${reservation.email})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedReservations.length} reservations`);

    return {
      createTable,
      reservations: insertedReservations,
    };
  } catch (error) {
    console.error('Error seeding reservations:', error);
    throw error;
  }
}

async function seedRevenue(client) {
  try {
    // Create the "revenue" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `;

    console.log(`Created "revenue" table`);

    // Insert data into the "revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}


async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedCustomers(client);
  await seedInvoices(client);
  await seedMenu(client);
  await seedReservations(client);
  await seedRevenue(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});