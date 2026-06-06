let API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Remove trailing slash if present to prevent double slashes (e.g. //api/leads)
if (API_BASE.endsWith('/')) {
  API_BASE = API_BASE.slice(0, -1);
}

const LEADS_URL = `${API_BASE}/api/leads`;
const TASKS_URL = `${API_BASE}/api/tasks`;
const EVENTS_URL = `${API_BASE}/api/events`;

// Leads APIs
export const getLeads = async (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });

  const response = await fetch(`${LEADS_URL}?${queryParams.toString()}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch leads');
  }
  return response.json();
};

export const getLeadById = async (id) => {
  const response = await fetch(`${LEADS_URL}/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch lead');
  }
  return response.json();
};

export const createLead = async (leadData) => {
  const response = await fetch(`${LEADS_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create lead');
  }
  return response.json();
};

export const updateLead = async (id, leadData) => {
  const response = await fetch(`${LEADS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update lead');
  }
  return response.json();
};

export const deleteLead = async (id) => {
  const response = await fetch(`${LEADS_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete lead');
  }
  return response.json();
};

export const getLeadStats = async () => {
  const response = await fetch(`${LEADS_URL}/stats/summary`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch lead statistics');
  }
  return response.json();
};

// Tasks APIs
export const getTasks = async () => {
  const response = await fetch(TASKS_URL);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch tasks');
  }
  return response.json();
};

export const createTask = async (taskData) => {
  const response = await fetch(TASKS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create task');
  }
  return response.json();
};

export const updateTask = async (id, taskData) => {
  const response = await fetch(`${TASKS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update task');
  }
  return response.json();
};

export const deleteTask = async (id) => {
  const response = await fetch(`${TASKS_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete task');
  }
  return response.json();
};

// Events APIs
export const getEvents = async () => {
  const response = await fetch(EVENTS_URL);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch calendar events');
  }
  return response.json();
};

export const createEvent = async (eventData) => {
  const response = await fetch(EVENTS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create calendar event');
  }
  return response.json();
};

export const deleteEvent = async (id) => {
  const response = await fetch(`${EVENTS_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete calendar event');
  }
  return response.json();
};

const AI_URL = `${API_BASE}/api/ai`;

export const scoreLeadAI = async (leadData) => {
  const response = await fetch(`${AI_URL}/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData)
  });
  if (!response.ok) throw new Error('AI Scoring failed');
  return response.json();
};

export const summarizeLeadAI = async (leadData) => {
  const response = await fetch(`${AI_URL}/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData)
  });
  if (!response.ok) throw new Error('AI Summarization failed');
  return response.json();
};

export const notesLeadAI = async (text) => {
  const response = await fetch(`${AI_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!response.ok) throw new Error('Smart Notes failed');
  return response.json();
};

export const nextActionAI = async (leadData) => {
  const response = await fetch(`${AI_URL}/next-action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData)
  });
  if (!response.ok) throw new Error('AI Next Action failed');
  return response.json();
};

export const chatAI = async (messages, leadsContext) => {
  const response = await fetch(`${AI_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, leadsContext })
  });
  if (!response.ok) throw new Error('AI Chat failed');
  return response.json();
};
