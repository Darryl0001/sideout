import { DataProvider } from '@/context/DataContext';
import { AppRoutes } from '@/routes/AppRoutes';
import { Toaster } from '@/components/ui/sonner';

export function App() {
  return (
    <DataProvider>
      <AppRoutes />
      <Toaster />
    </DataProvider>
  );
}

export default App;