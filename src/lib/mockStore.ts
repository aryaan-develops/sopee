import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/data/mock-db.json');

// Ensure directory exists
if (!fs.existsSync(path.dirname(DATA_PATH))) {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
}

// Initial default data
const DEFAULT_DATA = {
  users: [
    { id: '1', email: 'user@gmail.com', name: 'Standard User', role: 'user' },
    { id: '2', email: 'seller@gmail.com', name: 'Premium Seller', role: 'seller' },
    { id: '3', email: 'admin@gmail.com', name: 'Main Admin', role: 'admin' },
  ],
  products: [
    { id: '1', name: 'Wireless Headphones', price: 199, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', sellerId: '2' },
    { id: '2', name: 'Smart Watch', price: 299, category: 'Electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', sellerId: '2' },
    { id: '3', name: 'Leather Backpack', price: 129, category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', sellerId: '2' },
  ],
  orders: [],
  invoices: []
};

function readDb() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
    return DEFAULT_DATA;
  }
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return DEFAULT_DATA;
  }
}

function writeDb(data: any) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export const mockDb = {
  getProducts: () => readDb().products,
  getProduct: (id: string) => readDb().products.find((p: any) => p.id === id),
  getOrders: () => readDb().orders,
  getUserOrders: (userId: string) => readDb().orders.filter((o: any) => o.userId === userId),
  getSellerOrders: (sellerId: string) => readDb().orders.filter((o: any) => o.items.some((i: any) => i.sellerId === sellerId)),
  addOrder: (order: any) => {
    const db = readDb();
    const newOrder = { 
      ...order, 
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    db.orders.push(newOrder);
    
    // Auto-generate invoice
    const newInvoice = {
      id: 'INV-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      orderId: newOrder.id,
      userId: newOrder.userId,
      amount: newOrder.totalAmount,
      date: new Date().toISOString(),
      items: newOrder.items,
      billingTo: newOrder.customerName || 'Standard User',
      status: 'unpaid'
    };
    db.invoices.push(newInvoice);
    
    writeDb(db);
    return newOrder;
  },
  getInvoices: () => readDb().invoices,
  getInvoice: (id: string) => readDb().invoices.find((i: any) => i.id === id),
  getUserInvoices: (userId: string) => readDb().invoices.filter((i: any) => i.userId === userId),
  getSellerInvoices: (sellerId: string) => {
    const db = readDb();
    const sellerOrders = db.orders.filter((o: any) => o.items.some((item: any) => item.sellerId === sellerId));
    const sellerOrderIds = sellerOrders.map((o: any) => o.id);
    return db.invoices.filter((i: any) => sellerOrderIds.includes(i.orderId));
  },
  updateOrderStatus: (orderId: string, status: string) => {
    const db = readDb();
    const order = db.orders.find((o: any) => o.id === orderId);
    if (order) order.status = status;
    writeDb(db);
    return order;
  },
  deleteProduct: (id: string) => {
    const db = readDb();
    db.products = db.products.filter((p: any) => p.id !== id);
    writeDb(db);
  },
  addProduct: (product: any) => {
    const db = readDb();
    const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) };
    db.products.push(newProduct);
    writeDb(db);
    return newProduct;
  },
  getUserByEmail: (email: string) => {
    return readDb().users.find((u: any) => u.email === email);
  },
  addUser: (user: any) => {
    const db = readDb();
    const newUser = { 
      ...user, 
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    writeDb(db);
    return newUser;
  }
};
