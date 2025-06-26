import { format, differenceInMinutes, parseISO } from 'date-fns';

export const formatDateTime = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy HH:mm:ss');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

export const formatTime = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'HH:mm:ss');
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid Time';
  }
};

export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

export const calculateWorkingHours = (loginTime: string, logoutTime: string): number => {
  try {
    const login = parseISO(loginTime);
    const logout = parseISO(logoutTime);
    
    const totalMinutes = differenceInMinutes(logout, login);
    return totalMinutes / 60; // Convert to hours with decimal
  } catch (error) {
    console.error('Error calculating working hours:', error);
    return 0;
  }
};

export const formatWorkingHours = (hours: number): string => {
  if (hours === 0) return '0h 0m';
  
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (wholeHours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${wholeHours}h`;
  } else {
    return `${wholeHours}h ${minutes}m`;
  }
};

export const getCurrentDateTime = (): string => {
  return new Date().toISOString();
};

export const formatLocationCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};
