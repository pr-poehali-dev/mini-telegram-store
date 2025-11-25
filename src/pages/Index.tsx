import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  category: 'shelf' | 'panel' | 'vase' | 'sculpture';
  image: string;
  description: string;
}

const products: Product[] = [
  { id: 1, name: 'Керамическая ваза Serenity', price: 24500, category: 'vase', image: 'https://cdn.poehali.dev/projects/8d011bcf-07f5-4566-bc30-992a40c4460f/files/857d375f-b96a-4570-a781-28603868cb40.jpg', description: 'Элегантная ваза с органичными формами' },
  { id: 2, name: 'Панно Abstract Gold', price: 48900, category: 'panel', image: 'https://cdn.poehali.dev/projects/8d011bcf-07f5-4566-bc30-992a40c4460f/files/8b993a45-6f40-448e-b6be-57ee9d1eb2ce.jpg', description: 'Геометрическое панно с золотыми акцентами' },
  { id: 3, name: 'Полка Genesis', price: 35600, category: 'shelf', image: 'https://cdn.poehali.dev/projects/8d011bcf-07f5-4566-bc30-992a40c4460f/files/ed360931-e432-40ae-a479-44b335ac0c06.jpg', description: 'Минималистичная полка премиум класса' },
  { id: 4, name: 'Скульптура Essence', price: 67800, category: 'sculpture', image: 'https://cdn.poehali.dev/projects/8d011bcf-07f5-4566-bc30-992a40c4460f/files/857d375f-b96a-4570-a781-28603868cb40.jpg', description: 'Современная абстрактная скульптура' },
  { id: 5, name: 'Ваза Minimalist', price: 19900, category: 'vase', image: 'https://cdn.poehali.dev/projects/8d011bcf-07f5-4566-bc30-992a40c4460f/files/857d375f-b96a-4570-a781-28603868cb40.jpg', description: 'Строгие линии и чистые формы' },
  { id: 6, name: 'Панно Luxe', price: 52000, category: 'panel', image: 'https://cdn.poehali.dev/projects/8d011bcf-07f5-4566-bc30-992a40c4460f/files/8b993a45-6f40-448e-b6be-57ee9d1eb2ce.jpg', description: 'Роскошное настенное украшение' },
];

const categories = [
  { id: 'all', name: 'Все', icon: 'LayoutGrid' },
  { id: 'shelf', name: 'Полки', icon: 'Layers' },
  { id: 'panel', name: 'Панно', icon: 'Square' },
  { id: 'vase', name: 'Вазы', icon: 'Wine' },
  { id: 'sculpture', name: 'Скульптуры', icon: 'Box' },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<{id: number, quantity: number}[]>([]);
  const [orders] = useState<{id: string, date: string, total: number, items: number}[]>([
    { id: 'ORD-2024-001', date: '15 ноября 2024', total: 73400, items: 2 },
  ]);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const addToCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => 
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const favoriteProducts = products.filter(p => favorites.includes(p.id));
  const cartProducts = cart.map(item => ({
    ...products.find(p => p.id === item.id)!,
    quantity: item.quantity
  }));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">DÉCOR</h1>
          
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="Heart" size={20} />
                  {favorites.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {favorites.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Избранное</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
                  {favoriteProducts.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Пока пусто</p>
                  ) : (
                    <div className="space-y-4">
                      {favoriteProducts.map(product => (
                        <Card key={product.id} className="p-4 flex gap-4">
                          <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
                          <div className="flex-1">
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">{product.price.toLocaleString()} ₽</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => toggleFavorite(product.id)}
                          >
                            <Icon name="X" size={16} />
                          </Button>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="ShoppingBag" size={20} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-12rem)] mt-6">
                  {cartProducts.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                  ) : (
                    <div className="space-y-4">
                      {cartProducts.map(product => (
                        <Card key={product.id} className="p-4">
                          <div className="flex gap-4">
                            <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
                            <div className="flex-1">
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-muted-foreground">{product.price.toLocaleString()} ₽</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(product.id, product.quantity - 1)}
                                >
                                  <Icon name="Minus" size={14} />
                                </Button>
                                <span className="w-8 text-center">{product.quantity}</span>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(product.id, product.quantity + 1)}
                                >
                                  <Icon name="Plus" size={14} />
                                </Button>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeFromCart(product.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                {cart.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-background">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">Итого:</span>
                      <span className="text-2xl font-bold">{cartTotal.toLocaleString()} ₽</span>
                    </div>
                    <Button className="w-full" size="lg">Оформить заказ</Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <nav className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'catalog', label: 'Каталог', icon: 'Store' },
              { id: 'favorites', label: 'Избранное', icon: 'Heart' },
              { id: 'orders', label: 'Заказы', icon: 'Package' },
              { id: 'profile', label: 'Профиль', icon: 'User' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab.icon as any} size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'catalog' && (
          <div>
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {categories.map(cat => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <Icon name={cat.icon as any} size={16} />
                  {cat.name}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Icon 
                        name="Heart" 
                        size={20} 
                        className={favorites.includes(product.id) ? 'fill-current text-red-500' : ''}
                      />
                    </Button>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{product.price.toLocaleString()} ₽</span>
                      <Button onClick={() => addToCart(product.id)}>
                        <Icon name="ShoppingCart" size={18} className="mr-2" />
                        В корзину
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Избранное</h2>
            {favoriteProducts.length === 0 ? (
              <div className="text-center py-16">
                <Icon name="Heart" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Вы пока ничего не добавили в избранное</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProducts.map(product => (
                  <Card key={product.id} className="group overflow-hidden">
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{product.price.toLocaleString()} ₽</span>
                        <Button onClick={() => addToCart(product.id)}>В корзину</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-3xl font-bold mb-8">История заказов</h2>
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <Icon name="Package" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">У вас пока нет заказов</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <Card key={order.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">Заказ {order.id}</h3>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">{order.items} товара</p>
                        <p className="text-xl font-bold">{order.total.toLocaleString()} ₽</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Профиль</h2>
            <Card className="p-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center">
                  <Icon name="User" size={48} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-1">Гость</h3>
                  <p className="text-muted-foreground">guest@example.com</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b">
                  <div className="flex items-center gap-3">
                    <Icon name="MapPin" size={20} />
                    <span>Адреса доставки</span>
                  </div>
                  <Icon name="ChevronRight" size={20} />
                </div>
                <div className="flex items-center justify-between py-4 border-b">
                  <div className="flex items-center gap-3">
                    <Icon name="CreditCard" size={20} />
                    <span>Способы оплаты</span>
                  </div>
                  <Icon name="ChevronRight" size={20} />
                </div>
                <div className="flex items-center justify-between py-4 border-b">
                  <div className="flex items-center gap-3">
                    <Icon name="Bell" size={20} />
                    <span>Уведомления</span>
                  </div>
                  <Icon name="ChevronRight" size={20} />
                </div>
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <Icon name="Settings" size={20} />
                    <span>Настройки</span>
                  </div>
                  <Icon name="ChevronRight" size={20} />
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
