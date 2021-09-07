// hide flash notifications when appears
const hideNotification = (notification) => {
    if(notification){
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 1000);
        }, 1200);
    }
};

// flash notifications
const NotificationElement = document.querySelector('#notification');
hideNotification(NotificationElement);