import { ModuleKeys } from '../interface';
import { FeedbacksScreen } from '~/core_modules/profile/widgets/feedbacks';
import { UserDeletionScreen } from '~/core_modules/profile/widgets/userDeletion';
import { Dashboard } from '~/custom_modules/dashboard';
import { CategoriesPage } from '~/custom_modules/inventory/categories';
import { ProductListExample } from '~/custom_modules/customers';
import { ContentGallery } from '~/core_modules/content_gallery';
import { InventoryPage } from '~/custom_modules/inventory';
import { ProductsPage } from '~/custom_modules/inventory/products';
import { ModifiersPage } from '~/custom_modules/inventory/modifiers';
import { OrdersPage } from '~/custom_modules/orders';
import { TempNotificationPage } from '~/core_modules/notifications/tempIndex';
import { ProfileScreen } from '~/core_modules/profile';

export const moduleScreens: Record<
  ModuleKeys,
  {
    body: React.ComponentType<any>;
    rightHeader?: React.ComponentType<any>;
    bottomHeader?: React.ComponentType<any>;
  }
> = {
  Dashboard: {
    body: Dashboard,
  },
  Customers: {
    body: ProductListExample,
  },
  Gallery: {
    body: ContentGallery,
  },
  Inventory: {
    body: InventoryPage,
  },
  Products: {
    body: ProductsPage,
  },
  Categories: {
    body: CategoriesPage,
  },
  Modifiers: {
    body: ModifiersPage,
  },
  Orders: {
    body: OrdersPage,
  },
  Notifications: {
    body: TempNotificationPage,
  },
  FeedBack: {
    body: FeedbacksScreen,
  },
  AccountDeletion: {
    body: UserDeletionScreen,
  },
  Profile: {
    body: ProfileScreen,
  },
};
