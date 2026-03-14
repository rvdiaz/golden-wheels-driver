import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { useMutation, useReactiveVar } from '@apollo/client';
import { Header } from '~/codidge_components/UI/header';
import { PageSafeContainer } from '~/codidge_components/UI/pageSafeContainer';
import { addFeedbackMutation, getImagesUploadUrl } from './graphql/mutations';
import InputField from '~/codidge_components/UI/form/inputs/inputField';
import PrimaryButton, { ButtonSize } from '~/codidge_components/UI/button/PrimaryButton';
import { userData } from '~/store/user';
import Constants from 'expo-constants';

interface FeedbackFormData {
  subject: string;
  message: string;
}

export const FeedbacksScreen = () => {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const userInfo = useReactiveVar(userData);

  const [getPresignUrl] = useMutation(getImagesUploadUrl);
  const [addFeedback] = useMutation(addFeedbackMutation);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    defaultValues: {
      subject: '',
      message: '',
    },
  });

  // Request permissions for image picker
  const requestImagePermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to upload images!'
        );
        return false;
      }
    }
    return true;
  };

  // Pick image from gallery
  const pickImage = async () => {
    const hasPermission = await requestImagePermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7, // Compress image to reduce upload size
      base64: false,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera permissions to take photos!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: false,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Upload image to S3
  const uploadImageToS3 = async (imageUri: string) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Generate unique filename
      const filename = `feedback/${userInfo?.userID}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.jpg`;

      const { data } = await getPresignUrl({
        variables: {
          tenant: {
            tenantId: userInfo?.activeTenantId,
          },
          imgInput: {
            filename: filename,
            type: blob.type,
            bucketPath: 'gallery',
          },
        },
      });

      if (!data?.getImagesUploadUrl) {
        throw new Error('Missing presigned URL data');
      }

      const { uploadUrl, fileUrl } = data.getImagesUploadUrl;

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': blob.type,
        },
        body: blob,
      });

      console.log('uploadResponse', uploadResponse);

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      console.log(':::fileUrl', fileUrl);
      return fileUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
      return null;
    }
  };

  // Handle form submission
  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let pictureUrl: string | undefined;

      // Upload image if selected
      if (selectedImage) {
        const uploadedUrl = await uploadImageToS3(selectedImage);
        if (uploadedUrl) {
          pictureUrl = uploadedUrl;
        }
      }

      // Submit feedback via GraphQL
      const input = {
        userId: userInfo?.userID,
        userName: `${userInfo?.name}`,
        subject: data.subject,
        message: data.message,
        pictureUrl,
      };

      await addFeedback({
        variables: { input },
      });

      // Success handling
      Alert.alert('Success', 'Your feedback has been submitted successfully!', [
        {
          text: 'OK',
          onPress: () => {
            reset();
            setSelectedImage(null);
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Submission Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose from where you want to select an image',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  return (
    <PageSafeContainer>
      <Header showBack={true} title="Feedback" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.description}>
          We'd love to hear from you! Share your feedback, suggestions, or report any issues.
        </Text>

        {/* Subject Field */}
        <View style={styles.fieldContainer}>
          <Controller
            control={control}
            name="subject"
            rules={{
              required: 'Subject is required',
              minLength: {
                value: 3,
                message: 'Subject must be at least 3 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="Subject"
                required={true}
                placeholder="Enter subject"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={errors.subject?.message}
              />
            )}
          />
        </View>

        {/* Message Field */}
        <View style={styles.fieldContainer}>
          <Controller
            control={control}
            name="message"
            rules={{
              required: 'Message is required',
              minLength: {
                value: 10,
                message: 'Message must be at least 10 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="Message"
                required={true}
                placeholder="Enter your feedback message"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                errorMessage={errors.message?.message}
                style={styles.messageInput}
              />
            )}
          />
        </View>

        {/* Screenshot Section */}
        <View>
          <Text style={styles.label}>Screenshot (Optional)</Text>

          {!selectedImage ? (
            <TouchableOpacity style={styles.imagePickerButton} onPress={showImageOptions}>
              <Text style={styles.imagePickerIcon}>📷</Text>
              <Text style={styles.imagePickerText}>Add Screenshot</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                <Text style={styles.removeImageText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Upload Progress */}
        {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Uploading image: {Math.round(uploadProgress)}%</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
            </View>
          </View>
        )}

        <PrimaryButton
          size={ButtonSize.LARGE}
          style={{
            marginTop: 16,
          }}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          title="Submit Feedback"
        />
      </ScrollView>
    </PageSafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 5,
  },
  messageInput: {
    minHeight: 120,
    paddingTop: 12,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  imagePickerButton: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  imagePickerIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  imagePickerText: {
    fontSize: 14,
    color: '#666666',
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginVertical: 16,
  },
  progressText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
