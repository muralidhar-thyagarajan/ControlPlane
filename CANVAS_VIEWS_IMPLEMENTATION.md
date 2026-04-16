# Canvas Views Implementation

## Overview
Created 7 separate canvas panels, one for each tab in the Command Bar. Each canvas inherits styles from the main canvas container and displays a "Coming Soon" indicator.

---

## Implementation Summary

### Canvas Views Created (7 Total)

| Canvas ID | Tab Name | Title Display | Status |
|-----------|----------|---------------|--------|
| `#canvas-dashboard` | Dashboard | "Panel for Dashboard" | complete (coming soon) |
| `#canvas-incidents` | Incidents | "Panel for Incidents" | complete (coming soon) |
| `#canvas-topology` | Topology | "Panel for Topology" | complete (coming soon) |
| `#canvas-applications` | Applications | "Panel for Applications" | complete (coming soon) |
| `#canvas-automation` | Automation & Actions | "Panel for Automation & Actions" | complete (coming soon) |
| `#canvas-activity` | Activity | "Panel for Activity" | complete (coming soon) |
| `#canvas-settings` | Settings | "Panel for Settings" | complete (coming soon) |

---

## Visual Structure

### Each Canvas View Contains

```
┌─────────────────────────────────────────────────────┐
│ Panel for [Tab Name]              🚧 Coming Soon    │ ← Canvas Top Panel
├─────────────────────────────────────────────────────┤
│                                                     │
│                                                     │
│              Canvas Content Area                    │
│              (scrollable, empty for now)            │
│                                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Top Panel:**
- Height: `var(--gr-step-3)` (4.27vh - same as Command Bar)
- Background: `var(--color-bg-secondary)` (#151b2d)
- Border bottom: 1px solid `var(--color-border-active)`
- Left: Panel title "Panel for [Tab Name]"
- Right: Coming Soon badge (🚧 icon + "COMING SOON" label)

**Content Area:**
- Flex: 1 (fills remaining height)
- Padding: `var(--spacing-lg)`
- Background: `var(--color-bg-primary)` (#0c1324)
- Overflow-y: auto (scrollable)
- Empty by default (ready for future content)

---

## Tab Switching Behavior

### Default State (Page Load)
- ✓ `#canvas-dashboard` has `.active` class (visible)
- ✓ All other canvas views hidden (`display: none`)
- ✓ Dashboard tab in Command Bar has `.active` class

### Click Tab in Command Bar
1. `setActiveTab(tabId)` called (e.g., `setActiveTab('incidents')`)
2. Command Bar tab visual state updates (`.active` class moves)
3. `updateCanvasView(tabId)` called automatically
4. All canvas views `.active` class removed (all hidden)
5. Corresponding canvas view `.active` class added (becomes visible)
6. Console logs: `"Canvas view updated: canvas-incidents"`

### Example Flow
```
User clicks "Incidents" tab
  ↓
setActiveTab('incidents')
  ↓
updateCanvasView('incidents')
  ↓
Remove .active from #canvas-dashboard
Add .active to #canvas-incidents
  ↓
Canvas switches from Dashboard to Incidents view
```

---

## Files Modified (5 files)

### 1. `styles/canvas.css` (+60 lines)

**Major changes:**
- Modified `#panel-canvas` padding from `var(--spacing-lg)` to `0`
- Added overflow: auto for scrolling

**New classes added:**

#### `.canvas-view`
```css
.canvas-view {
  display: none;           /* Hidden by default */
  width: 100%;
  height: 100%;
  flex-direction: column;
}

.canvas-view.active {
  display: flex;           /* Show when active */
}
```

#### `.canvas-top-panel`
```css
.canvas-top-panel {
  height: var(--gr-step-3);              /* Same as topbar */
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border-active);
  padding: 0 var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-shrink: 0;
}
```

#### `.canvas-panel-title`
```css
.canvas-panel-title {
  font-family: var(--font-ui);           /* Space Grotesk */
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  flex: 1;
}
```

#### `.coming-soon-badge`
```css
.coming-soon-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-active);
  border-radius: var(--radius-sm);
  margin-left: auto;                     /* Push to right */
}
```

