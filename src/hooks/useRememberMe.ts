/**
 * هوک مدیریت Remember Me
 * ذخیره Username در localStorage هنگام فعال بودن
 */
import { useState, useEffect, useCallback } from 'react';

const REMEMBER_KEY = 'rememberMe';
const USERNAME_KEY = 'savedUsername';

interface RememberMeState {
  rememberMe: boolean;
  savedUsername: string;
  setRememberMe: (value: boolean) => void;
  setUsername: (username: string) => void;
  clearSavedData: () => void;
}

export function useRememberMe(): RememberMeState {
  const [rememberMe, setRememberMeState] = useState<boolean>(() => {
    return localStorage.getItem(REMEMBER_KEY) === 'true';
  });

  const [savedUsername, setSavedUsername] = useState<string>(() => {
    if (localStorage.getItem(REMEMBER_KEY) === 'true') {
      return localStorage.getItem(USERNAME_KEY) || '';
    }
    return '';
  });

  useEffect(() => {
    localStorage.setItem(REMEMBER_KEY, String(rememberMe));
  }, [rememberMe]);

  const setRememberMe = useCallback((value: boolean) => {
    setRememberMeState(value);
    if (!value) {
      localStorage.removeItem(USERNAME_KEY);
      setSavedUsername('');
    }
  }, []);

  const setUsername = useCallback((username: string) => {
    setSavedUsername(username);
    if (rememberMe) {
      localStorage.setItem(USERNAME_KEY, username);
    }
  }, [rememberMe]);

  const clearSavedData = useCallback(() => {
    localStorage.removeItem(REMEMBER_KEY);
    localStorage.removeItem(USERNAME_KEY);
    setRememberMeState(false);
    setSavedUsername('');
  }, []);

  return { rememberMe, savedUsername, setRememberMe, setUsername, clearSavedData };
}
