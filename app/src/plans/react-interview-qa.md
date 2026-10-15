# React Interview Questions & Answers
## Based on Stock Tracker PWA Codebase Learning Sessions

---

## Session 1 — Functional Components

### Q1: What is a functional component in React?
**A:** A functional component is a plain JavaScript/TypeScript function that accepts a `props` object as its single argument and returns JSX (markup). It is the modern standard — no classes, no decorators. Every component in this project follows this pattern:

```tsx
export const SearchBar = ({ value, onChange, placeholder = 'Search products...' }: SearchBarProps) => {
  return (
    <div>...</div>
  );
};
```
*Reference: `app/src/app/stock-tracking/components/SearchBar.tsx`, line 7*

---

### Q2: How does a React functional component differ from an Angular component?
**A:**
| Aspect | Angular | React |
|--------|---------|-------|
| Definition | Class with `@Component` decorator | Plain function |
| Template | Separate `.html` file or `template` string | JSX returned from the function body |
| Lifecycle | `ngOnInit` runs once, Zone.js detects mutations | The entire function re-runs on every render |
| Instance | Long-lived class instance with `this` | No instance — each render is a fresh function call |
| Data in | `@Input()` decorators | Props (single object argument) |
| Data out | `@Output()` + `EventEmitter` | Callback props (functions passed as props) |

---

### Q3: How are props passed to a React component?
**A:** React always passes a **single object** (the props object) as the function's argument. You destructure it in the parameter list:

```tsx
// Correct — destructuring from a single object
export const EmptyState = ({ message, icon = "📦" }: EmptyStateProps) => { ... }

// WRONG — separate parameters (React won't call it this way)
export const EmptyState = (message: string, icon = "📦") => { ... }
```

The wrong version would receive the entire `{ message: "..." }` object as the first parameter, causing `[object Object]` to render on screen.

---

### Q4: What is the Angular equivalent of React props?
**A:**
- **Data props** → `@Input()` in Angular
- **Callback props** (e.g., `onChange: (value: string) => void`) → `@Output()` + `EventEmitter` in Angular
- **Default values** (e.g., `placeholder = 'Search products...'`) → `@Input() placeholder = 'Search products...'` in Angular

The key difference: React unifies `@Input` and `@Output` into a single props object. There is no distinction between data flowing down and callbacks flowing up — they are all just properties.

---

### Q5: Why does a React component re-run its entire function on every render?
**A:** React has no Zone.js or change detection. When state or props change, React calls the component function again from top to bottom, gets the new JSX, and diffs it against the previous output (virtual DOM reconciliation). This is fundamentally different from Angular, where the class instance persists and Zone.js patches async APIs to detect when to update the view.

---

## Session 2 — JSX Fundamentals

### Q6: What is JSX?
**A:** JSX is a syntax extension that lets you write HTML-like markup inside JavaScript. It compiles to `React.createElement()` calls. It is **not HTML** — it is JavaScript that looks like HTML.

```tsx
// This JSX:
<button onClick={() => setShowDialog(true)}>Click</button>

// Compiles to:
React.createElement('button', { onClick: () => setShowDialog(true) }, 'Click')
```

---

### Q7: What are the key differences between JSX and HTML?
**A:**
| HTML | JSX | Reason |
|------|-----|--------|
| `class="btn"` | `className="btn"` | `class` is a reserved word in JS |
| `for="email"` | `htmlFor="email"` | `for` is a reserved word in JS |
| `stroke-width="2"` | `strokeWidth="2"` | Hyphenated names are not valid JS identifiers |
| `font-size: 16px` | `fontSize: '16px'` | Style is a JS object, not a CSS string |
| `<!-- comment -->` | `{/* comment */}` | JSX uses JS expression syntax for comments |
| `<img>` | `<img />` | All tags must be explicitly closed in JSX |

*Reference: `app/src/app/stock-tracking/components/Header.tsx`, line 47 — `strokeWidth`, `strokeLinecap`*

---

### Q8: What is a React Fragment and when do you use it?
**A:** A Fragment (`<>...</>` or `<React.Fragment>...</React.Fragment>`) lets you group multiple elements without adding an extra DOM node. You need it because a component can only return **one root element** (a function can only `return` one value).

```tsx
// Without Fragment — adds unnecessary <div> to DOM
return (
  <div>
    <button>...</button>
    <InfoDialog ... />
  </div>
);

// With Fragment — no extra DOM node
return (
  <>
    <button>...</button>
    <InfoDialog ... />
  </>
);
```

*Reference: `app/src/app/stock-tracking/components/RestrictedFeatureFAB.tsx`, lines 8 and 68*

In Angular, templates can have multiple root elements. In React, you need a Fragment to achieve the same thing.

---

### Q9: Why does `style` in JSX use double curly braces `{{ }}`?
**A:** The two sets of braces serve different purposes:
- **Outer `{}`** — JSX expression slot (tells JSX: "evaluate this as JavaScript")
- **Inner `{}`** — JavaScript object literal (the actual style object)

