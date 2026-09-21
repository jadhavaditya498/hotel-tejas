import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import { Bell, BookOpen, CalendarDays, Check, ChevronDown, ClipboardList, Copy, CreditCard, Grid2X2, LayoutDashboard, LogOut, Mail, Menu, MessageSquare, PanelLeftClose, PanelLeftOpen, Search, Send, Settings, ShoppingBag, Store, Users, X } from 'lucide-react'
import { bills, menuItems, orderData, tableData } from './backend/data'
import './App.css'

type NavItem = { label: string; to: string; icon: ReactNode }

const navigation: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Tables', to: '/tables', icon: <Grid2X2 size={18} /> },
  { label: 'Orders', to: '/orders', icon: <ClipboardList size={18} /> },
  { label: 'Menu', to: '/menu', icon: <BookOpen size={18} /> },
  { label: 'Categories', to: '/categories', icon: <ShoppingBag size={18} /> },
  { label: 'Billing', to: '/billing', icon: <Store size={18} /> },
  { label: 'Payments', to: '/payments', icon: <CreditCard size={18} /> },
  { label: 'Customers', to: '/customers', icon: <Users size={18} /> },
  { label: 'Reports', to: '/reports', icon: <CalendarDays size={18} /> },
  { label: 'Settings', to: '/settings', icon: <Settings size={18} /> },
]

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/tables': 'Tables',
  '/orders': 'Orders',
  '/menu': 'Menu',
  '/categories': 'Categories',
  '/billing': 'Billing',
  '/payments': 'Payments',
  '/customers': 'Customers',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/users': 'User Management',
}


type Bill = typeof bills[number]
type TableOrder = { item: typeof menuItems[number]; quantity: number }
type RestaurantTable = typeof tableData[number]
type TableHistoryEntry = { id: string; table: string; customerName: string; customerPhone: string; billNumber: string; amount: string; paidAt: string }
type RestaurantData = { tables: RestaurantTable[]; setTables: React.Dispatch<React.SetStateAction<RestaurantTable[]>>; tableHistory: TableHistoryEntry[]; setTableHistory: React.Dispatch<React.SetStateAction<TableHistoryEntry[]>> }
const RestaurantDataContext = createContext<RestaurantData | null>(null)

function getTableTotal(orders: TableOrder[], fallback: string) {
  if (orders.length === 0) return fallback
  const subtotal = orders.reduce((total, order) => total + Number(order.item.price.replace(/[^0-9]/g, '')) * order.quantity, 0)
  return `₹${Math.round(subtotal * 1.05).toLocaleString('en-IN')}`
}

function useRestaurantData() {
  const data = useContext(RestaurantDataContext)
  if (!data) throw new Error('RestaurantDataContext is unavailable')
  return data
}

