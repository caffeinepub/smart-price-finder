import { useState } from 'react';
import { Plus, Store as StoreIcon, ExternalLink, MapPin, Star, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const IRANIAN_CITIES = [
  { name: 'قم', proximity: 0 },
  { name: 'تهران', proximity: 1 },
  { name: 'مشهد', proximity: 2 },
  { name: 'اصفهان', proximity: 2 },
  { name: 'تبریز', proximity: 3 },
  { name: 'شیراز', proximity: 3 },
  { name: 'اهواز', proximity: 3 },
  { name: 'کرمانشاه', proximity: 4 },
  { name: 'رشت', proximity: 4 },
  { name: 'اراک', proximity: 4 },
  { name: 'ارومیه', proximity: 5 },
  { name: 'یزد', proximity: 5 },
  { name: 'ساری', proximity: 5 },
  { name: 'همدان', proximity: 5 },
];

interface CustomStore {
  id: string;
  name: string;
  url: string;
  city: string;
  reputationScore: number;
  dateAdded: string;
}

export default function StoreManagement() {
  const [storeName, setStoreName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [reputationScore, setReputationScore] = useState('3');
  const [customStores, setCustomStores] = useState<CustomStore[]>([]);

  const handleAddStore = () => {
    if (!storeName.trim()) {
      toast.error('لطفاً نام فروشگاه را وارد کنید');
      return;
    }

    if (!storeUrl.trim()) {
      toast.error('لطفاً آدرس فروشگاه را وارد کنید');
      return;
    }

    try {
      new URL(storeUrl);
    } catch {
      toast.error('آدرس وارد شده معتبر نیست');
      return;
    }

    if (!selectedCity) {
      toast.error('لطفاً شهر را انتخاب کنید');
      return;
    }

    const newStore: CustomStore = {
      id: Date.now().toString(),
      name: storeName,
      url: storeUrl,
      city: selectedCity,
      reputationScore: parseInt(reputationScore),
      dateAdded: new Date().toLocaleDateString('fa-IR'),
    };

    setCustomStores([...customStores, newStore]);
    
    // Reset form
    setStoreName('');
    setStoreUrl('');
    setSelectedCity('');
    setReputationScore('3');

    toast.success('فروشگاه با موفقیت اضافه شد');
  };

  const handleDeleteStore = (id: string) => {
    setCustomStores(customStores.filter(store => store.id !== id));
    toast.success('فروشگاه حذف شد');
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-l from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
          مدیریت فروشگاه‌ها
        </h1>
        <p className="text-muted-foreground">
          فروشگاه‌های دلخواه خود را اضافه کنید تا در جستجوهای بعدی لحاظ شوند
        </p>
      </div>

      <Card className="border-2 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 shadow-lg hover:shadow-neon-blue-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            افزودن فروشگاه جدید
          </CardTitle>
          <CardDescription>
            اطلاعات فروشگاه مورد نظر خود را وارد کنید
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="storeName" className="text-right block">نام فروشگاه</Label>
              <Input
                id="storeName"
                placeholder="مثال: فروشگاه آنلاین من"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="border-blue-500/30 focus:border-blue-500 focus:shadow-neon-blue-sm transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeUrl" className="text-right block">آدرس وب‌سایت</Label>
              <Input
                id="storeUrl"
                type="url"
                placeholder="https://example.com"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                dir="ltr"
                className="text-left border-blue-500/30 focus:border-blue-500 focus:shadow-neon-blue-sm transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-right block">شهر</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger id="city" className="border-blue-500/30 focus:border-blue-500 focus:shadow-neon-blue-sm transition-all duration-300">
                  <SelectValue placeholder="انتخاب شهر" />
                </SelectTrigger>
                <SelectContent>
                  {IRANIAN_CITIES.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reputation" className="text-right block">امتیاز اعتبار (۱ تا ۵)</Label>
              <Select value={reputationScore} onValueChange={setReputationScore}>
                <SelectTrigger id="reputation" className="border-blue-500/30 focus:border-blue-500 focus:shadow-neon-blue-sm transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((score) => (
                    <SelectItem key={score} value={score.toString()}>
                      {score} ستاره
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleAddStore}
            className="w-full bg-gradient-to-l from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30 hover:shadow-neon-blue transition-all duration-300"
          >
            <Plus className="w-4 h-4 ml-2" />
            افزودن فروشگاه
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          فروشگاه‌های اضافه شده ({customStores.length})
        </h2>

        {customStores.length === 0 ? (
          <Card className="border-blue-500/20">
            <CardContent className="py-12 text-center text-muted-foreground">
              <StoreIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>هنوز فروشگاهی اضافه نشده است</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {customStores.map((store) => (
              <Card 
                key={store.id} 
                className="hover:shadow-neon-blue-sm transition-all duration-300 border-blue-500/20 hover:border-blue-500/40"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteStore(store.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="space-y-1 text-right flex-1">
                      <CardTitle className="text-lg">{store.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-xs justify-end">
                        {store.city}
                        <MapPin className="w-3 h-3" />
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-0.5 justify-end">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < store.reputationScore
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground justify-end">
                    <Badge variant="outline" className="border-blue-500/30">{store.dateAdded}</Badge>
                    <span>:تاریخ افزودن</span>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/10 hover:shadow-neon-blue-sm transition-all duration-300"
                  >
                    <a
                      href={store.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      مشاهده فروشگاه
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
