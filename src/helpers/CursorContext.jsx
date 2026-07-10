import { createContext, useContext, useEffect, useState } from 'react';

const CursorContext = createContext({ cursorEnabled: true, toggleCursor: () => {} });

const getInitialCursor = () => {
  if (typeof window === 'undefined') return true;
  try {
    const saved = localStorage.getItem('customCursor');
    if (saved === 'on' || saved === 'off') return saved === 'on';
  } catch (e) { /* ignore */ }
  return true;
};

export const CursorProvider = ({ children }) => {
  const [cursorEnabled, setCursorEnabled] = useState(getInitialCursor);

  useEffect(() => {
    try {
      localStorage.setItem('customCursor', cursorEnabled ? 'on' : 'off');
    } catch (e) { /* ignore */ }
  }, [cursorEnabled]);

  const toggleCursor = () => setCursorEnabled((c) => !c);

  return (
    <CursorContext.Provider value={{ cursorEnabled, toggleCursor }}>
      {children}
    </CursorContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCursor = () => useContext(CursorContext);
