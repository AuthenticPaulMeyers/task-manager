// notifications.js

// Ask permission when user first opens the dashboard
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
          console.log('Notification permission denied.');
        }
      });
    }
  }
  
  // Set a local timer to show notification at reminder_time
  function scheduleTaskNotification(task) {
    const reminderTime = new Date(task.reminder_time).getTime();
    const now = Date.now();
    const delay = reminderTime - now;
  
    if (delay > 0) {
      setTimeout(() => {
        showNotification(task.title, task.description);
      }, delay);
    }
  }
  
  // Show the actual browser notification
  function showNotification(title, description) {
    if (Notification.permission === 'granted') {
      new Notification('🕑 Reminder: ' + title, {
        body: description || 'You have a task to complete!',
        icon: '/assets/logo.png' // optional icon
      });
    }
  }
  