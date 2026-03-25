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
