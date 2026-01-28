# Cursor AI - Prompt Templates Cheat Sheet

Quick copy-paste prompts for common tasks in TFA Farm OS development.

---

## 📦 Component Generation

### Basic Component

```
Create [ComponentName] component at [path].

Props:
- [prop1]: [type] - [description]
- [prop2]: [type] - [description]

Features:
- [feature 1]
- [feature 2]

Use TFA color system from tailwind.config.ts.
Use Lucide React for icons.
Make it responsive (mobile-first).
Include TypeScript types.
```

### Dashboard Component

```
Create components/dashboard/[ComponentName].tsx that:
1. [Primary feature]
2. [Secondary feature]
3. Uses TFA colors (bg-tfa-bg-secondary, text-tfa-accent, etc.)
4. Follows the design in docs/TFA_Farm_OS_PRD.md
5. Matches the style of existing dashboard components
6. Includes hover states and transitions
7. Is responsive (mobile → desktop)

Export as default.
Include prop types.
```

---

## 🔌 API Route Generation

### Basic CRUD API

```
Create app/api/[resource]/route.ts with:

GET: List all [resources] with optional filters
- Query params: [param1], [param2]
- Return: Array of [Resource] objects
- Include pagination

POST: Create new [resource]
- Body: [Resource] data
- Validate: [validation rules]
- Return: Created [resource] with ID

Use supabaseAdmin from lib/supabase/client.ts.
Include error handling with proper status codes.
Add request validation with Zod.
Follow the database schema in supabase/migrations/001_initial_schema.sql.
```

### Single Resource API

```
Create app/api/[resource]/[id]/route.ts with:

GET: Fetch single [resource] by ID
- Include related data: [relations]
- Return 404 if not found

PUT: Update [resource]
- Body: Partial [resource] data
- Validate updates
- Return updated [resource]

DELETE: Remove [resource]
- Soft delete (set deleted_at)
- Return 204 on success

Use supabaseAdmin.
Include error handling.
Add authorization checks.
```

---

## 🪝 Custom Hook Generation

```
Create lib/hooks/use[ResourceName].ts hook that:

Features:
- Fetches [resources] from /api/[endpoint]
- Supports filtering by [filters]
- Uses React Query for caching
- Subscribes to Supabase Realtime for live updates
- Returns: { data, isLoading, error, refetch }

Include TypeScript types.
Handle loading and error states.
Example usage in JSDoc comment.
```

---

## 🧪 Test Generation

### Component Test

```
Create unit tests for [component-path].tsx using Jest and React Testing Library.

Cover:
1. Renders correctly with all props
2. [Interactive feature] works (click, hover, etc.)
3. Displays correct state when [condition]
4. Handles edge cases: [edge cases]
5. Accessibility: keyboard navigation, ARIA labels

Place test at: [component-path].test.tsx
Use TFA test utilities if available.
Mock API calls with msw.
Aim for >80% coverage.
```

### E2E Test

```
Create Playwright test at tests/e2e/[feature].spec.ts that:

User flow:
1. [Step 1]
2. [Step 2]
3. [Step 3]
4. Verify [expected outcome]

Test both happy path and error cases.
Use page object pattern for reusability.
Include screenshots on failure.
```

---

## 🗺️ Mapbox Integration

```
Create/update [component] to integrate Mapbox:

1. Initialize map centered on Steelpoort [-24.7333, 29.9167]
2. Add plot boundaries from /api/plots as GeoJSON
3. Style plots by status:
   - completed: tfa-primary fill
   - in-progress: warning fill
   - pending: muted fill
4. Add click handler → show popup with plot details
5. Add zoom controls
6. Add layer toggle: satellite/streets
7. Add legend

Use NEXT_PUBLIC_MAPBOX_TOKEN from env.
Handle loading state.
Handle errors gracefully.
Make map responsive.
```

---

## 📊 Data Visualization

```
Create [ChartComponent] using Recharts that displays:

Data: [data source]
Chart Type: [Line/Bar/Area/Pie]
X-axis: [label]
Y-axis: [label]
Colors: Use TFA color palette
Features:
- Tooltip on hover
- Legend
- Responsive sizing
- Empty state message
- Loading skeleton

Fetch data from [API endpoint].
Update every [interval].
Export as PNG button.
```

---

## 🎨 Styling Fixes

```
Update [component] styling to:
1. Use TFA color tokens instead of hardcoded colors
2. Fix [specific issue]
3. Improve responsiveness on [device size]
4. Add hover states
5. Fix dark mode contrast issues

Reference TFA color system in docs/TFA_COLOR_SYSTEM.md.
Test on mobile (375px), tablet (768px), desktop (1920px).
Ensure WCAG AA contrast compliance.
```

---

## 🐛 Bug Fixes

```
Debug and fix issue in [file-path]:

Issue: [Describe the bug]
Expected: [Expected behavior]
Actual: [Actual behavior]

Steps to reproduce:
1. [Step 1]
2. [Step 2]
3. [Bug occurs]

Fix the issue while maintaining existing functionality.
Add tests to prevent regression.
Explain the root cause in comments.
```

