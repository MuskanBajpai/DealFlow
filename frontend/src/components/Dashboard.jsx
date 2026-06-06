import React, { useState, useRef } from 'react';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Plus, 
  PhoneCall, 
  Mail, 
  CalendarDays, 
  FileText,
  Search,
  Trash2,
  Edit3,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  Upload,
  BarChart4,
  Eye
} from 'lucide-react';

const Dashboard = ({ 
  leads, 
  totalLeads, 
  currentPage, 
  totalPages, 
  searchQuery, 
  setSearchQuery,
  statusFilter, 
  setStatusFilter,
  sortBy, 
  setSortBy,
  sortOrder, 
  setSortOrder,
  onPageChange, 
  onEditLead, 
  onDeleteLead, 
  onStatusChangeInline,
  onAddLead,
  stats,
  tasks = [],
  onImportCSV,
  onExportCSV,
  adminName
}) => {
  const { total = 0, byStatus = {}, bySource = {}, conversionRate = 0, history = [], activities = [] } = stats || {};

  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onImportCSV) {
      onImportCSV(file);
      e.target.value = '';
    }
  };

  // Helper to generate coordinates for history line graph
  const getLineGraphData = () => {
    const dates = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const match = (history || []).find(h => h._id === dateStr);
      dates.push({
        dateStr,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: match ? match.count : 0
      });
    }
    return dates;
  };

  const linePoints = getLineGraphData();
  const lineCounts = linePoints.map(p => p.count);
  const maxLineCount = Math.max(...lineCounts, 4);
  
  const svgW = 300;
  const svgH = 120;
  const padX = 20;
  const padY = 20;
  
  const points = linePoints.map((p, i) => {
    const x = padX + i * ((svgW - 2 * padX) / 29);
    const y = svgH - padY - (p.count / maxLineCount) * (svgH - 2 * padY);
    return { ...p, x, y };
  });

  const linePathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`;
  }, '');
  
  const areaPathD = points.length > 0
    ? `${linePathD} L ${points[points.length - 1].x},${svgH - 10} L ${points[0].x},${svgH - 10} Z`
    : '';

  // Color mapping
  const colorMap = {
    New: 'purple',
    Contacted: 'pink',
    Qualified: 'warning',
    Converted: 'success',
    Lost: 'danger'
  };

  const sparklines = {
    total: "M0,25 Q15,10 30,22 T60,5 T90,20 L100,20",
    new: "M0,20 Q15,25 30,12 T60,18 T90,8 L100,10",
    contacted: "M0,15 Q15,8 30,20 T60,12 T90,18 L100,15",
    qualified: "M0,22 Q15,15 30,25 T60,10 T90,22 L100,20",
    converted: "M0,12 Q15,22 30,10 T60,20 T90,12 L100,10",
    lost: "M0,25 Q15,18 30,22 T60,15 T90,25 L100,24"
  };

  // Donut chart parameters
  const r = 40;
  const circ = 2 * Math.PI * r; // 251.3

  const statuses = [
    { label: 'New', count: byStatus.New || 0, colorKey: 'purple', pct: total > 0 ? (byStatus.New || 0) / total : 0 },
    { label: 'Contacted', count: byStatus.Contacted || 0, colorKey: 'pink', pct: total > 0 ? (byStatus.Contacted || 0) / total : 0 },
    { label: 'Qualified', count: byStatus.Qualified || 0, colorKey: 'warning', pct: total > 0 ? (byStatus.Qualified || 0) / total : 0 },
    { label: 'Converted', count: byStatus.Converted || 0, colorKey: 'success', pct: total > 0 ? (byStatus.Converted || 0) / total : 0 },
    { label: 'Lost', count: byStatus.Lost || 0, colorKey: 'danger', pct: total > 0 ? (byStatus.Lost || 0) / total : 0 }
  ];

  let accumulatedPercent = 0;
  const donutSlices = statuses.map(st => {
    const strokeDasharray = `${st.pct * circ} ${circ - (st.pct * circ)}`;
    const strokeDashoffset = -accumulatedPercent * circ;
    accumulatedPercent += st.pct;
    return {
      ...st,
      strokeDasharray,
      strokeDashoffset
    };
  });

  // Dynamically calculate sources from database stats
  const totalSourcesCount = Object.values(bySource).reduce((a, b) => a + b, 0);
  const sourcesData = [
    { name: 'Website', value: bySource.Website || 0 },
    { name: 'Referral', value: bySource.Referral || 0 },
    { name: 'Social Media', value: bySource['Social Media'] || 0 },
    { name: 'Email Campaign', value: bySource['Email Campaign'] || 0 },
    { name: 'Others', value: bySource.Others || 0 }
  ].map(s => ({
    ...s,
    pct: totalSourcesCount > 0 ? Math.round((s.value / totalSourcesCount) * 100) : 0
  }));

  // Render chart tooltip date and value
  const todayISO = new Date().toISOString().slice(0, 10);
  const latestHistoryPoint = history.length > 0 ? history[history.length - 1] : { _id: todayISO, count: 0 };
  const tooltipDateLabel = (() => {
    try {
      const d = new Date(latestHistoryPoint._id);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  })();

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const renderSortIndicator = (field) => {
    if (sortBy !== field) return <ArrowUpDown size={10} style={{ opacity: 0.3, marginLeft: '4px' }} />;
    return sortOrder === 'asc' 
      ? <span style={{ color: 'var(--primary)', marginLeft: '4px' }}>▲</span>
      : <span style={{ color: 'var(--primary)', marginLeft: '4px' }}>▼</span>;
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div>
      {/* Greeting Header */}
      <div className="greeting-row">
        <div className="greeting-text">
          <h2>Good Morning, {adminName || 'Jayesh'}</h2>
          <p>Here's what's happening with your leads today.</p>
        </div>
        <button className="btn btn-primary" onClick={onAddLead}>
          <Plus size={16} />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* 6-Column KPI Grid */}
      <div className="kpi-row">
        <div className="kpi-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="kpi-header">
            <div className="kpi-icon-container purple"><Users size={14} /></div>
            <span className="kpi-title">Total Leads</span>
          </div>
          <span className="kpi-value">{total}</span>
          <span className="kpi-trend up">
            <span>↑ 18.6%</span>
            <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>vs last month</span>
          </span>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid var(--pink)' }}>
          <div className="kpi-header">
            <div className="kpi-icon-container pink"><Plus size={14} /></div>
            <span className="kpi-title">New Leads</span>
          </div>
          <span className="kpi-value">{byStatus.New || 0}</span>
          <span className="kpi-trend up">
            <span>↑ 12.3%</span>
            <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>vs last month</span>
          </span>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div className="kpi-header">
            <div className="kpi-icon-container warning"><PhoneCall size={14} /></div>
            <span className="kpi-title">Contacted</span>
          </div>
          <span className="kpi-value">{byStatus.Contacted || 0}</span>
          <span className="kpi-trend up">
            <span>↑ 15.9%</span>
            <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>vs last month</span>
          </span>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div className="kpi-header">
            <div className="kpi-icon-container success"><CheckCircle size={14} /></div>
            <span className="kpi-title">Qualified</span>
          </div>
          <span className="kpi-value">{byStatus.Qualified || 0}</span>
          <span className="kpi-trend up">
            <span>↑ 10.2%</span>
            <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>vs last month</span>
          </span>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="kpi-header">
            <div className="kpi-icon-container purple"><CheckCircle size={14} /></div>
            <span className="kpi-title">Converted</span>
          </div>
          <span className="kpi-value">{byStatus.Converted || 0}</span>
          <span className="kpi-trend up">
            <span>↑ 20.8%</span>
            <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>vs last month</span>
          </span>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div className="kpi-header">
            <div className="kpi-icon-container danger"><AlertCircle size={14} /></div>
            <span className="kpi-title">Lost</span>
          </div>
          <span className="kpi-value">{byStatus.Lost || 0}</span>
          <span className="kpi-trend down">
            <span>↓ 6.4%</span>
            <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>vs last month</span>
          </span>
        </div>
      </div>

      {/* Middle Row (Donut list, dynamic over time, source ratios) */}
      <div className="analytics-row">
        {/* Leads Overview Donut */}
        <div className="card-panel">
          <div className="panel-header">
            <h3 className="panel-title">Leads Overview</h3>
          </div>
          <div className="status-grid-widget" style={{ padding: '0.5rem 0' }}>
            <div className="total-leads-summary" style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{total}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Active CRM Leads</span>
            </div>
            <div className="status-progress-bars" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {statuses.map((st, i) => {
                const percentage = total > 0 ? ((st.count / total) * 100).toFixed(0) : 0;
                return (
                  <div 
                    key={i} 
                    className="status-progress-item"
                    onClick={() => setStatusFilter(st.label === statusFilter ? 'All' : st.label)}
                    style={{ 
                      cursor: 'pointer', 
                      opacity: statusFilter !== 'All' && statusFilter !== st.label ? 0.45 : 1,
                      transition: 'all 0.15s'
                    }}
                  >
                    <div className="status-progress-info" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem', fontWeight: 500 }}>
                      <span className="status-progress-label" style={{ color: 'var(--text-main)' }}>{st.label}</span>
                      <span className="status-progress-val" style={{ color: 'var(--text-muted)' }}>{st.count} ({percentage}%)</span>
                    </div>
                    <div className="status-progress-track" style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        className={`status-progress-fill`} 
                        style={{ 
                          height: '100%',
                          width: `${percentage}%`, 
                          backgroundColor: `var(--${st.colorKey})`,
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Leads Over Time Graph */}
        <div className="card-panel">
          <div className="panel-header">
            <h3 className="panel-title">Leads Over Time</h3>
            <select className="panel-select" defaultValue="30">
              <option value="30">Last 30 days</option>
            </select>
          </div>
          {/* Leads Over Time chart wrapper — extra top margin gives tooltip room */}
          <div style={{ position: 'relative', width: '100%', marginTop: '0.5rem' }}>
            {/* Tooltip shown above the SVG */}
            {hoveredPoint && (
              <div
                style={{
                  position: 'absolute',
                  left: `${(hoveredPoint.x / svgW) * 100}%`,
                  top: '-32px',
                  transform: 'translateX(-50%)',
                  background: '#1E293B',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 20,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
              >
                {hoveredPoint.count} Leads · {hoveredPoint.label}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: '-4px',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderTop: '4px solid #1E293B',
                }} />
              </div>
            )}

            <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" height="120" style={{ display: 'block', overflow: 'visible' }}>
              <line x1="0" y1="20" x2="300" y2="20" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="300" y2="80" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="110" x2="300" y2="110" stroke="#F1F5F9" strokeWidth="1" />

              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {points.map((p, i) => {
                const barWidth = 6;
                const barHeight = Math.max(0, 110 - p.y);
                const isHovered = hoveredPoint && hoveredPoint.dateStr === p.dateStr;
                return (
                  <g key={i}>
                    <rect
                      x={p.x - barWidth / 2}
                      y={p.y}
                      width={barWidth}
                      height={barHeight}
                      fill={isHovered ? "var(--primary)" : "url(#chartGradient)"}
                      stroke="var(--primary)"
                      strokeWidth={isHovered ? "1.5" : "1"}
                      rx="1.5"
                      style={{ transition: 'all 0.1s' }}
                    />
                    {/* Invisible large hit area */}
                    <rect
                      x={p.x - 5}
                      y={10}
                      width={10}
                      height={100}
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredPoint(p)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* X-axis date labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.65rem', color: 'var(--text-light)' }}>
              {linePoints.filter((_, i) => i % 2 === 0 || i === 6).map((p, i) => (
                <span key={i}>{p.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Source list */}
        <div className="card-panel">
          <div className="panel-header">
            <h3 className="panel-title">Lead Source</h3>
          </div>
          <div className="source-list">
            {sourcesData.map((source, i) => (
              <div key={i} className="source-item">
                <span className="source-name">{source.name}</span>
                <div className="source-bar-wrapper">
                  <div className="source-bar-fill" style={{ width: `${source.pct}%` }} />
                </div>
                <span className="source-value">{source.value} ({source.pct}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row Details widgets */}
      <div className="details-row">
        {/* Dynamic Tasks list */}
        <div className="card-panel">
          <div className="panel-header">
            <h3 className="panel-title">Upcoming Tasks</h3>
          </div>
          <div className="task-list">
            {tasks.slice(0, 4).map((task, i) => {
              const icon = task.priority === 'High' ? <PhoneCall size={12} /> : task.priority === 'Medium' ? <FileText size={12} /> : <Mail size={12} />;
              return (
                <div key={task._id || i} className="task-item">
                  <div className="task-icon-col">{icon}</div>
                  <div className="task-text-col">
                    <span className="task-title" style={{ textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>{task.title}</span>
                    <span className="task-date">{task.date} • {task.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Recent Activity Timeline */}
        <div className="card-panel">
          <div className="panel-header">
            <h3 className="panel-title">Recent Activity</h3>
          </div>
          <div className="activity-list">
            {activities.slice(0, 4).map((act, i) => (
              <div key={act._id || i} className="activity-item">
                <span className={`activity-dot-col ${act.color || 'purple'}`} />
                <div className="activity-text-col">
                  <span className="activity-desc">{act.desc}</span>
                  <span className="activity-time">
                    {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Leads Table Card */}
      <div className="leads-table-card">
        <div className="table-header-panel">
          <h3 className="table-title">All Leads</h3>
          <div className="table-panel-controls">
            <div className="table-panel-search-wrapper" style={{ position: 'relative' }}>
              <Search size={14} className="table-panel-search-icon" />
              <input 
                type="text" 
                className="table-panel-search-input"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <button className="btn-filter-icon" onClick={() => setStatusFilter(statusFilter === 'All' ? 'New' : 'All')}>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span>Filter</span>
            </button>

            <select 
              className="table-panel-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>

            <select 
              className="table-panel-select"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
            >
              <option value="createdAt-desc">Sort: Newest</option>
              <option value="createdAt-asc">Sort: Oldest</option>
              <option value="name-asc">Sort: Name (A-Z)</option>
              <option value="company-asc">Sort: Company</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th onClick={() => handleSort('name')}>Lead {renderSortIndicator('name')}</th>
                <th>Email</th>
                <th>Phone</th>
                <th onClick={() => handleSort('company')}>Company {renderSortIndicator('company')}</th>
                <th>Status</th>
                <th>Source</th>
                <th onClick={() => handleSort('createdAt')}>Created Date {renderSortIndicator('createdAt')}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads && leads.length > 0 ? (
                leads.map((lead, index) => {
                  const initial = lead.name ? lead.name.charAt(0).toUpperCase() : 'L';
                  const rowNum = (currentPage - 1) * 8 + index + 1;
                  return (
                    <tr key={lead._id}>
                      <td style={{ color: 'var(--text-muted)' }}>{rowNum}</td>
                      <td>
                        <div className="lead-identity-cell">
                          <div className="lead-table-avatar">{initial}</div>
                          <span className="lead-table-name">{lead.name}</span>
                        </div>
                      </td>
                      <td>{lead.email}</td>
                      <td>{lead.phone}</td>
                      <td>{lead.company}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className={`badge badge-${colorMap[lead.status]}`}>
                            {lead.status}
                          </span>
                          <select 
                            value={lead.status} 
                            onChange={(e) => onStatusChangeInline(lead._id, e.target.value)}
                            className="table-status-select"
                          >
                            <option value="New">Move to New</option>
                            <option value="Contacted">Move to Contacted</option>
                            <option value="Qualified">Move to Qualified</option>
                            <option value="Converted">Move to Converted</option>
                            <option value="Lost">Move to Lost</option>
                          </select>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{lead.source || 'Website'}</td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        {new Date(lead.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td>
                        <button className="table-action-btn" title="View details" onClick={() => onEditLead(lead)}>
                          <Eye size={12} />
                        </button>
                        <button className="table-action-btn" title="Edit record" onClick={() => onEditLead(lead)}>
                          <Edit3 size={12} />
                        </button>
                        <button 
                          className="table-action-btn delete" 
                          title="Delete record"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete lead: ${lead.name}?`)) {
                              onDeleteLead(lead._id);
                            }
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No leads registered matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginated Footer */}
        {totalPages > 1 && (
          <div className="table-footer">
            <span className="footer-info-text">
              Showing <strong>{(currentPage - 1) * 8 + 1}</strong> to <strong>{Math.min(currentPage * 8, totalLeads)}</strong> of <strong>{totalLeads}</strong> leads
            </span>
            
            <div className="footer-pagination">
              <button 
                className="page-arrow-btn"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
              >
                <ChevronLeft size={14} />
              </button>

              {getPageNumbers().map(pageNum => (
                <button
                  key={pageNum}
                  className={`page-number-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

              <button 
                className="page-arrow-btn"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
