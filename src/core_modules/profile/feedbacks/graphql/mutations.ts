import { gql } from '@apollo/client';

export const addFeedbackMutation = gql`
  mutation addFeedback($input: AddFeedbackInput!) {
    addFeedback(input: $input) {
      userName
      userId
      subject
    }
  }
`;

export const getImagesUploadUrl = gql`
  mutation getImagesUploadUrl($imgInput: UploadUrlImageInput!) {
    getImagesUploadUrl(imgInput: $imgInput) {
      uploadUrl
      fileUrl
    }
  }
`;
