import avatarController from './avatarController';
import store from '../store/store';

class TaskReminderService {
  constructor() {
    this.reminderInterval = null;
    this.incompleteTasks = new Map(); // taskId -> { title, lastReminded }
  }

  start() {
    // Check every 30 minutes for incomplete tasks
    this.reminderInterval = setInterval(() => {
      this.checkIncompleteTasks();
    }, 30 * 60 * 1000); // 30 minutes

    // Also do an initial check after 5 minutes
    setTimeout(() => {
      this.checkIncompleteTasks();
    }, 5 * 60 * 1000);
  }

  stop() {
    if (this.reminderInterval) {
      clearInterval(this.reminderInterval);
      this.reminderInterval = null;
    }
  }

  addTask(taskId, taskTitle) {
    this.incompleteTasks.set(taskId, {
      title: taskTitle,
      lastReminded: null,
      addedAt: Date.now(),
    });
  }

  removeTask(taskId) {
    this.incompleteTasks.delete(taskId);
  }

  markTaskComplete(taskId) {
    const task = this.incompleteTasks.get(taskId);
    if (task) {
      this.incompleteTasks.delete(taskId);
    }
  }

  checkIncompleteTasks() {
    const state = store.getState();
    const avatarNotifications = state.avatar?.notifications;

    if (!avatarNotifications?.taskReminders) {
      return; // Task reminders disabled
    }

    const now = Date.now();
    const reminderCooldown = 60 * 60 * 1000; // 1 hour cooldown between reminders

    this.incompleteTasks.forEach((task, taskId) => {
      const timeSinceAdded = now - task.addedAt;
      const timeSinceLastReminder = task.lastReminded ? now - task.lastReminded : Infinity;

      // Remind if task has been incomplete for more than 1 hour
      // and hasn't been reminded in the last hour
      if (timeSinceAdded > 60 * 60 * 1000 && timeSinceLastReminder > reminderCooldown) {
        avatarController.taskIncomplete(task.title);
        task.lastReminded = now;
      }
    });
  }

  // Periodic encouragement (every 2 hours)
  startEncouragementTimer() {
    setInterval(() => {
      const state = store.getState();
      const avatarNotifications = state.avatar?.notifications;

      if (avatarNotifications?.encouragement) {
        avatarController.encouragement();
      }
    }, 2 * 60 * 60 * 1000); // 2 hours
  }

  // Break reminders (every 90 minutes)
  startBreakReminders() {
    setInterval(() => {
      const state = store.getState();
      const avatarNotifications = state.avatar?.notifications;
      const timerActive = state.app?.timerActive;

      // Only remind if not actively in a timer session
      if (avatarNotifications?.breaks && !timerActive) {
        avatarController.breakReminder();
      }
    }, 90 * 60 * 1000); // 90 minutes
  }
}

// Create singleton instance
const taskReminderService = new TaskReminderService();

export default taskReminderService;
