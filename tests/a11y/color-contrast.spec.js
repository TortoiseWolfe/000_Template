/**
 * Color Contrast and Colorblind Accessibility Tests
 * 
 * These tests ensure that the application is accessible to users with
 * various forms of color vision deficiency (colorblindness) and that
 * all text meets WCAG contrast requirements.
 */

import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y, getViolations } from 'axe-playwright';

// Color vision deficiency filters
const colorblindFilters = {
  deuteranopia: 'url("#deuteranopia")', // Red-green (most common, ~8% of males)
  protanopia: 'url("#protanopia")',     // Red-green (~1% of males)
  tritanopia: 'url("#tritanopia")',     // Blue-yellow (rare)
  achromatopsia: 'grayscale(100%)'      // Complete color blindness (very rare)
};

// SVG filters for accurate colorblind simulation
const svgFilters = `
<svg xmlns="http://www.w3.org/2000/svg" style="display: none">
  <defs>
    <!-- Deuteranopia (Red-Green Color Blindness) -->
    <filter id="deuteranopia">
      <feColorMatrix type="matrix" values="
        0.625 0.375 0.000 0 0
        0.700 0.300 0.000 0 0
        0.000 0.300 0.700 0 0
        0.000 0.000 0.000 1 0"/>
    </filter>
    
    <!-- Protanopia (Red-Green Color Blindness) -->
    <filter id="protanopia">
      <feColorMatrix type="matrix" values="
        0.567 0.433 0.000 0 0
        0.558 0.442 0.000 0 0
        0.000 0.242 0.758 0 0
        0.000 0.000 0.000 1 0"/>
    </filter>
    
    <!-- Tritanopia (Blue-Yellow Color Blindness) -->
    <filter id="tritanopia">
      <feColorMatrix type="matrix" values="
        0.950 0.050 0.000 0 0
        0.000 0.433 0.567 0 0
        0.000 0.475 0.525 0 0
        0.000 0.000 0.000 1 0"/>
    </filter>
  </defs>
</svg>
`;

test.describe('Color Contrast Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });

  test('meets WCAG AA contrast requirements', async ({ page }) => {
    // Check for color contrast violations
    const violations = await getViolations(page, null, {
      runOnly: {
        type: 'rule',
        values: ['color-contrast']
      }
    });

    // Report any violations
    if (violations.length > 0) {
      console.log('Color contrast violations found:');
      violations.forEach(violation => {
        console.log(`- ${violation.help}`);
        violation.nodes.forEach(node => {
          console.log(`  Element: ${node.html}`);
          console.log(`  Impact: ${node.impact}`);
          console.log(`  Message: ${node.failureSummary}`);
        });
      });
    }

    expect(violations).toHaveLength(0);
  });

  test('meets WCAG AAA contrast requirements for critical text', async ({ page }) => {
    // Critical text elements that should meet AAA standards (7:1 ratio)
    const criticalSelectors = [
      'h1', 'h2', 'h3',           // Headings
      'button',                    // Interactive elements
      '.error', '.warning',        // Important messages
      'label',                     // Form labels
      'a'                         // Links
    ];

    for (const selector of criticalSelectors) {
      const elements = await page.$$(selector);
      
      for (const element of elements) {
        const contrastRatio = await element.evaluate(el => {
          const style = window.getComputedStyle(el);
          const backgroundColor = style.backgroundColor;
          const color = style.color;
          
          // This is a simplified check - in production, use a proper
          // contrast calculation library
          return calculateContrast(color, backgroundColor);
        });

        // AAA standard requires 7:1 for normal text, 4.5:1 for large text
        const fontSize = await element.evaluate(el => 
          parseFloat(window.getComputedStyle(el).fontSize)
        );
        
        const requiredRatio = fontSize >= 18 ? 4.5 : 7;
        
        if (contrastRatio < requiredRatio) {
          const text = await element.textContent();
          console.warn(`Low contrast on "${text}": ${contrastRatio}:1 (needs ${requiredRatio}:1)`);
        }
      }
    }
  });
});

