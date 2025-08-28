# Product Requirements Prompt: [FEATURE_NAME]

*Date: [YYYY-MM-DD]*
*Author: [Your Name]*
*Confidence Score: [1-10]/10*

## Goal

**Primary Objective**: [One sentence description of what we're building]

**Success Criteria**:
- [ ] [Specific, measurable outcome 1]
- [ ] [Specific, measurable outcome 2]
- [ ] [Specific, measurable outcome 3]
- [ ] All validation loops pass
- [ ] Accessibility tests pass (including colorblind)

## Context

### Current State
```
[Describe the current codebase structure]
Example:
- Frontend: React with TypeScript
- State: Context API
- Styling: Tailwind CSS
- Testing: Jest + React Testing Library
```

### Desired State
```
[Describe what the codebase should look like after implementation]
Example:
- New component: UserDashboard with metrics
- API endpoint: GET /api/v1/user/metrics
- Database: user_metrics table
- Tests: 100% coverage for new code
```

### Documentation References
- [Link to relevant specs]
- [Link to design mockups]
- [Link to API documentation]
- [Link to similar examples in codebase]

### Example Patterns to Follow
```javascript
// PATTERN: Follow examples/auth-flow.js lines 23-45
const authenticateUser = async (credentials) => {
  // Implementation following existing pattern
};

// MIRROR: Structure from examples/api-client.py
class MetricsClient:
    # Implementation mirroring existing client
```

### Known Gotchas
1. **Rate Limiting**: API calls limited to 60/minute
2. **Cache Invalidation**: Must clear cache after updates
3. **Browser Compatibility**: Test in Safari for date inputs
4. **Color Accessibility**: Ensure 4.5:1 contrast ratio

## Task Breakdown

### Task 1: Data Models and Schema
**Priority**: High
**Dependencies**: None
**Time Estimate**: 1 hour

**Implementation**:
1. Create database migration for user_metrics table
2. Define TypeScript interfaces/types
3. Create Zod/Yup validation schemas
4. Generate test fixtures

**Validation**:
- [ ] Migration runs successfully
- [ ] Types compile without errors
- [ ] Validation schemas tested
- [ ] Test data generates correctly

### Task 2: Backend API Implementation
**Priority**: High
**Dependencies**: Task 1
**Time Estimate**: 2 hours

**Implementation**:
1. Create GET /api/v1/user/metrics endpoint
2. Add authentication middleware
3. Implement caching strategy
4. Add rate limiting
5. Write integration tests

**Validation**:
- [ ] API returns correct data format
- [ ] Authentication works properly
- [ ] Rate limiting enforced
- [ ] Integration tests pass
- [ ] Error handling complete

### Task 3: Frontend Components
**Priority**: High
**Dependencies**: Task 2
**Time Estimate**: 3 hours

**Implementation**:
1. Create MetricsCard component
2. Create MetricsGrid container
3. Implement data fetching hooks
4. Add loading and error states
5. Ensure keyboard navigation
6. Add ARIA labels

**Validation**:
- [ ] Components render correctly
- [ ] Data displays accurately
- [ ] Loading states work
- [ ] Error handling works
- [ ] Keyboard navigation complete
- [ ] Screen reader tested

### Task 4: Styling and Responsiveness
**Priority**: Medium
**Dependencies**: Task 3
**Time Estimate**: 1 hour

**Implementation**:
1. Apply design system tokens
2. Ensure mobile responsiveness
3. Test color contrast (4.5:1 minimum)
4. Test with colorblind simulators
5. Add dark mode support

**Validation**:
- [ ] Matches design mockups
- [ ] Works on all screen sizes
- [ ] Contrast ratios pass
- [ ] Colorblind safe
- [ ] Dark mode works

### Task 5: Testing Suite
**Priority**: High
**Dependencies**: Tasks 1-4
**Time Estimate**: 2 hours

**Implementation**:
1. Write unit tests (>80% coverage)
2. Write integration tests
3. Write E2E tests for critical paths
4. Write accessibility tests
5. Write visual regression tests

**Validation**:
- [ ] Unit test coverage >80%
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Accessibility tests pass
- [ ] No visual regressions

### Task 6: Documentation
**Priority**: Medium
**Dependencies**: Tasks 1-5
**Time Estimate**: 30 minutes

**Implementation**:
1. Update API documentation
2. Add component documentation
3. Update README if needed
4. Add ADR if architectural decision made
5. Update changelog

**Validation**:
- [ ] API docs accurate
- [ ] Component docs complete
- [ ] Examples provided
- [ ] Changelog updated

## Validation Loops

Execute these in order. Do not proceed if any step fails.

### Level 1: Syntax and Style
```bash
npm run lint:fix
npm run format
npm run type-check
```

### Level 2: Unit Tests
```bash
npm run test:unit -- --coverage
# Coverage must be >80%
```

### Level 3: Integration Tests
```bash
npm run test:integration
npm run test:api
```

### Level 4: E2E Tests
```bash
npm run test:e2e
# Test in Chrome, Firefox, Safari
```

### Level 5: Accessibility Tests
```bash
npm run test:a11y
npm run test:colorblind
# Manual: Test with NVDA/JAWS
```

### Level 6: Performance Tests
```bash
npm run lighthouse
npm run bundle-analyze
# Ensure bundle increase <50KB
```

### Level 7: Security Scan
```bash
npm audit
npm run test:security
```

## Anti-Patterns to Avoid

### Code Anti-Patterns
- ❌ Don't use inline styles
- ❌ Don't hardcode values that should be configurable
- ❌ Don't skip error boundaries
- ❌ Don't use any TypeScript type
- ❌ Don't ignore linting warnings
- ❌ Don't create files >500 lines

### Accessibility Anti-Patterns
- ❌ Don't use color as the only indicator
- ❌ Don't skip heading levels
- ❌ Don't hide focus indicators
- ❌ Don't use placeholder as label
- ❌ Don't create keyboard traps
- ❌ Don't ignore screen reader warnings

### Performance Anti-Patterns
- ❌ Don't fetch data in render
- ❌ Don't skip memoization for expensive operations
- ❌ Don't load unnecessary dependencies
- ❌ Don't use synchronous operations
- ❌ Don't skip image optimization

### Security Anti-Patterns
- ❌ Don't trust user input
- ❌ Don't expose sensitive data in logs
- ❌ Don't skip authentication checks
- ❌ Don't use eval() or dangerouslySetInnerHTML
- ❌ Don't commit secrets

## Definition of Done

A task is ONLY complete when:

- [ ] All code written and committed
- [ ] All validation loops pass
- [ ] Test coverage >80%
- [ ] No linting errors or warnings
- [ ] Accessibility tests pass (including colorblind)
- [ ] Performance metrics met
- [ ] Documentation updated
- [ ] Code reviewed (if applicable)
- [ ] Deployed to staging (if applicable)

## Rollback Plan

If issues arise after deployment:

1. **Immediate**: Revert deployment to previous version
2. **Investigation**: Check error logs and monitoring
3. **Fix Forward**: If simple fix, deploy patch
4. **Full Rollback**: If complex, revert code changes
5. **Post-Mortem**: Document lessons learned

## Confidence Score: [X]/10

**Reasoning**:
- [Why this confidence level?]
- [What could increase confidence?]
- [What risks remain?]

## Notes

[Any additional context, assumptions, or considerations]

---

*Template Version: 1.0.0*
*Based on Context Engineering methodology*