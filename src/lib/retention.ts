/** 最終更新からの保持日数。経過後に自動削除される。 */
export const ROOM_RETENTION_DAYS = 90;

export function retentionCutoffIso(now = new Date()): string {
  const cutoff = new Date(now);
  cutoff.setUTCDate(cutoff.getUTCDate() - ROOM_RETENTION_DAYS);
  return cutoff.toISOString();
}