```tsx
// Correct
<p style={{ fontSize: '2rem', color: 'red' }}>Hello</p>

// WRONG — syntax error
<p style={fontSize: '2rem'}>Hello</p>
// This fails because fontSize: '2rem' is not a valid JS expression by itself
```

Style properties use camelCase (`fontSize`, `backgroundColor`, `borderRadius`) because they are JavaScript object keys, not CSS property names.

*Reference: `app/src/app/stock-tracking/components/Header.tsx`, lines 20–30*

---

### Q10: How do you embed JavaScript expressions in JSX?
**A:** Use curly braces `{}`. Any valid JavaScript expression can go inside:

```tsx
// Function call
{getTitle()}

// Ternary
{home.expanded ? '−' : '+'}

// Variable reference
{message}

// Inline arrow function (for event handlers)
onClick={() => setShowDialog(true)}
```

In Angular, you use `{{ interpolation }}` for display and `[property]="expression"` for binding. In React, `{}` handles all of these — there is only one syntax for embedding JS.

*Reference: `app/src/app/stock-tracking/components/Header.tsx`, line 64 — `{getTitle()}`*

---

## Session 3 — Props

### Q11: How does data flow between components in React?
**A:** Data flows **one way** — from parent to child via **props**. Unlike Angular which has separate `@Input()` (data down) and `@Output()`+`EventEmitter` (events up), React uses a single props object for both:

- **Data props** (equivalent to `@Input`): `<Header activeTab="dashboard" />`
- **Callback props** (equivalent to `@Output`): `<Header onHamburgerClick={handleMenuOpen} />`

Both are just properties on the same object. The child receives them all in one argument.

*Reference: `app/src/app/stock-tracking/components/Header.tsx`, lines 3–7 — `HeaderProps` interface*

---

### Q12: How does a child component communicate back to its parent in React?
**A:** The parent passes a **callback function** as a prop. The child calls it directly — no `EventEmitter`, no `emit()`, no subscription.

```tsx
// Parent (HomeAccordion.tsx, line 728):
<ConfirmDialog
  onConfirm={() => {
    setShowDeleteHomeDialog(false);
    onDelete(home.id);
  }}
  onCancel={() => setShowDeleteHomeDialog(false)}
/>

// Child (ConfirmDialog.tsx, line 93):
<button onClick={onConfirm}>Confirm</button>
```

The child does not know what `onConfirm` does. It just calls the function. The parent defines the behavior. This is simpler than Angular's `EventEmitter` pattern.

*Reference: `app/src/app/shared/ui/ConfirmDialog.tsx`, lines 93 and 77*

---

### Q13: How do you make a prop optional with a default value?
**A:** Two steps:

1. Mark it optional with `?` in the type definition
2. Set the default in the destructuring parameter

```tsx
// Type definition (ConfirmDialog.tsx, lines 7-9):
type ConfirmDialogProps = {
  confirmText?: string;    // ? = optional
  cancelText?: string;
  variant?: 'danger' | 'info';
  // ...
};

// Destructuring with defaults (ConfirmDialog.tsx, lines 18-20):
export const ConfirmDialog = ({
  confirmText = 'Confirm',   // default value here
  cancelText = 'Cancel',
  variant = 'danger',
}: ConfirmDialogProps) => { ... };
```

**Common mistake:** Setting the default in the type (`actionLabel?: 'Retry'`) creates a **literal type** — only the exact string `"Retry"` is allowed. Use `string` in the type and set the default in destructuring.

*Reference: `app/src/app/shared/ui/ConfirmDialog.tsx`, lines 3–23*

---

### Q14: What is the difference between `onClick={onAction}` and `onClick={onAction()}`?
**A:**
- `onClick={onAction}` — passes the **function reference**. React will call it when the button is clicked. ✅ Correct.
- `onClick={onAction()}` — **calls the function immediately** during render, and passes its **return value** (likely `undefined`) as the click handler. The function fires on every render, not on click. ❌ Wrong.

This is a common React bug. If you need to pass arguments, wrap it in an arrow function:
```tsx
onClick={() => onAction(someArg)}
```

---

### Q15: What is "callback prop chaining"?
**A:** When a callback prop is passed through multiple component layers:

```
AppShellPortfolio (defines handleDeleteHome)
  → passes onDelete={handleDeleteHome} to HomeAccordion
    → HomeAccordion passes onConfirm={() => onDelete(home.id)} to ConfirmDialog
      → ConfirmDialog calls onConfirm() on button click
```

The action bubbles up through function calls, not events. Each layer can add its own logic (like closing a dialog) before calling the parent's callback.

*Reference: `app/src/app/stock-tracking/HomeAccordion.tsx`, lines 721–733*

---

## Session 4 — useState Hook

### Q16: What is `useState` and how does it work?
**A:** `useState` is a React hook that adds state to functional components. It returns a tuple: `[currentValue, setterFunction]`.

