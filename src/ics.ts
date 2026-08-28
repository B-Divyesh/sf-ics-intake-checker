export type Severity = 'error' | 'warning' | 'note' | 'pass';

export interface Finding {
  id: string;
  severity: Severity;
  title: string;
  detail: string;
  eventIndex?: number;
  repair?: 'uids' | 'stamps' | 'alarms' | 'people' | 'method' | 'lineEndings';
}

export interface IcsProperty {
  name: string;
  params: Record<string, string>;
  value: string;
  raw: string;
}

export interface CalendarEvent {
  index: number;
  properties: IcsProperty[];
  summary: string;
  uid: string;
  start?: DateValue;
  end?: DateValue;
  location: string;
  description: string;
  recurrence: string;
  attendees: number;
  alarms: number;
  status: string;
  organizer: string;
  fingerprint: string;
}

export interface DateValue {
  raw: string;
  tzid?: string;
  kind: 'date' | 'utc' | 'zoned' | 'floating';
  timestamp?: number;
  label: string;
}

export interface Inspection {
  source: string;
  events: CalendarEvent[];
  findings: Finding[];
  calendarName: string;
  method: string;
  timezones: string[];
  lineEnding: 'CRLF' | 'LF' | 'mixed';
  canExport: boolean;
}

const KNOWN_TZ = new Set([
  'UTC', 'Etc/UTC', 'America/New_York', 'America/Chicago', 'America/Denver',
  'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Kolkata',
  'Asia/Tokyo', 'Australia/Sydney'
]);

function validTimeZone(value: string): boolean {
  if (KNOWN_TZ.has(value)) return true;
  try { new Intl.DateTimeFormat('en', { timeZone: value }).format(); return true; }
  catch { return false; }
}

function unescapeText(value: string): string {
  return value.replace(/\\[nN]/g, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\');
}

function splitHeader(line: string): [string, string] | undefined {
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    if (line[i] === '"') quoted = !quoted;
    if (line[i] === ':' && !quoted) return [line.slice(0, i), line.slice(i + 1)];
  }
  return undefined;
}

function parseProperty(line: string): IcsProperty | undefined {
  const pair = splitHeader(line);
  if (!pair) return undefined;
  const [head, value] = pair;
  const bits = head.split(';');
  const name = (bits.shift() || '').toUpperCase();
  if (!name) return undefined;
  const params: Record<string, string> = {};
  for (const bit of bits) {
    const eq = bit.indexOf('=');
    if (eq > 0) params[bit.slice(0, eq).toUpperCase()] = bit.slice(eq + 1).replace(/^"|"$/g, '');
  }
  return { name, params, value, raw: line };
}

function unfold(source: string): string[] {
  const physical = source.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const lines: string[] = [];
  for (const line of physical) {
    if (/^[ \t]/.test(line) && lines.length) lines[lines.length - 1] += line.slice(1);
    else lines.push(line.replace(/\0/g, ''));
  }
  return lines;
}

function formatDate(raw: string, kind: DateValue['kind']): { timestamp?: number; label: string } {
  const basic = raw.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?)?Z?$/);
  if (!basic) return { label: raw };
  const [, y, m, d, hh = '00', mm = '00', ss = '00'] = basic;
  const utc = Date.UTC(+y, +m - 1, +d, +hh, +mm, +ss);
  const valid = new Date(utc);
  if (valid.getUTCFullYear() !== +y || valid.getUTCMonth() !== +m - 1 || valid.getUTCDate() !== +d || valid.getUTCHours() !== +hh || valid.getUTCMinutes() !== +mm || valid.getUTCSeconds() !== +ss) return { label: raw };
  if (kind === 'date') return { timestamp: utc, label: new Intl.DateTimeFormat(undefined, { dateStyle: 'full', timeZone: 'UTC' }).format(valid) };
  const label = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(valid);
  return { timestamp: utc, label };
}

