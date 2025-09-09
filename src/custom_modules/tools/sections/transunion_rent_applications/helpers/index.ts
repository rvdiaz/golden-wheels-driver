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

  // Check if any renter has a pending status
  const hasPendingStatus = renters.some(
    (renter) =>
      renter.renterStatus === 'IdentityVerificationPending' ||
      renter.renterStatus.toLowerCase().includes('pending')
  );

  if (hasPendingStatus) {
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

  return {
    status: 'In Progress',
    color: '#ff9500',
    bgColor: '#fff3e0',
  };
};
