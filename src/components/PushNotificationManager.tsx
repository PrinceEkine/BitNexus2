import React, { useEffect, useState } from 'react';
import { Bell, BellOff, ShieldCheck } from 'lucide-react';
import { useRealtime } from '../contexts/RealtimeContext';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export const PushNotificationManager = () => {
  const { currentUser } = useRealtime();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    if (!('serviceWorker' in navigator)) return;
    
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    setIsSubscribed(!!subscription);
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribe = async () => {
    if (!VAPID_PUBLIC_KEY) {
      console.error('VAPID Public Key is missing');
      return;
    }

    setLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        const registration = await navigator.serviceWorker.register('/sw.js');
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });

        // Send subscription to server
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscription,
            userId: currentUser?.id
          })
        });

        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        
        // Notify server
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
            userId: currentUser?.id
          })
        });
        
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!('Notification' in window)) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
      <div className={isSubscribed ? "text-emerald-500" : "text-gray-400"}>
        {isSubscribed ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Push Notifications</p>
        <p className="text-xs text-brand-dark font-medium">
          {isSubscribed ? 'Notifications are active' : 'Stay updated with critical alerts'}
        </p>
      </div>
      <button
        onClick={isSubscribed ? unsubscribe : subscribe}
        disabled={loading || !currentUser}
        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
          isSubscribed 
            ? "bg-gray-50 text-gray-500 hover:bg-gray-100" 
            : "bg-brand-dark text-white hover:bg-black"
        } disabled:opacity-50`}
      >
        {loading ? 'Processing...' : (isSubscribed ? 'Disable' : 'Enable')}
      </button>
    </div>
  );
};
