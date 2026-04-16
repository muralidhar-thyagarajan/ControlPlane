// Si2C Control Plane - Interactions
// Global state and event handlers

window.Si2C = {
  activeTab: 'dashboard',
  activeRecord: null,
  detailOpen: false, // Start with Detail Pane hidden
  navRailCollapsed: true, // Start with Nav Rail hidden

  // Facility selector state
  selectedPod: localStorage.getItem('si2c_pod') || 'Hetrogenous LOB',
  selectedFacility: localStorage.getItem('si2c_facility') || 'Lab-Demo',

  // Control pane identifier
  currentControlPane: function() {
    return `${this.selectedPod}__${this.selectedFacility}`;
  },

  // Track active tab per control pane
  controlPaneTabs: {},

  panels: {
    topbar:                         { status: 'complete', cssFile: 'topbar.css' },
    navRail:                        { status: 'scaffold', cssFile: 'nav-rail.css' },
    canvasContainer:                { status: 'complete', cssFile: 'canvas.css' },
    canvasDashboard:                { status: 'complete', cssFile: 'canvas.css', label: 'Dashboard Canvas' },
    canvasDashboardDomainHealth:    { status: 'complete', cssFile: 'canvas.css', label: 'Dashboard - Domain Health Cards' },
    canvasDashboardActiveAnomalies: { status: 'complete', cssFile: 'canvas.css', label: 'Dashboard - Active Anomalies Panel' },
    canvasDashboardAiRecommendations: { status: 'complete', cssFile: 'canvas.css', label: 'Dashboard - AI Recommendations Panel' },
    canvasDashboardActionsFeed:     { status: 'complete', cssFile: 'canvas.css', label: 'Dashboard - Autonomous Actions Feed' },
    canvasIncidents:                { status: 'complete', cssFile: 'canvas.css', label: 'Incidents Canvas' },
    canvasTopology:                 { status: 'complete', cssFile: 'canvas.css', label: 'Topology Canvas' },
    canvasApplications:             { status: 'complete', cssFile: 'canvas.css', label: 'Applications Canvas' },
    canvasAutomation:               { status: 'complete', cssFile: 'canvas.css', label: 'Automation Canvas' },
    canvasActivity:                 { status: 'complete', cssFile: 'canvas.css', label: 'Activity Canvas' },
    canvasSettings:                 { status: 'complete', cssFile: 'canvas.css', label: 'Settings Canvas' },
    detailPane:                     { status: 'complete', cssFile: 'detail-pane.css' }
  },

  // Ask AI functionality - toggles Nav Rail
  showAskAI: function() {
    toggleNavRail();
  }
};

// Initialize collapsed state on page load
document.addEventListener('DOMContentLoaded', function() {
  const appShell = document.getElementById('app-shell');
  if (window.Si2C.navRailCollapsed) {
    appShell.classList.add('nav-rail-collapsed');
  }
});

