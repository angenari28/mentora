export interface DashboardResponse {
  activeUsers: number;
  activeCourses: number;
  activeClasses: number;
  completedClasses: number;
  recentActivities: RecentActivity[];
}

export interface RecentActivity {
  userName: string;
  createdAt: string;
}
