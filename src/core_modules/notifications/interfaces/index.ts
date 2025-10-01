export interface INotification {
  notificationId: string;
  title: string;
  body: string;
  createdAt: string;
}

export interface GetUserNotificationsResponse {
  getUserNotifications: {
    items: INotification[];
  };
}