```tsx
const [clickCount, setClickCount] = useState(0);
//      ^value      ^setter                  ^initial value
```

- The **value** is read-only within the current render — do not mutate it directly.
- The **setter** schedules a re-render with the new value.
- The **initial value** is only used on the first render.

In Angular, state is just a class property (`this.count = 0`) and Zone.js detects mutations. In React, you must call the setter — direct assignment (`count = 5`) does nothing.

*Reference: `app/src/app/stock-tracking/components/EditProductModal.tsx`, lines 12–16*

---

### Q17: Are state updates synchronous or asynchronous in React?
**A:** **Asynchronous.** When you call `setFormMode('signin')`, the variable `formMode` does **not** change on that line. React batches all state updates in the current event handler and applies them in a single re-render.

```tsx
// stock-tracking.tsx, lines 30–34:
setFormMode('signin');           // does NOT change formMode yet
setSignInMessage('Logged out.'); // does NOT change signInMessage yet
// React batches both → one re-render with both new values
```

In Angular, `this.formMode = 'signin'` changes the value instantly on that line.

*Reference: `app/src/app/stock-tracking/stock-tracking.tsx`, lines 30–34*

---

### Q18: What is the difference between `setState(value)` and `setState(prev => newValue)`?
**A:** The **functional update** form `setState(prev => prev + 1)` is safer when the new state depends on the previous state.

```tsx
// Direct update — UNSAFE for rapid clicks:
setCount(count + 1);  // If count=0, three rapid clicks all read 0 → result: 1

// Functional update — SAFE:
setCount(prev => prev + 1);  // Each call gets latest pending value → result: 3
```

Why? State updates are batched. With `count + 1`, all calls in the same batch read the same stale `count`. With `prev => prev + 1`, React chains the updates: `0→1→2→3`.

**Rule of thumb:** Use functional updates whenever new state depends on old state.

---

### Q19: What is the "controlled component" pattern in React?
**A:** React's equivalent of Angular's `[(ngModel)]` two-way binding, split into two explicit pieces:

```tsx
// Angular:
<input [(ngModel)]="stockType" />

// React (EditProductModal.tsx, lines 90–91):
<select
  value={stockType}                              // READ: display current state
  onChange={(e) => setStockType(e.target.value)}  // WRITE: update state on change
>
```

- `value={state}` — the input always reflects the current state (controlled by React)
- `onChange={handler}` — every user input triggers a state update → re-render → input updates

If you forget `onChange`, the input becomes **read-only** (React controls it but never updates it). If you forget `value`, it becomes **uncontrolled** (React does not manage it).

*Reference: `app/src/app/stock-tracking/components/EditProductModal.tsx`, lines 90–91*

---

### Q20: Why would you copy props into local state?
**A:** For **edit forms** where you want a local draft that does not affect the parent until the user explicitly saves.

```tsx
// EditProductModal.tsx, lines 12–16:
const [stockType, setStockType] = useState(product.stockType);
const [productName, setProductName] = useState(product.product);
// User edits locally... parent data unchanged
// Only on Save (line 19): onSave(product.id, { stockType, product: productName, ... })
```

Without local state, every keystroke would need to call the parent's update function — no way to cancel edits.

*Reference: `app/src/app/stock-tracking/components/EditProductModal.tsx`, lines 11–27*

---

### Q21: What is a TypeScript union type generic with `useState`?
**A:** Restricts the state to specific allowed values:

```tsx
const [formMode, setFormMode] = useState<'signin' | 'signup' | 'dashboard'>('signin');

setFormMode('dashboard');  // ✅ OK
setFormMode('logout');     // ❌ TypeScript compile error
```

This is React/TypeScript's equivalent of an Angular enum. It prevents invalid state values at compile time.

*Reference: `app/src/app/stock-tracking/stock-tracking.tsx`, line 7*

---

## Session 6 — Conditional & List Rendering

### Q22: How does React handle conditional rendering without `*ngIf`?
**A:** React uses three plain JavaScript patterns instead of Angular's `*ngIf` directive:

**1. Short-circuit `&&` (show/hide):**
```tsx
{signInMessage && <p>{signInMessage}</p>}
// Renders <p> only if signInMessage is truthy
```

**2. Ternary `? :` (if/else):**
```tsx
{homes.length === 0 ? (
  <p>No homes added yet.</p>
) : (
  homes.map((home) => <button key={home.id}>{home.name}</button>)
)}
```

**3. Early return (skip entire component):**
```tsx
if (!isOpen) return null;  // Renders nothing to DOM
```

| Angular | React |
|---------|-------|
| `*ngIf="condition"` | `{condition && <Element />}` |
| `*ngIf="x; else tmpl"` | `{x ? <A /> : <B />}` |
| `*ngIf` on host element | `if (!x) return null;` |

*Reference: `app/src/app/stock-tracking/components/SideDrawer.tsx`, line 12 (early return), lines 99–139 (ternary + map)*

---

