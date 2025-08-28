# Known Gotchas and Common Pitfalls

*Last Updated: 2025-08-28*

This document catalogues common issues, quirks, and pitfalls encountered in this project and their solutions.

## Table of Contents
- [Framework-Specific Issues](#framework-specific-issues)
- [API and Network](#api-and-network)
- [Performance Issues](#performance-issues)
- [Accessibility Pitfalls](#accessibility-pitfalls)
- [Security Concerns](#security-concerns)
- [Testing Challenges](#testing-challenges)
- [Deployment Issues](#deployment-issues)
- [Browser Compatibility](#browser-compatibility)

## Framework-Specific Issues

### React

#### Issue: Stale Closure in useEffect
**Problem**: Variables captured in useEffect don't update
```javascript
// BAD - count will always be 0
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1); // Always adds 1 to initial count
  }, 1000);
  return () => clearInterval(timer);
}, []);
```

**Solution**: Use functional updates or include dependencies
```javascript
// GOOD - uses functional update
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);
  return () => clearInterval(timer);
}, []);
```

#### Issue: Memory Leaks with Subscriptions
**Problem**: Not cleaning up subscriptions causes memory leaks
**Solution**: Always return cleanup function from useEffect

#### Issue: Infinite Render Loops
**Problem**: Setting state in render or incorrect dependencies
**Solution**: Use useCallback/useMemo and check dependency arrays

### Next.js

#### Issue: Hydration Mismatch
**Problem**: Server and client render different content
**Solution**: Use useEffect for client-only content or dynamic imports

#### Issue: Image Optimization Breaking
**Problem**: Images not loading in production
**Solution**: Configure domains in next.config.js

### Node.js

#### Issue: Unhandled Promise Rejections
**Problem**: Async errors crash the application
**Solution**: Always use try/catch or .catch() with promises

#### Issue: Memory Leaks with Event Emitters
**Problem**: Not removing event listeners
**Solution**: Always call removeListener or use once()

### Python/FastAPI

#### Issue: Async Context Issues
**Problem**: Using blocking I/O in async functions
**Solution**: Use async libraries (aiohttp, asyncpg, etc.)

#### Issue: Pydantic Validation Errors
**Problem**: Unclear error messages for nested models
**Solution**: Use custom validators with clear error messages

## API and Network

### Rate Limiting

#### Issue: 429 Too Many Requests
**Limits**:
- Public API: 60 requests/minute
- Authenticated: 600 requests/minute
- Search endpoints: 10 requests/minute

**Solution**:
```javascript
// Implement exponential backoff
const backoff = async (fn, retries = 3) => {
  try {
    return await fn();
  } catch (error) {
    if (error.status === 429 && retries > 0) {
      await new Promise(r => setTimeout(r, 2 ** (4 - retries) * 1000));
      return backoff(fn, retries - 1);
    }
    throw error;
  }
};
```

### CORS Issues

#### Issue: CORS Blocking Requests
**Problem**: Browser blocks cross-origin requests
**Solution**: Configure ALLOWED_ORIGINS in .env and server

### Timeout Issues

#### Issue: Request Timeout
**Default Timeouts**:
- API Gateway: 30 seconds
- Database queries: 30 seconds
- File uploads: 5 minutes

**Solution**: Implement pagination or background jobs for long operations

## Performance Issues

### Bundle Size

#### Issue: Bundle Exceeds 500KB
**Common Causes**:
- Importing entire libraries (lodash, moment)
- Large images in bundle
- Duplicate dependencies

**Solution**:
```javascript
// BAD
import _ from 'lodash';

// GOOD
import debounce from 'lodash/debounce';
```

### Memory Leaks

#### Issue: Gradual Memory Increase
**Common Causes**:
- Unclosed database connections
- Global event listeners
- Circular references
- Large cached objects

**Solution**: Use weak references and proper cleanup

### Slow Initial Load

#### Issue: FCP > 1s
**Common Causes**:
- Render-blocking resources
- Large JavaScript bundles
- Unoptimized images

**Solution**: Code splitting, lazy loading, image optimization

## Accessibility Pitfalls

### Color Contrast

#### Issue: Insufficient Contrast Ratios
**Requirements**:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- AAA compliance: 7:1

**Testing**:
```bash
npm run test:contrast
```

### Colorblind Accessibility

#### Issue: Information Lost Without Color
**Problem**: Using only color to convey meaning
**Solution**: Always provide additional indicators (icons, text, patterns)

```javascript
// BAD
<div style={{ color: status === 'error' ? 'red' : 'green' }}>
  {message}
</div>

// GOOD
<div style={{ color: status === 'error' ? 'red' : 'green' }}>
  {status === 'error' ? '❌' : '✓'} {message}
</div>
```

### Keyboard Navigation

#### Issue: Focus Trapped or Lost
**Problem**: Modal dialogs not managing focus properly
**Solution**: Use focus-trap-react or similar library

### Screen Reader Issues

#### Issue: Dynamic Content Not Announced
**Problem**: Updates not communicated to screen readers
**Solution**: Use ARIA live regions

```html
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

## Security Concerns

### Authentication

#### Issue: JWT Token Expiry
**Problem**: Tokens expire during user session
**Solution**: Implement refresh token rotation

#### Issue: Session Fixation
**Problem**: Session ID doesn't change after login
**Solution**: Regenerate session after authentication

### Input Validation

#### Issue: SQL Injection
**Problem**: Concatenating user input in queries
**Solution**: Always use parameterized queries

#### Issue: XSS Attacks
**Problem**: Rendering user content without sanitization
**Solution**: Use DOMPurify or similar library

### File Uploads

#### Issue: Malicious File Uploads
**Checks Required**:
- File type validation (MIME and extension)
- File size limits (10MB default)
- Virus scanning
- Separate storage domain

## Testing Challenges

### Flaky Tests

#### Issue: Intermittent Test Failures
**Common Causes**:
- Timing issues
- Test order dependencies
- External service dependencies

**Solution**:
```javascript
// Use waitFor instead of fixed delays
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### Mocking Issues

#### Issue: Over-Mocking
**Problem**: Tests pass but production fails
**Solution**: Use integration tests with real services when possible

### Coverage Gaps

#### Issue: Untested Edge Cases
**Common Misses**:
- Error boundaries
- Loading states
- Empty states
- Network failures

## Deployment Issues

### Environment Variables

#### Issue: Missing Environment Variables
**Problem**: App crashes due to undefined variables
**Solution**: Validate environment on startup

```javascript
// env-check.js
const required = ['DATABASE_URL', 'API_KEY', 'SESSION_SECRET'];
const missing = required.filter(key => !process.env[key]);
if (missing.length) {
  throw new Error(`Missing env vars: ${missing.join(', ')}`);
}
```

### Build Failures

#### Issue: Works Locally, Fails in CI
**Common Causes**:
- Case sensitivity (Linux vs Windows/Mac)
- Missing dependencies in package.json
- Different Node versions

**Solution**: Use exact versions and Docker for consistency

### Database Migrations

#### Issue: Migration Conflicts
**Problem**: Multiple developers creating migrations
**Solution**: Use timestamp-based migration names

## Browser Compatibility

### Safari Issues

#### Issue: Date Input Problems
**Problem**: Safari doesn't support date inputs well
**Solution**: Use date picker library

#### Issue: Flexbox Bugs
**Problem**: Safari has flexbox rendering issues
**Solution**: Use explicit flex values

### Mobile Issues

#### Issue: iOS Zoom on Input Focus
**Problem**: Page zooms when input focused
**Solution**: Set font-size to 16px on inputs

#### Issue: 100vh on Mobile
**Problem**: 100vh includes browser chrome
**Solution**: Use CSS custom properties with JavaScript

```css
:root {
  --app-height: 100vh;
}

@supports (-webkit-touch-callout: none) {
  :root {
    --app-height: -webkit-fill-available;
  }
}
```

## Quick Reference

### Debug Commands

```bash
# Check bundle size
npm run bundle-analyze

# Test accessibility
npm run test:a11y

# Check for security issues
npm audit fix

# Test performance
npm run lighthouse

# Check TypeScript types
npm run type-check

# Validate environment
npm run env:check
```

### Common Fixes

| Issue | Quick Fix |
|-------|-----------|
| CORS error | Check ALLOWED_ORIGINS in .env |
| 429 error | Implement rate limiting/caching |
| Memory leak | Check useEffect cleanup |
| Slow performance | Run bundle-analyze |
| Test failing | Check for timing issues |
| Build failing | Check case sensitivity |
| Style broken | Clear cache, rebuild CSS |

## Contributing

Found a new gotcha? Add it here with:
1. Clear problem description
2. Code example of the issue
3. Solution with code example
4. Any relevant links or references

---

*Remember: Every gotcha documented saves hours of debugging!*