/* Sentinel-aware tab switching — adds/removes .active per sentinel nav-item pattern */
function setActiveTab(tabId) {
  // Update state
  window.Si2C.activeTab = tabId;

  // Store tab preference for current control pane
  const controlPaneId = window.Si2C.currentControlPane();
  window.Si2C.controlPaneTabs[controlPaneId] = tabId;

  // Remove .active from all tabs
  const allTabs = document.querySelectorAll('.topbar-nav .nav-item');
  allTabs.forEach(tab => {
    tab.classList.remove('active');
  });

  // Add .active to clicked tab
  const activeTab = document.querySelector(`.topbar-nav .nav-item[data-tab="${tabId}"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }

  // Update canvas view - show corresponding canvas panel
  updateCanvasView(tabId);

  console.log(`Tab switched to: ${tabId} (Control Pane: ${controlPaneId})`);
}

/* Update Canvas View - shows the appropriate canvas panel for the active tab */
function updateCanvasView(tabId) {
  // Remove .active from all canvas views
  const allCanvasViews = document.querySelectorAll('.canvas-view');
  allCanvasViews.forEach(view => {
    view.classList.remove('active');
  });

  // Add .active to the corresponding canvas view
  const activeCanvas = document.getElementById(`canvas-${tabId}`);
  if (activeCanvas) {
    activeCanvas.classList.add('active');
    console.log(`Canvas view updated: canvas-${tabId}`);
  } else {
    console.warn(`Canvas view not found: canvas-${tabId}`);
  }
}

/* Toggle Detail Pane — opens or closes based on current state */
function toggleDetailPane() {
  const detailPane = document.getElementById('panel-detail-pane');
  const infoIcon = document.querySelector('.canvas-info-icon');

  window.Si2C.detailOpen = !window.Si2C.detailOpen;

  if (window.Si2C.detailOpen) {
    detailPane.classList.add('open');
    infoIcon.classList.add('active');
    console.log('Detail Pane opened');
  } else {
    detailPane.classList.remove('open');
    infoIcon.classList.remove('active');
    console.log('Detail Pane closed');
  }
}

/* Opens Detail Pane — applies .open class for slide-in animation */
function openDetailPane(recordId, recordType) {
  const detailPane = document.getElementById('panel-detail-pane');
  const infoIcon = document.querySelector('.canvas-info-icon');

  // Update state
  window.Si2C.detailOpen = true;
  window.Si2C.activeRecord = recordId;

  // Add open class
  detailPane.classList.add('open');
  infoIcon.classList.add('active');

  console.log(`Detail Pane opened for ${recordType}: ${recordId}`);

  // Future: load record details based on recordId and recordType
  // updateDetailPaneContent(recordId, recordType);
}

/* Closes Detail Pane — removes .open class for slide-out animation */
function closeDetailPane() {
  const detailPane = document.getElementById('panel-detail-pane');
  const infoIcon = document.querySelector('.canvas-info-icon');

  // Update state
  window.Si2C.detailOpen = false;
  window.Si2C.activeRecord = null;

  // Remove open class
  detailPane.classList.remove('open');
  infoIcon.classList.remove('active');

  console.log('Detail Pane closed');
}

/* Sends prompt text from Prompt Dock to Conversation Stream */
function sendPrompt(text) {
  // To be implemented
}

/* Collapses/expands Nav Rail — toggles Nav Rail visibility with slide animation */
function toggleNavRail() {
  const appShell = document.getElementById('app-shell');

  // Toggle collapsed state
  window.Si2C.navRailCollapsed = !window.Si2C.navRailCollapsed;

  if (window.Si2C.navRailCollapsed) {
    // Collapse: slide Nav Rail out to the left, expand Canvas
    appShell.classList.add('nav-rail-collapsed');
    console.log('Nav Rail collapsed - Canvas expanded');
  } else {
    // Expand: slide Nav Rail in from the left, push Canvas to the right
    appShell.classList.remove('nav-rail-collapsed');
    console.log('Nav Rail expanded - Canvas pushed right');
  }
}

/* Updates manifest status in console for session handoff awareness */
function logPanelStatus() {
  console.table(window.Si2C.panels);
}

/**
 * Open settings dialog/page
 * TODO: Implement settings functionality
 */
function openSettings() {
  console.log('Settings opened');
  alert('Settings functionality coming soon');
}

// ========================================
// FACILITY DATA MAPPING
// ========================================

const FACILITY_OPTIONS = {
  'Hetrogenous LOB': ['Lab-Demo', 'Lab-MacMini'],
  'Semiconductor (DS)': [
    'VA-Greyhound 1',
    'VA-Greyhound 2',
    'VA-Beagle 1',
    'VA-Beagle 2',
    'CA-Dalmatian 1',
    'CA-Dalmatian 2',
    'CA-Retriever 1',
    'CA-Retriever 2',
    'TX-Shepherd 1',
    'TX-Shepherd 2',
    'NY-Terrier 1',
    'NY-Terrier 2'
  ]
};

const CONTROL_PANE_DATA = {
  'Hetrogenous LOB__Lab-Demo': 'live',
  // All others: 'coming-soon' (default)
};

// ========================================
// FACILITY SELECTOR FUNCTIONS
// ========================================

/**
 * Initialize facility selector on page load
 * Reads from localStorage and updates display
 */
function initializeFacilitySelector() {
  // Read from localStorage (if exists)
  const storedPod = localStorage.getItem('si2c_pod');
  const storedFacility = localStorage.getItem('si2c_facility');

  // Update state
  if (storedPod) window.Si2C.selectedPod = storedPod;
  if (storedFacility) window.Si2C.selectedFacility = storedFacility;

  // Update display in Command Bar
  updateFacilityDisplay();

  console.log('Facility selector initialized:', {
    pod: window.Si2C.selectedPod,
    facility: window.Si2C.selectedFacility
  });
}

/**
 * Filter facility dropdown based on selected pod
 */
function filterFacilitiesByPod() {
  const podSelect = document.getElementById('pod-select');
  const facilitySelect = document.getElementById('facility-select');

  if (!podSelect || !facilitySelect) return;

  const selectedPod = podSelect.value;
  const facilities = FACILITY_OPTIONS[selectedPod] || [];

  // Clear existing options
  facilitySelect.innerHTML = '';

  // Populate with filtered facilities
  facilities.forEach(facility => {
    const option = document.createElement('option');
    option.value = facility;
    option.textContent = facility;
    facilitySelect.appendChild(option);
  });

  // Select first facility by default
  if (facilities.length > 0) {
    facilitySelect.value = facilities[0];
  }

  console.log('Facilities filtered for pod:', selectedPod, '→', facilities);
}

/**
 * Open facility selector dialog
 */
function openFacilitySelector() {
  const backdrop = document.getElementById('facility-selector-backdrop');
  const podSelect = document.getElementById('pod-select');
  const facilitySelect = document.getElementById('facility-select');

  // Pre-populate pod dropdown
  if (podSelect) {
    podSelect.value = window.Si2C.selectedPod;
  }

  // Filter facilities based on pod
  filterFacilitiesByPod();

  // Pre-select current facility
  if (facilitySelect) {
    facilitySelect.value = window.Si2C.selectedFacility;
  }

  // Show backdrop and dialog
  if (backdrop) {
    backdrop.classList.add('open');
  }

  // Focus first dropdown
  if (podSelect) {
    setTimeout(() => podSelect.focus(), 100);
  }

  console.log('Facility selector opened');
}

/**
 * Close facility selector dialog without saving changes
 */
function closeFacilitySelector() {
  const backdrop = document.getElementById('facility-selector-backdrop');

  if (backdrop) {
    backdrop.classList.remove('open');
  }

  console.log('Facility selector closed');
}

/**
 * Update facility selection and trigger dashboard reload
 */
function updateFacilitySelection() {
  const podSelect = document.getElementById('pod-select');
  const facilitySelect = document.getElementById('facility-select');

  if (!podSelect || !facilitySelect) {
    console.error('Dropdown elements not found');
    return;
  }

  // STEP A: Capture selected values
  const newPod = podSelect.value;
  const newFacility = facilitySelect.value;

  console.log('Updating facility selection:', { newPod, newFacility });

  // STEP B: Update state
  window.Si2C.selectedPod = newPod;
  window.Si2C.selectedFacility = newFacility;

  // STEP C: Persist to localStorage
  localStorage.setItem('si2c_pod', newPod);
  localStorage.setItem('si2c_facility', newFacility);

  // STEP D: Close dialog
  closeFacilitySelector();

  // STEP E: Show loading overlay
  showLoadingOverlay();

  // STEP F: After 5 seconds, hide loading and update
  setTimeout(() => {
    hideLoadingOverlay();
    updateFacilityDisplay();
    reloadDashboardData();
  }, 5000);
}

/**
 * Show loading overlay with spinner
 */
function showLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.add('open');
  }
  console.log('Loading overlay shown');
}

/**
 * Hide loading overlay
 */
function hideLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.remove('open');
  }
  console.log('Loading overlay hidden');
}

/**
 * Update facility display in Command Bar
 */
function updateFacilityDisplay() {
  const podDisplay = document.getElementById('selected-pod');
  const facilityDisplay = document.getElementById('selected-facility');

  if (podDisplay) {
    podDisplay.textContent = window.Si2C.selectedPod;
  }

  if (facilityDisplay) {
    facilityDisplay.textContent = window.Si2C.selectedFacility;
  }

  console.log('Facility display updated in Command Bar');
}

/**
 * Reload dashboard data for new facility
 * Implements control pane switching
 */
function reloadDashboardData() {
  console.log('Reloading control pane for:', window.Si2C.selectedPod, '/', window.Si2C.selectedFacility);

  const controlPaneId = window.Si2C.currentControlPane();

  // Always switch to Dashboard tab when loading new control pane
  window.Si2C.activeTab = 'dashboard';
  setActiveTab('dashboard');

  // Load content based on control pane
  if (CONTROL_PANE_DATA[controlPaneId] === 'live') {
    loadLiveDashboard();
  } else {
    loadComingSoonDashboard();
  }

  console.log('Control pane switched to:', controlPaneId);
}

/**
 * Load live dashboard for Hetrogenous LOB / Lab-Demo
 */
function loadLiveDashboard() {
  const dashboardCanvas = document.getElementById('canvas-dashboard');
  if (!dashboardCanvas) return;

  // Restore full dashboard structure (if it was cleared)
  const contentArea = dashboardCanvas.querySelector('.canvas-content');
  if (contentArea && !contentArea.querySelector('.dashboard-grid')) {
    // Re-create dashboard structure
    contentArea.innerHTML = `
      <div class="dashboard-grid">
        <!-- SECTION: Domain Health Cards -->
        <div id="canvas-dashboard-domain-health" class="domain-cards-section" data-section="domain-health">
          <div class="section-header">
            <span class="section-title">Infrastructure</span>
          </div>
          <div class="domain-cards-grid" id="infrastructure-cards"></div>
          <div class="section-header mt-md">
            <span class="section-title">Operations & Security</span>
          </div>
          <div class="domain-cards-grid" id="ops-security-cards"></div>
        </div>

        <!-- SECTION: Active Anomalies + AI Recommendations -->
        <div class="middle-section">
          <div id="canvas-dashboard-active-anomalies" class="panel" data-section="active-anomalies">
            <div class="panel-header">
              <div class="panel-title">
                Active Anomalies
                <span class="panel-badge" id="anomaly-count">5</span>
              </div>
              <button class="btn btn-ghost btn-sm">View All</button>
            </div>
            <div class="panel-content" id="anomalies-list"></div>
          </div>

          <div id="canvas-dashboard-ai-recommendations" class="panel" data-section="ai-recommendations">
            <div class="panel-header">
              <div class="panel-title">
                <span style="color: var(--color-ai);">AI</span> Recommendations
                <span class="panel-badge" style="background-color: var(--color-ai);">1</span>
              </div>
            </div>
            <div class="panel-content" id="recommendations-list"></div>
          </div>
        </div>

        <!-- SECTION: Autonomous Actions Feed -->
        <div id="canvas-dashboard-actions-feed" class="actions-feed-section" data-section="actions-feed">
          <div class="panel-header">
            <div class="panel-title">Recent Autonomous Actions</div>
            <span class="text-muted" style="font-size: 0.75rem;">47 actions today</span>
          </div>
          <div class="actions-feed-content" id="actions-feed"></div>
        </div>
      </div>
    `;
  }

  // Render the data
  renderDomainCards();
  renderAnomalies();
  renderRecommendations();
  renderActionsFeed();

  console.log('Live dashboard loaded');
}

/**
 * Load coming soon placeholder for all other combinations
 */
function loadComingSoonDashboard() {
  const dashboardCanvas = document.getElementById('canvas-dashboard');
  if (!dashboardCanvas) return;

  // Clear existing content, show coming soon
  const contentArea = dashboardCanvas.querySelector('.canvas-content');
  if (contentArea) {
    contentArea.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: var(--spacing-xxl);">
        <div style="text-align: center; color: var(--color-text-muted);">
          <div style="font-size: 3rem; margin-bottom: var(--spacing-md);">🚧</div>
          <div style="font-family: var(--font-ui); font-size: 1.25rem; margin-bottom: var(--spacing-sm); color: var(--color-text-secondary);">
            Coming Soon
          </div>
          <div style="font-size: 0.875rem;">
            Dashboard for this facility is under development
          </div>
        </div>
      </div>
    `;
  }

  console.log('Coming soon dashboard loaded');
}

