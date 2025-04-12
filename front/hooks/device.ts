/**
 * Custom hook for device detection and capability checking
 * Provides utilities to identify device types and their capabilities
 */
export const useDevice = () => {
  // Get the userAgent string
  const userAgent = navigator.userAgent;

  /**
   * Check if the device is mobile (includes tablets and phones)
   * @returns {boolean} True if the device is mobile
   */
  const isMobileDevice = (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent,
    );
  };

  /**
   * Check specifically for tablet devices
   * @returns {boolean} True if the device is a tablet
   */
  const isTablet = (): boolean => {
    return /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent);
  };

  /**
   * Check if the device supports touch interactions
   * @returns {boolean} True if touch is supported
   */
  const isTouchDevice = (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  /**
   * Check if the browser is in mobile emulation mode in DevTools
   * Modern browsers like Chrome and Firefox add "Touch" to userAgent in emulation mode
   * @returns {boolean} True if in emulation mode
   */
  const isEmulatingMobile = (): boolean => {
    return /Touch/i.test(navigator.userAgent);
  };

  /**
   * Check if the browser is Chrome
   * @returns {boolean} True if Chrome
   */
  function isChrome(): boolean {
    return /Chrome/i.test(userAgent);
  }

  /**
   * Check device capabilities including touch, pointer, hover support and screen properties
   * @returns {Object} Device capabilities
   */
  const checkDeviceCapabilities = () => {
    const capabilities = {
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      pointerSupport: !!window.PointerEvent,
      hoverSupport: window.matchMedia('(hover: hover)').matches,
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      devicePixelRatio: window.devicePixelRatio || 1,
    };

    return capabilities;
  };

  /**
   * Get device type based on media queries
   * @returns {string} Device type: 'mobile', 'tablet', or 'desktop'
   */
  const getDeviceType = (): string => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    if (mediaQuery.matches) {
      return window.matchMedia('(max-width: 480px)').matches
        ? 'mobile'
        : 'tablet';
    }

    return 'desktop';
  };

  /**
   * Comprehensive device detection combining user agent and capabilities
   * @returns {Object} Detailed device information
   */
  const detectDevice = () => {
    const capabilities = checkDeviceCapabilities();
    const userAgentInfo = {
      isMobile: isMobileDevice(),
      isTablet: isTablet(),
      isChrome: isChrome(),
      isTouchEnabled: isTouchDevice(),
    };

    let deviceType;

    // Check screen size and touch capabilities
    if (
      userAgentInfo.isTablet ||
      (capabilities.screenSize.width >= 600 &&
        capabilities.screenSize.width <= 1024)
    ) {
      deviceType = 'tablet';
    } else if (userAgentInfo.isMobile || capabilities.screenSize.width < 600) {
      deviceType = 'mobile';
    } else {
      deviceType = 'desktop';
    }

    // Check for Chrome DevTools emulation mode
    const isEmulation =
      isChrome() &&
      capabilities.touchSupport &&
      deviceType === 'desktop' &&
      isEmulatingMobile();

    return {
      deviceType,
      isEmulation,
      ...capabilities,
      ...userAgentInfo,
    };
  };

  return {
    detectDevice,
    getDeviceType,
  };
};
