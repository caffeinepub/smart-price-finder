import { ExternalLink, MapPin, Star, TrendingDown, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Product } from '../backend';

interface ProductResultsProps {
  products: Product[];
  isLoading: boolean;
  hasSearched?: boolean;
}

export default function ProductResults({ products, isLoading, hasSearched = false }: ProductResultsProps) {
  console.log('ProductResults render:', { productsCount: products.length, isLoading, hasSearched });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-lg text-muted-foreground">در حال جستجو در فروشگاه‌ها...</p>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
          <ExternalLink className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">هنوز جستجویی انجام نشده</h3>
        <p className="text-muted-foreground">
          نام محصول مورد نظر خود را در کادر بالا وارد کنید
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
          <ExternalLink className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">محصولی یافت نشد</h3>
        <p className="text-muted-foreground">
          لطفاً با کلمات کلیدی دیگری جستجو کنید
        </p>
      </div>
    );
  }

  const formatPrice = (price: bigint) => {
    return new Intl.NumberFormat('fa-IR').format(Number(price));
  };

  const getProximityBadge = (proximity: bigint) => {
    const prox = Number(proximity);
    if (prox === 0) return { label: 'قم', color: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30' };
    if (prox === 1) return { label: 'تهران', color: 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30' };
    if (prox <= 2) return { label: 'نزدیک', color: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-500/30' };
    return { label: 'دور', color: 'bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30' };
  };

  const getReputationStars = (score: bigint) => {
    return Array.from({ length: 5 }, (_, i) => i < Number(score));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          نتایج جستجو ({products.length} محصول)
        </h2>
        <div className="flex gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="gap-1 border-blue-500/30">
            <TrendingDown className="w-3 h-3" />
            مرتب شده بر اساس قیمت
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => {
          const proximityBadge = getProximityBadge(product.storeCity.proximityToQom);
          const reputationStars = getReputationStars(product.store.reputationScore);

          return (
            <Card
              key={`${product.productID}-${index}`}
              className="overflow-hidden hover:shadow-neon-blue transition-all duration-300 border-2 border-border hover:border-blue-500/50 group"
            >
              <div className="relative h-48 bg-muted overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3Eتصویر%3C/text%3E%3C/svg%3E';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    بدون تصویر
                  </div>
                )}
                
                {index < 3 && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-gradient-to-l from-yellow-500 to-orange-500 text-white shadow-lg">
                      پیشنهاد #{index + 1}
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-base line-clamp-2 leading-relaxed text-right">
                  {product.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-2 justify-end">
                  <span className="text-sm text-muted-foreground">تومان</span>
                  <span className="text-2xl font-bold text-blue-500">
                    {formatPrice(product.price)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{product.storeName}</span>
                    <span className="text-muted-foreground">:فروشگاه</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <Badge className={proximityBadge.color}>
                      {product.storeCity.name}
                    </Badge>
                    <span className="text-muted-foreground flex items-center gap-1">
                      موقعیت
                      <MapPin className="w-3 h-3" />
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-0.5">
                      {reputationStars.map((filled, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            filled
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground">:اعتبار</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {Number(product.store.averageShippingTime)} روز کاری
                    </span>
                    <span className="text-muted-foreground">:ارسال</span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-gradient-to-l from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/20 hover:shadow-neon-blue transition-all duration-300"
                >
                  <a
                    href={product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    مشاهده در فروشگاه
                  </a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