---

## 🔄 Refactoring

```
Refactor [file-path] to:
1. Extract [repeated logic] into utility function
2. Improve [performance/readability/maintainability]
3. Add TypeScript types
4. Simplify [complex logic]
5. Keep existing functionality intact

Add unit tests for new utilities.
Update existing tests if needed.
Follow existing code patterns.
```

---

## 🔐 Authentication

```
Add authentication to [route/component]:

1. Check if user is authenticated
2. Redirect to /login if not
3. Get user profile from Supabase
4. Verify user has required role: [roles]
5. Show error message if unauthorized

Use Supabase Auth.
Follow middleware pattern in existing protected routes.
Add loading state during auth check.
```

---

## 📱 Mobile Optimization

```
Optimize [component] for mobile:

Issues:
- [Touch targets too small]
- [Text not readable]
- [Layout breaks on mobile]

Fixes needed:
- Increase touch target to min 44px
- Use responsive text sizes (text-base → text-sm on mobile)
- Stack vertically on <768px
- Add swipe gestures where appropriate
- Test on iOS Safari and Chrome Android

Use Tailwind responsive prefixes (sm:, md:, lg:).
Test on real devices if possible.
```

---

## 🌐 API Integration

```
Integrate [external API] in lib/api/[service].ts:

API: [API name and docs URL]
Endpoint: [endpoint]
Auth: [API key in .env as API_KEY_NAME]

Features:
- Fetch [data]
- Transform to our data model
- Cache responses (5 minutes)
- Handle rate limits
- Retry on failure (3 attempts)
- Type responses with TypeScript

Export functions:
- fetch[Resource]()
- format[Resource]()

Include error handling.
Add JSDoc comments.
```

---

## 📝 Form Creation

```
Create [FormName] form component:

Fields:
- [field1]: [input type] - [validation]
- [field2]: [input type] - [validation]
- [field3]: [input type] - [validation]

Features:
- React Hook Form for state management
- Zod for validation
- Show field errors inline
- Disable submit while loading
- Success/error toast notifications
- Reset form after successful submit

Submit to: [API endpoint]
Use TFA form styling (inputs, buttons, labels).
Accessible (labels, error announcements).
```

---

## 🔔 Notification System

```
Add notification system to [component]:

Types: success, error, warning, info
Features:
- Toast appears in top-right
- Auto-dismiss after 5 seconds
- Manually dismissable
- Queue multiple notifications
- Icon based on type
- Use TFA colors

Use [library: react-hot-toast / sonner / custom]
Integrate with existing UI.
Add to layout for global access.
```

---

## 📦 Package Installation

```
Which package should I use for [feature]?

Requirements:
- [requirement 1]
- [requirement 2]
- Compatible with Next.js 14
- TypeScript support
- Active maintenance
- Small bundle size

Suggest package with pros/cons.
Show installation command.
Provide basic usage example.
```

---

## 🎯 Quick Fixes

### "Fix TypeScript errors in [file]"
```
Fix all TypeScript errors in [file-path].
Maintain existing functionality.
Don't use 'any' types.
Add proper interfaces/types.
```

### "Add loading state to [component]"
```
Add loading state to [component-path]:
- Show skeleton/spinner while data loads
- Disable interactions during loading
- Use TFA color for spinner
- Smooth transitions
```

### "Handle errors in [component]"
```
Add error handling to [component-path]:
- Show user-friendly error message
- Include retry button
- Log error to console
- Don't expose technical details to user
```

---

## 🚀 Performance Optimization

```
Optimize performance of [component/page]:

Issues:
- [Slow initial load]
- [Re-renders too often]
- [Large bundle size]

Optimizations:
- Lazy load heavy components
- Memoize expensive calculations
- Debounce API calls
- Code split routes
- Optimize images

Measure before/after with Lighthouse.
Aim for <3s load time.
```

---

## 💡 Best Practices Reminder

When using these prompts:

1. **Always provide context files:**
   - Add PRD, color system, existing components
   - Cursor generates better code with more context

2. **Be specific:**
   - "Red button" → "bg-error hover:bg-error-dark button"
   - "Make it pretty" → "Add shadow-tfa-md, rounded-lg, border-tfa-border"

3. **Reference existing patterns:**
   - "Follow the pattern in [existing-file].tsx"
   - "Match the style of [component-name]"

4. **Iterate:**
   - First generation might not be perfect
   - Refine: "Now add [feature]" or "Change [aspect]"

5. **Test as you go:**
   - Generate component → Generate test → Run test
   - Don't wait until the end

---

## 🔗 Quick Links

- **PRD:** `docs/TFA_Farm_OS_PRD.md`
- **Colors:** `docs/TFA_COLOR_SYSTEM.md`
- **Schema:** `supabase/migrations/001_initial_schema.sql`
- **TODO:** `TODO.md`
- **Guide:** `CURSOR_GUIDE.md`

---

**Pro Tip:** Bookmark this file in Cursor! Right-click in file explorer → "Pin to Top"

**Keyboard Shortcut:** Cmd/Ctrl + K to quickly search for prompts in this file.
