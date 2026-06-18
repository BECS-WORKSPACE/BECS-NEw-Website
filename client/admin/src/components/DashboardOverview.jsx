import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Clock, AlertCircle } from 'lucide-react';

const COLORS = {
  Delivered: '#10b981',
  Processing: '#f59e0b',
  Shipped: '#6366f1',
  Cancelled: '#ef4444',
  Returned: '#8b5cf6',
  Pending: '#64748b'
};

const DashboardOverview = ({ stats, orders, setActiveTab, formatPrice }) => {
  if (!stats) return <div style={{ padding: '40px' }}>Loading analytics...</div>;

  // Process data for charts
  const { chartData, statusData, kpis, topProducts } = useMemo(() => {
    // 1. KPIs
    const today = new Date();
    const yesterday = subDays(today, 1);
    
    const todayRevenue = orders
      .filter(o => o.status !== 'Cancelled' && o.status !== 'Returned')
      .filter(o => isWithinInterval(new Date(o.createdAt), { start: startOfDay(today), end: endOfDay(today) }))
      .reduce((sum, o) => sum + o.totalPrice, 0);

    const yesterdayRevenue = orders
      .filter(o => o.status !== 'Cancelled' && o.status !== 'Returned')
      .filter(o => isWithinInterval(new Date(o.createdAt), { start: startOfDay(yesterday), end: endOfDay(yesterday) }))
      .reduce((sum, o) => sum + o.totalPrice, 0);

    const validOrders = orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Returned');
    const aov = validOrders.length ? validOrders.reduce((sum, o) => sum + o.totalPrice, 0) / validOrders.length : 0;
    
    let growth = 0;
    if (yesterdayRevenue > 0) {
      growth = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
    }

    // 2. Revenue Chart Data (Last 7 Days)
    const dailyData = {};
    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      dailyData[format(d, 'MMM dd')] = 0;
    }
    
    validOrders.forEach(o => {
      const dateKey = format(new Date(o.createdAt), 'MMM dd');
      if (dailyData[dateKey] !== undefined) {
        dailyData[dateKey] += o.totalPrice;
      }
    });

    const cData = Object.keys(dailyData).map(k => ({ date: k, revenue: dailyData[k] }));

    // 3. Status Distribution
    const statuses = {};
    orders.forEach(o => {
      statuses[o.status] = (statuses[o.status] || 0) + 1;
    });
    const sData = Object.keys(statuses).map(key => ({ name: key, value: statuses[key] }));

    // 4. Top Selling Products
    const productSales = {};
    orders.forEach(order => {
      if (order.status !== 'Cancelled') {
        (order.items || []).forEach(item => {
          if (!productSales[item.name]) productSales[item.name] = { name: item.name, units: 0, revenue: 0 };
          productSales[item.name].units += item.quantity;
          productSales[item.name].revenue += item.price * item.quantity;
        });
      }
    });
    const tProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    return { 
      chartData: cData, 
      statusData: sData, 
      kpis: { todayRevenue, aov, growth }, 
      topProducts: tProducts 
    };
  }, [orders]);

  return (
    <div className="view-container dashboard-modern">
      <header className="view-header">
        <div>
          <h2 className="view-title">Master Control Panel</h2>
          <p className="view-subtitle">Real-time telemetry and ecosystem analytics.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>
          <span className="live-dot"></span> Live Data
        </div>
      </header>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}><DollarSign size={24} /></div>
          <div>
            <h3>Total Revenue</h3>
            <div className="value">{formatPrice(stats.totalRevenue)}</div>
            <p className="trend-up">All time sales</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f0fdf4', color: '#10b981' }}><ShoppingBag size={24} /></div>
          <div>
            <h3>Today's Revenue</h3>
            <div className="value">{formatPrice(kpis.todayRevenue)}</div>
            <p className={kpis.growth >= 0 ? "trend-up" : "trend-down"}>
              {kpis.growth >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>} 
              {Math.abs(kpis.growth).toFixed(1)}% vs yesterday
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fdf4ff', color: '#d946ef' }}><ShoppingBag size={24} /></div>
          <div>
            <h3>Average Order Value</h3>
            <div className="value">{formatPrice(kpis.aov)}</div>
            <p className="trend-up">Per valid order</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}><Clock size={24} /></div>
          <div>
            <h3>Pending Orders</h3>
            <div className="value">{stats.pendingOrders}</div>
            <p className="trend-up">Requires processing</p>
          </div>
        </div>
      </div>

      <div className="charts-layout">
        {/* Revenue Trend */}
        <div className="card chart-card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <h3>Revenue Trend (Last 7 Days)</h3>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip formatter={(value) => formatPrice(value)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status */}
        <div className="card chart-card">
          <div className="card-header">
            <h3>Order Status Distribution</h3>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS.Pending} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="tables-grid" style={{ marginTop: '30px' }}>
        {/* Top Products */}
        <section className="card">
          <div className="card-header">
            <h3>Top Selling Products</h3>
            <button className="btn-ghost" onClick={() => setActiveTab('products')}>Inventory</button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Product</th><th>Units Sold</th><th>Revenue</th></tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{p.units}</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{formatPrice(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Live Orders */}
        <section className="card">
          <div className="card-header">
            <h3>Recent Live Orders</h3>
            <button className="btn-ghost" onClick={() => setActiveTab('orders')}>Manage Orders</button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Order ID</th><th>Status</th><th>Total</th></tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(order => (
                  <tr key={order._id}>
                    <td style={{ color: 'var(--accent)', fontWeight: 700 }}>{order._id.slice(-6)}</td>
                    <td>
                      <span className={`badge badge-${order.status === 'Delivered' ? 'success' : order.status === 'Processing' ? 'warning' : order.status === 'Cancelled' ? 'danger' : 'primary'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{formatPrice(order.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardOverview;
