import { useEffect, useState } from 'react';

interface UseOTPAutoFillOptions {
  onOTPReceived: (otp: string) => void;
  enabled?: boolean;
}

export const useOTPAutoFill = ({ onOTPReceived, enabled = true }: UseOTPAutoFillOptions) => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Проверяем поддержку OTP AutoFill API
    const checkSupport = () => {
      const supported = 'OTPCredential' in window && !!navigator.credentials;
      setIsSupported(supported);
      return supported;
    };

    if (!enabled || !checkSupport()) {
      return;
    }

    const requestOTP = async () => {
      try {
        // @ts-ignore - OTPCredential может не быть в типах
        const otpCredential = await navigator.credentials.get({
          // @ts-ignore
          otp: { transport: ['sms'] },
          signal: new AbortController().signal
        });

        // @ts-ignore
        if (otpCredential && otpCredential.code) {
          // Извлекаем код подтверждения из SMS
          // @ts-ignore
          const otpMatch = otpCredential.code.match(/\d{4,8}/);
          if (otpMatch) {
            onOTPReceived(otpMatch[0]);
          }
        }
      } catch (error) {
        console.log('OTP AutoFill not available or cancelled:', error);
      }
    };

    // Запрашиваем OTP при монтировании
    requestOTP();

    // Слушаем входящие SMS с кодами
    const handleSMS = (event: any) => {
      if (event.data && typeof event.data === 'string') {
        // Ищем паттерны кодов в SMS
        const otpPatterns = [
          /код:\s*(\d{4,8})/i,
          /code:\s*(\d{4,8})/i,
          /(\d{6})/,
          /(\d{4})/
        ];

        for (const pattern of otpPatterns) {
          const match = event.data.match(pattern);
          if (match && match[1]) {
            onOTPReceived(match[1]);
            break;
          }
        }
      }
    };

    // В современных браузерах можем слушать SMS API
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSMS);
      
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleSMS);
      };
    }

  }, [enabled, onOTPReceived]);

  return { isSupported };
};