### Q23: How does React render lists without `*ngFor`?
**A:** Use JavaScript's `.map()` method, which returns an array of JSX elements:

```tsx
// Angular:
<button *ngFor="let home of homes">{{home.name}}</button>

// React (SideDrawer.tsx, lines 104–138):
{homes.map((home) => (
  <button key={home.id}>{home.name}</button>
))}
```

Rules:
- `.map()` must return JSX for each item
- Every element returned by `.map()` **must** have a unique `key` prop
- You can chain `.filter().map()` for filtered lists

*Reference: `app/src/app/stock-tracking/components/SideDrawer.tsx`, lines 104–138*

---

### Q24: What is the `key` prop and why does it matter?
**A:** `key` is a special prop that helps React identify which list items changed, were added, or removed during re-renders.

**Good key — stable unique ID:**
```tsx
<button key={home.id}>...</button>  // ✅ ID is stable across re-renders
```

**Bad key — array index:**
```tsx
<li key={index}>...</li>  // ❌ Indices shift when items are deleted/reordered
```

**What goes wrong with index keys:** If you delete item #2 from [A, B, C]:
- Before: index 0=A, 1=B, 2=C
- After: index 0=A, 1=C
- React thinks key `1` is the same element — reuses B's DOM node for C
- Result: wrong animations, stale child state, visual glitches

*Reference: `app/src/app/stock-tracking/components/SideDrawer.tsx`, line 106 — `key={home.id}`*

---

### Q25: What does `return null` do in a React component?
**A:** It renders **nothing** to the DOM — the component produces no output. This is equivalent to Angular's `*ngIf="false"` on the host element.

```tsx
// SideDrawer.tsx, line 12:
if (!isOpen) return null;
// The entire drawer (backdrop, panel, animation) is removed from the DOM
```

This is different from `display: none` (which hides but keeps the element in the DOM). `return null` completely unmounts the component's output.

---

### Q26: When should you use early return vs `&&` vs ternary?
**A:**
- **Early return** — when the condition replaces the **entire** component output (loading states, empty states, auth guards)
- **`&&`** — when you want to show/hide a **small part** of the JSX
- **Ternary** — when you need to choose between **two different** elements

```tsx
// Early return — whole component replacement
if (isLoading) return <Spinner />;

// && — partial show/hide
{error && <p className="error">{error}</p>}

// Ternary — choose between two elements
{isExpanded ? '−' : '+'}
```

---

## Session 7 — Event Handling

### Q27: How does React handle events differently from Angular?
**A:**

| Aspect | Angular | React |
|--------|---------|-------|
| Syntax | `(click)="handleClick()"` (string) | `onClick={handleClick}` (function reference) |
| Naming | Lowercase: `(click)`, `(keydown)` | camelCase: `onClick`, `onKeyDown` |
| Event object | `$event` | `e` (SyntheticEvent) |
| `change` event | Fires on blur | `onChange` fires on **every keystroke** |
| Two-way binding | `[(ngModel)]` | `value={state}` + `onChange={handler}` |

Key quirk: React's `onChange` on text inputs behaves like Angular's `(input)`, not `(change)`.

*Reference: `app/src/app/stock-tracking/screens/ProfileScreen.tsx`, line 153*

---

### Q28: What is a React SyntheticEvent?
**A:** React wraps native browser events in a **SyntheticEvent** — a cross-browser wrapper that normalizes event behavior. You access it as the parameter in event handlers:

```tsx
onChange={(e) => setNewHomeName(e.target.value)}
//        ^ SyntheticEvent
//           ^ the DOM element that fired the event
//                    ^ the input's current text value
```

Common properties: `e.target`, `e.target.value`, `e.key` (for keyboard events), `e.preventDefault()`, `e.stopPropagation()`.

---

### Q29: How do you handle keyboard events in React?
**A:** Use `onKeyDown` (or `onKeyUp`, `onKeyPress`) with `e.key` to check which key was pressed:

```tsx
// ProfileScreen.tsx, line 155:
onKeyDown={(e) => e.key === 'Enter' && handleAddHome()}

// ConfirmDialog.tsx, line 26-27:
const handler = (e: KeyboardEvent) => {
  if (e.key === 'Escape') onCancel();
};
```

Common `e.key` values: `'Enter'`, `'Escape'`, `'ArrowDown'`, `'Tab'`, `'Backspace'`.

---

### Q30: Why use `onMouseDown` instead of `onClick` for dropdown items?
**A:** Browser event order is: `mousedown → blur → mouseup → click`.

When a user clicks a dropdown item while an input is focused:
1. `onMouseDown` fires on the dropdown item ← **before blur**
2. `onBlur` fires on the input (hides dropdown)
3. `onClick` fires on the dropdown item ← **after blur** (dropdown already gone!)

Using `onMouseDown` ensures the selection handler runs before the input's `onBlur` hides the dropdown.

```tsx
// HomeAccordion.tsx, line 422:
onMouseDown={() => {
  onUpdateProduct(home.id, product.id, { stockType: cat.name });
}}
```

