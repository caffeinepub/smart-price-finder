import { Store, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  currentView: 'search' | 'stores';
  onViewChange: (view: 'search' | 'stores') => void;
}

export default function Header({ currentView, onViewChange }: HeaderProps) {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-neon-blue-sm">
              <Search className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">جستجوگر هوشمند</span>
          </div>

          <nav className="flex gap-2">
            <Button
              variant={currentView === 'search' ? 'default' : 'ghost'}
              onClick={() => onViewChange('search')}
              className={`gap-2 transition-all duration-300 ${
                currentView === 'search' 
                  ? 'bg-gradient-to-l from-blue-500 to-cyan-500 shadow-neon-blue-sm hover:shadow-neon-blue' 
                  : 'hover:bg-blue-500/10 hover:border-blue-500/30'
              }`}
            >
              <Search className="w-4 h-4" />
              جستجو
            </Button>
            <Button
              variant={currentView === 'stores' ? 'default' : 'ghost'}
              onClick={() => onViewChange('stores')}
              className={`gap-2 transition-all duration-300 ${
                currentView === 'stores' 
                  ? 'bg-gradient-to-l from-blue-500 to-cyan-500 shadow-neon-blue-sm hover:shadow-neon-blue' 
                  : 'hover:bg-blue-500/10 hover:border-blue-500/30'
              }`}
            >
              <Store className="w-4 h-4" />
              مدیریت فروشگاه‌ها
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
