export function formatDateRange(startAt, endAt) {
  try {
    const tz = 'Europe/Amsterdam';
    const start = new Date(startAt);
    const end = new Date(endAt);

    const dayStr = start.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: tz,
    });

    const startTime = start.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: tz,
      hour12: false,
    });

    const endTime = end.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: tz,
      hour12: false,
    });

    const tzShort =
      new Intl.DateTimeFormat('en-GB', { timeZone: tz, timeZoneName: 'short' })
        .formatToParts(start)
        .find((p) => p.type === 'timeZoneName')?.value || '';

    return `${dayStr} • ${startTime}–${endTime}${tzShort ? ` ${tzShort}` : ''}`;
  } catch {
    return `${startAt} - ${endAt}`;
  }
}

export function formatPrice(price) {
  if (!price || typeof price.amount !== 'number' || price.amount === 0) return 'FREE';
  const currency = price.currency || 'EUR';
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(price.amount);
}

export function addressText(location) {
  if (!location) return null;
  const parts = [location.address, location.city, location.postCode, location.country].filter(Boolean);
  return parts.length ? parts.join(', ') : null;
}

export function mapLink(location) {
  if (!location) return null;
  const base = 'https://www.google.com/maps/search/?api=1&query=';
  const address = addressText(location);
  if (address) {
    return `${base}${encodeURIComponent(address)}`;
  }
  return null;
}
