import { IScreeningRequestRenter } from '../interfaces';

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
  renters: IScreeningRequestRenter[]
): { status: string; color: string; bgColor: string } => {
  if (renters.length === 0) {
    return {
      status: 'Not Started',
      color: '#666',
      bgColor: '#f5f5f5',
    };
  }

  // Check if any renter has submitted reports (with TransUnion)
  const hasReportsRequested = renters.some((renter) => renter.renterStatus === 'ReportsRequested');

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
      renter.renterStatus === 'IdentityVerificationPending' ||
      renter.renterStatus.toLowerCase().includes('pending')
  );

  if (hasOtherPending) {
    return {
      status: 'In Progress',
      color: '#ff9500',
      bgColor: '#fff3e0',
    };
  }

  // If all renters are complete/approved
  const allComplete = renters.every(
    (renter) => renter.renterStatus === 'Complete' || renter.renterStatus === 'Approved'
  );

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
): { status: string; color: string; bgColor: string } => {
  switch (renterStatus) {
    case 'ReportsRequested':
      return {
        status: 'Submitted',
        color: '#2196f3',
        bgColor: '#e3f2fd',
      };
    case 'Complete':
    case 'Approved':
      return {
        status: 'Complete',
        color: '#4caf50',
        bgColor: '#e8f5e8',
      };
    case 'IdentityVerificationPending':
      return {
        status: 'In Progress',
        color: '#ff9500',
        bgColor: '#fff3e0',
      };
    default:
      if (renterStatus.toLowerCase().includes('pending')) {
        return {
          status: 'In Progress',
          color: '#ff9500',
          bgColor: '#fff3e0',
        };
      }
      return {
        status: 'Not Started',
        color: '#666',
        bgColor: '#f5f5f5',
      };
  }
};
