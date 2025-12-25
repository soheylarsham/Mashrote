import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 1000); // Allow fade out
    }, 4000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden font-naskh text-center px-4 animate-fade-out" style={{ animationDelay: '3.5s', animationFillMode: 'forwards' }}>
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-black to-red-900/50 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <div className="relative z-10 space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 animate-slide-in-up drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
          قانون مشروطه ایران
        </h1>
        <h2 className="text-2xl md:text-3xl text-white/80 animate-slide-in-up" style={{ animationDelay: '0.5s' }}>
          به همراه متمم
        </h2>
        
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-50 my-8"></div>

        <p className="text-xl md:text-2xl text-cyan-400 animate-slide-in-up" style={{ animationDelay: '1.5s' }}>
          کاری از ابلیس بیخدایان
        </p>

        <p className="text-lg md:text-xl text-pink-400 mt-4 animate-slide-in-up" style={{ animationDelay: '2.5s' }}>
          تقدیم به استاد میکائیل گرامی
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