This is often paired with `setTimeout` in `onBlur` as a belt-and-suspenders approach.

*Reference: `app/src/app/stock-tracking/HomeAccordion.tsx`, lines 384–397 (onBlur), line 422 (onMouseDown)*

---

### Q31: What is the difference between `e.stopPropagation()` and `e.preventDefault()`?
**A:**
- **`e.stopPropagation()`** — stops the event from bubbling up to parent elements. Used when clicking inside a modal should not trigger the backdrop's click handler.
- **`e.preventDefault()`** — prevents the browser's default behavior (e.g., form submission, link navigation).

```tsx
// EditProductModal.tsx, line 79 — stop click from reaching backdrop:
onClick={(e) => e.stopPropagation()}

// Form submission — prevent page reload:
onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
```

---

### Q32: What goes wrong if you use `{}` in an arrow function without `return`?
**A:** The function returns `undefined` instead of the expression's value:

```tsx
// WRONG — returns undefined, filters out everything:
items.filter((data) => { data.includes(filterText) })

// CORRECT — implicit return (no braces):
items.filter((data) => data.includes(filterText))

// CORRECT — explicit return (with braces):
items.filter((data) => { return data.includes(filterText); })
```

Rule: single expression → no braces (implicit return). Multiple statements → braces + explicit `return`.

---

## Session 9 — useEffect Hook

### Q33: What is `useEffect` and how does it relate to Angular lifecycle hooks?
**A:** `useEffect` is React's single API for side effects — it replaces three Angular lifecycle hooks:

| Angular | React `useEffect` |
|---------|-------------------|
| `ngOnInit()` | `useEffect(fn, [])` — runs once after first render |
| `ngOnDestroy()` | The cleanup function returned from `useEffect` |
| `ngOnChanges(changes)` | `useEffect(fn, [dep1, dep2])` — runs when deps change |

```tsx
// AppShellPortfolio.tsx, lines 30–40 — "ngOnInit" pattern:
useEffect(() => {
  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) { setUserName(name); }
  };
  fetchUser();
}, []);  // ← empty array = run once
```

*Reference: `app/src/app/stock-tracking/AppShellPortfolio.tsx`, lines 30–40*

---

### Q34: What does the dependency array in `useEffect` control?
**A:** It tells React **when** to re-run the effect:

| Dependency Array | When Effect Runs |
|-----------------|-----------------|
| `[]` (empty) | Once after first render only |
| `[open, onCancel]` | After first render + whenever `open` or `onCancel` changes |
| No array at all | After **every** render (usually a bug) |

```tsx
// ConfirmDialog.tsx, lines 24–31:
useEffect(() => {
  // ... add keydown listener
}, [open, onCancel]);  // Re-runs when open or onCancel changes
```

**Common mistake:** Forgetting `[]` makes the effect run on every render — adding a new event listener each time.

*Reference: `app/src/app/shared/ui/ConfirmDialog.tsx`, lines 24–31*

---

### Q35: What is the cleanup function in `useEffect`?
**A:** The function you `return` from `useEffect`. React calls it in two situations:
1. **Before re-running** the effect (when dependencies change)
2. **When the component unmounts** (removed from DOM)

```tsx
// ConfirmDialog.tsx, lines 24–31:
useEffect(() => {
  const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
  window.addEventListener('keydown', handler);     // SETUP
  return () => window.removeEventListener('keydown', handler);  // CLEANUP
}, [open, onCancel]);
```

Without cleanup, event listeners accumulate — each re-run adds a new one without removing the old.

Angular equivalent: `ngOnDestroy()` for unmount cleanup. But React cleanup also handles "dependency changed" — no Angular equivalent for that.

---

### Q36: Why can't `useEffect` be `async`?
**A:** `useEffect` expects its callback to return either `undefined` or a **cleanup function**. The `async` keyword makes a function return a **Promise** — which is neither.

```tsx
// ❌ WRONG — returns a Promise:
useEffect(async () => {
  const data = await fetch('/api');
}, []);

// ✅ CORRECT — define async inside, call it:
useEffect(() => {
  const loadData = async () => {
    const data = await fetch('/api');
    setData(data);
  };
  loadData();
}, []);
```

Angular's `ngOnInit` can be `async` because Angular ignores its return value. React uses the return value for cleanup.

*Reference: `app/src/app/stock-tracking/AppShellPortfolio.tsx`, lines 30–40*

---

### Q37: How does API data reach the UI in React (without Observables)?
**A:** No Observables, no subscriptions, no async pipe. The flow is:

```
1. useEffect runs after first render
2. async function calls API → await pauses until response
3. setState(data) stores the response in state
4. React re-renders the component (function re-runs)
5. JSX reads the new state and displays it
```

```tsx
// AppShellPortfolio.tsx, lines 43–74:
useEffect(() => {
  const loadData = async () => {
    setIsLoading(true);
    try {
      const homesFromApi = await api.getHomesWithProducts();
      setHomes(formattedHomes);  // ← This triggers re-render
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  loadData();
}, []);
```