// ========================================
// DASHBOARD DATA & RENDERING
// ========================================

/* Mock data for dashboard */
const domainData = [
  // Infrastructure
  { domain: 'Cooling', icon: '🌡️', category: 'Infrastructure', status: 'Degraded', score: 87, alerts: 1, criticalAlerts: 1, trend: 'Declining', metric: '78% capacity' },
  { domain: 'Compute', icon: '🖥️', category: 'Infrastructure', status: 'Degraded', score: 92, alerts: 0, criticalAlerts: 0, trend: 'Stable', metric: '3,847/3,872 GPUs' },
  { domain: 'Network', icon: '🌐', category: 'Infrastructure', status: 'Healthy', score: 99, alerts: 0, criticalAlerts: 0, trend: 'Stable', metric: '1.2 µs latency' },
  { domain: 'Storage', icon: '💾', category: 'Infrastructure', status: 'Healthy', score: 98, alerts: 0, criticalAlerts: 0, trend: 'Stable', metric: '2.4M IOPS' },
  // Operations & Security
  { domain: 'Power', icon: '⚡', category: 'Operations', status: 'Healthy', score: 96, alerts: 0, criticalAlerts: 0, trend: 'Stable', metric: '42.3 MW load' },
  { domain: 'RAN', icon: '📡', category: 'Operations', status: 'Healthy', score: 94, alerts: 1, criticalAlerts: 0, trend: 'Stable', metric: '847/850 cells' },
  { domain: 'Net Security', icon: '🛡️', category: 'Security', status: 'Degraded', score: 88, alerts: 2, criticalAlerts: 0, trend: 'Declining', metric: '1,247 blocked' },
  { domain: 'Physical Sec', icon: '🚪', category: 'Security', status: 'Healthy', score: 99, alerts: 0, criticalAlerts: 0, trend: 'Stable', metric: '156/156 cameras' }
];

