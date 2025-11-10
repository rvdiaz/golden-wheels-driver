export interface INotification {
  notificationId: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface GetUserNotificationsResponse {
  getUserNotifications: {
    items: INotification[];
  };
}

export interface OnNotificationPublishedData {
  onNotificationPublished: {
    tenantId: string;
    userId: string;
    sent: boolean;
    showOnApp: boolean;
    userNotification: INotification;
  };
}

export interface MarkNotificationsReadedResponse {
  updated: number;
  total: number;
  notificationIds: string[];
}
