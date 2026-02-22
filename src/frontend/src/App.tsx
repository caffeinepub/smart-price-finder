import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchInput from './components/SearchInput';
import ProductResults from './components/ProductResults';
import StoreManagement from './components/StoreManagement';
import { Toaster } from '@/components/ui/sonner';
import type { Product } from './backend';

const queryClient = new QueryClient();

type View = 'search' | 'stores';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('search');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5" dir="rtl">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {currentView === 'search' ? (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-l from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                جستجوگر هوشمند قیمت
              </h1>
              <p className="text-lg text-muted-foreground">
                بهترین قیمت‌ها را از فروشگاه‌های معتبر ایران پیدا کنید
              </p>
            </div>

            <SearchInput 
              onSearchResults={setSearchResults}
              onSearchStart={() => setIsSearching(true)}
              onSearchEnd={() => setIsSearching(false)}
            />

            <ProductResults 
              products={searchResults} 
              isLoading={isSearching}
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <StoreManagement />
          </div>
        )}
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
