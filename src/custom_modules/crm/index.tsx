import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  RefreshControl,
  Platform,
  ActionSheetIOS,
  Alert,
} from 'react-native';
import { FloatingMenu } from '~/codidge_components/UI/button/FloatingMenu';
import ContactForm from './widgets/addContact';
import { ContactList } from './widgets/contactList';
import { ActiveCrmTabs, ContactType, IContact, IFollowUp } from './interfaces';
import { useReactiveVar } from '@apollo/client';
import { PageLoading } from '~/codidge_components/UI/loading/loadingPage';
import Constants from 'expo-constants';
import { userData } from '~/store/user';
import { theme } from '~/theme/theme';
import { CircleUser, Clock, Users } from 'lucide-react-native';
import { crmTabSelection } from './hooks/tabSelectionVar';
import { CompactTabHeader } from '~/codidge_components/UI/tabs';
import { FollowUpList } from './widgets/followUps/followUpList';
import { AddFollowUpModal } from './widgets/followUps/followUpForm';
import { useAddFollowUp } from './hooks/followUpCreation';
import { ImportContactsModal } from './widgets/contactFromExport';
import { useContactsQueries } from './hooks/contactMutations';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const CRMScreen: React.FC = () => {
  const crmTab = useReactiveVar(crmTabSelection);

  const user = useReactiveVar(userData);
  const [refreshing, setRefreshing] = useState(false);

  const [importModalVisible, setImportModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const disposeModalHandler = () => {
    setModalVisible(false);
  };

  const { addFollowUp, addingFollowUp } = useAddFollowUp({
    tenantId,
    onCompleted: () => setModalVisible(false),
  });

  const {
    loadingContacts,
    contacts: dataContacts,
    handleAddContact,
    refetch,
  } = useContactsQueries();

  if (loadingContacts) {
    return <PageLoading />;
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleImportContacts = async (phoneContacts: any, asLeads: any, category: any) => {
    try {
      // Parse phone contacts and add category
      const newContacts = phoneContacts.map((pc: any) => {
        // Parse the full name if needed
        let firstName = '';
        let lastName = '';

        if (pc.name) {
          const nameParts = pc.name.split(' ');
          firstName = nameParts[0] || '';
          lastName = nameParts.slice(1).join(' ') || '';
        }

        return {
          firstName,
          lastName,
          phone: pc.phoneNumbers?.[0]?.number || '',
          email: pc.emails?.[0]?.email || '',
          type: asLeads ? ContactType.LEAD : ContactType.CLIENT, // ContactType.LEAD or ContactType.CLIENT
          category: category, // The selected category
          priority: 'medium',
          leadStatus: asLeads ? 'new' : undefined,
          notes:
            pc.company || pc.jobTitle
              ? `Company: ${[pc.jobTitle, pc.company].filter(Boolean).join(' at ')}`
              : '',
        };
      });

      // Batch import - you'll need to create a mutation for this
      // or loop through and add each contact
      for (const contact of newContacts) {
        await handleAddContact({
          tenant: { tenantId },
          userId: user?.id,
          contactData: contact,
        });
      }

      // Refetch contacts list
      await refetch();
    } catch (error) {
      console.error('Error importing contacts:', error);
      throw error;
    }
  };

  const contacts = dataContacts.slice().sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const existingPhones = contacts.flatMap((c) => c.phone);

  const leads = contacts.filter((ctc) => ctc.type === ContactType.LEAD);
  const pureContacts = contacts.filter((ctc) => ctc.type === ContactType.CLIENT);

  return (
    <SafeAreaView style={styles.container}>
      <CompactTabHeader
        tabs={[
          {
            key: ActiveCrmTabs.lead,
            label: 'Leads',
            Icon: Users,
            indexNumber: leads.length,
          },
          {
            key: ActiveCrmTabs.contact,
            label: 'Contacts',
            Icon: CircleUser,
            indexNumber: pureContacts.length,
          },
          {
            key: ActiveCrmTabs.followUp,
            label: 'Follow-ups',
            Icon: Clock,
            indexNumber: 0,
          },
        ]}
        onTabChange={(key) => crmTabSelection(key as ActiveCrmTabs)}
      />

      {crmTab !== ActiveCrmTabs.followUp ? (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          style={styles.content}
          showsVerticalScrollIndicator={false}>
          <ContactList
            title={crmTab === ActiveCrmTabs.contact ? 'Contacts' : 'Follow Ups'}
            contacts={crmTab === ActiveCrmTabs.contact ? pureContacts : leads}
          />
        </ScrollView>
      ) : (
        <FollowUpList />
      )}
      {crmTab !== ActiveCrmTabs.followUp ? (
        <FloatingMenu
          title="Add New"
          icon="Plus"
          onPress={() => {
            if (Platform.OS === 'ios') {
              ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: ['Add Single Contact', 'Import from Phone', 'Cancel'],
                  cancelButtonIndex: 2,
                  title: 'Add Contacts',
                },
                (buttonIndex) => {
                  if (buttonIndex === 0) {
                    setModalVisible(true);
                  } else if (buttonIndex === 1) {
                    setImportModalVisible(true);
                  }
                }
              );
            } else {
              // For Android, use Alert
              Alert.alert('Add Contacts', 'Choose an option', [
                { text: 'Add Single Contact', onPress: () => setModalVisible(true) },
                { text: 'Import from Phone', onPress: () => setImportModalVisible(true) },
                { text: 'Cancel', style: 'cancel' },
              ]);
            }
          }}
        />
      ) : (
        <FloatingMenu
          title="Follow Up"
          icon="Plus"
          onPress={() => {
            setModalVisible(true);
          }}
        />
      )}
      {crmTab !== ActiveCrmTabs.followUp ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={disposeModalHandler}>
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <ContactForm disposeModalHandler={disposeModalHandler} />
          </View>
        </Modal>
      ) : (
        <AddFollowUpModal
          loading={addingFollowUp}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={async (newFollowUp: Partial<IFollowUp>) => {
            try {
              await addFollowUp({
                variables: {
                  tenant: {
                    tenantId,
                  },
                  input: {
                    userId: user?.id,
                    date: newFollowUp.date,
                    notes: newFollowUp.notes,
                    title: newFollowUp.title,
                    contact: newFollowUp.contact,
                    time: newFollowUp.time,
                  },
                },
              });
            } catch (error) {
              console.log('::error');
            }
          }}
          contacts={contacts}
        />
      )}
      {importModalVisible && (
        <ImportContactsModal
          visible={importModalVisible}
          onClose={() => setImportModalVisible(false)}
          onImport={handleImportContacts}
          existingContactPhones={existingPhones}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bodyBackground,
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: theme.borderRadius.lg,
    padding: 18,
    marginHorizontal: 16,
  },
  contactListContainer: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    marginTop: 16,
    marginHorizontal: -8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
  },
  searchCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  mainGrid: {
    gap: 24,
    paddingBottom: 80,
  },
  rightColumn: {
    flex: 1,
    gap: 24,
  },
  activityCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityContact: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  followUpCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  followUpList: {
    gap: 12,
  },
  followUpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  followUpContent: {
    flex: 1,
  },
  followUpContact: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  followUpTask: {
    fontSize: 12,
    color: '#6B7280',
  },
  followUpDate: {
    fontSize: 12,
    fontWeight: '600',
  },
});