const anomaliesData = [
  {
    id: 'ALT-2024-03847',
    severity: 'Critical',
    title: 'CDU-12 flow rate degradation',
    domain: 'Cooling',
    object: 'CDU-12',
    countdown: '3:47',
    hasCountdown: true,
    metrics: 'Flow Rate: 83% (threshold: 85%)',
    trend: '↓ 1.2%/min for 8 min',
    impact: '5 racks • 127 GPUs • 1 training job',
    hasAI: true
  },
  {
    id: 'ALT-2024-03851',
    severity: 'Medium',
    title: 'Unusual outbound traffic pattern',
    domain: 'Network Security',
    object: 'FW-Core-02',
    hasCountdown: false,
    metrics: 'Anomaly Score: 78% (threshold: 60%)',
    trend: '↑ 5%/min',
    impact: 'Core firewall • potential exfiltration',
    hasAI: true
  },
  {
    id: 'ALT-2024-03852',
    severity: 'Medium',
    title: 'IDS signature match: port scan',
    domain: 'Network Security',
    object: 'IDS-Zone-B',
    hasCountdown: false,
    metrics: 'Signature: Recon/PortScan-TCP',
    impact: 'Network Zone B • reconnaissance',
    hasAI: false
  },
  {
    id: 'ALT-2024-03842',
    severity: 'Medium',
    title: 'Rack-21 inlet temp elevated',
    domain: 'Cooling',
    object: 'Rack-21',
    hasCountdown: false,
    metrics: 'Inlet: 27°C (threshold: 25°C)',
    impact: '1 rack • 32 GPUs',
    hasAI: false,
    assigned: 'Sarah Chen'
  },
  {
    id: 'ALT-2024-03849',
    severity: 'Low',
    title: 'RU-247 signal degradation',
    domain: 'RAN',
    object: 'RU-247',
    hasCountdown: false,
    metrics: 'Signal: -82 dBm (threshold: -75)',
    impact: '1 radio unit • ~200 UEs',
    hasAI: false,
    assigned: 'Mike Rodriguez'
  }
];

