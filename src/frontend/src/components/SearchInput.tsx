import { useState, useRef } from 'react';
import { Search, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { useProductSearch } from '../hooks/useProductSearch';
import type { Product } from '../backend';

interface SearchInputProps {
  onSearchResults: (results: Product[]) => void;
  onSearchStart: () => void;
  onSearchEnd: () => void;
}

export default function SearchInput({ onSearchResults, onSearchStart, onSearchEnd }: SearchInputProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { searchByText, isSearching } = useProductSearch();

  const handleTextSearch = async () => {
    if (!searchText.trim()) {
      toast.error('لطفاً متن جستجو را وارد کنید');
      return;
    }

    onSearchStart();
    try {
      const results = await searchByText(searchText);
      onSearchResults(results);
      
      if (results.length === 0) {
        toast.info('محصولی یافت نشد. لطفاً کلمات دیگری را امتحان کنید.');
      } else {
        toast.success(`${results.length} محصول یافت شد`);
      }
    } catch (error) {
      toast.error('خطا در جستجو. لطفاً دوباره تلاش کنید.');
      console.error('Search error:', error);
    } finally {
      onSearchEnd();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('لطفاً یک فایل تصویری انتخاب کنید');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast.info('جستجوی تصویری در نسخه‌های آینده فعال خواهد شد');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSearching) {
      handleTextSearch();
    }
  };

  return (
    <Card className="p-6 shadow-xl border-2 border-blue-500/20 bg-gradient-to-br from-card via-card to-blue-500/5 hover:border-blue-500/40 transition-all duration-300">
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="نام محصول مورد نظر خود را وارد کنید..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSearching}
              className="h-12 pr-4 text-base border-blue-500/30 focus:border-blue-500 focus:shadow-neon-blue-sm bg-background/50 transition-all duration-300"
            />
          </div>
          
          <Button
            onClick={handleTextSearch}
            disabled={isSearching || !searchText.trim()}
            className="h-12 px-6 bg-gradient-to-l from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30 hover:shadow-neon-blue transition-all duration-300"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                در حال جستجو...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 ml-2" />
                جستجو
              </>
            )}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSearching}
                  className="h-12 px-6 border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/10 hover:shadow-neon-blue-sm transition-all duration-300"
                >
                  <ImageIcon className="w-5 h-5 ml-2" />
                  تصویر
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>جستجوی تصویری در نسخه‌های آینده فعال خواهد شد</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {imagePreview && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-blue-500/20">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{selectedImage?.name}</p>
              <p className="text-xs text-muted-foreground">جستجوی تصویری به زودی...</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedImage(null);
                setImagePreview(null);
              }}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              حذف
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">جستجوهای پیشنهادی:</span>
          {['گوشی موبایل', 'لپ تاپ', 'هدفون', 'ساعت هوشمند'].map((term) => (
            <Button
              key={term}
              variant="outline"
              size="sm"
              onClick={() => setSearchText(term)}
              disabled={isSearching}
              className="text-xs border-blue-500/20 hover:border-blue-500 hover:bg-blue-500/10 hover:shadow-neon-blue-sm transition-all duration-300"
            >
              {term}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