#### `.construction-icon`
```css
.construction-icon {
  font-size: 1.25rem;                    /* 🚧 emoji */
}
```

#### `.coming-soon-label`
```css
.coming-soon-label {
  font-family: var(--font-ui);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-status-warning);    /* Orange #ffb300 */
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

#### `.canvas-content`
```css
.canvas-content {
  flex: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
  background-color: var(--color-bg-primary);
}
```

---

### 2. `index-scaffold.html` (Major rewrite of #panel-canvas)

**Before:**
```html
<div id="panel-canvas">
  <button class="canvas-info-icon">ℹ️</button>
  <span>Canvas (canvas.css)</span>
</div>
```

**After:**
```html
<div id="panel-canvas">
  <button class="canvas-info-icon">ℹ️</button>

  <div id="canvas-dashboard" class="canvas-view active">
    <div class="canvas-top-panel">
      <div class="canvas-panel-title">Panel for Dashboard</div>
      <div class="coming-soon-badge">
        <span class="construction-icon">🚧</span>
        <span class="coming-soon-label">Coming Soon</span>
      </div>
    </div>
    <div class="canvas-content"></div>
  </div>

  <!-- 6 more canvas views (incidents, topology, etc.) -->
</div>
```

**Structure per canvas:**
- Outer div: `id="canvas-[tabname]"`, `class="canvas-view"`, `data-canvas="[tabname]"`
- Dashboard has `class="canvas-view active"` (visible on load)
- Others have `class="canvas-view"` (hidden until tab clicked)

---

### 3. `scripts/interactions.js` (+20 lines)

**Modified `setActiveTab()` function:**
```javascript
function setActiveTab(tabId) {
  window.Si2C.activeTab = tabId;

  // Update Command Bar tabs
  const allTabs = document.querySelectorAll('.topbar-nav .nav-item');
  allTabs.forEach(tab => tab.classList.remove('active'));

  const activeTab = document.querySelector(`.topbar-nav .nav-item[data-tab="${tabId}"]`);
  if (activeTab) activeTab.classList.add('active');

  // NEW: Update canvas view
  updateCanvasView(tabId);

  console.log(`Tab switched to: ${tabId}`);
}
```

**NEW function `updateCanvasView()`:**
```javascript
function updateCanvasView(tabId) {
  // Remove .active from all canvas views
  const allCanvasViews = document.querySelectorAll('.canvas-view');
  allCanvasViews.forEach(view => view.classList.remove('active'));

  // Add .active to the corresponding canvas view
  const activeCanvas = document.getElementById(`canvas-${tabId}`);
  if (activeCanvas) {
    activeCanvas.classList.add('active');
    console.log(`Canvas view updated: canvas-${tabId}`);
  } else {
    console.warn(`Canvas view not found: canvas-${tabId}`);
  }
}
```

**Updated panel registry:**
```javascript
window.Si2C = {
  panels: {
    canvasContainer:    { status: 'complete', cssFile: 'canvas.css' },
    canvasDashboard:    { status: 'complete', cssFile: 'canvas.css', label: 'Dashboard Canvas' },
    canvasIncidents:    { status: 'complete', cssFile: 'canvas.css', label: 'Incidents Canvas' },
    canvasTopology:     { status: 'complete', cssFile: 'canvas.css', label: 'Topology Canvas' },
    canvasApplications: { status: 'complete', cssFile: 'canvas.css', label: 'Applications Canvas' },
    canvasAutomation:   { status: 'complete', cssFile: 'canvas.css', label: 'Automation Canvas' },
    canvasActivity:     { status: 'complete', cssFile: 'canvas.css', label: 'Activity Canvas' },
    canvasSettings:     { status: 'complete', cssFile: 'canvas.css', label: 'Settings Canvas' }
  }
}
```

---

### 4. `PROTOTYPE_MANIFEST.md` (Updated Panel Registry)

**Added 8 new entries:**
- `#panel-canvas` → Canvas Container (complete)
- `#canvas-dashboard` → Dashboard Canvas (complete - coming soon)
- `#canvas-incidents` → Incidents Canvas (complete - coming soon)
- `#canvas-topology` → Topology Canvas (complete - coming soon)
- `#canvas-applications` → Applications Canvas (complete - coming soon)
- `#canvas-automation` → Automation Canvas (complete - coming soon)
- `#canvas-activity` → Activity Canvas (complete - coming soon)
- `#canvas-settings` → Settings Canvas (complete - coming soon)

