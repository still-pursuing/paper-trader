export function timeDifference(current: number, previous: number) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = current - previous;

  if (elapsed < msPerMinute) {
    const seconds = Math.floor(elapsed / 1000);
    return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
  }

  if (elapsed < msPerHour) {
    const minutes = Math.floor(elapsed / msPerMinute);
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }

  if (elapsed < msPerDay) {
    const hours = Math.floor(elapsed / msPerHour);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  if (elapsed < msPerMonth) {
    const days = Math.floor(elapsed / msPerDay);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }

  if (elapsed < msPerYear) {
    const months = Math.floor(elapsed / msPerMonth);
    return `${months} month${months === 1 ? '' : 's'} ago`;
  }

  const years = Math.floor(elapsed / msPerYear);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

// https://stackoverflow.com/questions/6108819/javascript-timestamp-to-relative-time
