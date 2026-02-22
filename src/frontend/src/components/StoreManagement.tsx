import { useState, useEffect } from 'react';
import { Plus, Store as StoreIcon, ExternalLink, MapPin, Star, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useActor } from '../hooks/useActor';
import type { City } from '../backend';

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

interface AddedStore {
  id: bigint;
  name: string;
  url: string;
  city: string;
  reputationScore: number;
  averageShippingTime: number;
  dateAdded: string;
}

export default function StoreManagement() {
  const { actor } = useActor();
  const [storeName, setStoreName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [reputationScore, setReputationScore] = useState('3');
  const [averageShippingTime, setAverageShippingTime] = useState('2');
  const [addedStores, setAddedStores] = useState<AddedStore[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Initialize sellers on component mount
    const initSellers = async () => {
      if (actor) {
        try {
          await actor.initializeSellers();
          console.log('Sellers initialized successfully');
        } catch (error) {
          console.log('Sellers may already be initialized:', error);
        }
      }
    };
    initSellers();
  }, [actor]);

  const handleAddStore = async () => {
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

    if (!actor) {
      toast.error('در حال اتصال به سیستم...');
      return;
    }

    setIsSubmitting(true);

    try {
      const cityData = IRANIAN_CITIES.find(c => c.name === selectedCity);
      if (!cityData) {
        toast.error('شهر انتخاب شده معتبر نیست');
        return;
      }

      const city: City = {
        name: cityData.name,
        proximityToQom: BigInt(cityData.proximity),
      };

      console.log('Adding store to backend:', {
        name: storeName,
        url: storeUrl,
        city,
        averageShippingTime: parseInt(averageShippingTime),
        reputationScore: parseInt(reputationScore),
      });

      const storeId = await actor.addCustomStore(
        storeName,
        storeUrl,
        city,
        BigInt(parseInt(averageShippingTime)),
        BigInt(parseInt(reputationScore))
      );

      console.log('Store added successfully with ID:', storeId);

      const newStore: AddedStore = {
        id: storeId,
        name: storeName,
        url: storeUrl,
        city: selectedCity,
        reputationScore: parseInt(reputationScore),
        averageShippingTime: parseInt(averageShippingTime),
        dateAdded: new Date().toLocaleDateString('fa-IR'),
      };

      setAddedStores([...addedStores, newStore]);
      
      // Reset form
      setStoreName('');
      setStoreUrl('');
      setSelectedCity('');
      setReputationScore('3');
      setAverageShippingTime('2');

      toast.success('فروشگاه با موفقیت اضافه شد');
    } catch (error) {
      console.error('Error adding store:', error);
      toast.error('خطا در افزودن فروشگاه. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                dir="ltr"
                className="text-left border-blue-500/30 focus:border-blue-500 focus:shadow-neon-blue-sm transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-right block">شهر</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity} disabled={isSubmitting}>
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
              <Select value={reputationScore} onValueChange={setReputationScore} disabled={isSubmitting}>
                <SelectTrigger id="reputation" className="border-blue-500/30 focus:border-blue-500 focus:shadow-neon-blue-sm transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((score) => (
                    <SelectItem key={score} value={score.toString()}>
                      <div className="flex items-center gap-2">
                        {score} ستاره
                        <div className="flex gap-0.5">
                          {Array.from({ length: score }, (_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingTime" className="text-right block">زمان ارسال (روز کاری)</Label>
              <Select value={averageShippingTime} onValueChange={setAverageShippingTime} disabled={isSubmitting}>
                <SelectTrigger id="shippingTime" className="border-blue-500/30 focus:border-blue-500 focus:shadow-neon-blue-sm transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 7, 10, 14].map((days) => (
                    <SelectItem key={days} value={days.toString()}>
                      {days} روز کاری
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleAddStore}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-l from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30 hover:shadow-neon-blue transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                در حال افزودن...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 ml-2" />
                افزودن فروشگاه
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          فروشگاه‌های اضافه شده ({addedStores.length})
        </h2>

        {addedStores.length === 0 ? (
          <Card className="border-blue-500/20">
            <CardContent className="py-12 text-center text-muted-foreground">
              <StoreIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>هنوز فروشگاهی اضافه نشده است</p>
              <p className="text-sm mt-2">فروشگاه‌های پیش‌فرض (دیجی‌کالا، بامیلو، هایپر) در سیستم موجود هستند</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {addedStores.map((store) => (
              <Card 
                key={store.id.toString()} 
                className="hover:shadow-neon-blue-sm transition-all duration-300 border-blue-500/20 hover:border-blue-500/40"
              >
                <CardHeader>
                  <div className="space-y-1 text-right">
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-xs justify-end">
                      {store.city}
                      <MapPin className="w-3 h-3" />
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-0.5">
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
                    <span className="text-muted-foreground">:اعتبار</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{store.averageShippingTime} روز کاری</span>
                    <span className="text-muted-foreground">:زمان ارسال</span>
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
