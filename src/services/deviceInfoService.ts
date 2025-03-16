import axios from 'axios';

interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
  userAgent: string;
}

/**
 * Detects browser information from user agent
 */
export const detectBrowser = (userAgent: string): string => {
  const browsers = [
    { name: 'Chrome', regex: /Chrome\/([0-9.]+)/ },
    { name: 'Firefox', regex: /Firefox\/([0-9.]+)/ },
    { name: 'Safari', regex: /Safari\/([0-9.]+)/ },
    { name: 'Edge', regex: /Edg(e)?\/([0-9.]+)/ },
    { name: 'Opera', regex: /OPR\/([0-9.]+)/ },
    { name: 'IE', regex: /Trident\/([0-9.]+)/ }
  ];

  for (const browser of browsers) {
    if (browser.regex.test(userAgent)) {
      const match = userAgent.match(browser.regex);
      const version = match ? match[1] || match[2] : '';
      return `${browser.name} ${version}`;
    }
  }

  return 'Unknown Browser';
};

/**
 * Detects operating system from user agent
 */
export const detectOS = (userAgent: string): string => {
  if (/Windows/.test(userAgent)) return 'Windows';
  if (/Macintosh|Mac OS X/.test(userAgent)) return 'macOS';
  if (/Linux/.test(userAgent)) return 'Linux';
  if (/Android/.test(userAgent)) return 'Android';
  if (/iPhone|iPad|iPod/.test(userAgent)) return 'iOS';
  return 'Unknown OS';
};

/**
 * Detects device type from user agent
 */
export const detectDevice = (userAgent: string): string => {
  if (/Mobile/.test(userAgent)) return 'Mobile';
  if (/Tablet/.test(userAgent)) return 'Tablet';
  if (/iPad/.test(userAgent)) return 'Tablet';
  return 'Desktop';
};

/**
 * Gets the user's IP address using a public API
 */
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Error getting IP address:', error);
    return 'Unknown';
  }
};

/**
 * Collects all device information
 */
export const collectDeviceInfo = async (): Promise<{deviceInfo: DeviceInfo, ipAddress: string}> => {
  const userAgent = navigator.userAgent;
  
  const deviceInfo: DeviceInfo = {
    browser: detectBrowser(userAgent),
    os: detectOS(userAgent),
    device: detectDevice(userAgent),
    userAgent: userAgent
  };

  const ipAddress = await getUserIP();
  
  return {
    deviceInfo,
    ipAddress
  };
}; 