# React Concepts in Stock Tracker PWA — Learning Guide

> This document catalogues every React concept used in the Stock Tracker PWA and serves as a structured learning path. Each concept includes what it is, where it's used in our codebase, and a mini-lesson to master it.

---

## Table of Contents

1. [Functional Components](#1-functional-components)
2. [JSX Fundamentals](#2-jsx-fundamentals)
3. [Props & TypeScript Typing](#3-props--typescript-typing)
4. [useState Hook](#4-usestate-hook)
5. [useEffect Hook](#5-useeffect-hook)
6. [useMemo Hook](#6-usememo-hook)
7. [useCallback Hook](#7-usecallback-hook)
8. [useRef Hook](#8-useref-hook)
9. [react-hook-form (useForm)](#9-react-hook-form-useform)
10. [Conditional Rendering](#10-conditional-rendering)
11. [List Rendering](#11-list-rendering)
12. [Event Handling](#12-event-handling)
13. [Lifting State Up & Prop Drilling](#13-lifting-state-up--prop-drilling)
14. [Optimistic UI Updates](#14-optimistic-ui-updates)
15. [Async Operations & Side Effects](#15-async-operations--side-effects)
16. [Reusable / Shared Components](#16-reusable--shared-components)
17. [Inline Styles & CSS-in-JSX](#17-inline-styles--css-in-jsx)
18. [Angular–React Interop](#18-angularreact-interop)
19. [Architecture Overview](#19-architecture-overview)

---

## 1. Functional Components

### What is it?
A React component defined as a plain JavaScript/TypeScript function that returns JSX. This is the modern standard — no class components are used in this project.

### Where it's used
Every single `.tsx` file in the project. All 18 components follow the arrow-function pattern:

```tsx
export const ComponentName = (props: PropsType) => {
  // hooks, logic
  return ( <div>...</div> );
};
```

### Files
- `stock-tracking/stock-tracking.tsx` — Root auth router
- `stock-tracking/AppShellPortfolio.tsx` — App shell layout
- `stock-tracking/StockTrackerDashboard.tsx` — Legacy dashboard
- `stock-tracking/HomeAccordion.tsx` — Accordion for each home
- `stock-tracking/SignInForm.tsx` — Sign-in form
- `stock-tracking/SignUpForm.tsx` — Sign-up form
- `stock-tracking/components/Header.tsx` — Top header bar
- `stock-tracking/components/BottomNav.tsx` — Bottom navigation
- `stock-tracking/components/SideDrawer.tsx` — Side navigation drawer
- `stock-tracking/components/RestrictedFeatureFAB.tsx` — Floating action button
- `stock-tracking/components/SearchBar.tsx` — Search input
- `stock-tracking/components/CategoryTabs.tsx` — Category filter tabs
- `stock-tracking/components/ProductCard.tsx` — Product display card
- `stock-tracking/components/EditProductModal.tsx` — Edit product modal
- `stock-tracking/components/ExpiringSoon.tsx` — Expiring items widget
- `stock-tracking/components/HomeSelector.tsx` — Home dropdown selector
- `stock-tracking/components/OverviewChart.tsx` — Stock overview chart
- `shared/ui/ReusableInput.tsx`, `ReusableButton.tsx`, `ConfirmDialog.tsx` — Shared UI

### Learn
- A functional component is just a function that returns JSX
- It can accept `props` as its argument
- Hooks (like `useState`) give it state and lifecycle capabilities
- Always start component names with an uppercase letter

---

## 2. JSX Fundamentals

### What is it?
JSX is a syntax extension that lets you write HTML-like markup inside JavaScript. It gets compiled to `React.createElement()` calls.

### Patterns used in our codebase

| Pattern | Example | File |
|---------|---------|------|
| **Fragments `<>...</>`** | `<> <SignInForm /> {message && <p>...</p>} </>` | `stock-tracking.tsx:64` |
| **Expressions in `{}`** | `{home.expanded ? '−' : '+'}` | `HomeAccordion.tsx:292` |
| **Inline SVG** | `<svg width="24" ...><path d="..." /></svg>` | `Header.tsx:47` |
| **`<style>` injection** | `<style>{\`@keyframes spin {...}\`}</style>` | `StockTrackerDashboard.tsx:367` |
| **HTML `datalist`** | `<datalist id={...}><option ... /></datalist>` | `HomeAccordion.tsx:478` |

### Learn
- JSX uses `className` instead of `class`, `htmlFor` instead of `for`
- All tags must be closed (`<img />`, `<input />`)
- JavaScript expressions go inside `{}`
- You can embed any valid JS expression — ternaries, function calls, `.map()`

---

## 3. Props & TypeScript Typing

### What is it?
Props are the mechanism for passing data from parent to child components. TypeScript adds type safety.

### Patterns used

**Type aliases for props:**
```tsx
type HomeAccordionProps = {
  home: HomeItem;
  catalog: CatalogCategory[];
  onToggle: (id: number) => void;
  // ...
};
```

**Interfaces for props:**
```tsx
interface AppShellPortfolioProps {
  onLogout: () => void;
}
```

**Destructuring in function signature:**
```tsx
export const Header = ({ activeTab, onHamburgerClick, onNotificationClick }: HeaderProps) => { ... };
```

**Generic typing with `Partial<T>`:**
```tsx
const updateProduct = async (homeId: number, productId: number, fields: Partial<HomeItem['products'][number]>) => { ... };
```

**Type-only imports:**
```tsx
import type { HomeItem, CatalogCategory } from './types';
```

### Files
- `types.ts` — Central type definitions (`Product`, `HomeItem`, `CatalogCategory`, `Tab`, `AvailabilityStatus`)
- Every component file defines its own props type/interface

### Learn
- Use `type` for simple shapes, `interface` when you might extend later
- `Partial<T>` makes all properties optional — great for update operations
- `import type` ensures types are erased at compile time
- Callback props follow the pattern: `onAction: (args) => void`

---

## 4. useState Hook

### What is it?
`useState` lets you add state variables to functional components. It returns a `[value, setter]` tuple.

### Where it's used (every stateful component)

| Component | State Variables | Purpose |
|-----------|----------------|---------|
| `stock-tracking.tsx` | `formMode`, `signInMessage`, `registerMessage` | Auth flow routing, toast messages |
| `StockTrackerDashboard.tsx` | `homes`, `newHomeName`, `showAddHome`, `focusedHomeId`, `catalog`, `catalogLoading`, `catalogError`, `isParsingBill`, `isDataLoading`, `showMicFeatureDialog` | Full dashboard state |
| `AppShellPortfolio.tsx` | `activeTab`, `drawerOpen`, `selectedHomeId`, `homes`, `catalog`, `isLoading`, `userName`, `userEmail`, `showNotificationDialog` | App shell state |
| `HomeAccordion.tsx` | `editingHomeId`, `currentEditingHomeName`, `activeStockTypeDropdown`, `pendingUpdateIds`, `showBillMenu`, `showDeleteHomeDialog`, `showDeleteProductDialog`, `showFeatureDialog` | Accordion UI state |
| `SignInForm.tsx` | `rememberMe` | Checkbox state |
| `InventoryScreen.tsx` | `searchQuery`, `activeCategory`, `editingProduct`, `showBillScanDialog` | Filter/search state |
| `ProfileScreen.tsx` | `showNotificationDialog`, `showAddHome`, `newHomeName` | Profile UI state |
| `EditProductModal.tsx` | `stockType`, `productName`, `quantity`, `expiryDate`, `availability` | Form field state |
| `RestrictedFeatureFAB.tsx` | `showDialog` | Dialog visibility |

### Key patterns

**Generic typing:**
```tsx
const [formMode, setFormMode] = useState<'signin' | 'signup' | 'dashboard'>('signin');
const [homes, setHomes] = useState<HomeItem[]>([]);
const [focusedHomeId, setFocusedHomeId] = useState<number | null>(null);
```

**Functional updates (immutable array operations):**
```tsx
setHomes((prev) => prev.map((home) =>
  home.id === id ? { ...home, expanded: !home.expanded } : home
));

setHomes((prev) => prev.filter((home) => home.id !== id));

setHomes((prev) => [...prev, newHome]);
```

### Learn
- Always use the setter function, never mutate state directly
- For arrays/objects, create new references (spread operator)
- Use functional updates `setState(prev => ...)` when new state depends on old state
- TypeScript generics `useState<Type>()` ensure type safety

---

## 5. useEffect Hook

### What is it?
`useEffect` runs side effects after render — data fetching, subscriptions, DOM manipulation, timers.

### Where it's used

**Data fetching on mount (empty dependency array `[]`):**
```tsx
// StockTrackerDashboard.tsx:26
useEffect(() => {
  const getCatalog = async () => { ... };
  const loadInitialData = async () => { ... };
  getCatalog();
  loadInitialData();
}, []);
```

```tsx
// AppShellPortfolio.tsx:30 — Fetch user info
useEffect(() => {
  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserName(name);
      setUserEmail(user.email || '');
    }
  };
  fetchUser();
}, []);
```

**Syncing form values:**
```tsx
// SignInForm.tsx:50
useEffect(() => {
  if (storedCredentials.rememberMe) {
    signInForm.setValue('email', storedCredentials.email);
    signInForm.setValue('password', storedCredentials.password);
  }
}, [storedCredentials, signInForm]);
```

**Event listener with cleanup:**
```tsx
// ConfirmDialog.tsx:24
useEffect(() => {
  if (!open) return;
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onCancel();
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);  // Cleanup!
}, [open, onCancel]);
```

### Learn
- `useEffect(() => { ... }, [])` — runs once on mount
- `useEffect(() => { ... }, [dep1, dep2])` — runs when dependencies change
- Return a cleanup function for subscriptions/listeners
- Don't make the callback itself `async` — define an async function inside and call it

---

## 6. useMemo Hook

### What is it?
`useMemo` caches the result of an expensive computation, recalculating only when dependencies change.

### Where it's used

**Memoized localStorage parsing (runs once):**
```tsx
// SignInForm.tsx:24
const storedCredentials = useMemo(() => {
  if (typeof window === 'undefined') return { email: '', password: '', rememberMe: false };
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return { email: '', password: '', rememberMe: false };
    return JSON.parse(stored);
  } catch (e) {
    return { email: '', password: '', rememberMe: false };
  }
}, []);
```

**Derived category list:**
```tsx
// InventoryScreen.tsx:35
const categories = useMemo(() => {
  const cats = new Set<string>();
  products.forEach((p) => {
    if (p.stockType && p.stockType.trim()) cats.add(p.stockType.trim());
  });
  return Array.from(cats).sort();
}, [products]);
```

**Filtered product list:**
```tsx
// InventoryScreen.tsx:46
const filteredProducts = useMemo(() => {
  return products.filter((p) => {
    const matchesSearch = searchQuery === '' || p.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.stockType.trim() === activeCategory;
    return matchesSearch && matchesCategory;
  });
}, [products, searchQuery, activeCategory]);
```

### Learn
- Use `useMemo` for expensive computations that don't need to re-run every render
- Dependencies array controls when recalculation happens
- Don't overuse — only memoize when there's a real performance benefit
- Returns the **value**, not a function (compare with `useCallback`)

---

## 7. useCallback Hook

### What is it?
`useCallback` memoizes a function reference so it doesn't get recreated on every render. Useful when passing callbacks to child components.

### Where it's used

```tsx
// SignInForm.tsx:57
const persistCredentials = useCallback((data: SignInFormValues) => {
  if (typeof window === 'undefined') return;
  if (rememberMe) {
    window.localStorage.setItem(storageKey, JSON.stringify({
      email: data.email, password: data.password, rememberMe: true
    }));
  } else {
    window.localStorage.removeItem(storageKey);
  }
}, [rememberMe]);
```

### Learn
- `useCallback(fn, deps)` ≈ `useMemo(() => fn, deps)`
- Returns the **function itself**, not its result
- Prevents unnecessary re-renders of child components that receive the callback as a prop
- Dependency array: include all values from the component scope that the function uses

---

## 8. useRef Hook

### What is it?
`useRef` creates a mutable reference that persists across renders without causing re-renders. Commonly used for DOM element access.

### Where it's used

```tsx
// HomeAccordion.tsx:48
const fileInputRef = useRef<HTMLInputElement>(null);
const cameraInputRef = useRef<HTMLInputElement>(null);
```

**Usage — programmatic click on hidden file inputs:**
```tsx
// Triggering file upload
fileInputRef.current?.click();
cameraInputRef.current?.click();
```

**Attaching to DOM:**
```tsx
<input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={...} />
<input type="file" ref={cameraInputRef} style={{ display: 'none' }} accept="image/*" capture="environment" onChange={...} />
```

### Learn
- `useRef` returns `{ current: value }` — mutating `.current` doesn't trigger re-render
- Type it with `useRef<HTMLInputElement>(null)` for DOM elements
- Use optional chaining: `ref.current?.click()`
- Also useful for storing previous values or interval IDs

---

## 9. react-hook-form (useForm)

### What is it?
A third-party library for performant form handling with built-in validation. Minimizes re-renders by using uncontrolled inputs internally.

### Where it's used

**SignInForm.tsx:**
```tsx
const signInForm = useForm<SignInFormValues>({
  defaultValues: { email: storedCredentials.email, password: storedCredentials.password }
});
```

**SignUpForm.tsx:**
```tsx
const registerForm = useForm<RegisterFormValues>({
  defaultValues: { username: '', email: '', password: '', confirmPassword: '' }
});
```

### Key APIs used

| API | Usage | File |
|-----|-------|------|
| `register()` | Connects input to form state | `SignInForm.tsx:92`, `SignUpForm.tsx:54` |
| `handleSubmit()` | Wraps submit handler with validation | `SignInForm.tsx:84`, `SignUpForm.tsx:47` |
| `formState.errors` | Access validation errors | Both forms |
| `watch()` | Watch a field value reactively | `SignUpForm.tsx:90` — password match |
| `setValue()` | Programmatically set field value | `SignInForm.tsx:52` |
| `reset()` | Reset form to defaults | `SignUpForm.tsx:38` |

### Validation rules used
```tsx
rules={{
  required: 'Email is required',
  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
}}

rules={{
  required: 'Password is required',
  minLength: { value: 6, message: 'Password must be at least 6 characters' }
}}

rules={{
  required: 'Please confirm your password',
  validate: (value) => value === registerForm.watch('password') || 'Passwords do not match'
}}
```

### Learn
- `register('fieldName', rules)` returns `{ onChange, onBlur, ref, name }`
- `handleSubmit(onValid, onInvalid)` only calls `onValid` if all rules pass
- `watch('field')` subscribes to a field's value — useful for cross-field validation
- Much more performant than controlled inputs for large forms

---

## 10. Conditional Rendering

### What is it?
Showing or hiding UI elements based on state/props values.

### Patterns used

**Short-circuit `&&`:**
```tsx
{signInMessage && <p>{signInMessage}</p>}
{catalogError && <p style={{ color: '#ff4d4d' }}>{catalogError}</p>}
{isExpiringSoon() && <span>⏰</span>}
```

**Ternary operator:**
```tsx
{formMode === 'signin' ? <SignInForm ... /> : <SignUpForm ... />}
{home.expanded ? '−' : '+'}
{isParsingBill ? 'Parsing...' : 'Add from Bill'}
```

**Early return:**
```tsx
// SideDrawer.tsx:12
if (!isOpen) return null;

// InventoryScreen.tsx:74
if (!selectedHome) {
  return <div>Select a home...</div>;
}

// StockTrackerDashboard.tsx:361
if (isDataLoading) {
  return <div>Loading your stock data...</div>;
}
```

**`if` block before return:**
```tsx
// stock-tracking.tsx:49
if (formMode === 'dashboard') {
  return <AppShellPortfolio onLogout={handleLogout} />;
}
// Falls through to auth forms
return <div>...</div>;
```

### Learn
- `&&` — renders right side only if left side is truthy (beware of `0`)
- Ternary — choose between two elements
- Early return — bail out of the component entirely
- Never use `if/else` inside JSX directly — use these patterns instead

---

## 11. List Rendering

### What is it?
Rendering arrays of data as lists of components using `.map()` with a `key` prop.

### Where it's used

```tsx
// StockTrackerDashboard.tsx:438
homes.map((home) => (
  <HomeAccordion key={home.id} home={home} ... />
))

// BottomNav.tsx:61
tabs.map((tab) => {
  const isActive = activeTab === tab.key;
  return <button key={tab.key} ...>{tab.icon(isActive)}</button>;
})

// OverviewChart.tsx:37
stats.map((stat) => (
  <div key={stat.label}>{stat.value}</div>
))

// HomeAccordion.tsx:363
filteredProducts.map((product, index) => (
  <tr key={product.id}>...</tr>
))
```

### Learn
- Always provide a unique `key` prop — use `id` from data, not array index
- `.map()` must return JSX for each item
- You can chain `.filter().map()` for filtered lists
- `key` helps React identify which items changed, were added, or removed

---

## 12. Event Handling

### What is it?
Responding to user interactions — clicks, input changes, keyboard events, focus/blur, etc.

### Patterns used

| Event | Pattern | File |
|-------|---------|------|
| `onClick` | `onClick={() => setShowAddHome(true)}` | Throughout |
| `onChange` | `onChange={(e) => setNewHomeName(e.target.value)}` | Throughout |
| `onSubmit` | `onSubmit={signInForm.handleSubmit(onSubmit)}` | `SignInForm.tsx:84` |
| `onFocus` | `onFocus={() => setActiveStockTypeDropdown(product.id)}` | `HomeAccordion.tsx:383` |
| `onBlur` | `onBlur={() => { setTimeout(() => { ... }, 150); }}` | `HomeAccordion.tsx:385` |
| `onMouseDown` | `onMouseDown={() => onUpdateProduct(...)}` | `HomeAccordion.tsx:424` |
| `onMouseEnter/Leave` | Hover highlight on dropdown items | `HomeAccordion.tsx:433` |
| `onKeyDown` | `onKeyDown={(e) => e.key === 'Enter' && handleAddHome()}` | `ProfileScreen.tsx:155` |
| `e.stopPropagation()` | Prevent click bubbling in nested elements | `HomeAccordion.tsx:257`, `EditProductModal.tsx:79` |

### Learn
- React events are camelCase: `onClick`, `onChange`, `onKeyDown`
- Event handlers receive a synthetic event object
- `e.stopPropagation()` prevents the event from bubbling to parent handlers
- `e.preventDefault()` prevents default browser behavior (e.g., form submission)
- Use `onMouseDown` instead of `onClick` when you need to fire before `onBlur`

---

## 13. Lifting State Up & Prop Drilling

### What is it?
Moving state to the nearest common ancestor so multiple children can share it. Data flows down via props, actions flow up via callback props.

### How it works in our app

**State lives in `AppShellPortfolio.tsx`:**
- `homes`, `catalog`, `selectedHomeId`, `userName`, `userEmail`
- CRUD functions: `handleAddProduct`, `handleUpdateProduct`, `handleDeleteProduct`, `handleAddHome`, `handleDeleteHome`

**Passed down to screens:**
```
AppShellPortfolio
  ├── DashboardScreen  ← receives homes, selectedHomeId, userName
  ├── InventoryScreen  ← receives homes, selectedHomeId, catalog, onUpdateProduct, onDeleteProduct, onAddProduct
  └── ProfileScreen    ← receives userName, userEmail, homes, onLogout, onAddHome, onDeleteHome
```

**Callback props (child → parent communication):**
```tsx
// Parent passes callback
<InventoryScreen onUpdateProduct={handleUpdateProduct} ... />

// Child calls it
const handleEditSave = (productId: number, fields: Partial<Product>) => {
  onUpdateProduct(selectedHomeId, productId, fields);
};
```

### Learn
- State should live in the lowest common ancestor of components that need it
- Pass data down as props, pass actions up as callback props
- This project uses **no Context API or Redux** — pure prop drilling
- Prop drilling works well for small-to-medium apps; consider Context/Redux for deeply nested trees

---

## 14. Optimistic UI Updates

### What is it?
Updating the UI immediately before the API call completes, then handling errors if the call fails.

### Where it's used

```tsx
// AppShellPortfolio.tsx:131
const handleUpdateProduct = async (homeId: number, productId: number, fields: Partial<Product>) => {
  // 1. Update state immediately (optimistic)
  setHomes((prev) =>
    prev.map((home) =>
      home.id === homeId
        ? { ...home, products: home.products.map((p) => (p.id === productId ? { ...p, ...fields } : p)) }
        : home
    )
  );
  // 2. Then persist to API
  try {
    await api.updateProduct(productId, fields);
  } catch (error) {
    console.error('Error updating product:', error);
    alert('Failed to save changes.');
    // Could revert state here
  }
};
```

### Learn
- Makes the app feel instant — no loading spinners for every edit
- Update local state first, then call the API
- If the API fails, you should ideally revert the state (rollback)
- Great for frequently updated data like product fields

---

## 15. Async Operations & Side Effects

### What is it?
Handling asynchronous operations like API calls, file reading, and network requests.

### Patterns used

**Async inside useEffect:**
```tsx
useEffect(() => {
  const loadData = async () => {
    setIsLoading(true);
    try {
      const homesFromApi = await api.getHomesWithProducts();
      setHomes(formattedHomes);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  loadData();
}, []);
```

**Promise.all for parallel requests:**
```tsx
// StockTrackerDashboard.tsx:326
const addedProducts = await Promise.all(
  matchedItems.map(item => api.addProduct(homeId, item))
);
```

**FileReader API:**
```tsx
// StockTrackerDashboard.tsx:246
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = async () => {
  const base64Image = reader.result as string;
  // ... send to API
};
```

**Fetch API:**
```tsx
const response = await fetch('/api/stock-tracker/parse-bill', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ image: base64Data }),
});
```

**Supabase client calls:**
```tsx
const { data, error } = await supabase
  .from('categories')
  .select('id, name, items(id, name)')
  .order('name');
```

**Effect cleanup:**
```tsx
useEffect(() => {
  const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);  // Cleanup
}, [open, onCancel]);
```

### Learn
- Never make the `useEffect` callback itself `async` — define an inner async function
- Use `try/catch/finally` for error handling and loading state
- `Promise.all` runs multiple promises in parallel
- Always clean up subscriptions and event listeners in the return function

---

## 16. Reusable / Shared Components

### What is it?
Generic, configurable components that are used across multiple parts of the app.

### Components

**`ReusableInput`** (`shared/ui/ReusableInput.tsx`):
- Integrates with react-hook-form via `register` prop
- Supports label, type, placeholder, required indicator, error display
- Used in: `SignInForm`, `SignUpForm`

**`ReusableButton`** (`shared/ui/ReusableButton.tsx`):
- Configurable label, type, variant (primary/secondary)
- Used in: `SignInForm`, `SignUpForm`

**`ConfirmDialog`** (`shared/ui/ConfirmDialog.tsx`):
- Modal with confirm/cancel actions
- Supports `danger` and `info` variants
- Keyboard escape to close
- Used in: `HomeAccordion` (delete home, delete product)

**`InfoDialog`** (`shared/ui/ConfirmDialog.tsx`):
- Info-only modal with optional download link
- Used in: `AppShellPortfolio`, `StockTrackerDashboard`, `InventoryScreen`, `ProfileScreen`, `RestrictedFeatureFAB`, `HomeAccordion`

### Learn
- Design components to be configurable via props
- Keep shared components in a `shared/ui/` directory
- Use optional props with defaults for flexibility
- Separate concerns: a dialog component shouldn't know about business logic

---

## 17. Inline Styles & CSS-in-JSX

### What is it?
Styling approach where CSS is written as JavaScript objects directly in JSX.

### Patterns used

**Inline style objects:**
```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
```

**CSS Variables via injected `<style>` tags:**
```tsx
<style>{`
  .st-shell {
    --st-bg-primary: #0F172A;
    --st-accent-green: #22C55E;
    --st-text-primary: #F8FAFC;
  }
`}</style>
```

**CSS Keyframe animations:**
```tsx
<style>{`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes slideInLeft {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
`}</style>
```

**Media queries in `<style>` blocks:**
```tsx
<style>{`
  @media (max-width: 780px) {
    .desktop-table { display: none !important; }
    .mobile-table { display: block !important; }
  }
`}</style>
```

### Learn
- Inline styles use camelCase: `backgroundColor`, `fontSize`, `borderRadius`
- Values are strings (`'16px'`) or numbers (interpreted as pixels)
- Can't do pseudo-classes (`:hover`) or media queries inline — use `<style>` tags
- CSS variables (`var(--name, fallback)`) work in inline styles too

---

## 18. Angular–React Interop

### What is it?
The Stock Tracker PWA is a React app mounted inside an Angular application. This is a micro-frontend pattern.

### How it works

```tsx
// stock-tracking.component.ts
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { StockTracking } from './stock-tracking';

@Component({
  selector: 'app-stock-tracking',
  templateUrl: './stock-tracking.component.html',
})
export class StockTrackingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('reactRoot', { static: true }) reactRoot!: ElementRef<HTMLDivElement>;
  private root?: Root;

  ngAfterViewInit(): void {
    this.root = createRoot(this.reactRoot.nativeElement);  // Create React root
    this.root.render(createElement(StockTracking));         // Render React component
  }

  ngOnDestroy(): void {
    this.root?.unmount();  // Clean up React tree
  }
}
```

### Learn
- `createRoot()` from `react-dom/client` creates a React rendering root
- `createElement()` creates a React element without JSX (since this is a `.ts` file, not `.tsx`)
- Mount in `ngAfterViewInit` (DOM is ready), unmount in `ngOnDestroy` (cleanup)
- The React tree is completely independent — it manages its own state and rendering

---

## 19. Architecture Overview

```
Angular Host (StockTrackingComponent)
  └── createRoot → StockTracking (Auth Router)
        ├── SignInForm (react-hook-form)
        │     ├── ReusableInput
        │     └── ReusableButton
        ├── SignUpForm (react-hook-form)
        │     ├── ReusableInput
        │     └── ReusableButton
        └── AppShellPortfolio (App Shell — state owner)
              ├── Header
              ├── SideDrawer
              ├── BottomNav
              ├── RestrictedFeatureFAB → InfoDialog
              ├── DashboardScreen
              │     ├── HomeSelector
              │     ├── OverviewChart
              │     └── ExpiringSoon
              ├── InventoryScreen
              │     ├── SearchBar
              │     ├── CategoryTabs
              │     ├── ProductCard
              │     ├── EditProductModal
              │     └── InfoDialog
              └── ProfileScreen
                    └── InfoDialog
```

### Data flow

```
Supabase DB ←→ homeApi.js / authService.ts ←→ AppShellPortfolio (state) ←→ Screens ←→ Components
```

- **Down:** State flows from `AppShellPortfolio` → Screens → Components via props
- **Up:** User actions flow from Components → Screens → `AppShellPortfolio` via callback props
- **External:** `homeApi.js` and `authService.ts` handle all Supabase communication

---

## Summary

| Category | Count / Details |
|----------|----------------|
| React Hooks used | **6** — `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useForm` |
| Total `.tsx` components | **18** (all functional, arrow-function style) |
| Shared/reusable components | **4** — `ReusableInput`, `ReusableButton`, `ConfirmDialog`, `InfoDialog` |
| Third-party React libraries | **2** — `react-hook-form`, `react-dom/client` |
| State management | **Prop drilling** — no Context, no Redux |
| Styling approach | **Inline styles** + injected `<style>` tags with CSS variables |
| TypeScript | Full typing — interfaces, type aliases, generics, `Partial<T>`, `as const` |

---

## Learning Path (Suggested Order)

1. ✅ **Functional Components** — foundation of everything
2. ✅ **JSX** — how to write UI in React
3. ✅ **Props** — data flow between components
4. ✅ **useState** — making components interactive
5. ✅ **Conditional & List Rendering** — dynamic UI
6. ✅ **Event Handling** — responding to user actions
7. ✅ **useEffect** — side effects and data fetching
8. ✅ **useRef** — DOM access
9. ✅ **useMemo & useCallback** — performance optimization
10. ✅ **react-hook-form** — advanced form handling
11. ✅ **Lifting State Up** — state architecture
12. ✅ **Optimistic Updates** — UX pattern
13. 🔲 **Async Patterns** — real-world data operations
14. 🔲 **Reusable Components** — component design
15. 🔲 **Angular–React Interop** — micro-frontend integration

### Phase 2 — JIRA_UI Codebase (React 18 + Vite + CSS Modules + plain JS)
> After completing Stock Tracker concepts, switch to `JIRA_UI` project for concepts not present in Stock Tracker. Overlapping concepts will be revisited for reinforcement.

16. 🔲 **CSS Modules** — scoped styling (replaces inline styles / Angular ViewEncapsulation)
17. 🔲 **react-router-dom v6** — client-side routing (pages, layouts, nested routes)
18. 🔲 **Context API** — global state without prop drilling (CopilotContext)
19. 🔲 **Custom Hooks** — extracting reusable logic (useClickOutside, useDataService, useCopilotChat)
20. 🔲 **Component Composition** — barrel exports, layout patterns, compound components
21. 🔲 **Data Layer / Services** — adapters, transforms, data fetching patterns (no Angular DI)
22. 🔲 **Functional Components (revisit)** — reinforcement with new codebase
23. 🔲 **Props (revisit)** — reinforcement with CSS Module class passing, children prop
24. 🔲 **useState (revisit)** — reinforcement with new patterns
25. 🔲 **useEffect (revisit)** — reinforcement with new patterns
26. 🔲 **Conditional & List Rendering (revisit)** — reinforcement with new codebase
27. 🔲 **Lifting State Up (revisit)** — reinforcement with Context as alternative

> Status: 🔲 = not started · 🟡 = in progress · ✅ = done

---

## Session Log

### Session 1 — Functional Components (2026-09-03)
**What I learned:** A React component is just a function that returns JSX — no class, no decorator. Props come in as a single object (unlike Angular's separate `@Input`/`@Output`), and you destructure them in the parameter list. The function re-runs entirely on every render.
**Misconception to revisit:** Initially wrote props as separate function parameters instead of destructuring from a single object — this would cause `[object Object]` to render because React passes one props object, not individual arguments.

### Session 2 — JSX Fundamentals (2026-09-03)
**What I learned:** JSX is JavaScript, not HTML — expressions go in `{}`, attributes are camelCase (`fontSize`, `strokeWidth`, `className`), comments use `{/* */}`, and Fragments (`<>...</>`) let you return multiple siblings without a wrapper div. The double braces in `style={{...}}` are outer = expression slot, inner = object literal.
**Misconception to revisit:** Need to clarify why `style={{ }}` needs double braces — the outer `{}` is JSX expression syntax, the inner `{}` is a JS object. Single braces `style={fontSize:'2rem'}` would be a syntax error.

### Session 3 — Props (2026-09-03)
**What I learned:** React has no `@Input`/`@Output` split — everything is a prop. Callback props are just functions the parent passes down; the child calls them directly (no EventEmitter). Optional props use `?` in the type and default values in destructuring. The `&&` pattern conditionally renders elements based on whether a prop exists.
**Misconception to revisit:** Used a literal type `'Retry'` instead of `string` for an optional prop with a default — literal types restrict to one exact value. Also missed setting the default value in destructuring (not in the type).

### Session 4 — useState (2026-09-08)
**What I learned:** `useState` returns a `[value, setter]` pair. State updates are asynchronous — the variable does not change on the line you call the setter; React batches and re-renders. The controlled component pattern (`value` + `onChange`) replaces Angular's `[(ngModel)]`. Use functional updates (`prev => prev + 1`) when new state depends on old state to avoid stale closures during rapid updates.
**Misconception to revisit:** None — exercise completed correctly on first attempt. Reinforce: `setState(val + 1)` vs `setState(prev => prev + 1)` difference under rapid clicks.

### Session 5 — Spaced Review (2026-09-08)
**File reviewed:** `BottomNav.tsx` (unseen). Tested: Functional Components, Props, JSX, useState.
**Score:** 4/5. Correctly identified: functional component, @Input/@Output equivalents, .map() as *ngFor, key prop purpose.
**Misconception to revisit:** Assumed active tab state was a boolean toggle inside the tabs array. Actual pattern: state lives in parent (AppShellPortfolio), passed down as prop, updated via callback. Stateless/presentational component pattern — will cover formally in Session 11 (Lifting State Up).

### Session 6 — Conditional & List Rendering (2026-09-10)
**What I learned:** React has no `*ngIf`/`*ngFor` — use `&&` for show/hide, ternary for if/else, early `return null` to skip entire component, and `.map()` for lists. `key` must be a stable unique ID, not array index. The entire ternary must be inside one `{}` block in JSX. `<ul>` wraps `.map()`, not the other way around.
**Misconception to revisit:** Initially placed ternary `?:` operators outside JSX expression braces — syntax error. Also created a new `<ul>` per `.map()` iteration instead of wrapping `.map()` in one `<ul>`. Both fixed on second attempt. Still using `key={index}` — should use `key={item}` for stable identity.

### Session 7 — Event Handling (2026-09-10)
**What I learned:** React events are camelCase props (`onClick`, `onChange`, `onKeyDown`) that receive function references, not strings. React's `onChange` fires on every keystroke (like Angular's `(input)`). `onBlur` + `onMouseDown` + `setTimeout` is a pattern for custom dropdowns — `mousedown` fires before `blur` in browser event order. Arrow functions with `{}` need explicit `return`; without braces, return is implicit.
**Misconception to revisit:** Used `{}` in `.filter()` arrow function without `return` — silently filtered out everything. Also forgot `value={filterText}` on input — uncontrolled input ignores state resets. Both fixed on second attempt.

### Session 8 — Spaced Review (2026-09-10)
**File reviewed:** `HomeSelector.tsx` (unseen). Tested all 6 DONE concepts.
**Score:** 6/6. Correctly identified: destructured props, stateless component, data vs callback props, early return null, key={home.id} rationale, Number() for string-to-number conversion, state lives in parent.
**Misconception resolved:** Session 5 misconception about where state lives — now correctly identifies stateless/presentational components.

### Session 9 — useEffect (2026-09-11)
**What I learned:** `useEffect(fn, [])` = `ngOnInit` (runs once). `useEffect(fn, [deps])` = runs when deps change. The return function = cleanup (like `ngOnDestroy`, but also runs before re-run). `useEffect` callback cannot be `async` because React expects `undefined` or a cleanup function, not a Promise. Define async inside and call it. `await` pauses the function until the Promise resolves, then unwraps the value. API data reaches the UI via `setState` → re-render → JSX reads new state.
**Misconception to revisit:** Initially forgot the `[]` dependency array — without it, the effect runs on every render (adds a new listener each time). Also restricted the keydown handler to Escape only instead of all keys.

### Session 10 — useRef (2026-09-11)
**What I learned:** `useRef` is React's `@ViewChild` — it creates a `{ current: null }` box. You attach it to a DOM element via the `ref` JSX attribute, and React fills `.current` with the actual DOM node after render. Use `.current` (not `.nativeElement` like Angular) to call imperative methods like `.focus()` or `.click()`. Mutating `.current` never triggers a re-render — that's the key difference from `useState`. The hidden-input pattern (hide an `<input type="file">`, trigger it via `ref.current?.click()`) is a common real-world use case.
**Misconception to revisit:** Used `onClick={onClickMethod()}` with parentheses — this calls the function during render instead of passing a reference. Same mistake pattern from Session 7 (Angular's `(click)="method()"` uses parens, React's `onClick` does not). Also thought using `useState` to hold a DOM element would cause re-renders on keystrokes — the actual problem is an infinite render loop: ref callback → setState → re-render → ref callback → setState → forever.

### Session 11 — Spaced Review (2026-09-15)
**File reviewed:** `EditProductModal.tsx` (unseen). Tested all 8 DONE concepts.
**Score:** 5/8. Correctly identified: @Input/@Output mapping, stopPropagation on inner div to prevent backdrop close, key prop purpose in .map(), useEffect + useRef combo for auto-focus, useRef for focusing input on modal open.
**Misconceptions to revisit:**
- `Partial<T>` means "all fields become optional" — not "fields can be blank." Used for sending only changed fields in updates.
- Props are read-only in React. Local state is for draft editing (cancel without affecting parent), not to "avoid parent re-renders."
- `onClick={fn()}` vs `onClick={() => fn(val)}` — third occurrence of this mistake (Sessions 7, 10, 11). Now correctly stated: `fn()` calls immediately during render, passes return value (undefined) to onClick. The arrow wrapper defers execution to click time.

### Session 12 — useMemo & useCallback (2026-09-17)
**What I learned:** `useMemo(fn, deps)` caches the return value of `fn`; `useCallback(fn, deps)` caches the function itself. Both only recalculate when a dependency changes. Each `useMemo` has its own independent dependency array — changing `searchQuery` recalculates `filteredProducts` but not `categories` if `categories` only depends on `products`. `[]` deps = compute once, cache forever. An uncontrolled input (no `value`/`onChange`) doesn't trigger state changes, so no re-render, so `useMemo` never re-runs.
**Misconception to revisit:** None — all predictions correct, exercise completed on first attempt. Minor style note: static arrays should be defined outside the component to avoid recreation on every render.

### Session 13 — react-hook-form (2026-09-24)
**What I learned:** `react-hook-form` is React's equivalent of Angular Reactive Forms. `useForm()` returns `register`, `handleSubmit`, `formState`, `setValue`, `watch`, `reset`. `register('field', rules)` returns `{ onChange, onBlur, ref, name }` — spread these on `<input>` to connect it to the form. `handleSubmit(onSubmit)` runs validation first, only calls `onSubmit(data)` if all rules pass — without it, you get no validation AND the wrong argument type (event instead of data). `watch('field')` subscribes to a field's value for cross-field validation. `ReusableInput` is a wrapper that receives `register` as a prop, calls it internally, and separates `ref` from the rest using destructuring with the rest operator.
**Misconception to revisit:** Minor copy-paste error — email field's required message said "Name is required" instead of "Email is required." Not a code logic error but a UX bug. No structural misconceptions.

### Session 14 — Spaced Review (2026-09-24)
**File reviewed:** `ExpiringSoon.tsx` (unseen). Tested: Props, Conditional Rendering, List Rendering, useMemo, Event Handling, JSX.
**Score:** 4.5/6. Correctly identified: data-only prop (no callbacks), early return vs `&&` patterns, key prop purpose, presentational component with no event handlers, nested ternary as chained `? :`.
**Misconceptions to revisit:**
- `.slice(0, 3)` before `.map()` limits rendered items to the first 3 — missed this.
- `useMemo` recalculates when **dependencies** change, not on a timer. Thought cached data would be "wrong" because dates change daily — but `useMemo` doesn't cache across days, it caches across re-renders within a session. Skipping `useMemo` here is fine because the component has no local state, so it only re-renders when `products` changes anyway.

### Session 15 — Lifting State Up & Prop Drilling (2026-09-30)
**What I learned:** Each `useState` is private to its component — React does NOT share state automatically like Angular's DI-injected services. To share state between siblings, lift it to the nearest common ancestor and pass it down as props. Callback props let children trigger state changes in the parent. When the parent's state updates, it re-renders and all children in the subtree re-render too (not just the ones using the changed prop). Prop drilling is the cost: every intermediate component must forward the prop even if it doesn't use it.
**Misconception to revisit:** Initially believed React shares state between components automatically (like Angular services via DI). Corrected: `useState` is completely isolated per component instance. Sharing requires explicit prop passing from a common ancestor. Also: copy-paste guard `if (!selectedHomeId) return` in the exercise blocked adding a home when no home was selected — the exact scenario where adding is most needed.

### Session 16 — Optimistic UI Updates (2026-09-30)
**What I learned:** Optimistic update = update local state immediately before the API responds, so the UI feels instant. Pessimistic = wait for API success before updating state. This codebase uses optimistic for `handleUpdateProduct` (low risk, easy rollback) and pessimistic for `handleDeleteProduct` and `handleAddProduct` (destructive or needs server-generated ID). The original code had a bug: no rollback on API failure. Fix: capture `const previousHomes = homes` before the optimistic `setHomes`, then `setHomes(previousHomes)` in the catch block. Closures matter: `homes` inside an async function is the value from the render when the function was created — `setHomes` doesn't mutate it. Using `homes` directly in catch "works by accident" in simple cases but fails if other edits happened concurrently.
**Misconception to revisit:** Initially fixed the bug by making the update pessimistic (moving `setHomes` after `await`) instead of adding rollback. Valid fix, but loses the instant-feel benefit of optimistic updates. Corrected to optimistic-with-rollback on second attempt.