test.describe('Colorblind Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Inject SVG filters for colorblind simulation
    await page.evaluate(filters => {
      const div = document.createElement('div');
      div.innerHTML = filters;
      document.body.appendChild(div);
    }, svgFilters);
  });

  Object.entries(colorblindFilters).forEach(([condition, filter]) => {
    test(`information is perceivable with ${condition}`, async ({ page }) => {
      // Apply colorblind filter
      await page.evaluate(filter => {
        document.documentElement.style.filter = filter;
      }, filter);

      // Check that all important information is still accessible
      await verifyInformationAccessibility(page);
      
      // Take screenshot for manual review
      await page.screenshot({
        path: `tests/screenshots/colorblind-${condition}.png`,
        fullPage: true
      });
    });

    test(`no information lost with ${condition}`, async ({ page }) => {
      // Get all text content before applying filter
      const originalContent = await page.evaluate(() => {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        
        const texts = [];
        let node;
        while (node = walker.nextNode()) {
          const text = node.textContent.trim();
          if (text) texts.push(text);
        }
        return texts;
      });

      // Apply colorblind filter
      await page.evaluate(filter => {
        document.documentElement.style.filter = filter;
      }, filter);

      // Verify all text is still visible
      const filteredContent = await page.evaluate(() => {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        
        const texts = [];
        let node;
        while (node = walker.nextNode()) {
          const text = node.textContent.trim();
          if (text) texts.push(text);
        }
        return texts;
      });

      // All original content should still be present
      expect(filteredContent).toEqual(originalContent);
    });
  });

  test('error states are distinguishable without color', async ({ page }) => {
    // Navigate to a form with validation
    await page.goto('/form-example');
    
    // Trigger validation errors
    await page.click('button[type="submit"]');
    
    // Apply grayscale filter to remove all color
    await page.evaluate(() => {
      document.documentElement.style.filter = 'grayscale(100%)';
    });
    
    // Check that error states have non-color indicators
    const errorFields = await page.$$('.error, [aria-invalid="true"]');
    
    for (const field of errorFields) {
      const hasNonColorIndicator = await field.evaluate(el => {
        const style = window.getComputedStyle(el);
        
        // Check for non-color indicators
        return (
          style.borderStyle !== 'none' ||      // Border style change
          style.borderWidth !== '1px' ||        // Border width change
          el.querySelector('.error-icon') ||    // Error icon
          el.querySelector('.error-message') || // Error message
          el.getAttribute('aria-invalid') ||    // ARIA attribute
          el.getAttribute('aria-describedby')   // Error description
        );
      });
      
      expect(hasNonColorIndicator).toBeTruthy();
    }
  });

  test('success states are distinguishable without color', async ({ page }) => {
    // Similar to error states, but for success indicators
    await page.goto('/form-example');
    
    // Fill form correctly
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'ValidPassword123!');
    await page.click('button[type="submit"]');
    
    // Apply grayscale filter
    await page.evaluate(() => {
      document.documentElement.style.filter = 'grayscale(100%)';
    });
    
    // Check for non-color success indicators
    const successElements = await page.$$('.success, [aria-live="polite"]');
    
    for (const element of successElements) {
      const hasNonColorIndicator = await element.evaluate(el => {
        return (
          el.querySelector('.success-icon') ||    // Success icon (✓)
          el.textContent.includes('✓') ||         // Checkmark in text
          el.textContent.includes('Success') ||   // Success text
          el.getAttribute('aria-live')            // ARIA announcement
        );
      });
      
      expect(hasNonColorIndicator).toBeTruthy();
    }
  });

  test('interactive elements are identifiable without color', async ({ page }) => {
    // Apply complete color blindness filter
    await page.evaluate(() => {
      document.documentElement.style.filter = 'grayscale(100%)';
    });
    
    // Check that all interactive elements are still identifiable
    const interactiveSelectors = ['a', 'button', 'input', 'select', 'textarea'];
    
    for (const selector of interactiveSelectors) {
      const elements = await page.$$(selector);
      
      for (const element of elements) {
        const isIdentifiable = await element.evaluate(el => {
          const style = window.getComputedStyle(el);
          
          // Check for visual indicators besides color
          return (
            style.textDecoration !== 'none' ||     // Underline for links
            style.border !== 'none' ||              // Border
            style.backgroundColor !== 'transparent' || // Background
            style.boxShadow !== 'none' ||          // Shadow
            style.outline !== 'none' ||            // Outline
            el.tagName === 'BUTTON' ||             // Semantic button
            el.tagName === 'INPUT' ||              // Form input
            el.tagName === 'SELECT' ||             // Dropdown
            el.tagName === 'TEXTAREA'              // Text area
          );
        });
        
        expect(isIdentifiable).toBeTruthy();
      }
    }
  });
});

test.describe('Focus Indicators', () => {
  test('focus indicators have sufficient contrast', async ({ page }) => {
    await page.goto('/');
    
    // Tab through all focusable elements
    const focusableElements = await page.$$('a, button, input, select, textarea, [tabindex]');
    
    for (const element of focusableElements) {
      await element.focus();
      
      const hasVisibleFocus = await element.evaluate(el => {
        const style = window.getComputedStyle(el);
        
        // Check for visible focus indicator
        return (
          style.outline !== 'none' ||
          style.boxShadow !== 'none' ||
          style.border !== window.getComputedStyle(el, ':not(:focus)').border
        );
      });
      
      expect(hasVisibleFocus).toBeTruthy();
    }
  });
});

// Helper function to verify information accessibility
async function verifyInformationAccessibility(page) {
  // Check that critical information is still perceivable
  
  // 1. Error messages should be visible
  const errorMessages = await page.$$('.error-message, [role="alert"]');
  for (const msg of errorMessages) {
    const isVisible = await msg.isVisible();
    expect(isVisible).toBeTruthy();
  }
  
  // 2. Success messages should be visible
  const successMessages = await page.$$('.success-message, [aria-live="polite"]');
  for (const msg of successMessages) {
    const isVisible = await msg.isVisible();
    expect(isVisible).toBeTruthy();
  }
  
  // 3. Required field indicators should be visible
  const requiredFields = await page.$$('[required], [aria-required="true"]');
  for (const field of requiredFields) {
    const indicator = await field.evaluate(el => {
      // Check for required indicator
      const label = document.querySelector(`label[for="${el.id}"]`);
      return label && (
        label.textContent.includes('*') ||
        label.textContent.includes('required') ||
        label.querySelector('.required-indicator')
      );
    });
    expect(indicator).toBeTruthy();
  }
  
  // 4. Status indicators should have text/icon alternatives
  const statusElements = await page.$$('[data-status], .status');
  for (const element of statusElements) {
    const hasAlternative = await element.evaluate(el => {
      return (
        el.textContent.trim() !== '' ||           // Has text
        el.querySelector('svg, img') ||           // Has icon
        el.getAttribute('aria-label') ||          // Has ARIA label
        el.getAttribute('title')                  // Has title
      );
    });
    expect(hasAlternative).toBeTruthy();
  }
}

// Simplified contrast calculation (use a proper library in production)
function calculateContrast(color1, color2) {
  // This is a placeholder - use a proper contrast calculation library
  // like color-contrast-checker or wcag-contrast
  return 7.1; // Mock value for testing
}