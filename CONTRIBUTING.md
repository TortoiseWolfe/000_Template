# Contributing to PROJECT_NAME

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Documentation](#documentation)

## 📜 Code of Conduct

### Our Pledge
We are committed to providing a friendly, safe, and welcoming environment for all contributors.

### Expected Behavior
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Accept feedback gracefully
- Prioritize accessibility and security

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Public or private harassment
- Publishing private information
- Any unprofessional conduct

## 🚀 Getting Started

### Prerequisites
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/PROJECT_NAME.git
   cd PROJECT_NAME
   ```

3. Set up upstream remote:
   ```bash
   git remote add upstream https://github.com/TortoiseWolfe/PROJECT_NAME.git
   ```

4. Install dependencies:
   ```bash
   npm install
   cp .env.example .env
   ```

### Development Setup
```bash
# Start development environment
docker-compose up

# Or run locally
npm run dev
```

## 🔄 Development Process

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# Or for bugs: bug/issue-description
```

### 2. Create a PRP Document
Before coding, document your approach:
```bash
cp PRPs/templates/prp_base.md PRPs/your-feature.md
```

Include:
- Clear goal and success criteria
- Current vs desired state
- Task breakdown
- Validation loops
- Anti-patterns to avoid

### 3. Write Tests First (TDD)
```javascript
// Start with a failing test
describe('YourFeature', () => {
  it('should do something specific', () => {
    // Test implementation
  });
});
```

### 4. Implement Feature
- Follow examples in `examples/` directory
- Keep functions under 50 lines
- Ensure accessibility (ARIA labels, keyboard nav)
- No color-only information

### 5. Run Validation Loops
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
npm run test:a11y

# Level 6: Performance
npm run lighthouse
```

## 📝 Coding Standards

### JavaScript/TypeScript
```javascript
// Use meaningful variable names
const userAuthenticationToken = generateToken(); // ✅
const token = genTkn(); // ❌

// Prefer async/await over callbacks
async function fetchUserData(userId) {
  try {
    const user = await api.getUser(userId);
    return user;
  } catch (error) {
    logger.error('Failed to fetch user:', error);
    throw new UserFetchError(error.message);
  }
}

// Always handle errors explicitly
```

### Component Structure (React Example)
```jsx
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

export function Component({ title, onAction }) {
  const [state, setState] = useState(false);
  
  const handleClick = useCallback(() => {
    setState(prev => !prev);
    onAction?.(state);
  }, [state, onAction]);
  
  return (
    <button 
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

### CSS/Styling
- Use CSS modules or styled-components
- Follow design system tokens
- Ensure 4.5:1 contrast ratio minimum
- Test with colorblind filters

### Git Commit Messages
Format: `type(scope): description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```bash
feat(auth): add OAuth2 login support
fix(api): handle rate limiting errors
docs(readme): update deployment instructions
test(a11y): add colorblind accessibility tests
```

## 🧪 Testing Requirements

### Coverage Requirements
- Unit tests: >80% coverage
- Integration tests: All API endpoints
- E2E tests: Critical user paths
- Accessibility tests: All pages

### Writing Tests
```javascript
describe('Feature', () => {
  // Arrange
  beforeEach(() => {
    // Setup
  });
  
  // Act & Assert
  it('should handle normal case', () => {
    // Test implementation
  });
  
  it('should handle edge case', () => {
    // Edge case test
  });
  
  it('should handle error case', () => {
    // Error handling test
  });
  
  // Cleanup
  afterEach(() => {
    // Cleanup
  });
});
```

### Accessibility Testing
Every feature must:
- Pass WCAG 2.1 AA standards
- Work without color (colorblind safe)
- Support keyboard navigation
- Work with screen readers
- Have proper ARIA labels

## 🔀 Pull Request Process

### Before Submitting
1. Update from upstream:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Ensure all tests pass:
   ```bash
   npm run validate:all
   ```

3. Update documentation if needed

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Accessibility tests pass

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] PR title follows conventional commits

## Related Issues
Fixes #123
```

### Review Process
1. Automated checks must pass
2. At least one reviewer approval required
3. Resolve all conversations
4. Squash and merge preferred

## 📚 Documentation

### Where to Document
- **Code**: JSDoc/docstrings for functions
- **API**: OpenAPI/Swagger specs
- **Features**: Update relevant .md files
- **Architecture**: ADR for decisions

### Documentation Standards
```javascript
/**
 * Authenticates a user with credentials
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<User>} Authenticated user object
 * @throws {AuthError} If authentication fails
 * @example
 * const user = await authenticate({
 *   email: 'user@example.com',
 *   password: 'securePassword123'
 * });
 */
async function authenticate(credentials) {
  // Implementation
}
```

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in commit co-authors

## 💬 Getting Help

- **Questions**: Open a discussion
- **Bugs**: Open an issue
- **Security**: See SECURITY.md
- **Chat**: Join our Discord

## 📋 Checklist for Contributors

Before submitting your PR, ensure:

- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Lint and format passing
- [ ] Accessibility verified
- [ ] Performance checked
- [ ] Security considered
- [ ] PR template completed

Thank you for contributing! 🎉