const actionsData = [
  { id: 'ACT-2024-08472', type: 'workload', icon: '📤', title: 'Inference workload shed from INF-03', time: '2 min ago', outcome: 'Success', policy: 'Capacity Constraint Response v2.1', isNew: true },
  { id: 'ACT-2024-08471', type: 'cooling', icon: '🌡️', title: 'Cooling output increased CL-7', time: '15 min ago', outcome: 'Success', policy: 'Thermal Response v1.2', isNew: false },
  { id: 'ACT-2024-08470', type: 'traffic', icon: '🔀', title: 'Traffic rerouted from Zone B', time: '1 hour ago', outcome: 'Success', policy: 'Network Optimization v3.0', isNew: false },
  { id: 'ACT-2024-08469', type: 'checkpoint', icon: '💾', title: 'Checkpoint triggered TJ-2841', time: '2 hours ago', outcome: 'Success', policy: 'Data Protection v1.1', isNew: false }
];

/* Render domain health cards */
function renderDomainCards() {
  const infraContainer = document.getElementById('infrastructure-cards');
  const opsContainer = document.getElementById('ops-security-cards');

  if (!infraContainer || !opsContainer) return;

  const infraDomains = domainData.filter(d => d.category === 'Infrastructure');
  const opsDomains = domainData.filter(d => d.category !== 'Infrastructure');

  infraContainer.innerHTML = infraDomains.map(renderDomainCard).join('');
  opsContainer.innerHTML = opsDomains.map(renderDomainCard).join('');
}

