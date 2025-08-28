# AI Assistant Context for PROJECT_NAME

*Last Updated: 2025-08-28*

## Project Overview

**Project**: PROJECT_NAME
**Description**: [One-sentence description of what this project does]
**Repository**: https://github.com/TortoiseWolfe/PROJECT_NAME
**Status**: Development/Production
**Confidence Score**: 8/10

## Tech Stack

### Frontend
- **Framework**: React/Next.js/Vue/Vanilla JS (choose one)
- **Styling**: Tailwind CSS / CSS Modules / Styled Components
- **State Management**: Context API / Redux / Zustand
- **Testing**: Jest, React Testing Library, Playwright

### Backend (if applicable)
- **Runtime**: Node.js / Python / Go
- **Framework**: Express / FastAPI / Gin
- **Database**: PostgreSQL / MongoDB / SQLite
- **ORM**: Prisma / SQLAlchemy / GORM

### Infrastructure
- **Deployment**: GitHub Pages / Vercel / Docker + VPS
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry / DataDog / Custom
- **Analytics**: Disabled by default (privacy-first)

## Project Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing - ALWAYS RUN BEFORE COMMITTING
npm run test         # Run all tests
npm run test:unit    # Unit tests only
npm run test:e2e     # End-to-end tests
npm run test:a11y    # Accessibility tests
npm run test:colorblind  # Colorblind accessibility

# Code Quality - MUST PASS
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix linting issues
npm run format       # Prettier formatting
npm run type-check   # TypeScript validation

# Performance
npm run lighthouse   # Lighthouse audit
npm run bundle-analyze  # Bundle size analysis

# Docker (if applicable)
docker-compose up    # Start all services
docker-compose down  # Stop all services
```

## Architecture Decisions

### State Management Pattern
- Use Context API for global state
- Keep component state local when possible
- Implement optimistic updates for better UX

### API Design
- RESTful endpoints with consistent naming
- GraphQL for complex data relationships
- Use API versioning (/api/v1/)

### Testing Strategy
- Unit tests for business logic (>80% coverage)
- Integration tests for API endpoints
- E2E tests for critical user paths
- Accessibility tests for all pages

### Security Practices
- Environment variables for all secrets
- Input validation on client and server
- Rate limiting on API endpoints
- CSP headers configured
- Regular dependency updates

## Development Workflow

### Feature Development
1. Create PRP document in PRPs/ folder
2. Write tests first (TDD approach)
3. Implement feature
4. Run validation loops
5. Update documentation
6. Create PR with comprehensive description

### Validation Loops (MUST COMPLETE)
```bash
# Level 1: Syntax
npm run lint:fix && npm run format

# Level 2: Types
npm run type-check

# Level 3: Unit Tests
npm run test:unit

# Level 4: Integration
npm run test:integration

# Level 5: Accessibility
npm run test:a11y && npm run test:colorblind

# Level 6: Performance
npm run lighthouse
```

## AI Assistant Guidelines

### DO's
- ✅ Follow existing patterns in examples/ folder
- ✅ Read specs/ before implementing features
- ✅ Run ALL validation loops before marking complete
- ✅ Test with screen readers (NVDA/JAWS)
- ✅ Ensure colorblind accessibility
- ✅ Use semantic HTML and ARIA labels
- ✅ Keep functions under 50 lines
- ✅ Write descriptive commit messages
- ✅ Update tests when changing code

### DON'Ts
- ❌ Skip validation loops
- ❌ Use color as the only indicator
- ❌ Hardcode configuration values
- ❌ Catch generic exceptions
- ❌ Create files > 500 lines
- ❌ Mock to make tests pass
- ❌ Ignore accessibility warnings
- ❌ Commit without running tests
- ❌ Use synchronous operations in async context

## Known Gotchas

### Common Issues
1. **Rate Limiting**: API calls limited to 60/min
2. **CORS**: Configure allowed origins in .env
3. **Bundle Size**: Keep under 500KB for optimal performance
4. **Color Contrast**: Minimum 4.5:1 ratio (7:1 for AAA)
5. **Focus Management**: Ensure keyboard navigation works

### Framework-Specific
- React: Use useCallback/useMemo for performance
- Next.js: Configure image optimization
- Vue: Proper reactivity with refs/reactive
- Node.js: Handle async errors properly
- Python: Use type hints consistently

## Current Context

### Active Features
- [List current features being developed]

### Technical Debt
- [List known technical debt items]

### Performance Metrics
- FCP: < 1s target
- TTI: < 3s target
- CLS: < 0.1
- Bundle Size: < 500KB

### Accessibility Status
- WCAG 2.1 AA compliant
- Screen reader tested
- Keyboard navigable
- Colorblind safe

## Project Patterns

### File Naming
- Components: PascalCase (Button.jsx)
- Utilities: camelCase (formatDate.js)
- Tests: *.test.js or *.spec.js
- Styles: *.module.css or styled.js

### Code Style
```javascript
// Example component structure
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './Component.module.css';

export function Component({ title, onAction }) {
  const [state, setState] = useState(false);
  
  const handleClick = useCallback(() => {
    setState(prev => !prev);
    onAction?.(state);
  }, [state, onAction]);
  
  return (
    <button 
      className={styles.button}
      onClick={handleClick}
      aria-pressed={state}
      aria-label={title}
    >
      {title}
    </button>
  );
}

Component.propTypes = {
  title: PropTypes.string.isRequired,
  onAction: PropTypes.func
};
```

## Integration Points

### External Services
- Authentication: Auth0 / Firebase / Custom JWT
- Database: Connection pooling configured
- Cache: Redis / In-memory
- Storage: S3 / Local filesystem
- Email: SendGrid / Resend

### Monitoring
- Error Tracking: Sentry configuration
- Performance: Web Vitals reporting
- Uptime: Pingdom / UptimeRobot
- Analytics: Opt-in only, GDPR compliant

## References

- [Design System](../specs/design-system.md)
- [API Documentation](../specs/api/)
- [Testing Guide](../docs/guides/testing.md)
- [Security Policy](../SECURITY.md)
- [Contributing Guide](../CONTRIBUTING.md)

## Confidence Score: 8/10

High confidence in structure and patterns. Adjust based on specific project requirements.