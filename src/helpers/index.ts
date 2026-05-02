const MIAMI_TZ = 'America/New_York';

function getMiamiOffsetMs(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: MIAMI_TZ,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => parseInt(parts.find((p) => p.type === type)?.value ?? '0');

  const miamiWallAsUTC = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour') % 24,
    get('minute'),
    get('second')
  );

  return date.getTime() - miamiWallAsUTC; // positive for EDT (+4hrs), EST (+5hrs)
}

export function toPickerDate(utcDate: Date): Date {
  const miamiOffset = getMiamiOffsetMs(utcDate);
  const miamiWallAsUTC = utcDate.getTime() - miamiOffset;
  // Re-add device's own offset so getHours() displays Miami wall clock correctly
  const deviceOffset = new Date().getTimezoneOffset() * 60000;
  return new Date(miamiWallAsUTC + deviceOffset);
}

export function fromPickerDate(pickerDate: Date): Date {
  // Strip device offset to get Miami wall clock as UTC
  const deviceOffset = new Date().getTimezoneOffset() * 60000;
  const miamiWallAsUTC = pickerDate.getTime() - deviceOffset;
  // Add Miami offset to get true UTC
  const miamiOffset = getMiamiOffsetMs(new Date(miamiWallAsUTC));
  return new Date(miamiWallAsUTC + miamiOffset);
}

export function formatMiamiTime(date: Date, mode: 'date' | 'time' | 'datetime'): string {
  if (mode === 'time') {
    return date.toLocaleTimeString('en-US', {
      timeZone: MIAMI_TZ,
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  if (mode === 'datetime') {
    return date.toLocaleString('en-US', {
      timeZone: MIAMI_TZ,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return date.toLocaleDateString('en-US', {
    timeZone: MIAMI_TZ,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
