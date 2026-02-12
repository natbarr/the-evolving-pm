# Hybrid Inline Form Validation

## Overview
Add real-time validation feedback to the submit form using a hybrid approach: validate on blur for most fields, validate on change for character limits.

## Problem
Current form validation only shows errors after submission:
- Users don't know if their input is valid until they submit
- Error messages are generic and appear in a single block
- No visual indication of field state (valid/invalid/touched)
- Character counter exists but doesn't warn when approaching limit

## Proposed Solution
Implement field-level validation with visual feedback:
- Validate URL and email fields on blur (when user leaves field)
- Validate context field on change with character limit warnings
- Show inline error messages below each field
- Add visual states (red border for errors, optional green for valid)

## User Stories
- As a user, I want to know immediately if my URL is invalid so I can fix it
- As a user, I want to see when I'm approaching the character limit
- As a user, I want clear, field-specific error messages

## Scope

### In Scope
- On blur validation for URL field (required, valid URL format)
- On blur validation for email field (valid email format if provided)
- On change validation for context field (character limit warning at 900+)
- Inline error messages below each field
- Visual field states (error border, error text color)
- Maintain existing Zod schema for server-side validation

### Out of Scope
- Password strength meters (no passwords)
- Async validation (e.g., checking if URL already submitted)

## Technical Approach

### State Management
```tsx
interface FieldState {
  value: string;
  touched: boolean;
  error: string | null;
}

const [fields, setFields] = useState({
  url: { value: '', touched: false, error: null },
  email: { value: '', touched: false, error: null },
  context: { value: '', touched: false, error: null },
});
```

### Validation Functions
```tsx
const validateUrl = (value: string): string | null => {
  if (!value) return 'URL is required';
  try {
    new URL(value);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

const validateEmail = (value: string): string | null => {
  if (!value) return null; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) ? null : 'Please enter a valid email';
};

const validateContext = (value: string): string | null => {
  if (value.length > 1000) return 'Context must be 1000 characters or less';
  return null;
};
```

### Event Handlers
```tsx
// On blur - validate URL and email
const handleBlur = (field: 'url' | 'email') => {
  setFields(prev => ({
    ...prev,
    [field]: {
      ...prev[field],
      touched: true,
      error: field === 'url' ? validateUrl(prev.url.value) : validateEmail(prev.email.value)
    }
  }));
};

// On change - always for context, clear errors for others
const handleChange = (field: string, value: string) => {
  setFields(prev => ({
    ...prev,
    [field]: {
      value,
      touched: prev[field].touched,
      error: field === 'context' ? validateContext(value) :
             prev[field].touched ? null : prev[field].error
    }
  }));
};
```

### UI Components
```tsx
// Field wrapper with error display
<div>
  <label>...</label>
  <input
    className={cn(
      inputClasses,
      field.touched && field.error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
    )}
    onBlur={() => handleBlur('url')}
    onChange={(e) => handleChange('url', e.target.value)}
    aria-invalid={field.touched && !!field.error}
    aria-describedby={field.error ? 'url-error' : undefined}
  />
  {field.touched && field.error && (
    <p id="url-error" className="mt-1 text-sm text-red-600">{field.error}</p>
  )}
</div>
```

### Character Limit Warning
```tsx
// Context field character counter with warning state
<p className={cn(
  "mt-1 text-sm",
  context.length > 900 ? "text-amber-600" : "text-primary-500",
  context.length > 1000 && "text-red-600"
)}>
  {context.length}/1000 characters
  {context.length > 900 && context.length <= 1000 && " - approaching limit"}
</p>
```

## Success Metrics
- Reduced form submission errors
- Faster form completion time
- Improved user satisfaction (qualitative)

## Dependencies
- None (using existing form structure)

## Estimated Effort
- Implementation: 2 hours
- Testing: 1 hour

## Decisions
- Show success state: Yes - green border when field is valid and touched

## Open Questions
- Should we debounce URL validation to avoid validating partial URLs as user types?
