const BOGOTA_TIME_ZONE = 'America/Bogota';

type DateParts = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
};

const bogotaFormatter = new Intl.DateTimeFormat('en', {
  timeZone: BOGOTA_TIME_ZONE,
  hour12: false,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

function extractBogotaParts(value?: string): DateParts | null {
  if (value) {
    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (dateOnlyMatch) {
      const [, year, month, day] = dateOnlyMatch;
      return { year, month, day, hour: '00', minute: '00' };
    }
  }
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return null;
  const parts = bogotaFormatter.formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  const year = get('year');
  const month = get('month');
  const day = get('day');
  const hour = get('hour');
  const minute = get('minute');
  if (!year || !month || !day || !hour || !minute) return null;
  return { year, month, day, hour, minute };
}

export function toBogotaLocalInputValue(value?: string): string {
  const parts = extractBogotaParts(value);
  if (!parts) return '';
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export function toBogotaDateOnly(value?: string): string {
  const parts = extractBogotaParts(value);
  if (!parts) return '';
  return `${parts.year}-${parts.month}-${parts.day}`;
}

const BOGOTA_OFFSET = '-05:00';

function stripTimezone(value: string): string {
  return value.split(/Z|([+-]\d{2}:\d{2})/)[0];
}

export function toBogotaOffsetDateTime(value: string): string {
  if (!value) return '';
  const cleaned = stripTimezone(value);
  if (cleaned.includes('T')) {
    const [date, time] = cleaned.split('T');
    const normalizedTime = time.length === 5 ? `${time}:00` : time;
    return `${date}T${normalizedTime}${BOGOTA_OFFSET}`;
  }
  return `${cleaned}T00:00:00${BOGOTA_OFFSET}`;
}

export function formatBogotaDateTime(value?: string): string {
  const parts = extractBogotaParts(value);
  if (!parts) return '';
  return `${parts.year}-${parts.month}-${parts.day} • ${parts.hour}:${parts.minute}`;
}
