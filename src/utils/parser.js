import { parse, addDays, addHours, setHours, setMinutes, isToday, isTomorrow } from 'date-fns';

const PRIORITY_PATTERNS = {
  P1: /\bP1\b/i,
  P2: /\bP2\b/i,
  P3: /\bP3\b/i,
  P4: /\bP4\b/i,
};

const TIME_PATTERNS = {
  'EOD': () => setHours(setMinutes(new Date(), 59), 23),
  'tonight': () => setHours(setMinutes(new Date(), 0), 20),
  'tomorrow': (time) => {
    const tomorrow = addDays(new Date(), 1);
    if (time) {
      const [hours, minutes] = time.split(':').map(Number);
      return setHours(setMinutes(tomorrow, minutes || 0), hours);
    }
    return tomorrow;
  },
};

const parseTime = (text) => {
  // Match time patterns like "5pm", "5:30pm", "17:00"
  const timeMatch = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!timeMatch) return null;

  let [_, hours, minutes, meridiem] = timeMatch;
  hours = parseInt(hours);
  minutes = minutes ? parseInt(minutes) : 0;

  if (meridiem?.toLowerCase() === 'pm' && hours < 12) {
    hours += 12;
  } else if (meridiem?.toLowerCase() === 'am' && hours === 12) {
    hours = 0;
  }

  return `${hours}:${minutes}`;
};

export const parseTask = (input) => {
  let remainingText = input;
  let dueDate = null;

  // Extract priority
  let priority = 'P3'; // Default priority
  for (const [p, pattern] of Object.entries(PRIORITY_PATTERNS)) {
    if (pattern.test(input)) {
      priority = p;
      remainingText = remainingText.replace(pattern, '').trim();
      break;
    }
  }

  // Extract time
  const time = parseTime(remainingText);
  if (time) {
    const [hours, minutes] = time.split(':').map(Number);
    dueDate = new Date(setHours(setMinutes(new Date(), minutes), hours));
  }

  // Check for special time patterns
  for (const [pattern, handler] of Object.entries(TIME_PATTERNS)) {
    if (remainingText.toLowerCase().includes(pattern)) {
      dueDate = handler(time);
      remainingText = remainingText.replace(new RegExp(pattern, 'i'), '').trim();
      break;
    }
  }

  // Extract assignee (assuming it's a name after "by")
  let assignee = null;
  const byMatch = remainingText.match(/\bby\s+([A-Za-z]+)\b/i);
  if (byMatch) {
    assignee = byMatch[1];
    remainingText = remainingText.replace(byMatch[0], '').trim();
  }

  // The remaining text is the task name
  const taskName = remainingText.trim();

  return {
    taskName,
    assignee,
    dueDate: dueDate ? new Date(dueDate) : null, // Ensure we return a proper Date object
    priority,
  };
};

export const formatDate = (date) => {
  if (!date) return '';
  
  // Ensure we're working with a Date object
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isToday(dateObj)) {
    return `Today, ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (isTomorrow(dateObj)) {
    return `Tomorrow, ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  return dateObj.toLocaleString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}; 