Angular equivalent: `this.homes = data` (Zone.js detects → template updates).
React equivalent: `setHomes(data)` (schedules re-render → function re-runs → JSX reads new state).

---

## Session 10 — useRef Hook

### Q38: What is `useRef` and what is its Angular equivalent?
**A:** `useRef` creates a mutable reference object `{ current: value }` that persists across renders without causing re-renders. Its primary use is accessing DOM elements directly.

| Angular | React |
|---------|-------|
| `@ViewChild('fileInput') fileInput!: ElementRef` | `const fileInputRef = useRef<HTMLInputElement>(null)` |
| `#fileInput` template reference | `ref={fileInputRef}` JSX attribute |
| `this.fileInput.nativeElement` | `fileInputRef.current` |
| `this.fileInput.nativeElement.click()` | `fileInputRef.current?.click()` |

```tsx
// HomeAccordion.tsx, line 48:
const fileInputRef = useRef<HTMLInputElement>(null);

// HomeAccordion.tsx, line 219 — attach to DOM:
<input type="file" ref={fileInputRef} style={{ display: 'none' }} />

// HomeAccordion.tsx, line 64 — use it:
fileInputRef.current?.click();
```

*Reference: `app/src/app/stock-tracking/HomeAccordion.tsx`, lines 48–49, 217–232*

---

### Q39: What does `useRef` return and what is `.current`?
**A:** `useRef(initialValue)` returns a plain object: `{ current: initialValue }`. For DOM refs, you pass `null` as the initial value:

```tsx
const inputRef = useRef<HTMLInputElement>(null);
// Returns: { current: null }

// After React renders <input ref={inputRef} />:
// inputRef.current === the actual HTMLInputElement DOM node
```

- `.current` starts as `null` (before the element renders)
- React fills `.current` with the DOM node after render
- You read `.current` to access the DOM element — equivalent to `document.getElementById()` but scoped to the component

---

### Q40: Why does ref code use optional chaining (`?.`) when accessing `.current`?
**A:** Because `.current` starts as `null` and could theoretically be `null` if the element hasn't rendered yet or has been conditionally removed:

```tsx
// Safe — won't crash if current is null:
fileInputRef.current?.click();

// Unsafe — crashes with "Cannot read property 'click' of null":
fileInputRef.current.click();
```

This is the same reason you'd use `this.fileInput?.nativeElement.click()` in Angular when a `@ViewChild` might not exist yet.

*Reference: `app/src/app/stock-tracking/HomeAccordion.tsx`, line 64*

---

### Q41: What is the key difference between `useRef` and `useState`?
**A:** **Mutating `ref.current` does NOT trigger a re-render.** Setting state via `useState` always triggers a re-render.

| | `useState` | `useRef` |
|---|-----------|---------|
| Triggers re-render? | ✅ Yes | ❌ No |
| Value persists across renders? | ✅ Yes | ✅ Yes |
| Use for | Data that affects the UI | DOM access, timers, previous values |
| Read/write | `value` / `setValue(x)` | `ref.current` / `ref.current = x` |

**When to use which:**
- Need the UI to update when the value changes → `useState`
- Need to imperatively interact with a DOM element (focus, click, scroll) → `useRef`
- Need to store a value silently (timer ID, previous value) → `useRef`

---

### Q42: What is the "hidden input" pattern with `useRef`?
**A:** A common pattern for custom file upload buttons. The native `<input type="file">` is ugly and hard to style, so you:

1. Hide the real input with `display: 'none'`
2. Create a styled button the user sees
3. Use `ref` to programmatically `.click()` the hidden input when the button is clicked

```tsx
// HomeAccordion.tsx, lines 48, 217–222:
const fileInputRef = useRef<HTMLInputElement>(null);

// Hidden input:
<input type="file" ref={fileInputRef} style={{ display: 'none' }}
       accept="image/*" onChange={(e) => onBillUpload(home.id, e)} />

// Visible button triggers it:
<button onClick={() => fileInputRef.current?.click()}>Upload Bill</button>
```

The user clicks the styled button → `ref.current?.click()` → browser opens file picker → user selects file → `onChange` fires → `onBillUpload` processes it.

*Reference: `app/src/app/stock-tracking/HomeAccordion.tsx`, lines 48–49, 217–232, 59–76*

---

### Q43: Why would storing a DOM element in `useState` instead of `useRef` cause problems?
**A:** It creates an **infinite render loop**:

```tsx
// ❌ BAD — infinite loop:
const [inputEl, setInputEl] = useState<HTMLInputElement | null>(null);
<input ref={(el) => setInputEl(el)} />
// 1. React renders → calls ref callback → setInputEl(el)
// 2. setState triggers re-render → React renders again
// 3. Calls ref callback again → setInputEl(el) → re-render → infinite loop
```