function renderDomainCard(domain) {
  const statusClass = domain.status.toLowerCase();
  const alertClass = domain.criticalAlerts > 0 ? 'has-critical' : (domain.alerts > 0 ? 'has-alerts' : '');
  const trendClass = domain.trend === 'Improving' ? 'improving' : (domain.trend === 'Declining' ? 'declining' : '');
  const trendIcon = domain.trend === 'Improving' ? '↑' : (domain.trend === 'Declining' ? '↓' : '→');

  return `
    <div class="domain-card" onclick="openDomainDetail('${domain.domain}')">
      <div class="domain-card-header">
        <div class="domain-card-title">
          <span class="domain-icon">${domain.icon}</span>
          <span>${domain.domain}</span>
        </div>
        <span class="status-badge ${statusClass}">${domain.status}</span>
      </div>
      <div class="health-score">${domain.score}%</div>
      <div class="health-bar">
        <div class="health-bar-fill ${statusClass}" style="width: ${domain.score}%;"></div>
      </div>
      <div class="domain-card-footer">
        <span class="alert-count ${alertClass}">
          ${domain.alerts > 0 ? `⚠️ ${domain.alerts} alert${domain.alerts > 1 ? 's' : ''}` : '✓ No alerts'}
        </span>
        <span class="trend ${trendClass}">${trendIcon} ${domain.trend}</span>
      </div>
      <div class="key-metric">${domain.metric}</div>
    </div>
  `;
}

/* Render anomaly cards */
function renderAnomalies() {
  const container = document.getElementById('anomalies-list');
  if (!container) return;

  container.innerHTML = anomaliesData.map(renderAnomalyCard).join('');

  const countElement = document.getElementById('anomaly-count');
  if (countElement) {
    countElement.textContent = anomaliesData.length;
  }
}

function renderAnomalyCard(anomaly) {
  const severityClass = anomaly.severity.toLowerCase();
  return `
    <div class="anomaly-card ${severityClass}" onclick="openAnomalyDetail('${anomaly.id}')">
      <div class="anomaly-header">
        <span class="severity-badge ${severityClass}">${anomaly.severity}</span>
        ${anomaly.hasCountdown ? `<span class="countdown">⏱️ ${anomaly.countdown}</span>` : ''}
      </div>
      <div class="anomaly-title">${anomaly.title}</div>
      <div class="anomaly-subtitle">${anomaly.domain} → ${anomaly.object}</div>
      <div class="anomaly-metrics">${anomaly.metrics}</div>
      ${anomaly.trend ? `<div class="anomaly-metrics text-warning">${anomaly.trend}</div>` : ''}
      <div class="anomaly-impact">Impact: ${anomaly.impact}</div>
      ${anomaly.hasAI ? '<div class="ai-indicator">🤖 AI Recommendation Available</div>' : ''}
      ${anomaly.assigned ? `<div class="text-muted" style="font-size: 0.75rem; margin-top: 8px;">Assigned: ${anomaly.assigned}</div>` : ''}
    </div>
  `;
}

