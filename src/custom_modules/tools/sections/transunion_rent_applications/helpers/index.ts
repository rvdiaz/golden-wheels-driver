import { IExtendedRenterInput } from '../interfaces';
import { Minus, Eye, Clock, CheckCircle } from 'lucide-react-native';

export const formatTransunionDate = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
};

export const getRequestStatus = (
  renters: IExtendedRenterInput[]
): { status: string; color: string; bgColor: string } => {
  if (renters.length === 0) {
    return {
      status: 'Not Started',
      color: '#666',
      bgColor: '#f5f5f5',
    };
  }

  // Check if any renter has submitted reports (with TransUnion)
  const hasReportsRequested = renters.some((renter) => renter.renterStatus === 'pending');

  if (hasReportsRequested) {
    return {
      status: 'Submitted',
      color: '#2196f3',
      bgColor: '#e3f2fd',
    };
  }

  // Check if any renter has other pending statuses
  const hasOtherPending = renters.some(
    (renter) =>
      renter.renterStatus === 'in_progress' ||
      renter.renterStatus.toLowerCase().includes('in_progress')
  );

  if (hasOtherPending) {
    return {
      status: 'In Progress',
      color: '#ff9500',
      bgColor: '#fff3e0',
    };
  }

  // If all renters are complete/approved
  const allComplete = renters.every((renter) => renter.renterStatus === 'completed');

  if (allComplete) {
    return {
      status: 'Complete',
      color: '#4caf50',
      bgColor: '#e8f5e8',
    };
  }

  // Default case for any other statuses
  return {
    status: 'In Progress',
    color: '#ff9500',
    bgColor: '#fff3e0',
  };
};

// Get individual applicant status
export const getApplicantStatus = (
  renterStatus: string
): {
  status: string;
  color: string;
  bgColor: string;
  icon: React.ComponentType<any>;
} => {
  switch (renterStatus.toLowerCase()) {
    case 'pending':
      return {
        status: 'Not Started',
        color: '#666',
        bgColor: '#f5f5f5',
        icon: Minus,
      };
    case 'viewed':
      return {
        status: 'Viewed',
        color: '#2196f3',
        bgColor: '#e3f2fd',
        icon: Eye,
      };
    case 'in_progress':
      return {
        status: 'In Progress',
        color: '#ff9500',
        bgColor: '#fff3e0',
        icon: Clock,
      };
    case 'completed':
      return {
        status: 'Completed',
        color: '#4caf50',
        bgColor: '#e8f5e8',
        icon: CheckCircle,
      };
    default:
      return {
        status: 'Not Started',
        color: '#666',
        bgColor: '#f5f5f5',
        icon: Minus,
      };
  }
};