function Dashboard() {
  const { tables } = useRestaurantData()
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setLastUpdated(new Date()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  const stats = [
    { label: "Today's sales", value: '₹45,850', change: '+12.8%', tone: 'mint' },
    { label: "Today's orders", value: '128', change: '+8.4%', tone: 'blue' },
    { label: 'Open tables', value: String(tables.filter((table) => table.status === 'Occupied').length), change: `of ${tables.length}`, tone: 'amber' },
    { label: 'Paid bills', value: '96', change: '+16 today', tone: 'rose' },
  ]

  return (
    <div className="dashboard-page">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">Wednesday, 02 September 2026</p>
          <h2>Good afternoon, Arjun</h2>
          <p className="muted">Here&apos;s what&apos;s happening at your restaurant today. Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.</p>
        </div>
        <button className="primary-button" type="button"><span>+</span> New order</button>
      </section>

      <section className="stat-grid" aria-label="Today's overview">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <div className={`stat-icon ${stat.tone}`}><span /></div>
            <div>
              <p className="stat-label">{stat.label}</p>
              <strong>{stat.value}</strong>
            </div>
            <span className="stat-change">{stat.change}</span>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="panel sales-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Revenue overview</p>
              <h3>Sales by day</h3>
            </div>
            <button className="select-button" type="button">This week <ChevronDown size={15} /></button>
          </div>

          <div className="chart">
            <div className="chart-y-axis">
              <span>₹20k</span>
              <span>₹15k</span>
              <span>₹10k</span>
              <span>₹5k</span>
              <span>₹0</span>
            </div>
            <div className="chart-area">
              <div className="chart-line" />
              <div className="chart-dots">
                <i /><i /><i /><i /><i /><i /><i />
              </div>
              <div className="chart-days">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>
        </article>

        <article className="panel category-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Product mix</p>
              <h3>Sales by category</h3>
            </div>
            <button className="icon-button" type="button" aria-label="More category options">⋯</button>
          </div>

          <div className="donut-wrap">
            <div className="donut"><strong>₹45.8k</strong><span>Total sales</span></div>
            <div className="legend">
              <span><i className="dot food" />Food <b>54%</b></span>
              <span><i className="dot drinks" />Drinks <b>28%</b></span>
              <span><i className="dot bar" />Bar <b>18%</b></span>
            </div>
          </div>
        </article>
      </section>

      <section className="bottom-grid">
        <article className="panel list-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Table status</p>
              <h3>Live occupancy</h3>
            </div>
            <button className="icon-button" type="button" aria-label="View all tables">View all</button>
          </div>

          {tables.slice(0, 4).map((table) => (
            <div className="order-row" key={table.id}>
              <span className="order-avatar">{table.id}</span>
              <div>
                <strong>{table.title}</strong>
                <small>{table.guests ? `${table.guests} guests` : 'Ready for seating'}</small>
              </div>
              <b>{table.spend}</b>
              <span className={`status ${table.tone}`}>{table.status}</span>
            </div>
          ))}
        </article>

        <article className="panel list-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Popular dishes</p>
              <h3>Top sellers</h3>
            </div>
            <button className="icon-button" type="button" aria-label="More dishes">⋯</button>
          </div>

          {menuItems.slice(0, 4).map((item) => (
            <div className="order-row" key={item.name}>
              <span className="order-avatar menu-icon">{item.name.slice(0, 2).toUpperCase()}</span>
              <div>
                <strong>{item.name}</strong>
                <small>{item.category}</small>
              </div>
              <b>{item.price}</b>
              <span className="status green">{item.tax}</span>
            </div>
          ))}
        </article>
      </section>
    </div>
  )
}

function TableOrderModal({ table, orders, onClose, onOrdersChange, onViewBill }: {
  table: typeof tableData[number]
  orders: TableOrder[]
  onClose: () => void
  onOrdersChange: (orders: TableOrder[]) => void
  onViewBill: (bill: Bill) => void
}) {
  const [selectedItem, setSelectedItem] = useState(menuItems[0].name)
  const subtotal = orders.reduce((total, order) => total + Number(order.item.price.replace(/[^0-9]/g, '')) * order.quantity, 0)
  const tax = subtotal * 0.05
  const total = subtotal + tax

  const addItem = () => {
    const item = menuItems.find((menuItem) => menuItem.name === selectedItem)
    if (!item) return

    const existingOrder = orders.find((order) => order.item.name === item.name)
    if (existingOrder) {
      onOrdersChange(orders.map((order) => order.item.name === item.name ? { ...order, quantity: order.quantity + 1 } : order))
      return
    }
    onOrdersChange([...orders, { item, quantity: 1 }])
  }

  const changeQuantity = (name: string, amount: number) => {
    onOrdersChange(orders
      .map((order) => order.item.name === name ? { ...order, quantity: order.quantity + amount } : order)
      .filter((order) => order.quantity > 0))
  }

  const viewBill = () => {
    onViewBill({
      number: `TABLE-${table.id}-OPEN`,
      table: table.title,
      customer: table.customerName || 'Walk-in customer',
      date: '03 Sep, 2026 • Just now',
      subtotal: `₹${subtotal.toLocaleString('en-IN')}`,
      tax: `₹${tax.toFixed(0)}`,
      discount: '₹0',
      total: `₹${total.toFixed(0)}`,
      paid: '₹0',
      balance: `₹${total.toFixed(0)}`,
      status: 'UNPAID',
    })
  }

  return (
    <div className="modal-backdrop">
      <section className="table-order-modal" role="dialog" aria-modal="true" aria-labelledby="table-order-title">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">{table.status} • {table.guests} guests</p>
            <h2 id="table-order-title">{table.title} order</h2>
          </div>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Close">×</button>
        </div>

        <div className="add-menu-row">
          <select value={selectedItem} onChange={(event) => setSelectedItem(event.target.value)} aria-label="Choose menu item">
            {menuItems.map((item) => <option key={item.name} value={item.name}>{item.name} • {item.price}</option>)}
          </select>
          <button className="primary-button" onClick={addItem} type="button">Add menu option</button>
        </div>

        <div className="table-order-list">
          {orders.length === 0 ? (
            <p className="empty-order">No menu items added yet.</p>
          ) : orders.map((order) => (
            <div className="table-order-row" key={order.item.name}>
              <div>
                <strong>{order.item.name}</strong>
                <small>{order.item.price} each</small>
              </div>
              <div className="quantity-control">
                <button onClick={() => changeQuantity(order.item.name, -1)} type="button" aria-label={`Remove one ${order.item.name}`}>−</button>
                <b>{order.quantity}</b>
                <button onClick={() => changeQuantity(order.item.name, 1)} type="button" aria-label={`Add one ${order.item.name}`}>+</button>
              </div>
              <strong>₹{(Number(order.item.price.replace(/[^0-9]/g, '')) * order.quantity).toLocaleString('en-IN')}</strong>
            </div>
          ))}
        </div>

        <div className="table-total-preview">
          <span>Subtotal <b>₹{subtotal.toLocaleString('en-IN')}</b></span>
          <span>CGST + SGST (5%) <b>₹{tax.toFixed(0)}</b></span>
          <strong>Total bill <b>₹{total.toFixed(0)}</b></strong>
        </div>

        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose} type="button">Close</button>
          <button className="primary-button" onClick={viewBill} type="button">View total bill</button>
        </div>
      </section>
    </div>
  )
}

