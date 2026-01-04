import { format, formatDistanceToNow, getTime } from 'date-fns';

// ----------------------------------------------------------------------

interface DateFormatOptions {
  date: Date | string | number;
  newFormat?: string;
}

export function fDate({ date, newFormat = 'dd MMM yyyy' }: DateFormatOptions): string {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime({ date, newFormat }: DateFormatOptions): string {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date: Date | string | number): string {
  return date ? getTime(new Date(date)).toString() : '';
}

export function fToNow(date: Date | string | number): string {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}