**Expanded Canvas section** with detailed specs for each canvas view including:
- Tab association
- Title display
- Future content plans
- Current status

---

### 5. `scaffold-test.html` (Updated to match index-scaffold.html)

Same 7 canvas views structure as `index-scaffold.html` for consistent testing.

---

## Design Tokens Used (100% Sentinel Compliance)

### Colors
- `--color-bg-primary` (#0c1324) - Canvas content background
- `--color-bg-secondary` (#151b2d) - Top panel background
- `--color-bg-tertiary` (#1c253d) - Coming soon badge background
- `--color-border-active` (#2e3447) - Borders
- `--color-text-primary` (#ffffff) - Panel titles
- `--color-status-warning` (#ffb300) - "Coming Soon" label (orange)

### Spacing
- `var(--spacing-xs)` (4px) - Badge padding vertical
- `var(--spacing-sm)` (8px) - Badge icon gap
- `var(--spacing-md)` (16px) - Badge padding horizontal, top panel gap
- `var(--spacing-lg)` (24px) - Top panel padding, content padding
- `var(--spacing-xl)` (32px) - (available for future use)

### Typography
- `var(--font-ui)` (Space Grotesk) - Panel titles, "Coming Soon" label
- `var(--font-body)` (Inter) - (available for future content)
- `var(--font-data)` (JetBrains Mono) - (available for future metrics)

### Layout
- `var(--gr-step-3)` (4.27vh) - Top panel height (matches Command Bar)
- `var(--radius-sm)` (4px) - Border radius for badge

### Other
- No new tokens created ✓
- No hardcoded hex values ✓
- All styles use Sentinel design system ✓

---

## Integration Points

### Adding Content to a Canvas View

**Example: Adding dashboard content**

1. **Locate the canvas view in HTML:**
```html
<div id="canvas-dashboard" class="canvas-view active">
  <div class="canvas-top-panel">...</div>
  <div class="canvas-content">
    <!-- ADD CONTENT HERE -->
  </div>
</div>
```

2. **Add content structure:**
```html
<div class="canvas-content">
  <div class="domain-cards-grid">
    <div class="domain-card">...</div>
    <div class="domain-card">...</div>
  </div>
</div>
```

3. **Use Sentinel components:**
- `.domain-card` for health cards
- `.incident-card` for incidents list
- `.config-card` for settings
- All available in `sentinel-v2.css`

### Programmatic Tab Switching

```javascript
// Switch to any tab
setActiveTab('incidents');
setActiveTab('topology');
setActiveTab('settings');

// Check current tab
console.log(window.Si2C.activeTab);
// Returns: 'dashboard', 'incidents', etc.

// Get active canvas element
const activeCanvas = document.querySelector('.canvas-view.active');
console.log(activeCanvas.id);
// Returns: 'canvas-dashboard', 'canvas-incidents', etc.
```

### Removing "Coming Soon" Badge

When a canvas view is ready with real content:

1. **Remove badge from HTML:**
```html
<!-- BEFORE -->
<div class="canvas-top-panel">
  <div class="canvas-panel-title">Panel for Dashboard</div>
  <div class="coming-soon-badge">...</div>  <!-- REMOVE THIS -->
</div>

<!-- AFTER -->
<div class="canvas-top-panel">
  <div class="canvas-panel-title">Dashboard</div>
  <!-- Badge removed, content ready -->
</div>
```

2. **Update panel title** (remove "Panel for" prefix if desired)

3. **Add real content** to `.canvas-content` div

---

## Testing Checklist

### Visual Tests
- [x] Page loads with Dashboard canvas visible
- [x] Dashboard shows "Panel for Dashboard" + 🚧 Coming Soon
- [x] Other 6 canvas views hidden on load
- [x] Click "Incidents" tab → Incidents canvas appears
- [x] Dashboard canvas disappears when switching tabs
- [x] Each canvas has top panel same height as Command Bar
- [x] Each canvas displays correct title
- [x] Coming Soon badge visible on all 7 canvases
- [x] Coming Soon label is orange (warning color)
- [x] Construction icon (🚧) displays correctly
- [x] Info icon (ℹ️) remains visible across all tab switches
- [x] Detail Pane toggle still works on all canvases

### Tab Switching Tests
```javascript
// Test each tab
setActiveTab('dashboard');     // Dashboard canvas shows
setActiveTab('incidents');     // Incidents canvas shows
setActiveTab('topology');      // Topology canvas shows
setActiveTab('applications');  // Applications canvas shows
setActiveTab('automation');    // Automation canvas shows
setActiveTab('activity');      // Activity canvas shows
setActiveTab('settings');      // Settings canvas shows

// Verify only one canvas visible at a time
document.querySelectorAll('.canvas-view.active').length
// Should always return: 1
```

### Console Tests
```javascript
// Check canvas registry
logPanelStatus()
// Should show 8 canvas entries (container + 7 views)

// Check active canvas
window.Si2C.activeTab
// Returns current tab name

// Verify updateCanvasView function exists
typeof updateCanvasView
// Returns: "function"

// Test canvas switching
updateCanvasView('topology')
// Console logs: "Canvas view updated: canvas-topology"
```

### Edge Cases
- [x] Switching between all 7 tabs works smoothly
- [x] No console errors during tab switches
- [x] Info icon remains functional across all canvases
- [x] Detail Pane can open/close on any canvas
- [x] Nav Rail toggle works independently of canvas switching
- [x] Multiple rapid tab clicks handled gracefully

---

## Future Enhancements

### Per-Canvas Features

**Dashboard (#canvas-dashboard):**
- Health cards grid (`.domain-cards-grid`)
- Domain status badges (`.status-badge`)
- Click card → `openDetailPane(recordId, 'health')`

**Incidents (#canvas-incidents):**
- Incident list (`.incident-card`)
- Severity filters
- Click row → `openDetailPane(recordId, 'incident')`

**Topology (#canvas-topology):**
- Infrastructure map visualization
- Interactive rack layout
- Click node → `openDetailPane(recordId, 'topology')`

**Applications (#canvas-applications):**
- Application list
- Health status per app
- Click row → `openDetailPane(recordId, 'app')`

**Automation (#canvas-automation):**
- Automation rules list
- Action history
- Create/edit rule buttons

**Activity (#canvas-activity):**
- Activity feed
- Audit log entries
- Filter by time/user/action

**Settings (#canvas-settings):**
- Configuration cards (`.config-card`)
- System preferences
- User profile settings

### General Enhancements

**Top Panel Extensions:**
- Add action buttons (filters, search, create new)
- Add breadcrumbs for sub-views
- Add view mode toggles (grid vs list)

**Content Area:**
- Loading states (skeleton UI)
- Empty states with helpful messaging
- Pagination or infinite scroll
- Search/filter controls

**Keyboard Navigation:**
- Tab key: cycle through tabs
- Number keys: quick switch (1-7 for each tab)
- Arrow keys: navigate within canvas content

**URL Routing:**
- Sync active tab with URL hash (#/dashboard, #/incidents)
- Browser back/forward navigation
- Deep linking to specific views

---

## Summary

**What was created:**
- 7 separate canvas panels, one per tab
- Consistent top panel structure across all
- Coming Soon indicators for all canvases
- Tab switching mechanism fully functional
- Panel registry updated with all canvases

**What works:**
- Tab clicks update both Command Bar and Canvas
- Only one canvas visible at a time
- Smooth instant switching (no animation delay)
- Info icon and Detail Pane work across all canvases
- Console logging for debugging
- State tracking in `window.Si2C.activeTab`

**What's ready:**
- Structure in place for content addition
- Each canvas has dedicated content area
- All Sentinel components available for use
- Integration points clearly defined

**Files modified:** 5 files (canvas.css, index-scaffold.html, interactions.js, PROTOTYPE_MANIFEST.md, scaffold-test.html)

**Lines added:** ~200 lines (60 CSS, 120 HTML, 20 JavaScript)

All 7 canvas views are **production-ready** for content population! 🎉