```tsx
// ✅ GOOD — no re-render:
const inputRef = useRef<HTMLInputElement>(null);
<input ref={inputRef} />
// React sets inputRef.current = el silently, no re-render triggered
```

`useRef` exists specifically because you need a mutable container that does not trigger the render cycle.

---

## Session 12 — useMemo & useCallback Hooks

### Q44: What is `useMemo` and why does React need it?
**A:** `useMemo(fn, deps)` caches the **return value** of `fn` and only recalculates when a dependency changes. React needs it because the component function re-runs entirely on every render — every variable, every computation is recreated from scratch. `useMemo` is an escape hatch that says "don't redo this work if the inputs haven't changed."

```tsx
// InventoryScreen.tsx, lines 35–43:
const categories = useMemo(() => {
  const cats = new Set<string>();
  products.forEach((p) => {
    if (p.stockType && p.stockType.trim()) cats.add(p.stockType.trim());
  });
  return Array.from(cats).sort();
}, [products]);  // Only recalculates when products changes
```

Angular equivalent: a **pure pipe** — it caches output and only recalculates when input changes. In Angular, class properties persist between change detection cycles, so there's no need for explicit memoization.

*Reference: `app/src/app/stock-tracking/screens/InventoryScreen.tsx`, lines 35–43*

---

### Q45: What is `useCallback` and how does it differ from `useMemo`?
**A:** `useCallback(fn, deps)` caches the **function itself** (the reference), not its return value. It's shorthand for `useMemo(() => fn, deps)`.

| Hook | Caches | Returns | Use when |
|------|--------|---------|----------|
| `useMemo(fn, deps)` | The **result** of calling `fn` | The cached value | Expensive computation (filtering, sorting) |
| `useCallback(fn, deps)` | The **function** `fn` itself | The cached function reference | Passing callbacks to child components |

```tsx
// SignInForm.tsx, lines 57–64:
const persistCredentials = useCallback((data: SignInFormValues) => {
  if (rememberMe) {
    window.localStorage.setItem(storageKey, JSON.stringify({...}));
  } else {
    window.localStorage.removeItem(storageKey);
  }
}, [rememberMe]);  // Recreates only when rememberMe changes
```

**Why cache a function?** Every render creates new function objects. Without `useCallback`, a child component receiving `persistCredentials` as a prop would see a "new" function every render and re-render unnecessarily.

*Reference: `app/src/app/stock-tracking/SignInForm.tsx`, lines 57–64*

---

### Q46: How does the dependency array work in `useMemo`?
**A:** Same rules as `useEffect`:

| Dependency Array | When it recalculates |
|-----------------|---------------------|
| `[]` (empty) | Once on first render, cached forever |
| `[products]` | When `products` reference changes |
| `[products, searchQuery, activeCategory]` | When **any** of the three changes |

Each `useMemo` has its own **independent** dependency array. Changing `searchQuery` recalculates `filteredProducts` but NOT `categories` (which only depends on `products`):

```tsx
// InventoryScreen.tsx:
const categories = useMemo(() => {...}, [products]);           // NOT affected by searchQuery
const filteredProducts = useMemo(() => {...}, [products, searchQuery, activeCategory]);  // IS affected
```

*Reference: `app/src/app/stock-tracking/screens/InventoryScreen.tsx`, lines 35–54*

---

### Q47: When should you use `useMemo` vs just computing the value directly?
**A:** Only use `useMemo` when there's a **real performance benefit**:

**Use `useMemo`:**
- Filtering/sorting large arrays (like `filteredProducts` with hundreds of items)
- Expensive computations (parsing, Set operations, complex transformations)
- Derived data that multiple parts of the JSX read

**Don't bother:**
- Simple expressions like `const isActive = tab === activeTab`
- String concatenation or basic math
- Values that are cheap to compute

Overusing `useMemo` adds complexity (dependency tracking, memory for cached values) without meaningful performance gain.

---

### Q48: What does `useMemo(() => {...}, [])` with empty deps do?
**A:** Computes the value **once** on the first render and caches it forever — the function never re-runs.

```tsx
// SignInForm.tsx, lines 24–39:
const storedCredentials = useMemo(() => {
  const stored = window.localStorage.getItem(storageKey);
  if (!stored) return { email: '', password: '', rememberMe: false };
  return JSON.parse(stored);
}, []);  // Parse localStorage once, never again
```

This is useful for expensive one-time operations like parsing localStorage or computing initial derived state. Same pattern as `useEffect(() => {}, [])` running once.

*Reference: `app/src/app/stock-tracking/SignInForm.tsx`, lines 24–39*

---

### Q49: Why should static arrays/objects be defined outside the component?
**A:** Variables defined inside the component are **recreated on every render**:

```tsx
// ❌ Recreated every render (wasteful):
export const App = () => {
  const fruits = ['Apple', 'Banana', 'Cherry'];  // new array each render
  // ...
};

// ✅ Created once, shared across renders:
const fruits = ['Apple', 'Banana', 'Cherry'];
export const App = () => {
  // fruits is the same reference every render
};
```

