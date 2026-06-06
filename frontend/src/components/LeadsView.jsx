import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  ArrowRight,
  UserPlus,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Eye,
  Columns
} from 'lucide-react';

const LeadsView = ({ 
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
  stats
}) => {
  const [activeSubTab, setActiveSubTab] = useState('List View'); // List View, Kanban View, Lead Source
  const { total = 0, byStatus = {}, bySource = {} } = stats || {};

  const colorMap = {
    New: 'purple',
    Contacted: 'pink',
    Qualified: 'warning',
    Converted: 'success',
    Lost: 'danger'
  };

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

  // Filter leads for the Kanban columns (we search local copy)
  const getKanbanLeadsByStatus = (statusName) => {
    return leads.filter(l => l.status === statusName);
  };

  // Calculate acquisition channels dynamically from database stats
  const totalSourcesCount = Object.values(bySource).reduce((a, b) => a + b, 0);
  const sourcesData = [
    { name: 'Website Integration', value: bySource.Website || 0 },
    { name: 'Referrals Network', value: bySource.Referral || 0 },
    { name: 'Social Platforms', value: bySource['Social Media'] || 0 },
    { name: 'Email Campaign Blast', value: bySource['Email Campaign'] || 0 },
    { name: 'Other Channels', value: bySource.Others || 0 }
  ].map(s => ({
    ...s,
    pct: totalSourcesCount > 0 ? Math.round((s.value / totalSourcesCount) * 100) : 0
  }));

  return (
    <div>
      {/* Header section */}
      <div className="greeting-row">
        <div className="greeting-text">
          <h2>Leads</h2>
          <p>Manage and track all your leads in one place.</p>
        </div>
        <button className="btn btn-primary" onClick={onAddLead}>
          <Plus size={16} />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* KPI row */}
      <div className="kpi-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="kpi-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="kpi-header">
            <div className="kpi-icon-container purple"><Users size={14} /></div>
            <span className="kpi-title">Total Leads</span>
          </div>
          <span className="kpi-value">{total}</span>
          <span className="kpi-trend up">↑ 18.6% <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>vs last month</span></span>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid var(--pink)' }}>
          <div className="kpi-header">
            <div className="kpi-icon-container pink"><Plus size={14} /></div>
            <span className="kpi-title">New Leads</span>
          </div>
          <span className="kpi-value">{byStatus.New || 0}</span>
          <span className="kpi-trend up">↑ 12.3% <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>vs last month</span></span>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div className="kpi-header">
            <div className="kpi-icon-container warning"><PhoneCallFallback size={14} /></div>
            <span className="kpi-title">Qualified</span>
          </div>
          <span className="kpi-value">{byStatus.Qualified || 0}</span>
          <span className="kpi-trend up">↑ 10.2% <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>vs last month</span></span>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div className="kpi-header">
            <div className="kpi-icon-container success"><CheckCircle size={14} /></div>
            <span className="kpi-title">Converted</span>
          </div>
          <span className="kpi-value">{byStatus.Converted || 0}</span>
          <span className="kpi-trend up">↑ 20.8% <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>vs last month</span></span>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div className="kpi-header">
            <div className="kpi-icon-container danger"><AlertCircle size={14} /></div>
            <span className="kpi-title">Lost</span>
          </div>
          <span className="kpi-value">{byStatus.Lost || 0}</span>
          <span className="kpi-trend down">↓ 6.4% <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>vs last month</span></span>
        </div>
      </div>

      {/* Leads Page Tabs switcher */}
      <div className="view-tabs">
        {['List View', 'Kanban View', 'Lead Source'].map(tab => (
          <button
            key={tab}
            className={`view-tab-btn ${activeSubTab === tab ? 'active' : ''}`}
            onClick={() => setActiveSubTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sub-tab Views Render */}
      {activeSubTab === 'List View' && (
        <div className="leads-table-card">
          <div className="table-header-panel">
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
            
            <div className="table-panel-controls">
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
              </select>
            </div>
          </div>

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
                {leads.map((lead, index) => {
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
                      <td style={{ color: 'var(--text-muted)' }}>
                        {lead.source || 'Website'}
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        {new Date(lead.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td>
                        <button className="table-action-btn" title="View Details" onClick={() => onEditLead(lead)}>
                          <Eye size={12} />
                        </button>
                        <button className="table-action-btn" title="Edit" onClick={() => onEditLead(lead)}>
                          <Edit3 size={12} />
                        </button>
                        <button className="table-action-btn delete" title="Delete" onClick={() => { if (window.confirm('Delete lead?')) onDeleteLead(lead._id); }}>
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer pagination */}
          {totalPages > 1 && (
            <div className="table-footer">
              <span className="footer-info-text">
                Showing <strong>{(currentPage - 1) * 8 + 1}</strong> to <strong>{Math.min(currentPage * 8, totalLeads)}</strong> of <strong>{totalLeads}</strong> leads
              </span>
              <div className="footer-pagination">
                <button className="page-arrow-btn" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
                  <ChevronLeft size={14} />
                </button>
                {getPageNumbers().map(pageNum => (
                  <button key={pageNum} className={`page-number-btn ${currentPage === pageNum ? 'active' : ''}`} onClick={() => onPageChange(pageNum)}>
                    {pageNum}
                  </button>
                ))}
                <button className="page-arrow-btn" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Kanban Board View */}
      {activeSubTab === 'Kanban View' && (
        <div className="kanban-board">
          {['New', 'Contacted', 'Qualified', 'Converted', 'Lost'].map(statusName => {
            const list = getKanbanLeadsByStatus(statusName);
            return (
              <div className="kanban-column" key={statusName}>
                <div className="kanban-column-header">
                  <div className="kanban-column-title">
                    <span className={`kanban-column-dot ${statusName.toLowerCase()}`} />
                    <span>{statusName}</span>
                  </div>
                  <span className="kanban-badge-count">{list.length}</span>
                </div>
                <div className="kanban-cards-wrapper">
                  {list.length > 0 ? (
                    list.map(lead => (
                      <div className="kanban-card" key={lead._id}>
                        <div>
                          <h4 className="kanban-card-title">{lead.name}</h4>
                          <span className="kanban-card-company">{lead.company}</span>
                        </div>
                        <div className="kanban-card-footer">
                          <span className="kanban-card-source">{lead.source || 'Website'}</span>
                          <div className="kanban-card-actions">
                            <button className="kanban-card-btn" onClick={() => onEditLead(lead)}>
                              <Edit3 size={11} />
                            </button>
                            {/* Inline status forward cycle */}
                            <button 
                              className="kanban-card-btn" 
                              title="Move Status"
                              onClick={() => {
                                const statusesCycle = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];
                                const nextIndex = (statusesCycle.indexOf(lead.status) + 1) % statusesCycle.length;
                                onStatusChangeInline(lead._id, statusesCycle[nextIndex]);
                              }}
                            >
                              <ArrowRight size={11} style={{ color: 'var(--primary)' }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.75rem', padding: '2rem 0' }}>
                      No leads here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lead Source Distribution page */}
      {activeSubTab === 'Lead Source' && (
        <div className="leads-table-card" style={{ padding: '2rem' }}>
          <h3 className="panel-title" style={{ marginBottom: '1.5rem' }}>Acquisition Channels</h3>
          <div className="source-list" style={{ maxWidth: '600px' }}>
            {sourcesData.map((source, i) => (
              <div key={i} className="source-item" style={{ marginBottom: '1rem' }}>
                <span className="source-name" style={{ width: '150px' }}>{source.name}</span>
                <div className="source-bar-wrapper">
                  <div className="source-bar-fill" style={{ width: `${source.pct}%` }} />
                </div>
                <span className="source-value">{source.value} leads ({source.pct}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper SVG fallback icon for PhoneCall
const PhoneCallFallback = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export default LeadsView;
