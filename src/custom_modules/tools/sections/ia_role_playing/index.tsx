import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import Text from '~/codidge_components/UI/text';
import {
  MessageCircle,
  Send,
  RotateCcw,
  User,
  Bot,
  Play,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Lightbulb,
} from 'lucide-react-native';
import { Message, ROLE_PLAY_SCENARIOS, Scenario } from './mockedData';

export const IARolePlayingPage = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);

  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    strengths: string[];
    improvements: string[];
  } | null>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const startScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setSessionActive(true);
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: scenario.initialMessage,
        timestamp: new Date(),
      },
    ]);
    setFeedback(null);
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!selectedScenario) return 'Please select a scenario first.';

    // Simple response logic based on scenario type and user input
    const lowerMessage = userMessage.toLowerCase();

    // Common objection handlers
    if (
      lowerMessage.includes('expensive') ||
      lowerMessage.includes('price') ||
      lowerMessage.includes('cost')
    ) {
      return (
        selectedScenario.objections[0] ||
        "I understand price is important. Let me explain the value you're getting..."
      );
    }

    if (lowerMessage.includes('think about it') || lowerMessage.includes('time')) {
      return (
        selectedScenario.objections[1] ||
        'I appreciate you want to take your time. What specific concerns do you have?'
      );
    }

    if (lowerMessage.includes('agent') || lowerMessage.includes('realtor')) {
      return (
        selectedScenario.objections[2] ||
        "That's a valid concern. Let me share how I work differently..."
      );
    }

    // Scenario-specific responses
    switch (selectedScenario.type) {
      case 'buyer':
        if (lowerMessage.includes('yes') || lowerMessage.includes('interested')) {
          return "Great! I'd love to learn more about what you're looking for. What's your ideal home like?";
        }
        return "I understand. Can you tell me more about your concerns or what's holding you back?";

      case 'seller':
        if (lowerMessage.includes('yes') || lowerMessage.includes('sell')) {
          return 'Excellent! When would be a good time to discuss your home and create a marketing strategy?';
        }
        return 'I see. What would need to change for you to consider selling in the near future?';

      case 'investor':
        if (lowerMessage.includes('roi') || lowerMessage.includes('return')) {
          return 'Based on current market conditions, properties in this area typically see 8-12% annual returns. Would you like to see specific numbers?';
        }
        return "Investment properties require careful analysis. What's your investment timeline and goals?";

      case 'objection':
        return "That's a common concern. Here's how successful agents handle this...";

      default:
        return 'Tell me more about that. What specifically concerns you?';
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !selectedScenario) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(inputText.trim());

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const endSession = () => {
    // Generate feedback based on conversation
    const userMessages = messages.filter((m) => m.role === 'user');
    const score = Math.min(95, 60 + userMessages.length * 5); // Simple scoring

    setFeedback({
      score,
      strengths: [
        'Good active listening demonstrated',
        'Asked clarifying questions',
        'Maintained professional tone',
      ],
      improvements: [
        'Could explore objections more deeply',
        'Try using more open-ended questions',
        'Reference specific market data',
      ],
    });
    setSessionActive(false);
  };

  const resetSession = () => {
    setSelectedScenario(null);
    setMessages([]);
    setInputText('');
    setSessionActive(false);
    setFeedback(null);
  };

  // Scenario Selection Screen
  if (!selectedScenario) {
    return (
      <PageSafeContainer>
        <Header
          title="AI Role Playing"
          showBack={true}
          onBack={() => {
            navigation.goBack();
          }}
        />
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.headerSection}>
            <MessageCircle color="#7c3aed" size={32} />
            <Text style={styles.headerTitle}>Real Estate Role Play Training</Text>
            <Text style={styles.headerSubtitle}>
              Practice your skills with AI-powered scenarios. Choose a scenario below to begin.
            </Text>
          </View>

          <View style={styles.scenariosGrid}>
            {ROLE_PLAY_SCENARIOS.map((scenario: any) => (
              <TouchableOpacity
                key={scenario.id}
                style={styles.scenarioCard}
                onPress={() => startScenario(scenario)}>
                <View style={styles.scenarioHeader}>
                  <View style={[styles.scenarioIcon, { backgroundColor: scenario.color + '20' }]}>
                    <Text style={styles.scenarioEmoji}>{scenario.icon}</Text>
                  </View>
                  <View style={styles.scenarioBadge}>
                    <Text style={styles.scenarioBadgeText}>{scenario.difficulty}</Text>
                  </View>
                </View>
                <Text style={styles.scenarioTitle}>{scenario.title}</Text>
                <Text style={styles.scenarioDescription}>{scenario.description}</Text>
                <View style={styles.scenarioFooter}>
                  <View style={styles.scenarioMeta}>
                    <Text style={styles.scenarioMetaText}>{scenario.duration} min</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => startScenario(scenario)}>
                    <Play color="#7c3aed" size={16} />
                    <Text style={styles.startButtonText}>Start</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoCard}>
            <AlertCircle color="#3b82f6" size={20} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>How it works</Text>
              <Text style={styles.infoText}>
                Select a scenario and engage in a realistic conversation with our AI. The AI will
                respond based on common client behaviors and objections. At the end, you'll receive
                feedback on your performance.
              </Text>
            </View>
          </View>
        </ScrollView>
      </PageSafeContainer>
    );
  }

  // Chat Session Screen
  if (sessionActive) {
    return (
      <PageSafeContainer>
        <Header
          title={selectedScenario.title}
          showBack={true}
          onBack={() => {
            if (messages.length > 1) {
              endSession();
            } else {
              resetSession();
            }
          }}
        />
        <KeyboardAvoidingView
          style={styles.flex1}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
          <View style={styles.chatContainer}>
            {/* Scenario Info Banner */}
            <View style={[styles.scenarioBanner, { borderColor: selectedScenario.color }]}>
              <Text style={styles.scenarioBannerText}>
                {selectedScenario.icon} {selectedScenario.title}
              </Text>
              <View style={styles.scenarioBadgeSmall}>
                <Text style={styles.scenarioBadgeSmallText}>{selectedScenario.difficulty}</Text>
              </View>
            </View>

            {/* Messages */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}>
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageWrapper,
                    message.role === 'user'
                      ? styles.messageWrapperUser
                      : styles.messageWrapperAssistant,
                  ]}>
                  <View
                    style={[
                      styles.messageBubble,
                      message.role === 'user'
                        ? styles.messageBubbleUser
                        : styles.messageBubbleAssistant,
                    ]}>
                    <View style={styles.messageHeader}>
                      {message.role === 'assistant' ? (
                        <Bot color="#7c3aed" size={16} />
                      ) : (
                        <User color="#fff" size={16} />
                      )}
                      <Text
                        style={[
                          styles.messageRole,
                          message.role === 'user' && styles.messageRoleUser,
                        ]}>
                        {message.role === 'assistant' ? 'Client' : 'You'}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.messageText,
                        message.role === 'user' && styles.messageTextUser,
                      ]}>
                      {message.content}
                    </Text>
                  </View>
                </View>
              ))}

              {isTyping && (
                <View style={[styles.messageWrapper, styles.messageWrapperAssistant]}>
                  <View style={[styles.messageBubble, styles.messageBubbleAssistant]}>
                    <View style={styles.typingIndicator}>
                      <View style={styles.typingDot} />
                      <View style={styles.typingDot} />
                      <View style={styles.typingDot} />
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Input Area */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Type your response..."
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  maxLength={500}
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    (!inputText.trim() || isTyping) && styles.sendButtonDisabled,
                  ]}
                  onPress={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}>
                  <Send color="#fff" size={20} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.endSessionButton} onPress={endSession}>
                <CheckCircle color="#16a34a" size={16} />
                <Text style={styles.endSessionButtonText}>End Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </PageSafeContainer>
    );
  }

  // Feedback Screen
  if (feedback) {
    return (
      <PageSafeContainer>
        <Header title="Session Feedback" showBack={true} onBack={resetSession} />
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.feedbackContainer}>
            {/* Score Card */}
            <View style={styles.scoreCard}>
              <Star color="#fbbf24" size={48} />
              <Text style={styles.scoreTitle}>Your Performance</Text>
              <Text style={styles.scoreValue}>{feedback.score}%</Text>
              <Text style={styles.scoreSubtext}>
                {feedback.score >= 80
                  ? 'Excellent work!'
                  : feedback.score >= 60
                    ? 'Good effort!'
                    : 'Keep practicing!'}
              </Text>
            </View>

            {/* Strengths */}
            <View style={styles.feedbackSection}>
              <View style={styles.feedbackHeader}>
                <CheckCircle color="#16a34a" size={20} />
                <Text style={styles.feedbackTitle}>Strengths</Text>
              </View>
              {feedback.strengths.map((strength, index) => (
                <View key={index} style={styles.feedbackItem}>
                  <View style={styles.feedbackBullet}>
                    <Text style={styles.feedbackBulletText}>✓</Text>
                  </View>
                  <Text style={styles.feedbackText}>{strength}</Text>
                </View>
              ))}
            </View>

            {/* Areas for Improvement */}
            <View style={styles.feedbackSection}>
              <View style={styles.feedbackHeader}>
                <Lightbulb color="#f59e0b" size={20} />
                <Text style={styles.feedbackTitle}>Areas for Improvement</Text>
              </View>
              {feedback.improvements.map((improvement, index) => (
                <View key={index} style={styles.feedbackItem}>
                  <View style={[styles.feedbackBullet, styles.feedbackBulletWarning]}>
                    <Text style={styles.feedbackBulletText}>!</Text>
                  </View>
                  <Text style={styles.feedbackText}>{improvement}</Text>
                </View>
              ))}
            </View>

            {/* Tips Card */}
            <View style={styles.tipsCard}>
              <TrendingUp color="#7c3aed" size={20} />
              <Text style={styles.tipsTitle}>Pro Tips</Text>
              <Text style={styles.tipsText}>
                {selectedScenario?.tips.join('\n\n') || 'Keep practicing to improve!'}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={resetSession}>
                <RotateCcw color="#fff" size={20} />
                <Text style={styles.buttonText}>Try Another Scenario</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonOutline]}
                onPress={() => startScenario(selectedScenario!)}>
                <Play color="#7c3aed" size={20} />
                <Text style={styles.buttonOutlineText}>Practice Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </PageSafeContainer>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  flex1: {
    flex: 1,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  scenariosGrid: {
    gap: 16,
    marginBottom: 16,
  },
  scenarioCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scenarioIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scenarioEmoji: {
    fontSize: 24,
  },
  scenarioBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scenarioBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  scenarioTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  scenarioDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  scenarioFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scenarioMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scenarioMetaText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c3aed',
  },
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#3b82f6',
    lineHeight: 18,
  },
  chatContainer: {
    flex: 1,
  },
  scenarioBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 2,
  },
  scenarioBannerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  scenarioBadgeSmall: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  scenarioBadgeSmallText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 16,
  },
  messageWrapper: {
    maxWidth: '80%',
    marginBottom: 12,
  },
  messageWrapperUser: {
    alignSelf: 'flex-end',
  },
  messageWrapperAssistant: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
  },
  messageBubbleUser: {
    backgroundColor: '#7c3aed',
  },
  messageBubbleAssistant: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  messageRole: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  messageRoleUser: {
    color: '#fff',
  },
  messageText: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  messageTextUser: {
    color: '#fff',
  },
  typingIndicator: {
    flexDirection: 'row',
    gap: 4,
    paddingVertical: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9ca3af',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  endSessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    backgroundColor: '#f0fdf4',
  },
  endSessionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
  },
  feedbackContainer: {
    gap: 20,
    paddingBottom: 24,
  },
  scoreCard: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#7c3aed',
    marginTop: 8,
  },
  scoreSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  feedbackSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  feedbackItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  feedbackBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackBulletWarning: {
    backgroundColor: '#fef3c7',
  },
  feedbackBulletText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16a34a',
  },
  feedbackText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  tipsCard: {
    padding: 16,
    backgroundColor: '#f5f3ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    gap: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7c3aed',
  },
  tipsText: {
    fontSize: 14,
    color: '#6b21a8',
    lineHeight: 20,
  },
  actionButtons: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonPrimary: {
    backgroundColor: '#7c3aed',
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  buttonOutlineText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7c3aed',
  },
});