/* Render AI recommendations */
function renderRecommendations() {
  const container = document.getElementById('recommendations-list');
  if (!container) return;

  container.innerHTML = `
    <div class="recommendation-card" onclick="openAnomalyDetail('ALT-2024-03847')">
      <div class="recommendation-header">
        <span class="urgency-badge">IMMEDIATE</span>
        <span class="countdown">⏱️ 2:58</span>
      </div>
      <div class="recommendation-title">Respond to CDU-12 flow degradation</div>
      <div class="recommendation-meta">Affects: TJ-2847, Racks 44-48</div>
      <div class="confidence-bar">
        <div class="confidence-track">
          <div class="confidence-fill" style="width: 91%;"></div>
        </div>
        <span class="confidence-label">91%</span>
      </div>
      <div class="action-list">
        <div class="action-item">
          <span class="action-number">1</span>
          <span>Trigger emergency checkpoint</span>
        </div>
        <div class="action-item">
          <span class="action-number">2</span>
          <span>Begin workload migration</span>
        </div>
        <div class="action-item">
          <span class="action-number">3</span>
          <span>Dispatch maintenance ticket</span>
        </div>
      </div>
      <div class="recommendation-buttons">
        <button class="btn btn-primary" onclick="event.stopPropagation(); openAnomalyDetail('ALT-2024-03847')">Review & Approve</button>
        <button class="btn btn-ghost" onclick="event.stopPropagation();">Dismiss</button>
      </div>
    </div>
  `;
}

/* Render autonomous actions feed */
function renderActionsFeed() {
  const container = document.getElementById('actions-feed');
  if (!container) return;

  container.innerHTML = actionsData.map(renderActionEntry).join('');
}

function renderActionEntry(action) {
  return `
    <div class="action-feed-entry ${action.isNew ? 'new' : ''}" onclick="openActionDetail('${action.id}')">
      <div class="action-icon">${action.icon}</div>
      <div class="action-content">
        <div class="action-title">${action.title}</div>
        <div class="action-meta">${action.policy}</div>
      </div>
      <span class="action-outcome success">${action.outcome}</span>
      <span class="action-time">${action.time}</span>
    </div>
  `;
}

/* Open domain detail in Detail Pane */
function openDomainDetail(domainName) {
  const domain = domainData.find(d => d.domain === domainName);
  if (!domain) return;

  // Update Detail Pane content
  const detailPane = document.getElementById('panel-detail-pane');
  const title = detailPane.querySelector('.detail-pane-title');
  const body = detailPane.querySelector('.detail-pane-body');

  title.textContent = `${domain.icon} ${domain.domain} Domain`;

  body.innerHTML = `
    <div class="detail-section">
      <div class="detail-section-title">Domain Health</div>
      <div class="detail-card">
        <div class="metric-row">
          <span class="metric-label">Status</span>
          <span class="metric-value ${domain.status.toLowerCase()}">${domain.status}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Health Score</span>
          <span class="metric-value">${domain.score}%</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Trend</span>
          <span class="metric-value">${domain.trend}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Active Alerts</span>
          <span class="metric-value">${domain.alerts}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Critical Alerts</span>
          <span class="metric-value ${domain.criticalAlerts > 0 ? 'critical' : ''}">${domain.criticalAlerts}</span>
        </div>
      </div>
    </div>
    <div class="detail-section mt-lg">
      <div class="detail-section-title">Key Metrics</div>
      <div class="detail-card">
        <div class="metric-row">
          <span class="metric-label">Primary Metric</span>
          <span class="metric-value">${domain.metric}</span>
        </div>
      </div>
    </div>
  `;

  openDetailPane(domainName, 'domain');
}

