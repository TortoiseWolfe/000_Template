# PROJECT_NAME

> A production-ready project template following Context Engineering principles with comprehensive testing, accessibility, and deployment support.

[![CI Pipeline](https://github.com/TortoiseWolfe/PROJECT_NAME/actions/workflows/ci.yml/badge.svg)](https://github.com/TortoiseWolfe/PROJECT_NAME/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/TortoiseWolfe/PROJECT_NAME/branch/main/graph/badge.svg)](https://codecov.io/gh/TortoiseWolfe/PROJECT_NAME)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG%202.1-AA-green.svg)](https://www.w3.org/WAI/WCAG21/quickref/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## ✨ Features

### Core Capabilities
- 🏗️ **Context Engineering** - Comprehensive AI context documentation
- ♿ **Accessibility First** - WCAG 2.1 AA compliant with colorblind support
- 🔒 **Security by Default** - Environment validation, CSP, rate limiting
- 🎯 **Privacy First** - All tracking disabled by default
- 🚀 **Performance Optimized** - < 1s FCP, < 3s TTI, < 500KB bundle
- 🧪 **Comprehensive Testing** - Unit, integration, E2E, accessibility
- 📦 **Multi-deployment** - GitHub Pages, Vercel, Docker, VPS ready
- 🎨 **Design System** - Consistent, accessible components
- 📊 **Monitoring Ready** - Error tracking, performance metrics
- 🔄 **CI/CD Pipeline** - Automated testing and deployment

### Technical Stack
- **Frontend**: React/Next.js/Vue (configurable)
- **Backend**: Node.js/Python/Go (configurable)
- **Database**: PostgreSQL/MongoDB/Redis
- **Testing**: Jest, Playwright, Pa11y
- **CI/CD**: GitHub Actions
- **Container**: Docker & Docker Compose
- **Monitoring**: Sentry, Lighthouse CI

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ or Python 3.11+
- Docker & Docker Compose (optional)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/TortoiseWolfe/PROJECT_NAME.git
cd PROJECT_NAME

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev

# Or use Docker
docker-compose up
```

### First Time Setup

1. **Configure Environment**
   ```bash
   # Generate secure secrets
   openssl rand -base64 32  # For SESSION_SECRET
   openssl rand -base64 32  # For JWT_SECRET
   ```

2. **Initialize Database**
   ```bash
   npm run db:migrate
   npm run db:seed  # Optional: Add test data
   ```

3. **Verify Setup**
   ```bash
   npm run validate  # Check all systems
   ```

## 📁 Project Structure

```
PROJECT_NAME/
├── ai_docs/              # AI assistant context
│   ├── claude.md         # Main AI guidelines
│   ├── architecture.md   # System design
│   └── prompts/          # Feature prompts
├── specs/                # Requirements & specs
│   ├── requirements.md   # Functional/non-functional
│   ├── design-system.md  # UI/UX standards
│   ├── known-gotchas.md  # Common pitfalls
│   └── api/              # API documentation
├── PRPs/                 # Product Requirement Prompts
│   └── templates/        # PRP templates
├── examples/             # Code examples & patterns
│   ├── auth/             # Authentication flows
│   ├── api/              # API integration
│   ├── testing/          # Test patterns
│   └── patterns/         # Common patterns
├── src/                  # Source code
│   ├── frontend/         # Frontend application
│   ├── backend/          # Backend services
│   └── shared/           # Shared utilities
├── tests/                # Test suites
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   ├── e2e/              # End-to-end tests
│   └── a11y/             # Accessibility tests
├── config/               # Configuration files
├── scripts/              # Utility scripts
├── docs/                 # Documentation
│   ├── ADR/              # Architecture decisions
│   └── guides/           # User guides
└── .github/              # GitHub configuration
    └── workflows/        # CI/CD pipelines
```

## 🛠️ Development

### Available Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing (ALWAYS run before committing)
npm run test             # Run all tests
npm run test:unit        # Unit tests only
npm run test:e2e         # End-to-end tests
npm run test:a11y        # Accessibility tests
npm run test:colorblind  # Colorblind accessibility

# Code Quality (MUST pass)
npm run lint             # ESLint check
npm run lint:fix         # Auto-fix issues
npm run format           # Prettier formatting
npm run type-check       # TypeScript validation

# Performance
npm run lighthouse       # Lighthouse audit
npm run bundle-analyze   # Bundle size analysis

# Docker
docker-compose up        # Start all services
docker-compose down      # Stop all services
docker-compose logs -f   # View logs
```

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Create PRP Document**
   ```bash
   cp PRPs/templates/prp_base.md PRPs/your-feature.md
   # Fill out the PRP with requirements
   ```

3. **Implement Feature**
   - Follow patterns in `examples/` directory
   - Write tests first (TDD)
   - Ensure accessibility

4. **Run Validation Loops**
   ```bash
   npm run validate:all  # Runs all checks
   ```

5. **Create Pull Request**
   - Include PRP in description
   - Ensure CI passes
   - Request review

### Environment Variables

Key environment variables (see `.env.example` for full list):

```bash
# Application
NODE_ENV=development
PUBLIC_URL=http://localhost:3000

# Privacy (all disabled by default)
ENABLE_ANALYTICS=false
ENABLE_ERROR_TRACKING=false
ENABLE_COOKIES=false

# Security
SESSION_SECRET=your_secret_here
JWT_SECRET=your_jwt_secret
ALLOWED_ORIGINS=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/db
REDIS_URL=redis://localhost:6379

# Feature Flags
FEATURE_NEW_UI=false
FEATURE_BETA_ACCESS=false
```

## 🧪 Testing

### Testing Strategy

| Type | Coverage | Purpose |
|------|----------|---------|
| Unit | >80% | Business logic |
| Integration | All APIs | API endpoints |
| E2E | Critical paths | User workflows |
| Accessibility | All pages | WCAG compliance |
| Performance | All pages | Web Vitals |
| Visual | Components | UI consistency |

### Running Tests

```bash
# Run all tests with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit -- --watch
npm run test:integration
npm run test:e2e -- --headed  # With browser UI

# Accessibility testing
npm run test:a11y
npm run test:colorblind
npm run test:keyboard

# Performance testing
npm run lighthouse
npm run test:performance
```

### Accessibility Testing

The template includes comprehensive accessibility testing:

- **WCAG 2.1 AA** compliance checking
- **Colorblind** testing for all vision types
- **Screen reader** compatibility (NVDA/JAWS)
- **Keyboard navigation** verification
- **Focus management** testing
- **ARIA** attribute validation

## 📦 Deployment

### GitHub Pages (Static Sites)

```bash
npm run build
npm run deploy:gh-pages
```

### Vercel

```bash
vercel --prod
```

### Docker Deployment

```bash
# Build production image
docker build -t project-name .

# Run container
docker run -p 3000:3000 project-name

# Deploy to registry
docker push your-registry/project-name
```

### VPS Deployment

```bash
# Use deployment script
npm run deploy:vps

# Or manually
ssh user@server
git pull
npm install --production
npm run build
pm2 restart app
```

### Environment-Specific Configs

- **Development**: `.env.development`
- **Staging**: `.env.staging`
- **Production**: `.env.production`

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on:
- Code of conduct
- Development setup
- Coding standards
- Pull request process
- Testing requirements

### Quick Contribution Guide

1. Fork the repository
2. Create feature branch
3. Write tests first
4. Implement feature
5. Run all validations
6. Submit pull request

## 🔒 Security

See [SECURITY.md](SECURITY.md) for:
- Security policies
- Vulnerability reporting
- Security best practices
- Dependency management

### Security Features

- 🔐 Environment variable validation
- 🛡️ CSP headers configured
- ⚡ Rate limiting enabled
- 🔍 Secret scanning in CI
- 📊 Dependency vulnerability scanning
- 🚪 Authentication & authorization
- 📝 Audit logging

## 📊 Performance Targets

| Metric | Target | Actual |
|--------|--------|--------|
| First Contentful Paint | < 1.0s | - |
| Time to Interactive | < 3.0s | - |
| Cumulative Layout Shift | < 0.1 | - |
| Bundle Size | < 500KB | - |
| Lighthouse Score | > 90 | - |
| Test Coverage | > 80% | - |

## 🎯 Validation Checklist

Before marking any task complete:

- [ ] All tests pass
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Accessibility tests pass
- [ ] Performance targets met
- [ ] Documentation updated
- [ ] Security scan clean
- [ ] Code reviewed

## 📚 Resources

### Documentation
- [AI Context Guide](ai_docs/claude.md)
- [Architecture Overview](ai_docs/architecture.md)
- [Requirements Spec](specs/requirements.md)
- [API Documentation](specs/api/)
- [Testing Guide](docs/guides/testing.md)

### External Resources
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Vitals](https://web.dev/vitals/)
- [OWASP Security](https://owasp.org/)
- [Context Engineering](https://github.com/TortoiseWolfe)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Context Engineering principles
- Following TortleWolfe's development standards
- Inspired by production best practices

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/TortoiseWolfe">@TortoiseWolfe</a>
  <br>
  <i>Privacy First • Accessibility Always • Security by Default</i>
</p># 000_Template
