# Prototype Manifest — Si2C Control Panel

## Purpose
Progressive panel-by-panel prototype. Each panel is independently buildable and
updatable without breaking others. This file is the source of truth across Claude Code
sessions. Always read this first at the start of every session.

## Design System
**File:** sentinel-v2.css (never modify)
**Theme:** Dark — deep navy backgrounds, adc6ff brand accent
**Fonts:** Space Grotesk (UI labels), JetBrains Mono (data/metrics), Inter (body)
**Base font size:** 14px
**Border radius:** 4px (--radius-sm only)

| Token | Value | Source |
|---|---|---|
| --color-bg-primary | #0c1324 | sentinel-v2.css |
| --color-bg-secondary | #151b2d | sentinel-v2.css |
| --color-bg-tertiary | #1c253d | sentinel-v2.css |
| --color-brand-primary | #adc6ff | sentinel-v2.css |
| --color-status-success | #00e676 | sentinel-v2.css |
| --color-status-warning | #ffb300 | sentinel-v2.css |
| --color-status-critical | #f44336 | sentinel-v2.css |
| --color-status-info | #00d1ff | sentinel-v2.css |
| --color-text-primary | #ffffff | sentinel-v2.css |
| --color-text-secondary | #dce1fb | sentinel-v2.css |
| --color-text-muted | rgba(220,225,251,0.5) | sentinel-v2.css |
| --gr-step-3 | 4.27vh | tokens.css |
| --gr-step-5 | 6.85vh | tokens.css |
| --gr-step-7 | 17.94vw | tokens.css |
| --gr-step-8 | 29.03vw | tokens.css |
| --gr-canvas | calc(100vw - step7 - step8) | tokens.css |

## Reusable Sentinel Components (already available — use don't recreate)
- `.btn-primary`, `.btn-secondary`, `.btn-ghost` — buttons
- `.nav-item`, `.nav-item.active` — tab/nav items
- `.domain-card`, `.domain-card:hover` — health cards
- `.status-badge.healthy/.degraded/.critical` — status pills
- `.health-bar`, `.health-bar-fill` — progress bars
- `.slide-panel`, `.slide-panel.open` — detail panel slide-in
- `.modal-overlay`, `.modal` — modal dialogs
- `.status-bar`, `.status-dot` — bottom status strip
- `.user-avatar` — profile circle

## Layout
CSS Grid on .app-shell:
  Row 1 — TOPBAR (spans all 3 columns) — height: var(--gr-step-3)
  Row 2 — NAV-RAIL | CANVAS | DETAIL-PANE

## Golden Ratio Proportions
| Dimension | Panel | φ Step | Value |
|---|---|---|---|
| Height | Command Bar | Step 3 | 4.27vh |
| Height | Accelerator Strip | Step 3 | 4.27vh |
| Height | Prompt Dock | Step 5 | 6.85vh |
| Width | Nav Rail | Step 7 | 17.94vw |
| Width | Canvas | computed | ~52vw |
| Width | Detail Pane | Step 8 | 29.03vw |

## Panel Registry
| ID | Panel Name | CSS File | Status |
|---|---|---|---|
| #panel-topbar | Command Bar | topbar.css | **complete** |
| #panel-nav-rail | Nav Rail | nav-rail.css | scaffold |
| #panel-canvas | Canvas Container | canvas.css | **complete** |
| #canvas-dashboard | Dashboard Canvas | canvas.css | **complete** |
| #canvas-dashboard-domain-health | Dashboard - Domain Health Cards | canvas.css | **complete** |
| #canvas-dashboard-active-anomalies | Dashboard - Active Anomalies Panel | canvas.css | **complete** |
| #canvas-dashboard-ai-recommendations | Dashboard - AI Recommendations Panel | canvas.css | **complete** |
| #canvas-dashboard-actions-feed | Dashboard - Autonomous Actions Feed | canvas.css | **complete** |
| #canvas-incidents | Incidents Canvas | canvas.css | complete (coming soon) |
| #canvas-topology | Topology Canvas | canvas.css | complete (coming soon) |
| #canvas-applications | Applications Canvas | canvas.css | complete (coming soon) |
| #canvas-automation | Automation Canvas | canvas.css | complete (coming soon) |
| #canvas-activity | Activity Canvas | canvas.css | complete (coming soon) |
| #canvas-settings | Settings Canvas | canvas.css | complete (coming soon) |
| #panel-detail-pane | Detail Pane | detail-pane.css | **complete** |

## Panel Specs

### Command Bar (#panel-topbar)
- Height: var(--gr-step-3)
- Background: var(--color-bg-secondary)
- Border-bottom: 1px solid var(--color-border-active)
- Layout: flex, space-between, align-items center
- LEFT: Ask AI button — use .btn-primary from sentinel, label "Ask AI", width 120px
- CENTER: Tab nav — use .nav and .nav-item from sentinel
  - Tabs: Dashboard | Incidents | Topology | Applications | Automation & Actions | Activity | Settings
  - Active tab uses .nav-item.active (bg: --color-brand-primary, text: --color-bg-primary)
  - Tab click calls setActiveTab(tabId) and updates canvas view
- RIGHT: user avatar (.user-avatar from sentinel) + name in --font-ui
- Status: scaffold