function parseDate(prop?: IcsProperty): DateValue | undefined {
  if (!prop) return undefined;
  const isDate = prop.params.VALUE === 'DATE' || /^\d{8}$/.test(prop.value);
  const isUtc = prop.value.endsWith('Z');
  const tzid = prop.params.TZID;
  const kind: DateValue['kind'] = isDate ? 'date' : isUtc ? 'utc' : tzid ? 'zoned' : 'floating';
  const formatted = formatDate(prop.value, kind);
  return { raw: prop.value, tzid, kind, ...formatted };
}

function property(items: IcsProperty[], name: string): IcsProperty | undefined {
  return items.find((item) => item.name === name);
}

function properties(items: IcsProperty[], name: string): IcsProperty[] {
  return items.filter((item) => item.name === name);
}

function hash(value: string): string {
  let out = 2166136261;
  for (let i = 0; i < value.length; i += 1) out = Math.imul(out ^ value.charCodeAt(i), 16777619);
  return (out >>> 0).toString(16).padStart(8, '0');
}

function lineEnding(source: string): Inspection['lineEnding'] {
  const crlf = (source.match(/\r\n/g) || []).length;
  const bareLf = (source.match(/(?<!\r)\n/g) || []).length;
  if (crlf && bareLf) return 'mixed';
  return crlf ? 'CRLF' : 'LF';
}

