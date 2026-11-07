/**
 * Utility functions for formatting dates in dd/mm/yyyy format
 */

export function formatDateDDMMYYYY(dateStr: string): string {
  if (!dateStr) return '';
  const cleanStr = dateStr.split('T')[0];
  const parts = cleanStr.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }
  
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateWithDayDDMMYYYY(dateStr: string): string {
  try {
    const cleanStr = dateStr.split('T')[0];
    const parts = cleanStr.split('-');
    let d: Date;
    if (parts.length === 3 && parts[0].length === 4) {
      d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    } else {
      d = new Date(dateStr);
    }
    
    if (isNaN(d.getTime())) return dateStr;

    const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(d);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${dayName}, ${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}