### Nav Rail (#panel-nav-rail)
- Width: var(--gr-step-7)
- Background: var(--color-bg-secondary)
- Border-right: 1px solid var(--color-border-active)
- Three stacked zones (flex-column):
  1. Accelerator Strip (height: var(--nav-accel-height))
     - BG: var(--color-bg-tertiary)
     - Quick-action shortcut buttons
     - Border-bottom: 1px solid var(--color-border-active)
  2. Conversation Stream (flex: 1)
     - BG: var(--color-bg-primary)
     - AI chat message bubbles + nav link suggestions
     - Nav link suggestions styled with --color-brand-primary
     - Overflow-y: auto
  3. Prompt Dock (height: var(--nav-prompt-height))
     - BG: var(--color-bg-tertiary)
     - Text input field + send button
     - Font: var(--font-data) for input
     - Border-top: 1px solid var(--color-border-active)
- Status: scaffold

### Canvas Container (#panel-canvas)
- Width: Fills available space (1fr in grid)
- Background: var(--color-bg-primary)
- Padding: 0 (each canvas-view handles its own)
- Contains 7 canvas views, one per tab
- Tab switching via setActiveTab(tabId) → updateCanvasView(tabId)
- Info icon (ℹ️) toggles Detail Pane overlay
- Status: **complete**

### Canvas Views (7 total)
Each canvas view inherits from .canvas-view class and has:
- Top Panel: height var(--gr-step-3), displays "Panel for [Tab Name]", 🚧 Coming Soon badge
- Content Area: flex:1, scrollable, receives tab-specific content

#### #canvas-dashboard
- Tab: Dashboard
- Title: "Dashboard"
- Layout: 3-column dashboard grid (.dashboard-grid from sentinel)
- Contains 4 subsections (see below)
- Status: **complete**

##### #canvas-dashboard-domain-health
- Section: Domain Health Cards
- Layout: Two groups (Infrastructure + Operations/Security)
- Components: .domain-card, .domain-cards-grid from sentinel
- Data: 8 domains (Cooling, Compute, Network, Storage, Power, RAN, Net Security, Physical Sec)
- Interaction: Click card → openDomainDetail() → Detail Pane opens with domain metrics
- Status: **complete**

##### #canvas-dashboard-active-anomalies
- Section: Active Anomalies Panel
- Layout: .panel with .panel-header and .panel-content
- Components: .anomaly-card from sentinel
- Data: 5 active anomalies with severity, metrics, trends, impact
- Interaction: Click anomaly → openAnomalyDetail() → Detail Pane opens with anomaly details
- Status: **complete**

##### #canvas-dashboard-ai-recommendations
- Section: AI Recommendations Panel
- Layout: .panel with .panel-header and .panel-content
- Components: .recommendation-card from sentinel
- Data: AI-generated recommendations with confidence scores
- Interaction: Click recommendation → openAnomalyDetail() → Detail Pane opens with details
- Status: **complete**

##### #canvas-dashboard-actions-feed
- Section: Recent Autonomous Actions Feed
- Layout: .actions-feed-section with scrollable feed
- Components: .action-feed-entry from sentinel
- Data: Recent autonomous actions with outcomes and policies
- Interaction: Click action → openActionDetail() → Detail Pane opens with action details
- Status: **complete**

#### #canvas-incidents
- Tab: Incidents
- Title: "Panel for Incidents"
- Future: Tabular list using .incident-card from sentinel
- Status: complete (coming soon)

#### #canvas-topology
- Tab: Topology
- Title: "Panel for Topology"
- Future: Infrastructure topology visualization
- Status: complete (coming soon)

#### #canvas-applications
- Tab: Applications
- Title: "Panel for Applications"
- Future: Tabular list → openDetailPane(recordId, 'app')
- Status: complete (coming soon)

#### #canvas-automation
- Tab: Automation & Actions
- Title: "Panel for Automation & Actions"
- Future: Automation rules and action history
- Status: complete (coming soon)

#### #canvas-activity
- Tab: Activity
- Title: "Panel for Activity"
- Future: Activity feed and audit log
- Status: complete (coming soon)

#### #canvas-settings
- Tab: Settings
- Title: "Panel for Settings"
- Future: Config cards using .config-card from sentinel
- Status: complete (coming soon)

### Detail Pane (#panel-detail-pane)
- Width: var(--gr-step-8)
- Background: var(--color-bg-secondary)
- Border-left: 1px solid var(--color-border-active)
- Uses sentinel .slide-panel pattern for open/close animation
- Header: --color-bg-tertiary bg, record title in --font-ui, close button
- Body: scrollable detail fields, metrics, related records
- Footer: action buttons using sentinel .btn-* classes
- Opens via openDetailPane(recordId, recordType)
- Closes via closeDetailPane()
- Status: scaffold

## Conventions
- All panels use `panel-` id prefix
- No inline styles anywhere — all classes in panel-specific CSS files
- Never hardcode hex values — always use sentinel or tokens CSS custom properties
- Reuse sentinel components before creating new ones
- Interaction state lives in window.Si2C in interactions.js
- Font usage: --font-ui for labels/nav, --font-data for metrics/IDs, --font-body for prose
- Update STATUS in Panel Registry whenever a panel progresses

## Session Handoff Protocol
At the start of every Claude Code session:
1. Read PROTOTYPE_MANIFEST.md completely
2. Run logPanelStatus() in browser console to verify live state
3. Identify the panel in scope for this session
4. Only modify: the panel's CSS file + its div in index.html
5. Do not touch sentinel-v2.css under any circumstances
6. Do not touch CSS or JS owned by panels marked complete
7. Update Panel Registry status before ending the session