export function inspectIcs(source: string): Inspection {
  const trimmed = source.replace(/^\uFEFF/, '').trim();
  const findings: Finding[] = [];
  const endings = lineEnding(source);
  if (!trimmed) return { source, events: [], findings: [{ id: 'empty', severity: 'error', title: 'The file is empty', detail: 'Choose an ICS file that contains at least one event.' }], calendarName: '', method: '', timezones: [], lineEnding: endings, canExport: false };
  if (source.length > 5_000_000) findings.push({ id: 'large', severity: 'warning', title: 'This file is unusually large', detail: 'Review the source before importing more than 5 MB of calendar data.' });
  const lines = unfold(trimmed);
  if (lines[0]?.toUpperCase() !== 'BEGIN:VCALENDAR' || !lines.some((line) => line.toUpperCase() === 'END:VCALENDAR')) {
    findings.push({ id: 'wrapper', severity: 'error', title: 'This is not a complete ICS calendar', detail: 'The file needs BEGIN:VCALENDAR and END:VCALENDAR lines.' });
  }
  const allProps = lines.map(parseProperty).filter((item): item is IcsProperty => Boolean(item));
  const version = allProps.find((item) => item.name === 'VERSION');
  if (!version || version.value !== '2.0') findings.push({ id: 'version', severity: 'warning', title: 'Calendar version 2.0 is missing', detail: 'This file has no VERSION:2.0 line. Ask the sender for an ICS 2.0 file.' });
  const method = allProps.find((item) => item.name === 'METHOD')?.value.toUpperCase() || '';
  if (method === 'CANCEL') findings.push({ id: 'cancel-method', severity: 'warning', title: 'This file cancels events', detail: 'This file contains METHOD:CANCEL. Check the event status before import.' });
  else if (method === 'REQUEST' || method === 'REPLY') findings.push({ id: 'invite-method', severity: 'note', title: `This is an invitation (${method})`, detail: `This file contains METHOD:${method}. Remove that line from the downloaded copy if you do not need it.`, repair: 'method' });
  const timezoneIds = allProps.filter((item) => item.name === 'TZID').map((item) => item.value);
  const eventBlocks: IcsProperty[][] = [];
  let current: IcsProperty[] | undefined;
  let alarmDepth = 0;
  for (const line of lines) {
    const upper = line.toUpperCase();
    if (upper === 'BEGIN:VEVENT') { current = []; alarmDepth = 0; continue; }
    if (upper === 'END:VEVENT') { if (current) eventBlocks.push(current); current = undefined; continue; }
    if (!current) continue;
    if (upper === 'BEGIN:VALARM') { alarmDepth += 1; current.push({ name: 'BEGIN', params: {}, value: 'VALARM', raw: line }); continue; }
    if (upper === 'END:VALARM') { alarmDepth = Math.max(0, alarmDepth - 1); current.push({ name: 'END', params: {}, value: 'VALARM', raw: line }); continue; }
    const parsed = parseProperty(line);
    if (parsed) current.push({ ...parsed, params: { ...parsed.params, ...(alarmDepth ? { '_IN_ALARM': '1' } : {}) } });
    else if (line.trim()) findings.push({ id: `bad-line-${findings.length}`, severity: 'warning', title: 'A line could not be read', detail: `Review this line in the source: ${line.slice(0, 80)}` });
  }
  const events: CalendarEvent[] = eventBlocks.map((items, index) => {
    const summary = unescapeText(property(items, 'SUMMARY')?.value || 'Untitled event');
    const uid = property(items, 'UID')?.value || '';
    const start = parseDate(property(items, 'DTSTART'));
    const end = parseDate(property(items, 'DTEND'));
    const recurrence = property(items, 'RRULE')?.value || '';
    const attendees = properties(items, 'ATTENDEE').length;
    const alarms = items.filter((item) => item.name === 'BEGIN' && item.value === 'VALARM').length;
    const location = unescapeText(property(items, 'LOCATION')?.value || '');
    const organizer = property(items, 'ORGANIZER')?.value.replace(/^mailto:/i, '') || '';
    const fingerprint = hash([summary.toLowerCase(), start?.raw || '', end?.raw || '', location.toLowerCase()].join('|'));
    return { index, properties: items, summary, uid, start, end, location, description: unescapeText(property(items, 'DESCRIPTION')?.value || ''), recurrence, attendees, alarms, status: property(items, 'STATUS')?.value || '', organizer, fingerprint };
  });
  if (!events.length) findings.push({ id: 'no-events', severity: 'error', title: 'No events were found', detail: 'Choose a file with at least one VEVENT block.' });
  const uids = new Map<string, number>();
  const prints = new Map<string, number>();
  for (const event of events) {
    const n = event.index + 1;
    if (!event.uid) findings.push({ id: `uid-${n}`, severity: 'warning', title: `Event ${n} has no unique ID`, detail: 'This event has no UID. Add a generated ID to the downloaded copy.', eventIndex: event.index, repair: 'uids' });
    else if (uids.has(event.uid)) findings.push({ id: `duplicate-uid-${n}`, severity: 'error', title: `Event ${n} repeats an event ID`, detail: `It has the same UID as event ${(uids.get(event.uid) || 0) + 1}. Remove one copy or ask the sender to fix it.`, eventIndex: event.index });
    else uids.set(event.uid, event.index);
    if (prints.has(event.fingerprint)) findings.push({ id: `duplicate-content-${n}`, severity: 'warning', title: `Event ${n} looks like a duplicate`, detail: `Its title, time, and location match event ${(prints.get(event.fingerprint) || 0) + 1}.`, eventIndex: event.index });
    else prints.set(event.fingerprint, event.index);
    if (!event.start) findings.push({ id: `start-${n}`, severity: 'error', title: `Event ${n} has no start time`, detail: 'Add DTSTART before importing this event.', eventIndex: event.index });
    else if (event.start.timestamp === undefined) findings.push({ id: `start-format-${n}`, severity: 'error', title: `Event ${n} has an invalid start time`, detail: `Change “${event.start.raw}” to an ICS date or date-time.`, eventIndex: event.index });
    if (event.start?.kind === 'floating') findings.push({ id: `floating-${n}`, severity: 'warning', title: `Event ${n} has no timezone`, detail: 'The start time has no TZID or UTC Z suffix. Confirm the shown local time before import.', eventIndex: event.index });
    if (event.start?.tzid && !validTimeZone(event.start.tzid) && !timezoneIds.includes(event.start.tzid)) findings.push({ id: `unknown-tz-${n}`, severity: 'error', title: `Event ${n} uses an unknown timezone`, detail: `Add a VTIMEZONE block for “${event.start.tzid}” or replace it with an IANA timezone.`, eventIndex: event.index });
    if (event.start?.timestamp !== undefined && event.end?.timestamp !== undefined && event.end.timestamp <= event.start.timestamp) findings.push({ id: `end-${n}`, severity: 'error', title: `Event ${n} ends before it starts`, detail: 'Correct DTEND so it falls after DTSTART.', eventIndex: event.index });
    if (!property(event.properties, 'DTSTAMP')) findings.push({ id: `stamp-${n}`, severity: 'note', title: `Event ${n} has no creation stamp`, detail: 'This event has no DTSTAMP. Add a UTC creation stamp to the downloaded copy.', eventIndex: event.index, repair: 'stamps' });
    if (event.recurrence) {
      const parts = Object.fromEntries(event.recurrence.split(';').map((part) => part.split('=')));
      if (!parts.FREQ || !['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].includes(parts.FREQ)) findings.push({ id: `rrule-${n}`, severity: 'error', title: `Event ${n} has an invalid repeat rule`, detail: 'RRULE needs a supported FREQ value.', eventIndex: event.index });
      else if (!parts.COUNT && !parts.UNTIL) findings.push({ id: `unbounded-${n}`, severity: 'warning', title: `Event ${n} repeats without an end`, detail: 'Confirm that this event should continue forever.', eventIndex: event.index });
      if (parts.INTERVAL && (!/^\d+$/.test(parts.INTERVAL) || +parts.INTERVAL < 1)) findings.push({ id: `interval-${n}`, severity: 'error', title: `Event ${n} has an invalid repeat interval`, detail: 'INTERVAL must be a whole number of 1 or more.', eventIndex: event.index });
      if (parts.COUNT && (!/^\d+$/.test(parts.COUNT) || +parts.COUNT < 1)) findings.push({ id: `count-${n}`, severity: 'error', title: `Event ${n} has an invalid repeat count`, detail: 'COUNT must be a whole number of 1 or more.', eventIndex: event.index });
      if (parts.UNTIL && formatDate(parts.UNTIL, parts.UNTIL.endsWith('Z') ? 'utc' : 'floating').timestamp === undefined) findings.push({ id: `until-${n}`, severity: 'error', title: `Event ${n} has an invalid repeat end`, detail: 'UNTIL must use an ICS date or date-time.', eventIndex: event.index });
    }
    if (event.attendees) findings.push({ id: `people-${n}`, severity: 'note', title: `Event ${n} contains ${event.attendees} attendee ${event.attendees === 1 ? 'address' : 'addresses'}`, detail: 'These addresses stay in the downloaded copy unless you remove attendee details.', eventIndex: event.index, repair: 'people' });
    if (event.alarms) findings.push({ id: `alarms-${n}`, severity: 'note', title: `Event ${n} contains ${event.alarms} ${event.alarms === 1 ? 'alarm' : 'alarms'}`, detail: 'Remove the alarm block from the downloaded copy if you do not need it.', eventIndex: event.index, repair: 'alarms' });
    if (event.status.toUpperCase() === 'CANCELLED') findings.push({ id: `status-${n}`, severity: 'warning', title: `Event ${n} is cancelled`, detail: 'This event contains STATUS:CANCELLED. Check it before import.', eventIndex: event.index });
    const urls = event.properties.filter((item) => item.name === 'URL' || item.name === 'ATTACH');
    if (urls.length) findings.push({ id: `links-${n}`, severity: 'note', title: `Event ${n} contains ${urls.length} external ${urls.length === 1 ? 'link' : 'links'}`, detail: 'Links are shown as text only. This checker never opens them.', eventIndex: event.index });
  }
  if (endings !== 'CRLF') findings.push({ id: 'line-endings', severity: 'note', title: 'Line endings are not the ICS standard', detail: 'Write CRLF line breaks in the downloaded copy.', repair: 'lineEndings' });
  const errors = findings.filter((finding) => finding.severity === 'error').length;
  if (!errors && events.length) findings.push({ id: 'parse-pass', severity: 'pass', title: 'The calendar structure can be exported', detail: 'Review warnings and event details before choosing a calendar.' });
  return { source, events, findings, calendarName: unescapeText(allProps.find((item) => item.name === 'X-WR-CALNAME')?.value || ''), method, timezones: timezoneIds, lineEnding: endings, canExport: errors === 0 && events.length > 0 };
}

function stamp(): string {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function fold(line: string): string[] {
  const output: string[] = [];
  let rest = line;
  while (rest.length > 73) { output.push(rest.slice(0, 73)); rest = ` ${rest.slice(73)}`; }
  output.push(rest);
  return output;
}

export interface RepairOptions { uids: boolean; stamps: boolean; alarms: boolean; people: boolean; method: boolean; lineEndings: boolean; }

export function repairIcs(inspection: Inspection, options: RepairOptions, destination: 'apple' | 'google' | 'outlook'): string {
  const lines = unfold(inspection.source.replace(/^\uFEFF/, '').trim());
  const output: string[] = [];
  let event = -1;
  let inAlarm = false;
  let alarmBuffer: string[] = [];
  let hasUid = false;
  let hasStamp = false;
  for (const line of lines) {
    const upper = line.toUpperCase();
    if (upper === 'BEGIN:VEVENT') { event += 1; hasUid = false; hasStamp = false; output.push(line); continue; }
    if (upper.startsWith('UID:')) hasUid = true;
    if (upper.startsWith('DTSTAMP:')) hasStamp = true;
    if (upper === 'BEGIN:VALARM') { inAlarm = true; alarmBuffer = [line]; continue; }
    if (inAlarm) {
      alarmBuffer.push(line);
      if (upper === 'END:VALARM') { if (!options.alarms) output.push(...alarmBuffer); inAlarm = false; }
      continue;
    }
    if (event >= 0 && options.people && (/^(ATTENDEE|ORGANIZER)[;:]/i.test(line))) continue;
    if (options.method && /^METHOD:/i.test(line)) continue;
    if (upper === 'END:VEVENT') {
      if (options.uids && !hasUid) output.push(`UID:local-${hash(`${event}|${inspection.events[event]?.fingerprint}|${stamp()}`)}@ics-intake-checker`);
      if (options.stamps && !hasStamp) output.push(`DTSTAMP:${stamp()}`);
      output.push(line);
      continue;
    }
    if (destination === 'outlook' && upper === 'BEGIN:VCALENDAR' && !inspection.method) { output.push(line, 'METHOD:PUBLISH'); continue; }
    output.push(line);
  }
  const normalized = output.flatMap(fold).join('\r\n') + '\r\n';
  return normalized;
}

export const SAMPLE_ICS = `BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//Northwind Community Clinic//Appointments//EN\r
METHOD:REQUEST\r
X-WR-CALNAME:Clinic visits\r
BEGIN:VEVENT\r
SUMMARY:Follow-up appointment\r
DTSTART:20260903T143000\r
DTEND:20260903T153000\r
LOCATION:West wing\\, Room 214\r
ATTENDEE;CN=Sam Lee:mailto:sam@example.test\r
ATTENDEE;CN=Care team:mailto:care@example.test\r
ORGANIZER:mailto:appointments@example.test\r
RRULE:FREQ=WEEKLY\r
URL:https://clinic.example.test/private-visit\r
BEGIN:VALARM\r
TRIGGER:-PT24H\r
ACTION:DISPLAY\r
DESCRIPTION:Appointment reminder\r
END:VALARM\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:vendor-workshop-42@example.test\r
DTSTAMP:20260820T090000Z\r
SUMMARY:Vendor onboarding workshop\r
DTSTART;TZID=America/New_York:20260907T090000\r
DTEND;TZID=America/New_York:20260907T103000\r
LOCATION:Conference room Cedar\r
STATUS:TENTATIVE\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:vendor-workshop-copy@example.test\r
DTSTAMP:20260820T091500Z\r
SUMMARY:Vendor onboarding workshop\r
DTSTART;TZID=America/New_York:20260907T090000\r
DTEND;TZID=America/New_York:20260907T103000\r
LOCATION:Conference room Cedar\r
STATUS:TENTATIVE\r
END:VEVENT\r
END:VCALENDAR\r
`;
