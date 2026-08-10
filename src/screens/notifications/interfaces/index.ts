export interface INotification {
  notificationID: string;
  /** A NotificationType value, e.g. "booking.openForClaim" — the push payload carries the same. */
  type: string;
  title: string;
  body: string;
  /** AWSJSON, so it arrives as a string. Routing payload; shape varies per type. */
  data?: string | null;
  read: boolean;
  createdAt: string;
}

export interface ListMyNotificationsResponse {
  listMyNotifications: {
    items: INotification[];
    nextBefore?: string | null;
  };
}

export interface GetMyUnreadCountResponse {
  getMyUnreadCount: number;
}

export interface MarkNotificationsReadResponse {
  markNotificationsRead: {
    updated: number;
    total: number;
    notificationIDs: string[];
  };
}
