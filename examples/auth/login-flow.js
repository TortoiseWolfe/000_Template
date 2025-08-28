/**
 * Example: Secure Login Flow
 * 
 * Purpose: Demonstrates secure authentication flow with JWT tokens
 * 
 * Key Patterns:
 * - Secure credential handling (never log passwords)
 * - JWT token management
 * - Refresh token rotation
 * - Rate limit awareness
 * - Error handling with user-friendly messages
 * 
 * Security Considerations:
 * - Passwords never stored in memory longer than needed
 * - Tokens stored in httpOnly cookies when possible
 * - CSRF protection enabled
 * - Rate limiting to prevent brute force
 * 
 * Accessibility:
 * - Form has proper ARIA labels
 * - Error messages announced to screen readers
 * - Loading states communicated
 */

import { z } from 'zod';

// Validation schema for login credentials
const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(12, 'Password must be at least 12 characters'),
  rememberMe: z.boolean().optional().default(false)
});

// Validation schema for API responses
const AuthResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    role: z.string(),
    permissions: z.array(z.string())
  })
});

/**
 * Main authentication class handling login flow
 */
class AuthenticationService {
  constructor(apiClient, tokenStorage) {
    this.apiClient = apiClient;
    this.tokenStorage = tokenStorage;
    this.refreshPromise = null;
    this.rateLimitRetryAfter = null;
  }

  /**
   * Authenticate user with email and password
   * @param {Object} credentials - User credentials
   * @returns {Promise<Object>} User object with tokens
   */
  async login(credentials) {
    try {
      // Validate input
      const validatedData = LoginSchema.parse(credentials);
      
      // Check if rate limited
      if (this.isRateLimited()) {
        throw new AuthError(
          'Too many login attempts. Please try again later.',
          'RATE_LIMITED',
          { retryAfter: this.rateLimitRetryAfter }
        );
      }

      // Prepare request (never log password)
      const requestData = {
        email: validatedData.email,
        password: validatedData.password,
        // Add CSRF token if available
        csrfToken: await this.getCSRFToken()
      };

      // Make login request
      const response = await this.apiClient.post('/auth/login', requestData, {
        timeout: 10000, // 10 second timeout
        retry: false // Don't retry failed auth attempts
      });

      // Validate response structure
      const authData = AuthResponseSchema.parse(response.data);

      // Store tokens securely
      await this.storeTokens(authData, validatedData.rememberMe);

      // Clear any rate limit tracking
      this.clearRateLimit();

      // Return user data (without tokens)
      return {
        user: authData.user,
        expiresAt: Date.now() + (authData.expiresIn * 1000)
      };

    } catch (error) {
      // Handle different error types
      if (error.response?.status === 401) {
        throw new AuthError(
          'Invalid email or password',
          'INVALID_CREDENTIALS'
        );
      }
      
      if (error.response?.status === 429) {
        // Handle rate limiting
        const retryAfter = error.response.headers['retry-after'];
        this.setRateLimit(retryAfter);
        throw new AuthError(
          `Too many attempts. Please try again in ${retryAfter} seconds.`,
          'RATE_LIMITED',
          { retryAfter }
        );
      }

      if (error instanceof z.ZodError) {
        throw new AuthError(
          'Invalid input data',
          'VALIDATION_ERROR',
          { errors: error.errors }
        );
      }

      // Log error for debugging (never log passwords!)
      console.error('Login error:', {
        error: error.message,
        code: error.code,
        // Safe to log email, but not password
        email: credentials.email
      });

      throw new AuthError(
        'An error occurred during login. Please try again.',
        'UNKNOWN_ERROR'
      );
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken() {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this._performRefresh();
    
    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  async _performRefresh() {
    try {
      const refreshToken = await this.tokenStorage.getRefreshToken();
      
      if (!refreshToken) {
        throw new AuthError('No refresh token available', 'NO_REFRESH_TOKEN');
      }

      const response = await this.apiClient.post('/auth/refresh', {
        refreshToken,
        csrfToken: await this.getCSRFToken()
      });

      const authData = AuthResponseSchema.parse(response.data);
      
      // Update stored tokens
      await this.tokenStorage.updateTokens({
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        expiresIn: authData.expiresIn
      });

      return authData;
      
    } catch (error) {
      // Clear tokens on refresh failure
      await this.logout();
      throw new AuthError(
        'Session expired. Please login again.',
        'SESSION_EXPIRED'
      );
    }
  }

  /**
   * Logout user and clear tokens
   */
  async logout() {
    try {
      // Notify server of logout
      const refreshToken = await this.tokenStorage.getRefreshToken();
      if (refreshToken) {
        await this.apiClient.post('/auth/logout', {
          refreshToken,
          csrfToken: await this.getCSRFToken()
        }).catch(() => {
          // Ignore logout errors - clear tokens anyway
        });
      }
    } finally {
      // Always clear local tokens
      await this.tokenStorage.clearTokens();
    }
  }

  /**
   * Store tokens securely
   */
  async storeTokens(authData, rememberMe) {
    const options = {
      // Use secure storage for sensitive tokens
      secure: true,
      // HttpOnly cookies if in browser
      httpOnly: true,
      // SameSite for CSRF protection
      sameSite: 'strict',
      // Longer expiry if "remember me" checked
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined
    };

    await this.tokenStorage.setTokens({
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
      expiresIn: authData.expiresIn
    }, options);
  }

  /**
   * Get CSRF token for requests
   */
  async getCSRFToken() {
    // Implementation depends on your CSRF strategy
    return document.querySelector('meta[name="csrf-token"]')?.content || '';
  }

  /**
   * Check if currently rate limited
   */
  isRateLimited() {
    if (!this.rateLimitRetryAfter) return false;
    return Date.now() < this.rateLimitRetryAfter;
  }

  /**
   * Set rate limit retry time
   */
  setRateLimit(retryAfterSeconds) {
    const retryAfter = parseInt(retryAfterSeconds, 10) || 60;
    this.rateLimitRetryAfter = Date.now() + (retryAfter * 1000);
  }

  /**
   * Clear rate limit
   */
  clearRateLimit() {
    this.rateLimitRetryAfter = null;
  }
}

/**
 * Custom error class for authentication errors
 */
class AuthError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.details = details;
  }
}

/**
 * React Hook Example for using auth service
 */
export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  const authService = useMemo(() => 
    new AuthenticationService(apiClient, tokenStorage), 
    []
  );

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(credentials);
      setUser(result.user);
      
      // Announce success to screen readers
      announceToScreenReader('Login successful');
      
      return result;
    } catch (error) {
      setError(error);
      
      // Announce error to screen readers
      announceToScreenReader(`Login failed: ${error.message}`);
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      await authService.logout();
      setUser(null);
      announceToScreenReader('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  return {
    user,
    login,
    logout,
    isLoading,
    error,
    isAuthenticated: !!user
  };
}

/**
 * Helper to announce messages to screen readers
 */
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Export for use in other components
export { AuthenticationService, AuthError };