For dynamic data from props/state, it must be inside. For hardcoded constants, outside is cleaner and avoids unnecessary object creation.

---

## Session 13 — react-hook-form

### Q50: What is `react-hook-form` and how does it compare to Angular Reactive Forms?
**A:** `react-hook-form` is a library for form state management with validation. It's React's equivalent of Angular's `FormGroup`/`FormControl`/`Validators`.

| Angular Reactive Forms | react-hook-form |
|----------------------|-----------------|
| `new FormGroup({ email: new FormControl('') })` | `useForm({ defaultValues: { email: '' } })` |
| `Validators.required` | `{ required: 'Email is required' }` |
| `formControlName="email"` | `{...register('email', rules)}` |
| `formGroup.controls.email.errors` | `formState.errors.email?.message` |
| `[formGroup]="form"` + `(ngSubmit)` | `onSubmit={form.handleSubmit(onSubmit)}` |
| `formGroup.patchValue({...})` | `form.setValue('field', value)` |
| `formGroup.reset()` | `form.reset()` |

Key difference: `react-hook-form` uses **uncontrolled inputs** internally — it attaches to the DOM via `ref` and only reads values when needed, making it faster (fewer re-renders) than Angular's change-tracking approach.

*Reference: `app/src/app/stock-tracking/SignUpForm.tsx`, `app/src/app/stock-tracking/SignInForm.tsx`*

---

### Q51: What does `register()` return and how do you use it?
**A:** `register('fieldName', rules)` returns an object with props to connect an input to the form:

```tsx
register('email', { required: 'Email is required' })
// Returns: { onChange: fn, onBlur: fn, ref: fn, name: 'email' }
```

You spread it directly on the input:
```tsx
<input {...form.register('email', { required: 'Email is required' })} />
// Equivalent to:
<input onChange={fn} onBlur={fn} ref={fn} name="email" />
```

`register` combines the job of Angular's `formControlName` (connects input to form) AND `Validators` (attaches validation rules) in one call.

*Reference: `app/src/app/shared/ui/ReusableInput.tsx`, line 25*

---

### Q52: What does `handleSubmit` do and why is it required?
**A:** `handleSubmit(onValid)` wraps your submit handler with validation:

1. User clicks submit → `handleSubmit` runs all validation rules
2. If **all pass** → calls `onValid(data)` with typed form values
3. If **any fail** → does NOT call `onValid`, populates `formState.errors`

```tsx
// SignUpForm.tsx, line 47:
<form onSubmit={registerForm.handleSubmit(onSubmit)}>
```

**Without `handleSubmit`:**
```tsx
<form onSubmit={onSubmit}>  // ❌ Two problems:
// 1. No validation — onSubmit fires even with invalid fields
// 2. Wrong argument — receives FormEvent, not ContactForm data
```

*Reference: `app/src/app/stock-tracking/SignUpForm.tsx`, line 47*

---

### Q53: What validation rules does `react-hook-form` support?
**A:** From this codebase:

```tsx
// Required:
{ required: 'Email is required' }

// Pattern (regex):
{ pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } }

// Min length:
{ minLength: { value: 6, message: 'At least 6 characters' } }

// Custom validation:
{ validate: (value) => value === form.watch('password') || 'Passwords do not match' }
```

Custom `validate` returns `true` to pass, or an error string to fail. Used for cross-field validation like password confirmation.

*Reference: `app/src/app/stock-tracking/SignUpForm.tsx`, lines 55–91*

---

### Q54: What does `watch()` do and when do you need it?
**A:** `watch('fieldName')` subscribes to a field's current value reactively — like Angular's `this.form.get('password').value` but reactive.

```tsx
// SignUpForm.tsx, line 90:
validate: (value) => value === registerForm.watch('password') || 'Passwords do not match'
```

Use it for **cross-field validation** — when one field's validity depends on another field's value. Here, `confirmPassword` needs to match `password` in real-time.

*Reference: `app/src/app/stock-tracking/SignUpForm.tsx`, line 90*

---

### Q55: How does `ReusableInput` integrate with `react-hook-form`?
**A:** The parent passes `register` (the function) and `rules` as props. `ReusableInput` calls `register(name, rules)` internally, then separates `ref` from the rest using destructuring:

```tsx
// ReusableInput.tsx, lines 25–26:
const fieldProps = register && name ? register(name, rules) : {};
const { ref, ...restFieldProps } = fieldProps;
// ref = the callback ref for DOM access
// restFieldProps = { onChange, onBlur, name }

// Line 32–33:
<input {...restFieldProps} ref={ref} ... />
```

`ref` is separated because React handles it specially — it's not a regular prop. The rest operator (`...restFieldProps`) collects everything except `ref` into a new object.

*Reference: `app/src/app/shared/ui/ReusableInput.tsx`, lines 25–33*

---

> **This document will be updated after each learning session.**
