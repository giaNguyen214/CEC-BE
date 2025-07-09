// Lọc context nhạy cảm
export function detectSensitiveContext(text: string): string[] {
  const issues: string[] = [];

  // Regex MSSV BK
  if (/\b\d{7}\b/.test(text)) {
    issues.push('Mã số sinh viên');
  }

  return issues;
}
