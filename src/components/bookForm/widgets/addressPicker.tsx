import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Modal,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { gql, useLazyQuery } from '@apollo/client';
import { X, Search, MapPin, Navigation, ChevronRight } from 'lucide-react-native';
import Text from '~/codidge_components/UI/text';
import { apiKeyClient } from '~/store/config/apolloClient';

export const getSearchAutoCompleteQuery = gql`
  query AutocompleteSearch($input: String!) {
    autoCompleteSearch(input: $input) {
      places {
        placeId
        displayName
        address
      }
    }
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IAddressSuggestion {
  displayName: string;
  address: string;
  placeId: string;
  meta?: any;
}

interface ISearchResults {
  places: IAddressSuggestion[];
}

export type AddressPickerVariant = 'pickup' | 'dropoff';

interface AddressPickerModalProps {
  visible: boolean;
  variant?: AddressPickerVariant;
  onClose: () => void;
  onSelect: (address: IAddressSuggestion) => void;
  initialValue?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const GOLD = '#D4A853';
const GOLD_DIM = 'rgba(212,168,83,0.6)';
const GOLD_FAINT = 'rgba(212,168,83,0.12)';

const VARIANT_CONFIG = {
  pickup: {
    label: 'Pickup Location',
    placeholder: 'Where are you?',
    icon: Navigation,
    hint: 'Enter your pickup address or current location',
  },
  dropoff: {
    label: 'Destination',
    placeholder: 'Where to?',
    icon: MapPin,
    hint: 'Enter your drop-off address',
  },
};

// ─── Suggestion Item ──────────────────────────────────────────────────────────

const SuggestionItem = ({
  item,
  onPress,
  isLast,
}: {
  item: IAddressSuggestion;
  onPress: (item: IAddressSuggestion) => void;
  isLast: boolean;
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 40 }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={() => onPress(item)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[suggestion.item, isLast && { borderBottomWidth: 0 }]}>
        <View style={suggestion.iconWrap}>
          <MapPin size={14} color={GOLD} />
        </View>
        <View style={suggestion.textWrap}>
          <Text style={suggestion.name} numberOfLines={1}>
            {item.displayName}
          </Text>
          <Text style={suggestion.address} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
        <ChevronRight size={14} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────

export const AddressPickerModal: React.FC<AddressPickerModalProps> = ({
  visible,
  variant = 'pickup',
  onClose,
  onSelect,
  initialValue = '',
}) => {
  const config = VARIANT_CONFIG[variant];
  const IconComponent = config.icon;

  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<TextInput>(null);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Apollo lazy query
  const [fetchSuggestions, { data, loading, error }] = useLazyQuery<{
    autoCompleteSearch: ISearchResults;
  }>(getSearchAutoCompleteQuery, {
    client: apiKeyClient,
  });

  const suggestions = data?.autoCompleteSearch?.places ?? [];

  // Slide in/out
  useEffect(() => {
    if (visible) {
      setSearchTerm(initialValue);
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 22,
        stiffness: 180,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => inputRef.current?.focus(), 80);
      });
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Debounced search
  useEffect(() => {
    if (!visible) return;
    if (searchTerm.trim().length < 2) return;

    const timer = setTimeout(() => {
      fetchSuggestions({ variables: { input: searchTerm } });
    }, 420);

    return () => clearTimeout(timer);
  }, [searchTerm, visible]);

  const handleSelect = useCallback(
    (item: IAddressSuggestion) => {
      onSelect(item);
      setSearchTerm('');
      onClose();
    },
    [onSelect, onClose]
  );

  const handleClose = useCallback(() => {
    setSearchTerm('');
    onClose();
  }, [onClose]);

  const showEmpty = !loading && searchTerm.trim().length > 1 && suggestions.length === 0;
  const showHint = searchTerm.trim().length <= 1 && !loading;
  const showResults = !loading && suggestions.length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}>
      {/* Full-screen dark backdrop */}
      <View style={modal.backdrop}>
        {/* Slide-up sheet */}
        <Animated.View style={[modal.sheet, { transform: [{ translateY: slideAnim }] }]}>
          {/* Blur + dark fill */}
          {Platform.OS === 'ios' && (
            <BlurView
              intensity={70}
              tint="dark"
              style={[
                StyleSheet.absoluteFill,
                { borderTopLeftRadius: 28, borderTopRightRadius: 28 },
              ]}
            />
          )}
          <LinearGradient
            colors={['rgba(2,6,23,0.96)', 'rgba(2,6,23,0.99)']}
            style={[StyleSheet.absoluteFill, { borderTopLeftRadius: 28, borderTopRightRadius: 28 }]}
          />

          {/* Top gold accent */}
          <LinearGradient
            colors={['transparent', GOLD, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={modal.topAccent}
          />

          {/* ── Header ── */}
          <View style={modal.header}>
            <View style={modal.headerLeft}>
              <View style={modal.variantIcon}>
                <IconComponent size={15} color={GOLD} />
              </View>
              <View>
                <Text style={modal.title}>{config.label}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleClose} style={modal.closeBtn} activeOpacity={0.7}>
              <X size={16} color="rgba(255,255,255,0.65)" />
            </TouchableOpacity>
          </View>

          {/* ── Search Input ── */}
          <View style={modal.searchWrapper}>
            <LinearGradient
              colors={[GOLD_FAINT, 'rgba(212,168,83,0.04)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={modal.searchGradient}>
              <View style={modal.searchIcon}>
                <Search size={16} color={GOLD_DIM} />
              </View>
              <TextInput
                ref={inputRef}
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder={config.placeholder}
                placeholderTextColor="rgba(255,255,255,0.25)"
                style={modal.searchInput}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="search"
              />
              {searchTerm.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchTerm('')}
                  style={modal.clearBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <X size={14} color="#ffffff" />
                </TouchableOpacity>
              )}
            </LinearGradient>
          </View>

          {/* ── Results Area ── */}
          <ScrollView
            style={modal.list}
            contentContainerStyle={modal.listContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {/* Loading */}
            {loading && (
              <View style={state.wrapper}>
                <ActivityIndicator size="small" color={GOLD} />
                <Text style={state.text}>Searching addresses…</Text>
              </View>
            )}

            {/* Hint */}
            {showHint && !showResults && (
              <View style={state.wrapper}>
                <View style={state.hintIconWrap}>
                  <IconComponent size={22} color={GOLD_DIM} />
                </View>
                <Text style={state.hintTitle}>{config.hint}</Text>
                <Text style={state.text}>Type at least 2 characters to search</Text>
              </View>
            )}

            {/* No results */}
            {showEmpty && (
              <View style={state.wrapper}>
                <View style={state.hintIconWrap}>
                  <Search size={22} color="rgba(255,255,255,0.15)" />
                </View>
                <Text style={state.hintTitle}>No results found</Text>
                <Text style={state.text}>Try a different address or landmark</Text>
              </View>
            )}

            {/* Results */}
            {showResults && (
              <View style={result.container}>
                <Text style={result.sectionLabel}>SUGGESTIONS</Text>
                {suggestions.map((item, index) => (
                  <SuggestionItem
                    key={item.placeId}
                    item={item}
                    onPress={handleSelect}
                    isLast={index === suggestions.length - 1}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const modal = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    height: SCREEN_HEIGHT * 0.88,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    backgroundColor: Platform.OS === 'android' ? 'rgba(2,6,23,0.99)' : 'transparent',
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  variantIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(212,168,83,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrapper: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.22)',
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 4,
    gap: 10,
  },
  searchIcon: {
    width: 24,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '400',
  },
  clearBtn: {
    padding: 4,
    color: '#ffffff',
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
});

const state = StyleSheet.create({
  wrapper: {
    paddingTop: 52,
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 10,
  },
  hintIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(212,168,83,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  hintTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
  },
  text: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.25)',
    textAlign: 'center',
    lineHeight: 19,
  },
});

const result = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
    color: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
});

const suggestion = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(212,168,83,0.08)',
    gap: 12,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(212,168,83,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },
  address: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
  },
});
