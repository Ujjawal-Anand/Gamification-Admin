'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { PersistProvider } from '@/components/providers/PersistProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistProvider>
        {children}
      </PersistProvider>
    </Provider>
  );
} 