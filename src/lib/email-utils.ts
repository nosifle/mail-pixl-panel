export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
};

export const getAvatarColor = (email: string): string => {
  const colors = [
    '#8ab4f8', '#f28b82', '#fbbc04', '#34a853', 
    '#a78bfa', '#fb7185', '#22d3ee', '#f472b6',
    '#c084fc', '#60a5fa', '#fca5a5', '#4ade80'
  ];
  
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = (hash * 31 + email.charCodeAt(i)) >>> 0;
  }
  
  return colors[hash % colors.length];
};

export const formatEmailDate = (dateString: string, detailed: boolean = false): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (detailed) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Moscow'
    };
    return date.toLocaleDateString('ru-RU', options);
  }

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes <= 1 ? 'только что' : `${diffMinutes} мин`;
  }
  
  if (diffHours < 24) {
    return `${diffHours} ч`;
  }
  
  if (diffDays < 7) {
    return `${diffDays} д`;
  }
  
  // Remove timezone info like "+0000" from display
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric'
  };
  
  if (date.getFullYear() !== now.getFullYear()) {
    options.year = 'numeric';
  }
  
  return date.toLocaleDateString('ru-RU', options);
};

export const generateMockEmails = (count: number = 5) => {
  const subjects = [
    "Добро пожаловать в x69x.fun",
    "Важное уведомление о безопасности", 
    "Ваш отчет готов",
    "Обновление системы",
    "Приглашение на встречу",
    "Новые возможности платформы",
    "Еженедельная сводка"
  ];
  
  const senders = [
    { name: "x69x Team", email: "noreply@x69x.fun" },
    { name: "Security Team", email: "security@x69x.fun" },
    { name: "Reports System", email: "reports@x69x.fun" },
    { name: "System Admin", email: "admin@x69x.fun" },
    { name: "Meeting Bot", email: "meetings@x69x.fun" },
    { name: "Platform News", email: "news@x69x.fun" },
    { name: "Weekly Digest", email: "digest@x69x.fun" }
  ];
  
  const emails = [];
  
  for (let i = 0; i < count; i++) {
    const sender = senders[i % senders.length];
    const date = new Date();
    date.setHours(date.getHours() - Math.random() * 72); // Last 3 days
    
    emails.push({
      uid: i + 1,
      subject: subjects[i % subjects.length],
      fromName: sender.name,
      fromEmail: sender.email,
      date: date.toISOString()
    });
  }
  
  return emails;
};