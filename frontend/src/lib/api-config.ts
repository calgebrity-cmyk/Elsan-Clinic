export const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'elsanpublichealth.com' || host === 'www.elsanpublichealth.com') {
      return 'https://api.elsanpublichealth.com/api/v1';
    } else if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8000/api/v1';
    }
  }
  return envUrl;
};
