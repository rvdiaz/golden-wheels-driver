import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from '~/codidge_components/UI/text';
import * as Icons from 'lucide-react-native';

interface QuizContentItemProps {
  item: any;
}

export const QuizContentItem: React.FC<QuizContentItemProps> = ({ item }) => {
  const handleStartQuiz = () => {
    // TODO: Implement quiz start logic
    console.log('Start quiz:', item);
  };

  return (
    <View style={styles.container}>
      {item.description && <Text style={styles.description}>{item.description}</Text>}

      {/* Quiz Information Card */}
      {item.quizData && (
        <View style={styles.quizInfoCard}>
          <View style={styles.quizHeader}>
            <Icons.HelpCircle size={20} color="#10B981" />
            <Text style={styles.quizTitle}>Quiz Details</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Icons.List size={16} color="#059669" />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>Questions</Text>
                <Text style={styles.statValue}>{item.quizData.questions?.length || 0}</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Icons.Target size={16} color="#059669" />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>Passing Score</Text>
                <Text style={styles.statValue}>{item.quizData.passingScore}%</Text>
              </View>
            </View>

            {item.quizData.timeLimit && (
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Icons.Clock size={16} color="#059669" />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>Time Limit</Text>
                  <Text style={styles.statValue}>{item.quizData.timeLimit} min</Text>
                </View>
              </View>
            )}
          </View>

          {item.quizData.allowRetakes !== undefined && (
            <View style={styles.infoRow}>
              <Icons.RefreshCw size={14} color="#059669" />
              <Text style={styles.infoText}>
                {item.quizData.allowRetakes ? 'Retakes allowed' : 'Single attempt only'}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Start Quiz Button */}
      <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz}>
        <Icons.Play size={18} color="#FFFFFF" />
        <Text style={styles.startButtonText}>Start Quiz</Text>
        <Icons.ChevronRight size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  quizInfoCard: {
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
  },
  statsContainer: {
    gap: 12,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#047857',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#A7F3D0',
  },
  infoText: {
    fontSize: 13,
    color: '#047857',
    fontWeight: '500',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
