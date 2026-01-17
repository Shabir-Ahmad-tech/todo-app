// Utility to check for due notifications

export const checkDetails = {
    hasPermission: () => Notification.permission === 'granted',
    requestPermission: async () => await Notification.requestPermission(),
};

// Play a subtle notification sound
export const playNotificationSound = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = 880; // A5
    gainNode.gain.value = 0.1;

    oscillator.start();

    // Nice "ding" envelope
    gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
    oscillator.stop(ctx.currentTime + 0.5);
};

export const sendNotification = (title, body) => {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            vibrate: [200, 100, 200]
        });
        playNotificationSound();
    }
};
