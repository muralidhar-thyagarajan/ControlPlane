# Nav Rail Slide Implementation

## Overview
Ask AI button now toggles the Nav Rail with smooth slide-in/slide-out animation, pushing/pulling the Canvas panel accordingly.

---

## Behavior Flow

### Initial State (Page Load)
- ✓ Nav Rail: **HIDDEN** (collapsed, translateX(-100%), opacity: 0)
- ✓ Canvas: **FULL WIDTH** (100vw - Detail Pane width = ~71vw)
- ✓ Ask AI button: Normal state (brand primary #adc6ff)

### Click Ask AI → Expand (Slide In)
- ✓ Nav Rail slides **IN from LEFT to RIGHT**
- ✓ Canvas pushed **TO THE RIGHT** (width reduces to ~52vw)
- ✓ Ask AI button: **Active state** (cyan #00d1ff with glow)
- ✓ Transition: 250ms ease (--transition-normal)

### Click Ask AI → Collapse (Slide Out)
- ✓ Nav Rail slides **OUT from RIGHT to LEFT**
- ✓ Canvas pulled **BACK TO LEFT** (width expands to ~71vw)
- ✓ Ask AI button: Returns to normal state
- ✓ Transition: 250ms ease (--transition-normal)

---

## CSS Grid Behavior

### Expanded State (Nav Rail Visible)
```
┌────────┬──────────────────────────┬─────────────────┐
│  Nav   │  Canvas                  │  Detail Pane    │
│  Rail  │  (main content)          │                 │
│ 17.94vw│  ~52vw                   │  29.03vw        │
└────────┴──────────────────────────┴─────────────────┘
```
**Grid columns:** `var(--gr-step-7) | var(--gr-canvas) | var(--gr-step-8)`
**Values:** `17.94vw | ~52vw | 29.03vw`

### Collapsed State (Nav Rail Hidden)
```
┌──────────────────────────────────────┬─────────────────┐
│  Canvas (expanded)                   │  Detail Pane    │
│  ~71vw                               │  29.03vw        │
└──────────────────────────────────────┴─────────────────┘
```
**Grid columns:** `0 | calc(100vw - var(--gr-step-8)) | var(--gr-step-8)`
**Values:** `0 | ~71vw | 29.03vw`

---

## Files Modified

### 1. `styles/layout.css` (+6 lines)
**Added:**
- Transition on `.app-shell` grid-template-columns
- `.app-shell.nav-rail-collapsed` state with adjusted grid columns

```css
.app-shell {
  transition: grid-template-columns var(--transition-normal);
}

.app-shell.nav-rail-collapsed {
  grid-template-columns: 0 calc(100vw - var(--gr-step-8)) var(--gr-step-8);
}
```

### 2. `styles/nav-rail.css` (+9 lines)
**Added:**
- Transition on opacity and transform
- `.app-shell.nav-rail-collapsed #panel-nav-rail` with slide-out animation

```css
#panel-nav-rail {
  transition: opacity var(--transition-normal), transform var(--transition-normal);
  opacity: 1;
  transform: translateX(0);
}

.app-shell.nav-rail-collapsed #panel-nav-rail {
  opacity: 0;
  transform: translateX(-100%);
  pointer-events: none;
}
```

### 3. `styles/topbar.css` (+7 lines)
**Added:**
- Transition on Ask AI button
- Active state when Nav Rail is expanded

```css
.btn-ask-ai {
  transition: all var(--transition-fast);
}

.app-shell:not(.nav-rail-collapsed) .btn-ask-ai {
  box-shadow: var(--accent-glow);
  background-color: var(--color-status-info);
}
```

### 4. `scripts/interactions.js` (+20 lines)
**Modified:**
- `window.Si2C.navRailCollapsed` initial state: `false` → `true`
- `showAskAI()`: now calls `toggleNavRail()`
- `toggleNavRail()`: **fully implemented** with class toggle logic
- Added `DOMContentLoaded` listener to initialize collapsed state

```javascript
// Initial state
navRailCollapsed: true, // Start with Nav Rail hidden

// Toggle implementation
function toggleNavRail() {
  const appShell = document.getElementById('app-shell');
  window.Si2C.navRailCollapsed = !window.Si2C.navRailCollapsed;

  if (window.Si2C.navRailCollapsed) {
    appShell.classList.add('nav-rail-collapsed');
    console.log('Nav Rail collapsed - Canvas expanded');
  } else {
    appShell.classList.remove('nav-rail-collapsed');
    console.log('Nav Rail expanded - Canvas pushed right');
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
  const appShell = document.getElementById('app-shell');
  if (window.Si2C.navRailCollapsed) {
    appShell.classList.add('nav-rail-collapsed');
  }
});
```

### 5. `scaffold-test.html` (+2 lines)
**Modified:**
- Enhanced console logging to show Nav Rail state

---

## Technical Implementation Details

### CSS Cascade Strategy
1. **Grid-level animation** (layout.css): Controls column widths with smooth transition
2. **Panel-level animation** (nav-rail.css): Slides panel with opacity + transform
3. **Button feedback** (topbar.css): Visual indicator when Nav Rail is open

### State Management
- **Global state:** `window.Si2C.navRailCollapsed` (boolean)
- **DOM state:** `.app-shell.nav-rail-collapsed` class
- **Initialization:** DOMContentLoaded event applies initial state

### Animation Properties
- **Duration:** 250ms (`var(--transition-normal)` from Sentinel)
- **Easing:** ease (default)
- **Properties animated:**
  - Grid columns (width)
  - Transform translateX (slide)
  - Opacity (fade)
  - Button background and shadow

### Accessibility
- `pointer-events: none` on collapsed Nav Rail prevents interaction
- Console logging for debugging state changes
- Smooth transitions prevent jarring visual changes

---

## Testing Checklist

### Visual Tests
- [ ] Initial page load: Nav Rail hidden, Canvas full width
- [ ] Click Ask AI: Nav Rail slides in from left
- [ ] Canvas width reduces smoothly (no jump)
- [ ] Ask AI button changes to cyan with glow
- [ ] Click Ask AI again: Nav Rail slides out to left
- [ ] Canvas width expands smoothly back to full
- [ ] Ask AI button returns to normal blue
- [ ] Transition feels smooth (250ms duration)

### Console Tests
```javascript
// Check initial state
window.Si2C.navRailCollapsed
// Should return: true

// Check after first click
window.Si2C.navRailCollapsed
// Should return: false

// Check CSS class on app-shell
document.getElementById('app-shell').classList.contains('nav-rail-collapsed')
// Should match navRailCollapsed state

// Manually toggle
toggleNavRail()
// Console should log state change
```

### Browser Compatibility
- [x] Chrome/Edge: CSS Grid transitions supported
- [x] Firefox: CSS Grid transitions supported
- [x] Safari: CSS Grid transitions supported
- [x] All modern browsers support transform and opacity transitions

---

## Future Enhancements

When Nav Rail content is built:
1. **Focus management:** Set focus to Nav Rail input when expanded
2. **Keyboard shortcut:** Add Cmd/Ctrl+K to toggle Nav Rail
3. **Escape key:** Close Nav Rail when expanded
4. **Animation completion events:** Trigger callbacks when animation finishes
5. **Resize handling:** Adjust behavior on very narrow screens

---

## Sentinel Compliance

✓ **No new color tokens** - uses existing `--color-status-info`
✓ **Uses Sentinel transitions** - `--transition-normal` and `--transition-fast`
✓ **Uses Sentinel glow** - `var(--accent-glow)`
✓ **Follows existing patterns** - class-based state management
✓ **No inline styles** - all CSS in appropriate panel files

---

## Integration Points

**Ready for Nav Rail content:**
- Expanded state automatically shows Nav Rail panel
- Canvas automatically adjusts width
- Ask AI button provides visual feedback
- State persists in `window.Si2C.navRailCollapsed`

**Next steps:**
1. Build Nav Rail three-zone layout (Accelerator | Stream | Prompt)
2. Implement AI conversation interface in Stream zone
3. Build Prompt Dock with input field and send button
4. Connect Ask AI button to focus Prompt Dock input when expanded
