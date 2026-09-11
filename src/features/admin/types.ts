export interface AdminManagementSectionItem {
  id: string;
  title: string;
  description: string;
  actions: string[];
}

export interface AdminProfile {
  name: string;
  role: string;
  systemVersion: string;
}
