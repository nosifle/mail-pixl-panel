import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Star, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="font-semibold text-xl text-foreground">AppName</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors">
                Функции
              </a>
              <a href="#about" className="text-foreground/70 hover:text-foreground transition-colors">
                О нас
              </a>
              <a href="#contact" className="text-foreground/70 hover:text-foreground transition-colors">
                Контакты
              </a>
              <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                Профиль
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Создавайте
              <span className="text-primary block">Удивительные</span>
              Решения
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Современная платформа для создания инновационных продуктов, 
              которые изменят ваш бизнес к лучшему
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="px-8 py-4 text-lg">
                Начать сейчас
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Узнать больше
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Почему выбирают нас?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Мы предоставляем лучшие инструменты для достижения ваших целей
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Быстрая работа
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Наше решение работает в 10 раз быстрее конкурентов благодаря 
                современным технологиям и оптимизации
              </p>
            </div>
            
            <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Командная работа
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Эффективное сотрудничество с коллегами в реальном времени 
                с удобными инструментами управления
              </p>
            </div>
            
            <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Высокое качество
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Проверенное качество и надежность, подтвержденные 
                тысячами довольных клиентов
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
            Готовы начать?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам компаний, которые уже используют наше решение
          </p>
          <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
            Попробовать бесплатно
            <CheckCircle className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="font-semibold text-xl text-foreground">AppName</span>
            </div>
            <p className="text-muted-foreground">
              © 2024 AppName. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;