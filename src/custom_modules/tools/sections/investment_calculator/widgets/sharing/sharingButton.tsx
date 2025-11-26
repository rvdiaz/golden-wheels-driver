import React, { useState } from 'react';
import { Alert, Linking, Share } from 'react-native';
import { CalculationResults } from '../../interfaces';
import { generateMailtoLink } from './sharingHtml';
import { ShareModal } from './sharingModal';

interface ShareResultsProps {
  results: CalculationResults;
  visible: boolean;
  onClose: () => void;
}

export const ShareResults: React.FC<ShareResultsProps> = ({ results, visible, onClose }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleEmailShare = async () => {
    try {
      setIsSharing(true);

      // Generate mailto link
      const mailtoUrl = generateMailtoLink(results, {
        subject: 'Investment Analysis Results',
      });

      // Check if we can open the URL
      const canOpen = await Linking.canOpenURL(mailtoUrl);

      if (!canOpen) {
        Alert.alert(
          'Email Not Available',
          'Please make sure you have an email app configured on your device.'
        );
        return;
      }

      // Open email client
      await Linking.openURL(mailtoUrl);
    } catch (error) {
      console.error('Error sharing via email:', error);
      Alert.alert(
        'Error',
        'Unable to open email client. Please try again or use another sharing method.'
      );
    } finally {
      setIsSharing(false);
      onClose();
    }
  };

  const handleNativeShare = async () => {
    try {
      setIsSharing(true);

      // Create a simple text summary for native share
      const summary = `
Investment Analysis Summary

💰 Total Cash Invested: $${results.totalCashInvested.toLocaleString()}
🔧 Total Repair Costs: $${results.totalRepairCosts.toLocaleString()}
📈 Annual Income Increase: $${results.totalIncomeIncrease.toLocaleString()}
💎 Estimated Value Gain: $${results.valueGain.toLocaleString()}

📊 Current Cap Rate: ${(results.currentCapRate * 100).toFixed(2)}%
✨ Improved Cap Rate: ${(results.improvedCapRate * 100).toFixed(2)}%
💵 Cash-on-Cash Return: ${(results.cashOnCashReturn * 100).toFixed(2)}%
💰 Annual Cash Flow: $${results.annualCashFlow.toLocaleString()}
📅 Monthly Cash Flow: $${(results.annualCashFlow / 12).toLocaleString()}
🏦 DSCR: ${results.debtServiceCoverageRatio.toFixed(2)}x
      `.trim();

      const result = await Share.share({
        message: summary,
        title: 'Investment Analysis Results',
      });

      if (result.action === Share.sharedAction) {
        console.log('Shared successfully');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Unable to share results. Please try again.');
    } finally {
      setIsSharing(false);
      onClose();
    }
  };

  return (
    <ShareModal
      visible={visible}
      onClose={onClose}
      onEmailShare={handleEmailShare}
      onNativeShare={handleNativeShare}
    />
  );
};
