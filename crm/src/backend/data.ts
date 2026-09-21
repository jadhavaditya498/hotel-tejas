export const menuItems = [
  { name: 'Paneer Tikka', category: 'Starters', description: 'Charred cottage cheese, peppers, and house spices', price: '₹280', tax: '5% GST', tone: 'orange' },
  { name: 'Chicken Biryani', category: 'Main Course', description: 'Fragrant basmati rice, tender chicken, and saffron', price: '₹320', tax: '5% GST', tone: 'gold' },
  { name: 'Masala Dosa', category: 'Main Course', description: 'Crisp dosa with potato masala and coconut chutney', price: '₹190', tax: '5% GST', tone: 'green' },
  { name: 'Berry Mojito', category: 'Mocktails', description: 'Fresh berries, mint, lime, and sparkling water', price: '₹220', tax: '18% GST', tone: 'pink' },
  { name: 'Craft Lager', category: 'Bar', description: 'Cold brewed lager with a clean, crisp finish', price: '₹260', tax: '18% GST', tone: 'amber' },
  { name: 'Gulab Jamun', category: 'Desserts', description: 'Warm milk dumplings with cardamom syrup', price: '₹140', tax: '5% GST', tone: 'purple' },
]

export const bills = [
  { number: 'INV-2026-1048', table: 'Table 08', customer: 'Neha Kapoor', date: '02 Sep, 2026 • 02:14 PM', subtotal: '₹1,180', tax: '₹59', discount: '₹0', total: '₹1,239', paid: '₹1,239', balance: '₹0', status: 'PAID' },
  { number: 'INV-2026-1047', table: 'Table 02', customer: 'Walk-in customer', date: '02 Sep, 2026 • 01:46 PM', subtotal: '₹820', tax: '₹41', discount: '₹0', total: '₹861', paid: '₹500', balance: '₹361', status: 'PARTIALLY_PAID' },
  { number: 'INV-2026-1046', table: 'Table 14', customer: 'Rohan Mehta', date: '02 Sep, 2026 • 01:18 PM', subtotal: '₹2,120', tax: '₹106', discount: '₹100', total: '₹2,126', paid: '₹0', balance: '₹2,126', status: 'UNPAID' },
  { number: 'INV-2026-1045', table: 'Table 05', customer: 'Ananya Rao', date: '02 Sep, 2026 • 12:52 PM', subtotal: '₹1,640', tax: '₹82', discount: '₹50', total: '₹1,672', paid: '₹1,672', balance: '₹0', status: 'PAID' },
  { number: 'INV-2026-1044', table: 'Table 11', customer: 'Walk-in customer', date: '02 Sep, 2026 • 12:30 PM', subtotal: '₹930', tax: '₹47', discount: '₹0', total: '₹977', paid: '₹0', balance: '₹977', status: 'DRAFT' },
]

export const tableData = [
  { id: 'T01', title: 'Table 01', status: 'Occupied', guests: 4, customerName: 'Ananya Rao', customerPhone: '+91 98765 43210', waiter: 'Amit', timer: '42 min', spend: '₹1,280', tone: 'green' },
  { id: 'T02', title: 'Table 02', status: 'Reserved', guests: 2, customerName: 'Walk-in customer', customerPhone: '+91 98204 11872', waiter: 'Rina', timer: 'Starts 7:30 PM', spend: '₹540', tone: 'amber' },
  { id: 'T03', title: 'Table 03', status: 'Available', guests: 0, customerName: '', customerPhone: '', waiter: '–', timer: 'Ready', spend: '₹0', tone: 'blue' },
  { id: 'T04', title: 'Table 04', status: 'Cleaning', guests: 0, customerName: '', customerPhone: '', waiter: 'Housekeeping', timer: '5 min', spend: '₹0', tone: 'rose' },
  { id: 'T05', title: 'Table 05', status: 'Occupied', guests: 6, customerName: 'Rohan Mehta', customerPhone: '+91 99008 22451', waiter: 'Shoaib', timer: '18 min', spend: '₹2,470', tone: 'green' },
  { id: 'T06', title: 'Table 06', status: 'Reserved', guests: 3, customerName: 'Neha Kapoor', customerPhone: '+91 98123 76540', waiter: 'Nisha', timer: 'Starts 8:00 PM', spend: '₹920', tone: 'amber' },
  { id: 'T07', title: 'Table 07', status: 'Available', guests: 0, customerName: '', customerPhone: '', waiter: '–', timer: 'Ready', spend: '₹0', tone: 'blue' },
  { id: 'T08', title: 'Table 08', status: 'Occupied', guests: 5, customerName: 'Neha Kapoor', customerPhone: '+91 98123 76540', waiter: 'Deepak', timer: '31 min', spend: '₹1,860', tone: 'green' },
]

export const orderData = [
  { id: 'ORD-1048', table: 'Table 08', customer: 'Neha Kapoor', time: '02:14 PM', status: 'Preparing', tone: 'amber', items: [{ name: 'Paneer Tikka', quantity: 2, price: '₹560' }, { name: 'Berry Mojito', quantity: 1, price: '₹220' }], total: '₹819' },
  { id: 'ORD-1047', table: 'Table 02', customer: 'Walk-in customer', time: '01:46 PM', status: 'Ready', tone: 'blue', items: [{ name: 'Chicken Biryani', quantity: 2, price: '₹640' }, { name: 'Gulab Jamun', quantity: 1, price: '₹140' }], total: '₹819' },
  { id: 'ORD-1046', table: 'Table 05', customer: 'Rohan Mehta', time: '01:18 PM', status: 'Served', tone: 'green', items: [{ name: 'Masala Dosa', quantity: 3, price: '₹570' }, { name: 'Craft Lager', quantity: 2, price: '₹520' }], total: '₹1,145' },
  { id: 'ORD-1045', table: 'Table 01', customer: 'Ananya Rao', time: '12:52 PM', status: 'New', tone: 'rose', items: [{ name: 'Chicken Biryani', quantity: 1, price: '₹320' }, { name: 'Berry Mojito', quantity: 2, price: '₹440' }], total: '₹798' },
  { id: 'ORD-1044', table: 'Table 11', customer: 'Walk-in customer', time: '12:30 PM', status: 'Cancelled', tone: 'rose', items: [{ name: 'Paneer Tikka', quantity: 1, price: '₹280' }], total: '₹294' },
]
