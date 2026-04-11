export type HistoryAction = 'CREATED' | 'UPDATED' | 'STATUS_CHANGE' | 'DELETED';
export type ChangeSource = 'INITIAL_REGISTRATION' | 'MANUAL_EDIT' | 'WORK_ORDER' | 'SYSTEM';

export interface AssetHistoryEntry {
  id: string;
  assetCode: string;
  status: 'operative' | 'maintenance' | 'out_of_service' | 'retired';
  changeDate: string;
  field?: string;
  description?: string;
  userId: string;
  userInitials: string;
}

export interface AssetHistoryDetail {
  logId: string;
  action: HistoryAction;
  changeSource: ChangeSource;
  details: string;
  assetCode: string;
  status: string;
  changeDate: string;
  userName: string;
  assetSnapshot: string;
}
