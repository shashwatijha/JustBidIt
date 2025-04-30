import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import '../styles/salesReport.css';

export default function SalesReport() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      const response = await fetch('/admin/generate-sales-report');
      const data = await response.json();
      if (data.status === 'success') {
        setReport(data.report);
      } else {
        alert('Error fetching report: ' + data.message);
      }
    };

    fetchReport();
  }, []);

  if (!report) return <div className="sales-wrapper">Loading report...</div>;

  return (
    <div className="sales-wrapper">
      <h2>Sales Report</h2>

      <div className="sales-kpis">
        <div className="kpi-card">
          <h3>Total Earnings</h3>
          <p>${Number(report.total_earnings).toFixed(2)}</p>
        </div>
      </div>

      <div className="sales-section">
        <h3>Earnings by Brand</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={report.earnings_by_brand}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="brand" />
            <YAxis />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff7e6', border: '1px solid #ffe58f' }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Bar
              dataKey="total"
              fill="#ffd000"        // IKEA yellow
              barSize={40}
              radius={[6, 6, 0, 0]} // rounded top corners
            />
          </BarChart>
        </ResponsiveContainer>
      </div>


      <div className="sales-section">
        <h3>Earnings by Item</h3>
        <table>
          <thead>
            <tr><th>Item</th><th>Earnings</th></tr>
          </thead>
          <tbody>
            {report.earnings_by_item.map((item, idx) => (
              <tr key={idx}>
                <td>{item.item_name}</td>
                <td>${Number(item.earnings).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sales-section">
        <h3>Best-Selling Items</h3>
        <table>
          <thead>
            <tr><th>Item</th><th>Total Bids</th></tr>
          </thead>
          <tbody>
            {report.best_selling_items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.item_name}</td>
                <td>{item.total_bids}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
