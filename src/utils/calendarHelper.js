/**
 * Google Calendar Integration Helper
 * Creates calendar events for focus sessions
 */

export const addToGoogleCalendar = (duration = 25, title = '🧠 NeuroFlow Focus Session') => {
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + duration * 60 * 1000);
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  };

  const eventTitle = encodeURIComponent(title);
  const details = encodeURIComponent(
    `Dedicated ${duration} minute focus session for ADHD productivity.\n\n` +
    `💡 Tips:\n` +
    `- Eliminate distractions\n` +
    `- Stay hydrated\n` +
    `- Take breaks after completion\n\n` +
    `Powered by NeuroFlow Suite`
  );
  const location = encodeURIComponent('NeuroFlow App');
  
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${details}&location=${location}`;

  window.open(calendarUrl, '_blank', 'width=700,height=600');
};

export const scheduleFocusSession = (date, duration = 25) => {
  const startDate = new Date(date);
  const endDate = new Date(startDate.getTime() + duration * 60 * 1000);
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  };

  const title = encodeURIComponent('🧠 NeuroFlow Scheduled Focus Session');
  const details = encodeURIComponent(`Your scheduled ${duration}-minute focus session.`);
  const location = encodeURIComponent('NeuroFlow App');
  
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${details}&location=${location}`;

  window.open(calendarUrl, '_blank', 'width=700,height=600');
};
