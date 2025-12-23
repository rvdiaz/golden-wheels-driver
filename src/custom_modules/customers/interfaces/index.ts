export interface ICustomer {
  customerID: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
}

export enum ModalContentCustomerType {
  EDIT = 'edit',
  ADD = 'add',
  DELETE = 'delete',
}

// Form Data Interfaces
export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Display helpers
export interface CustomerStats {
  totalCustomers: number;
  newThisMonth: number;
  recentCustomers: ICustomer[];
}

// Filter and sort options
export enum CustomerSortBy {
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  DATE_ASC = 'date_asc',
  DATE_DESC = 'date_desc',
  EMAIL_ASC = 'email_asc',
  EMAIL_DESC = 'email_desc',
}

export interface CustomerFilters {
  searchQuery: string;
  sortBy: CustomerSortBy;
}