/* Open anomaly detail in Detail Pane */
function openAnomalyDetail(anomalyId) {
  const anomaly = anomaliesData.find(a => a.id === anomalyId);
  if (!anomaly) return;

  // Update Detail Pane content
  const detailPane = document.getElementById('panel-detail-pane');
  const title = detailPane.querySelector('.detail-pane-title');
  const body = detailPane.querySelector('.detail-pane-body');

  title.textContent = anomaly.id;

  body.innerHTML = `
    <div class="detail-section">
      <div class="detail-section-title">Anomaly Details</div>
      <div class="detail-card">
        <div class="metric-row">
          <span class="metric-label">Severity</span>
          <span class="severity-badge ${anomaly.severity.toLowerCase()}">${anomaly.severity}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Title</span>
          <span class="metric-value">${anomaly.title}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Domain</span>
          <span class="metric-value">${anomaly.domain}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Object</span>
          <span class="metric-value">${anomaly.object}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Metrics</span>
          <span class="metric-value">${anomaly.metrics}</span>
        </div>
        ${anomaly.trend ? `
        <div class="metric-row">
          <span class="metric-label">Trend</span>
          <span class="metric-value warning">${anomaly.trend}</span>
        </div>` : ''}
      </div>
    </div>
    <div class="detail-section mt-lg">
      <div class="detail-section-title">Impact Analysis</div>
      <div class="detail-card">
        <p class="font-body" style="color: var(--color-text-secondary);">${anomaly.impact}</p>
      </div>
    </div>
    ${anomaly.hasAI ? `
    <div class="detail-section mt-lg">
      <div class="ai-indicator">🤖 AI Recommendation Available</div>
      <p class="font-body" style="color: var(--color-text-muted); font-size: 0.875rem; margin-top: var(--spacing-sm);">
        The AI control plane has analyzed this anomaly and has a recommended response ready for review.
      </p>
    </div>` : ''}
    ${anomaly.assigned ? `
    <div class="detail-section mt-lg">
      <div class="detail-section-title">Assignment</div>
      <div class="detail-card">
        <div class="metric-row">
          <span class="metric-label">Assigned To</span>
          <span class="metric-value">${anomaly.assigned}</span>
        </div>
      </div>
    </div>` : ''}
  `;

  openDetailPane(anomalyId, 'anomaly');
}

/* Open action detail in Detail Pane */
function openActionDetail(actionId) {
  const action = actionsData.find(a => a.id === actionId);
  if (!action) return;

  // Update Detail Pane content
  const detailPane = document.getElementById('panel-detail-pane');
  const title = detailPane.querySelector('.detail-pane-title');
  const body = detailPane.querySelector('.detail-pane-body');

  title.textContent = `${action.icon} ${action.id}`;

  body.innerHTML = `
    <div class="detail-section">
      <div class="detail-section-title">Action Details</div>
      <div class="detail-card">
        <div class="metric-row">
          <span class="metric-label">Type</span>
          <span class="metric-value">${action.type}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Action</span>
          <span class="metric-value">${action.title}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Time</span>
          <span class="metric-value">${action.time}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Outcome</span>
          <span class="metric-value success">${action.outcome}</span>
        </div>
      </div>
    </div>
    <div class="detail-section mt-lg">
      <div class="detail-section-title">Automation Policy</div>
      <div class="detail-card">
        <p class="font-body" style="color: var(--color-text-secondary);">${action.policy}</p>
      </div>
    </div>
    <div class="detail-section mt-lg">
      <div class="ai-indicator">🤖 Executed Autonomously</div>
      <p class="font-body" style="color: var(--color-text-muted); font-size: 0.875rem; margin-top: var(--spacing-sm);">
        This action was executed automatically by the AI control plane based on configured policies and real-time system analysis.
      </p>
    </div>
  `;

  openDetailPane(actionId, 'action');
}

/* Initialize dashboard - called on page load */
function initializeDashboard() {
  // Only initialize if dashboard canvas is present
  if (document.getElementById('canvas-dashboard')) {
    renderDomainCards();
    renderAnomalies();
    renderRecommendations();
    renderActionsFeed();
    console.log('Dashboard initialized with live data');
  }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const appShell = document.getElementById('app-shell');
  if (window.Si2C.navRailCollapsed) {
    appShell.classList.add('nav-rail-collapsed');
  }

  // Initialize dashboard
  initializeDashboard();

  // Initialize facility selector
  initializeFacilitySelector();
});
