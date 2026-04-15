import React, { useState } from 'react';
import { useForm, FormProvider, DeepPartial } from 'react-hook-form';
import { Booking, BookingForm, BookMode } from '~/screens/trips/interfaces';
import { TrioBookForm } from './formSteps/tripBookForm';
import { CarCategorySelection } from './formSteps/carCategorySelection';
import { SummaryAndPayment } from './formSteps/summaryAndPayment';
import { BookingFlowWrapper } from './widgets/formWrapper';
import { deepMerge } from './helpers';
import { BookingConfirmationScreen } from './formSteps/confirmationResults';
import { setActiveTab } from '~/store/navigationTabs';
import { ExtraNotes } from './formSteps/extraNotesForm.tsx';

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS = [
  {
    label: 'Trip Details',
    subtitle: 'Where are you going and when?',
  },
  {
    label: 'Choose Your Car',
    subtitle: 'Select the vehicle that fits your trip.',
  },
  {
    label: 'Extra Services',
    subtitle: 'Optional add-ons for your ride.',
  },
  {
    label: 'Summary',
    subtitle: 'Review your booking before paying.',
  },
];

const TOTAL_STEPS = STEPS.length;

// ─── Props ────────────────────────────────────────────────────────────────────

interface BookSelectionFormProps {
  onDismiss?: () => void;
  onPayPress?: (data: BookingForm) => void;
  initialValues?: DeepPartial<Booking>; // ← new
  initialStep?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const BookSelectionForm = ({ onDismiss, initialValues }: BookSelectionFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [finishPayment, setfinishPayment] = useState<
    | {
        bookingCode: string;
        pickupDisplayName: string;
        destinationDisplayName: string;
        startDate: string;
        carTypeName?: string;
        totalAmount?: number;
        currencyCode?: string;
        bookHours: number;
        bookMode: BookMode;
        notes: string;
      }
    | undefined
  >();
  const methods = useForm<BookingForm>({
    defaultValues: deepMerge(
      {
        status: 'pending',
        startDate: '',
        endDate: '',
        note: '',
        bookingBusinessData: {
          bookMode: BookMode.trip,
          bookHours: 2,
          pickupLocation: { displayName: '', formattedAddress: '', id: '' },
          dropoffLocation: { displayName: '', formattedAddress: '', id: '' },
          extraServices: [],
        },
      },
      initialValues ?? {} // ← anything passed in wins
    ),
    mode: 'onTouched',
  });

  const { trigger, handleSubmit } = methods;

  // ── Per-step validation ────────────────────────────────────────────────────

  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 0:
        return trigger([
          'bookingBusinessData.pickupLocation',
          'bookingBusinessData.dropoffLocation',
          'startDate',
        ]);
      case 1:
        return trigger(['bookingBusinessData.car']);
      case 2:
        return true; // extras are optional
      case 3:
        return true; // summary — no new fields
      default:
        return false;
    }
  };

  // ── Navigation ─────────────────────────────────────────────────────────────

  const handleNext = async () => {
    const valid = await validateStep(currentStep);
    if (!valid) return;
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep === 0) {
      onDismiss?.();
    } else {
      setCurrentStep((s) => s - 1);
    }
  };

  // ── Final submit ───────────────────────────────────────────────────────────

  const handlePay = handleSubmit((data: Booking) => {
    setfinishPayment({
      bookingCode: data.bookingCode,
      pickupDisplayName: data.bookingBusinessData.pickupLocation.displayName,
      destinationDisplayName: data.bookingBusinessData.dropoffLocation.displayName,
      startDate: data.startDate,
      carTypeName: data.bookingBusinessData.carType.name,
      currencyCode: data.bookingBusinessData.totalPrice.currencyCode,
      totalAmount: data.bookingBusinessData.totalPrice.amount,
      bookHours: data.bookingBusinessData.bookHours,
      bookMode: data.bookingBusinessData.bookMode,
      notes: data.note,
    });
  });

  const step = STEPS[currentStep];

  if (finishPayment) {
    return (
      <BookingConfirmationScreen
        bookingCode={finishPayment.bookingCode}
        pickupDisplayName={finishPayment.pickupDisplayName}
        destinationDisplayName={finishPayment.destinationDisplayName}
        carTypeName={finishPayment.carTypeName}
        currencyCode={finishPayment.currencyCode}
        startDate={finishPayment.startDate}
        totalAmount={finishPayment.totalAmount}
        bookMode={finishPayment.bookMode}
        notes={finishPayment.notes}
        onGoHome={() => {
          onDismiss?.();
          setActiveTab('Home');
        }}
        onViewTrips={() => {
          onDismiss?.();
          setActiveTab('Trips');
        }}
        bookHours={finishPayment.bookHours}
      />
    );
  }

  return (
    <FormProvider {...methods}>
      <BookingFlowWrapper
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        stepLabel={step?.label ?? ''}
        stepSubtitle={step?.subtitle ?? ''}
        onBack={handleBack}
        onDismiss={onDismiss}>
        {currentStep === 0 && <TrioBookForm onNext={handleNext} />}
        {currentStep === 1 && <CarCategorySelection onBack={handleBack} onNext={handleNext} />}
        {currentStep === 2 && <ExtraNotes onBack={handleBack} onNext={handleNext} />}
        {currentStep === 3 && <SummaryAndPayment finish={handlePay} onBack={handleBack} />}
      </BookingFlowWrapper>
    </FormProvider>
  );
};