function TablesPage() {
  const { tables, setTables, tableHistory, setTableHistory } = useRestaurantData()
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [activeTable, setActiveTable] = useState<typeof tableData[number] | null>(null)
  const [updateTable, setUpdateTable] = useState<typeof tableData[number] | null>(null)
  const [showAddTable, setShowAddTable] = useState(false)
  const [tableOrders, setTableOrders] = useState<Record<string, TableOrder[]>>({
    T01: [{ item: menuItems[0], quantity: 2 }, { item: menuItems[2], quantity: 1 }],
    T05: [{ item: menuItems[1], quantity: 3 }],
    T08: [{ item: menuItems[2], quantity: 2 }, { item: menuItems[3], quantity: 1 }],
  })
  const [billTable, setBillTable] = useState<Bill | null>(null)
  const statuses = ['All', 'Occupied', 'Reserved', 'Available', 'Cleaning']

  const filteredTables = selectedStatus === 'All'
    ? tables
    : tables.filter((table) => table.status === selectedStatus)

  const summary = {
    occupied: tables.filter((table) => table.status === 'Occupied').length,
    available: tables.filter((table) => table.status === 'Available').length,
    reserved: tables.filter((table) => table.status === 'Reserved').length,
  }

  const markBillPaid = (bill: Bill) => {
    const table = tables.find((currentTable) => currentTable.title === bill.table)
    if (!table) return

    setTableHistory((current) => [{
      id: `${bill.number}-${Date.now()}`,
      table: table.title,
      customerName: table.customerName || bill.customer,
      customerPhone: table.customerPhone || 'Phone not recorded',
      billNumber: bill.number,
      amount: bill.total,
      paidAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    }, ...current])
    setTables((current) => current.map((currentTable) => currentTable.id === table.id
      ? { ...currentTable, status: 'Available', tone: 'blue', timer: 'Ready', guests: 0, customerName: '', customerPhone: '', waiter: '–', spend: '₹0' }
      : currentTable))
    setTableOrders((current) => ({ ...current, [table.id]: [] }))
    setBillTable(null)
  }

  return (
    <div className="tables-page">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">Dining floor</p>
          <h2>Table dashboard</h2>
          <p className="muted">Track live seating, reservations, and service flow across the restaurant.</p>
        </div>
        <button className="primary-button" onClick={() => setShowAddTable(true)} type="button"><span>+</span> Add table</button>
      </section>

      <section className="table-summary-grid">
        <article className="summary-card green">
          <span>Occupied</span>
          <strong>{summary.occupied}</strong>
          <small>Seats in use</small>
        </article>
        <article className="summary-card blue">
          <span>Available</span>
          <strong>{summary.available}</strong>
          <small>Ready now</small>
        </article>
        <article className="summary-card amber">
          <span>Reserved</span>
          <strong>{summary.reserved}</strong>
          <small>Upcoming</small>
        </article>
      </section>

      <section className="table-toolbar">
        <div className="category-tabs">
          {statuses.map((status) => (
            <button
              key={status}
              className={selectedStatus === status ? 'selected' : ''}
              type="button"
              onClick={() => setSelectedStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
        <label className="billing-search">
          <Search size={15} />
          <input placeholder="Search table or waiter" aria-label="Search table dashboard" />
        </label>
      </section>

      <section className="table-grid">
        {filteredTables.map((table) => (
          <article key={table.id} className="table-card">
            <div className="table-card-top">
              <div>
                <p className="table-tag">{table.id}</p>
                <h3>{table.title}</h3>
              </div>
              <span className={`badge ${table.tone}`}>{table.status}</span>
            </div>

            <div className="table-meta">
              <div>
                <span>Guests</span>
                <strong>{table.guests || 0}</strong>
              </div>
              <div>
                <span>Waiter</span>
                <strong>{table.waiter}</strong>
              </div>
            </div>

            <div className="table-customer-contact">
              <span>Customer</span>
              <strong>{table.customerName || 'No customer assigned'}</strong>
              <small>{table.customerPhone || 'Add name and phone when seated'}</small>
            </div>

            <div className="table-order-summary">
              <span>Menu items</span>
              <strong>{(tableOrders[table.id] || []).reduce((count, order) => count + order.quantity, 0)} items</strong>
              <small>{(tableOrders[table.id] || []).length > 0 ? (tableOrders[table.id] || []).map((order) => order.item.name).join(', ') : 'No items added'}</small>
            </div>

            <div className="table-status-line">
              <span>{table.timer}</span>
              <b>{getTableTotal(tableOrders[table.id] || [], table.spend)}</b>
            </div>

            <div className="table-card-actions">
              <button type="button" className="secondary-button" onClick={() => setActiveTable(table)}>Add menu</button>
              <button type="button" className="primary-button small" onClick={() => setActiveTable(table)}>View bill</button>
            </div>
            <button className="table-update-button" onClick={() => setUpdateTable(table)} type="button">Update table</button>
            <button className="table-delete-button" onClick={() => {
              if (window.confirm(`Delete ${table.title}?`)) setTables((current) => current.filter((currentTable) => currentTable.id !== table.id))
            }} type="button">Delete table</button>
          </article>
        ))}
      </section>

      {activeTable && (
        <TableOrderModal
          table={activeTable}
          orders={tableOrders[activeTable.id] || []}
          onClose={() => setActiveTable(null)}
          onOrdersChange={(orders) => setTableOrders((current) => ({ ...current, [activeTable.id]: orders }))}
          onViewBill={(bill) => {
            setBillTable(bill)
            setActiveTable(null)
          }}
        />
      )}

      {billTable && <ReceiptModal bill={billTable} onClose={() => setBillTable(null)} onMarkPaid={() => markBillPaid(billTable)} />}
      {showAddTable && <AddTableModal onClose={() => setShowAddTable(false)} onAdd={(table) => { setTables((current) => [...current, table]); setShowAddTable(false) }} />}
      {updateTable && <UpdateTableModal table={updateTable} onClose={() => setUpdateTable(null)} onUpdate={(updatedTable) => { setTables((current) => current.map((table) => table.id === updatedTable.id ? updatedTable : table)); setUpdateTable(null) }} />}

      <section className="table-history-panel">
        <div className="billing-table-header"><div><p className="eyebrow">Completed visits</p><h3>Customer table history</h3></div><span>{tableHistory.length} paid visits</span></div>
        {tableHistory.length === 0 ? <p className="table-history-empty">Paid table visits will appear here with the customer details.</p> : <div className="table-history-list">{tableHistory.map((entry) => (
          <div className="table-history-row" key={entry.id}><span className="customer-avatar">{entry.customerName.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><div><strong>{entry.customerName}</strong><small>{entry.customerPhone} • {entry.table} • {entry.billNumber}</small></div><div className="table-history-amount"><b>{entry.amount}</b><small>Paid {entry.paidAt}</small></div></div>
        ))}</div>}
      </section>
    </div>
  )
}

function UpdateTableModal({ table, onClose, onUpdate }: { table: typeof tableData[number]; onClose: () => void; onUpdate: (table: typeof tableData[number]) => void }) {
  const [status, setStatus] = useState(table.status)
  const [guests, setGuests] = useState(String(table.guests))
  const [customerName, setCustomerName] = useState(table.customerName)
  const [customerPhone, setCustomerPhone] = useState(table.customerPhone)
  const [waiter, setWaiter] = useState(table.waiter === '–' ? '' : table.waiter)

  const submit = () => {
    const statusDetails = {
      Occupied: { tone: 'green', timer: 'Just seated' },
      Reserved: { tone: 'amber', timer: 'Upcoming reservation' },
      Available: { tone: 'blue', timer: 'Ready' },
      Cleaning: { tone: 'rose', timer: 'Cleaning' },
    }[status] || { tone: 'blue', timer: 'Ready' }

    onUpdate({ ...table, status, tone: statusDetails.tone, timer: statusDetails.timer, guests: Number(guests) || 0, customerName: customerName.trim(), customerPhone: customerPhone.trim(), waiter: waiter.trim() || '–' })
  }

  return (
    <div className="modal-backdrop">
      <section className="create-bill-modal" role="dialog" aria-modal="true" aria-labelledby="update-table-title">
        <div className="modal-heading">
          <div><p className="eyebrow">Dining floor</p><h2 id="update-table-title">Update {table.title}</h2></div>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Close">×</button>
        </div>
        <div className="bill-form-grid">
          <label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option>Occupied</option><option>Reserved</option><option>Available</option><option>Cleaning</option></select></label>
          <label>Guests<input type="number" min="0" value={guests} onChange={(event) => setGuests(event.target.value)} /></label>
          <label>Customer name<input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Customer name" /></label>
          <label>Customer phone<input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="+91 98765 43210" /></label>
          <label className="full-width-field">Waiter<input value={waiter} onChange={(event) => setWaiter(event.target.value)} placeholder="Assigned waiter" /></label>
        </div>
        <div className="modal-actions"><button className="secondary-button" onClick={onClose} type="button">Cancel</button><button className="primary-button" onClick={submit} type="button">Save update</button></div>
      </section>
    </div>
  )
}

function AddTableModal({ onClose, onAdd }: { onClose: () => void; onAdd: (table: typeof tableData[number]) => void }) {
  const [name, setName] = useState('Table 09')
  const [guests, setGuests] = useState('4')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [waiter, setWaiter] = useState('Unassigned')
  const [error, setError] = useState('')

  const submit = () => {
    const cleanName = name.trim()
    if (!cleanName) {
      setError('Enter a table name to continue.')
      return
    }
    const uniqueId = `T${Date.now().toString().slice(-6)}`
    onAdd({ id: uniqueId, title: cleanName, status: 'Available', guests: Number(guests) || 0, customerName: customerName.trim(), customerPhone: customerPhone.trim(), waiter: waiter.trim() || 'Unassigned', timer: 'Ready', spend: '₹0', tone: 'blue' })
  }

  return (
    <div className="modal-backdrop">
      <section className="create-bill-modal" role="dialog" aria-modal="true" aria-labelledby="add-table-title">
        <div className="modal-heading">
          <div><p className="eyebrow">Dining floor</p><h2 id="add-table-title">Add table</h2></div>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Close">×</button>
        </div>
        <div className="bill-form-grid">
          <label>Table name<input value={name} onChange={(event) => { setName(event.target.value); setError('') }} placeholder="e.g. Table 09" />{error && <small className="form-error">{error}</small>}</label>
          <label>Seats<input type="number" min="1" value={guests} onChange={(event) => setGuests(event.target.value)} /></label>
          <label>Customer name<input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Optional" /></label>
          <label>Customer phone<input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="Optional" /></label>
          <label className="full-width-field">Waiter<input value={waiter} onChange={(event) => setWaiter(event.target.value)} placeholder="Assigned waiter" /></label>
        </div>
        <div className="modal-actions"><button className="secondary-button" onClick={onClose} type="button">Cancel</button><button className="primary-button" onClick={submit} type="button">Add table</button></div>
      </section>
    </div>
  )
}

function MenuPage() {
  const [items, setItems] = useState(menuItems)
  const [activeCategory, setActiveCategory] = useState('All items')
  const [editingItem, setEditingItem] = useState<typeof menuItems[number] | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const categories = ['All items', 'Starters', 'Main Course', 'Desserts', 'Mocktails', 'Bar']
  const visibleItems = activeCategory === 'All items' ? items : items.filter((item) => item.category === activeCategory)

  const saveItem = (item: typeof menuItems[number]) => {
    setItems((current) => editingItem
      ? current.map((currentItem) => currentItem.name === editingItem.name ? item : currentItem)
      : [...current, item])
    setShowEditor(false)
    setEditingItem(null)
  }

  const deleteItem = (item: typeof menuItems[number]) => {
    if (window.confirm(`Delete ${item.name}?`)) {
      setItems((current) => current.filter((currentItem) => currentItem.name !== item.name))
    }
  }

  return (
    <div className="menu-page">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h2>Menu items</h2>
          <p className="muted">Manage dishes, drinks, taxes, and availability from one place.</p>
        </div>
        <button className="primary-button" onClick={() => { setEditingItem(null); setShowEditor(true) }} type="button"><span>+</span> Add menu item</button>
      </section>

      <div className="menu-toolbar">
        <div className="category-tabs">
          {categories.map((category) => (
            <button className={activeCategory === category ? 'selected' : ''} key={category} onClick={() => setActiveCategory(category)} type="button">
              {category}
            </button>
          ))}
        </div>
        <span className="menu-count">{visibleItems.length} items</span>
      </div>

      <section className="menu-grid">
        {visibleItems.map((item) => (
          <article className="menu-card" key={item.name}>
            <div className={`menu-art ${item.tone}`}><span>{item.category === 'Bar' ? 'BAR' : item.category === 'Mocktails' ? 'MIX' : 'CHEF'}</span></div>
            <div className="menu-card-body">
              <div className="menu-card-heading">
                <div>
                  <p className="menu-category">{item.category}</p>
                  <h3>{item.name}</h3>
                </div>
                <div className="menu-actions">
                  <button className="more-button" onClick={() => { setEditingItem(item); setShowEditor(true) }} type="button" aria-label={`Edit ${item.name}`}>Edit</button>
                  <button className="delete-button" onClick={() => deleteItem(item)} type="button" aria-label={`Delete ${item.name}`}>Delete</button>
                </div>
              </div>
              <p className="menu-description">{item.description}</p>
              <div className="menu-card-footer">
                <div>
                  <strong>{item.price}</strong>
                  <small>{item.tax}</small>
                </div>
                <span className="available"><i /> Available</span>
                <button className="add-button" type="button">Add</button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {showEditor && <MenuItemModal item={editingItem} onClose={() => { setShowEditor(false); setEditingItem(null) }} onSave={saveItem} />}
    </div>
  )
}

function MenuItemModal({ item, onClose, onSave }: {
  item: typeof menuItems[number] | null
  onClose: () => void
  onSave: (item: typeof menuItems[number]) => void
}) {
  const [name, setName] = useState(item?.name || '')
  const [category, setCategory] = useState(item?.category || 'Starters')
  const [description, setDescription] = useState(item?.description || '')
  const [price, setPrice] = useState(item?.price.replace(/[^0-9]/g, '') || '')
  const [tax, setTax] = useState(item?.tax || '5% GST')
  const tones = ['orange', 'gold', 'green', 'pink', 'amber', 'purple']

  const submit = () => {
    if (!name.trim() || !price.trim()) return
    onSave({
      name: name.trim(),
      category,
      description: description.trim() || 'Freshly prepared in our kitchen',
      price: `₹${Number(price).toLocaleString('en-IN')}`,
      tax,
      tone: item?.tone || tones[Math.floor(Math.random() * tones.length)],
    })
  }

  return (
    <div className="modal-backdrop">
      <section className="create-bill-modal menu-editor-modal" role="dialog" aria-modal="true" aria-labelledby="menu-editor-title">
        <div className="modal-heading">
          <div><p className="eyebrow">Menu catalogue</p><h2 id="menu-editor-title">{item ? 'Update menu item' : 'Add menu item'}</h2></div>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Close">×</button>
        </div>
        <div className="bill-form-grid">
          <label>Item name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Tandoori Roti" /></label>
          <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option>Starters</option><option>Main Course</option><option>Desserts</option><option>Mocktails</option><option>Bar</option></select></label>
          <label>Price (₹)<input type="number" min="0" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="250" /></label>
          <label>Tax<select value={tax} onChange={(event) => setTax(event.target.value)}><option>0% GST</option><option>5% GST</option><option>18% GST</option></select></label>
          <label className="full-width-field">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the dish" rows={3} /></label>
        </div>
        <div className="modal-actions"><button className="secondary-button" onClick={onClose} type="button">Cancel</button><button className="primary-button" onClick={submit} type="button">{item ? 'Save changes' : 'Add item'}</button></div>
      </section>
    </div>
  )
}

function CreateBillModal({ onClose, onCreate }: { onClose: () => void; onCreate: (bill: typeof bills[number]) => void }) {
  const [table, setTable] = useState('Table 01')
  const [customer, setCustomer] = useState('Walk-in customer')
  const [subtotal, setSubtotal] = useState('1000')
  const [discount, setDiscount] = useState('0')

  const subtotalValue = Math.max(0, Number(subtotal) || 0)
  const discountValue = Math.min(subtotalValue, Math.max(0, Number(discount) || 0))
  const tax = (subtotalValue - discountValue) * 0.05
  const total = subtotalValue - discountValue + tax

  const submit = () => {
    const billNumber = `INV-2026-${1050 + bills.length}`
    onCreate({
      number: billNumber,
      table,
      customer: customer || 'Walk-in customer',
      date: '02 Sep, 2026 • Just now',
      subtotal: `₹${subtotalValue.toLocaleString('en-IN')}`,
      tax: `₹${tax.toFixed(0)}`,
      discount: `₹${discountValue.toFixed(0)}`,
      total: `₹${total.toFixed(0)}`,
      paid: '₹0',
      balance: `₹${total.toFixed(0)}`,
      status: 'UNPAID',
    })
    onClose()
  }

  return (
    <div className="modal-backdrop">
      <section className="create-bill-modal" role="dialog" aria-modal="true" aria-labelledby="create-bill-title">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">Billing desk</p>
            <h2 id="create-bill-title">Create new bill</h2>
          </div>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Close">×</button>
        </div>

        <div className="bill-form-grid">
          <label>
            Table
            <select value={table} onChange={(event) => setTable(event.target.value)}>
              <option>Table 01</option>
              <option>Table 02</option>
              <option>Table 05</option>
              <option>Table 08</option>
              <option>Table 14</option>
            </select>
          </label>
          <label>
            Customer
            <input value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="Customer name" />
          </label>
          <label>
            Subtotal (₹)
            <input type="number" min="0" value={subtotal} onChange={(event) => setSubtotal(event.target.value)} />
          </label>
          <label>
            Discount (₹)
            <input type="number" min="0" max={subtotalValue} value={discount} onChange={(event) => setDiscount(event.target.value)} />
          </label>
        </div>

        <div className="bill-preview">
          <span>Taxable amount <b>₹{(subtotalValue - discountValue).toFixed(0)}</b></span>
          <span>CGST + SGST (5%) <b>₹{tax.toFixed(0)}</b></span>
          <strong>Grand total <b>₹{total.toFixed(0)}</b></strong>
        </div>

        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose} type="button">Cancel</button>
          <button className="primary-button" onClick={submit} type="button">Create bill</button>
        </div>
      </section>
    </div>
  )
}

function ReceiptModal({ bill, onClose, onMarkPaid }: { bill: Bill; onClose: () => void; onMarkPaid?: () => void }) {
  const sendOnWhatsApp = () => {
    const message = [
      'Hotel Tejas',
      `Bill: ${bill.number}`,
      `Table: ${bill.table}`,
      `Customer: ${bill.customer}`,
      `Date: ${bill.date}`,
      `Subtotal: ${bill.subtotal}`,
      `Tax: ${bill.tax}`,
      `Total bill: ${bill.total}`,
      `Balance: ${bill.balance}`,
      'Thank you for visiting!',
    ].join('\n')
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="modal-backdrop">
      <section className="receipt-modal" role="dialog" aria-modal="true" aria-labelledby="receipt-title">
        <div className="modal-heading receipt-toolbar">
          <div>
            <p className="eyebrow">Receipt preview</p>
            <h2 id="receipt-title">{bill.number}</h2>
          </div>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Close">×</button>
        </div>

        <div className="receipt-paper">
          <div className="receipt-brand">
            <span className="brand-mark"><Store size={18} /></span>
            <div>
              <strong>Hotel Tejas</strong>
              <small>42 Garden Road, Bengaluru • +91 98765 43210</small>
              <small>GSTIN: 29AABCT1234F1ZP</small>
            </div>
          </div>

          <div className="receipt-meta">
            <span><small>Bill number</small><b>{bill.number}</b></span>
            <span><small>Date & time</small><b>{bill.date}</b></span>
            <span><small>Table</small><b>{bill.table}</b></span>
            <span><small>Customer</small><b>{bill.customer}</b></span>
          </div>

          <div className="receipt-items">
            <div><span>Item</span><span>Amount</span></div>
            <div><span>Restaurant order</span><b>{bill.subtotal}</b></div>
            <div><span>Discount</span><b>- {bill.discount}</b></div>
            <div><span>CGST + SGST</span><b>{bill.tax}</b></div>
            <strong><span>Grand total</span><b>{bill.total}</b></strong>
          </div>

          <div className="receipt-payment">
            <span>Payment status <b>{bill.status.replace('_', ' ')}</b></span>
            <span>Amount paid <b>{bill.paid}</b></span>
            <span>Balance <b>{bill.balance}</b></span>
          </div>

          <p className="receipt-thanks">Thank you for visiting!</p>
        </div>

        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose} type="button">Close</button>
          <button className="whatsapp-button" onClick={sendOnWhatsApp} type="button">Send on WhatsApp</button>
          {onMarkPaid && bill.status !== 'PAID' && <button className="primary-button" onClick={onMarkPaid} type="button">Mark as paid</button>}
          <button className="primary-button" onClick={() => window.print()} type="button">Print receipt</button>
        </div>
      </section>
    </div>
  )
}

function CustomerPage() {
  const { tableHistory } = useRestaurantData()
  const [search, setSearch] = useState('')
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
  const [sentAction, setSentAction] = useState('')
  const pendingBills = bills.filter((bill) => bill.balance !== '₹0')
  const customers = Array.from(new Set(bills.map((bill) => bill.customer))).map((name) => {
    const customerBills = bills.filter((bill) => bill.customer === name)
    const pending = customerBills.filter((bill) => bill.balance !== '₹0')
    const balance = pending.reduce((total, bill) => total + Number(bill.balance.replace(/[^0-9]/g, '')), 0)
    return { name, bills: customerBills, pending, balance }
  }).filter((customer) => customer.name.toLowerCase().includes(search.toLowerCase()))

  const billMessage = (bill: Bill) => `Hello ${bill.customer}, your pending bill ${bill.number} at Hotel Tejas has a balance of ${bill.balance}. Total bill: ${bill.total}. Thank you.`

  const sendBill = (bill: Bill, channel: 'whatsapp' | 'sms' | 'email') => {
    const message = billMessage(bill)
    if (channel === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    if (channel === 'sms') window.location.href = `sms:?body=${encodeURIComponent(message)}`
    if (channel === 'email') window.location.href = `mailto:?subject=${encodeURIComponent(`Pending bill ${bill.number}`)}&body=${encodeURIComponent(message)}`
    setSentAction(`${bill.number} • ${channel} ready`)
    window.setTimeout(() => setSentAction(''), 3500)
  }

  const copyBill = async (bill: Bill) => {
    await navigator.clipboard.writeText(billMessage(bill))
    setSentAction(`${bill.number} • message copied`)
    window.setTimeout(() => setSentAction(''), 3500)
  }

  return (
    <div className="customers-page">
      <section className="welcome-row">
        <div><p className="eyebrow">Customer desk</p><h2>Customers</h2><p className="muted">Keep customer details close and follow up on open balances.</p></div>
        <label className="billing-search customer-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customers" aria-label="Search customers" /></label>
      </section>

      <section className="customer-summary-grid">
        <article><span className="customer-summary-icon">◎</span><div><small>Total customers</small><strong>{customers.length}</strong></div></article>
        <article><span className="customer-summary-icon warning">!</span><div><small>Customers with pending bills</small><strong>{customers.filter((customer) => customer.pending.length > 0).length}</strong></div></article>
        <article><span className="customer-summary-icon amount">₹</span><div><small>Pending balance</small><strong>₹{pendingBills.reduce((total, bill) => total + Number(bill.balance.replace(/[^0-9]/g, '')), 0).toLocaleString('en-IN')}</strong></div></article>
      </section>

      {sentAction && <div className="customer-toast"><Check size={15} /> {sentAction}</div>}

      <section className="customer-layout">
        <article className="customer-list-panel">
          <div className="billing-table-header"><div><p className="eyebrow">Directory</p><h3>Customer list</h3></div><span>{customers.length} customers</span></div>
          <div className="customer-list">{customers.map((customer) => (
            <div className="customer-row" key={customer.name}><span className="customer-avatar">{customer.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><div><strong>{customer.name}</strong><small>{customer.bills.length} bill{customer.bills.length === 1 ? '' : 's'} • {customer.pending.length ? `${customer.pending.length} pending` : 'All settled'}</small></div><b className={customer.balance ? 'pending-amount' : 'settled-amount'}>{customer.balance ? `₹${customer.balance.toLocaleString('en-IN')}` : 'Settled'}</b></div>
          ))}</div>
        </article>

        <article className="pending-bills-panel">
          <div className="billing-table-header"><div><p className="eyebrow">Follow up</p><h3>Pending bills</h3></div><span>{pendingBills.length} open</span></div>
          <div className="pending-bill-list">{pendingBills.map((bill) => (
            <div className="pending-bill" key={bill.number}><div className="pending-bill-heading"><div><strong>{bill.customer}</strong><small>{bill.number} • {bill.date}</small></div><b>{bill.balance}</b></div><div className="pending-bill-actions"><button className="mini-link" onClick={() => setSelectedBill(bill)} type="button">View bill</button><button title="Send on WhatsApp" aria-label={`Send ${bill.number} on WhatsApp`} onClick={() => sendBill(bill, 'whatsapp')} type="button"><Send size={14} /></button><button title="Send by SMS" aria-label={`Send ${bill.number} by SMS`} onClick={() => sendBill(bill, 'sms')} type="button"><MessageSquare size={14} /></button><button title="Send by email" aria-label={`Send ${bill.number} by email`} onClick={() => sendBill(bill, 'email')} type="button"><Mail size={14} /></button><button title="Copy message" aria-label={`Copy ${bill.number} message`} onClick={() => copyBill(bill)} type="button"><Copy size={14} /></button></div></div>
          ))}</div>
        </article>
      </section>

      <section className="table-history-panel customer-history-panel">
        <div className="billing-table-header"><div><p className="eyebrow">Completed visits</p><h3>Customer table history</h3></div><span>{tableHistory.length} paid visits</span></div>
        {tableHistory.length === 0 ? <p className="table-history-empty">Paid table visits will appear here with the customer details.</p> : <div className="table-history-list">{tableHistory.map((entry) => (
          <div className="table-history-row" key={entry.id}><span className="customer-avatar">{entry.customerName.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><div><strong>{entry.customerName}</strong><small>{entry.customerPhone} • {entry.table} • {entry.billNumber}</small></div><div className="table-history-amount"><b>{entry.amount}</b><small>Paid {entry.paidAt}</small></div></div>
        ))}</div>}
      </section>

      {selectedBill && <ReceiptModal bill={selectedBill} onClose={() => setSelectedBill(null)} />}
    </div>
  )
}

function BillingPage() {
  const [billList, setBillList] = useState(bills)
  const [activeStatus, setActiveStatus] = useState('All bills')
  const statuses = ['All bills', 'UNPAID', 'PARTIALLY_PAID', 'PAID', 'DRAFT']
  const [showCreateBill, setShowCreateBill] = useState(false)
  const [printBill, setPrintBill] = useState<typeof bills[number] | null>(null)

  const visibleBills = activeStatus === 'All bills' ? billList : billList.filter((bill) => bill.status === activeStatus)

  return (
    <div className="billing-page">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">Finance desk</p>
          <h2>Billing</h2>
          <p className="muted">Review bills, track outstanding balances, and record payments.</p>
        </div>
        <button className="primary-button" onClick={() => setShowCreateBill(true)} type="button"><span>+</span> Create bill</button>
      </section>

      <section className="billing-stats">
        <article>
          <span className="billing-stat-icon green">₹</span>
          <div><small>Total sales today</small><strong>₹45,850</strong></div>
          <em>+12.8%</em>
        </article>
        <article>
          <span className="billing-stat-icon blue">₹</span>
          <div><small>Paid bills</small><strong>96</strong></div>
          <em>+16 today</em>
        </article>
        <article>
          <span className="billing-stat-icon amber">!</span>
          <div><small>Pending balance</small><strong>₹8,420</strong></div>
          <em className="warning">12 bills</em>
        </article>
      </section>

      <section className="billing-toolbar">
        <div className="category-tabs">
          {statuses.map((status) => (
            <button className={activeStatus === status ? 'selected' : ''} key={status} onClick={() => setActiveStatus(status)} type="button">
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
        <label className="billing-search">
          <Search size={15} />
          <input placeholder="Search bill or customer" aria-label="Search bills" />
        </label>
      </section>

      <section className="billing-table-wrap">
        <div className="billing-table-header">
          <div>
            <p className="eyebrow">Ledger</p>
            <h3>Recent bills</h3>
          </div>
          <span>{visibleBills.length} bills</span>
        </div>

        <div className="billing-table-scroll">
          <table className="billing-table">
            <thead>
              <tr>
                <th>Bill number</th>
                <th>Table</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleBills.map((bill) => (
                <tr key={bill.number}>
                  <td>
                    <strong>{bill.number}</strong>
                    <small>Subtotal {bill.subtotal} • Tax {bill.tax}</small>
                  </td>
                  <td>{bill.table}</td>
                  <td>{bill.customer}</td>
                  <td>{bill.date}</td>
                  <td>
                    <b>{bill.total}</b>
                    <small>Discount {bill.discount}</small>
                  </td>
                  <td>{bill.paid}</td>
                  <td>{bill.balance}</td>
                  <td>
                    <span className={`status-chip ${bill.status.toLowerCase()}`}>{bill.status.replace('_', ' ')}</span>
                  </td>
                  <td>
                    <button className="mini-link" onClick={() => setPrintBill(bill)} type="button">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showCreateBill && (
        <CreateBillModal
          onClose={() => setShowCreateBill(false)}
          onCreate={(newBill) => {
            setBillList((current) => [newBill, ...current])
            setShowCreateBill(false)
          }}
        />
      )}

      {printBill && <ReceiptModal bill={printBill} onClose={() => setPrintBill(null)} />}
    </div>
  )
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="empty-page">
      <span className="empty-icon"><Store size={24} /></span>
      <p className="eyebrow">Workspace ready</p>
      <h2>{title}</h2>
      <p className="muted">This module is ready for the next implementation phase.</p>
    </div>
  )
}

function OrdersPage() {
  const [activeStatus, setActiveStatus] = useState('All orders')
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(orderData[0])
  const statuses = ['All orders', 'New', 'Preparing', 'Ready', 'Served']
  const visibleOrders = orderData.filter((order) => {
    const matchesStatus = activeStatus === 'All orders' || order.status === activeStatus
    const query = search.toLowerCase()
    const matchesSearch = !query || `${order.id} ${order.table} ${order.customer}`.toLowerCase().includes(query)
    return matchesStatus && matchesSearch
  })

  return (
    <div className="orders-page">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">Service desk</p>
          <h2>Orders</h2>
          <p className="muted">Follow every order from the kitchen ticket to the table.</p>
        </div>
        <button className="primary-button" type="button"><span>+</span> New order</button>
      </section>

      <section className="order-stats">
        <article><span className="order-stat-number green">12</span><div><small>Active orders</small><strong>In service</strong></div></article>
        <article><span className="order-stat-number amber">05</span><div><small>Preparing</small><strong>In kitchen</strong></div></article>
        <article><span className="order-stat-number blue">08</span><div><small>Ready to serve</small><strong>Waiting table-side</strong></div></article>
        <article><span className="order-stat-number rose">96</span><div><small>Completed today</small><strong>+16 from yesterday</strong></div></article>
      </section>

      <section className="orders-toolbar">
        <div className="category-tabs">
          {statuses.map((status) => (
            <button className={activeStatus === status ? 'selected' : ''} key={status} onClick={() => setActiveStatus(status)} type="button">
              {status}
            </button>
          ))}
        </div>
        <label className="billing-search">
          <Search size={15} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order, table or customer" aria-label="Search orders" />
        </label>
      </section>

      <section className="orders-layout">
        <div className="order-list-panel">
          <div className="billing-table-header">
            <div><p className="eyebrow">Live queue</p><h3>{visibleOrders.length} orders</h3></div>
            <span>Updated just now</span>
          </div>
          {visibleOrders.map((order) => (
            <button className={`order-card ${selectedOrder.id === order.id ? 'selected' : ''}`} key={order.id} onClick={() => setSelectedOrder(order)} type="button">
              <span className={`order-type-icon ${order.tone}`}>#{order.id.slice(-2)}</span>
              <span className="order-card-copy"><strong>{order.id}</strong><small>{order.table} • {order.customer}</small></span>
              <span className="order-card-time"><b>{order.total}</b><small>{order.time}</small></span>
              <span className={`status ${order.tone}`}>{order.status}</span>
            </button>
          ))}
          {visibleOrders.length === 0 && <p className="empty-order">No orders match your filters.</p>}
        </div>

        <aside className="order-detail-panel">
          <div className="order-detail-heading">
            <div><p className="eyebrow">Order details</p><h3>{selectedOrder.id}</h3></div>
            <span className={`status ${selectedOrder.tone}`}>{selectedOrder.status}</span>
          </div>
          <div className="order-detail-meta"><span><small>Table</small><b>{selectedOrder.table}</b></span><span><small>Customer</small><b>{selectedOrder.customer}</b></span><span><small>Placed at</small><b>{selectedOrder.time}</b></span></div>
          <div className="detail-items">
            {selectedOrder.items.map((item) => <div key={item.name}><span><b>{item.quantity}×</b> {item.name}</span><strong>{item.price}</strong></div>)}
          </div>
          <div className="detail-total"><span>Subtotal</span><b>{selectedOrder.total}</b><span>CGST + SGST included</span></div>
          <div className="modal-actions"><button className="secondary-button" type="button">Print ticket</button><button className="primary-button" type="button">Update status</button></div>
        </aside>
      </section>
    </div>
  )
}

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [tables, setTables] = useState(tableData)
  const [tableHistory, setTableHistory] = useState<TableHistoryEntry[]>([])

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
        <div className="brand">
          <span className="brand-mark"><Store size={19} /></span>
          <span className="brand-name">Hotel Tejas<span>.</span></span>
          <button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={20} /></button>
        </div>

        <p className="nav-label">Workspace</p>
        <nav>
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}>
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <NavLink to="/users"><Users size={18} /><span>User Management</span></NavLink>
          <div className="profile">
            <span className="profile-avatar">AS</span>
            <span className="profile-copy">
              <strong>Arjun Singh</strong>
              <small>Administrator</small>
            </span>
            <ChevronDown size={15} />
          </div>
          <button className="logout" type="button"><LogOut size={17} /><span>Log out</span></button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
          <button className="collapse-toggle" onClick={() => setCollapsed((value) => !value)} aria-label="Toggle sidebar">
            {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
          </button>

          <div className="page-heading">
            <h1>
              <Routes>
                <Route path="/" element="Dashboard" />
                <Route path="/dashboard" element="Dashboard" />
                {Object.entries(routeTitles).map(([path, title]) => (
                  <Route key={path} path={path} element={title} />
                ))}
                <Route path="/orders/:id" element="Order details" />
                <Route path="/billing/:id" element="Bill details" />
                <Route path="/customers/:id" element="Customer details" />
                <Route path="/login" element="Login" />
                <Route path="*" element="Dashboard" />
              </Routes>
            </h1>
            <span className="live-dot" />
            <span className="live-label">Live system</span>
          </div>

          <div className="header-actions">
            <label className="search">
              <Search size={17} />
              <input placeholder="Search menu, bills, tables" aria-label="Search" />
            </label>
            <button className="notification" type="button" aria-label="Notifications">
              <Bell size={18} />
              <i />
            </button>
            <div className="header-user">
              <span className="profile-avatar small">AS</span>
              <span>
                <strong>Arjun Singh</strong>
                <small>Admin</small>
              </span>
              <ChevronDown size={14} />
            </div>
          </div>
        </header>

        <RestaurantDataContext.Provider value={{ tables, setTables, tableHistory, setTableHistory }}>
          <div className="page-content">
            <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/categories" element={<PlaceholderPage title="Categories" />} />
            <Route path="/payments" element={<PlaceholderPage title="Payments" />} />
            <Route path="/customers" element={<CustomerPage />} />
            <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
            <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
            <Route path="/users" element={<PlaceholderPage title="User management" />} />
            <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </RestaurantDataContext.Provider>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App
