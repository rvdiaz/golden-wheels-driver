import { gql } from "@apollo/client";

// ========================================
// CATEGORY MUTATIONS
// ========================================

export const CREATE_TRAINING_CATEGORY = gql`
  mutation CreateTrainingCategory(
    $tenant: TenantData!
    $input: TrainingCategoryInput!
  ) {
    createTrainingCategory(tenant: $tenant, input: $input) {
      tenantId
      categoryId
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TRAINING_CATEGORY = gql`
  mutation UpdateTrainingCategory(
    $tenant: TenantData!
    $categoryId: String!
    $input: TrainingCategoryUpdateInput!
  ) {
    updateTrainingCategory(
      tenant: $tenant
      categoryId: $categoryId
      input: $input
    ) {
      tenantId
      categoryId
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TRAINING_CATEGORY = gql`
  mutation DeleteTrainingCategory($tenant: TenantData!, $categoryId: String!) {
    deleteTrainingCategory(tenant: $tenant, categoryId: $categoryId)
  }
`;

// ========================================
// PROGRAM MUTATIONS
// ========================================

export const CREATE_TRAINING_PROGRAM = gql`
  mutation CreateTrainingProgram(
    $tenant: TenantData!
    $input: TrainingProgramInput!
  ) {
    createTrainingProgram(tenant: $tenant, input: $input) {
      tenantId
      createdBy
      trainingId
      categoryId
      title
      description
      level
      tags
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TRAINING_PROGRAM = gql`
  mutation UpdateTrainingProgram(
    $tenant: TenantData!
    $trainingId: String!
    $input: TrainingProgramUpdateInput!
  ) {
    updateTrainingProgram(
      tenant: $tenant
      trainingId: $trainingId
      input: $input
    ) {
      tenantId
      createdBy
      trainingId
      categoryId
      title
      description
      level
      tags
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TRAINING_PROGRAM = gql`
  mutation DeleteTrainingProgram($tenant: TenantData!, $trainingId: String!) {
    deleteTrainingProgram(tenant: $tenant, trainingId: $trainingId)
  }
`;

// ========================================
// MODULE MUTATIONS
// ========================================

export const CREATE_TRAINING_MODULE = gql`
  mutation CreateTrainingModule(
    $tenant: TenantData!
    $input: TrainingModuleInput!
  ) {
    createTrainingModule(tenant: $tenant, input: $input) {
      tenantId
      trainingProgramId
      moduleId
      title
      description
      order
      estimatedDuration
      tags
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TRAINING_MODULE = gql`
  mutation UpdateTrainingModule(
    $tenant: TenantData!
    $trainingProgramId: String!
    $moduleId: String!
    $input: TrainingModuleUpdateInput!
  ) {
    updateTrainingModule(
      tenant: $tenant
      trainingProgramId: $trainingProgramId
      moduleId: $moduleId
      input: $input
    ) {
      tenantId
      trainingProgramId
      moduleId
      title
      description
      order
      estimatedDuration
      tags
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TRAINING_MODULE = gql`
  mutation DeleteTrainingModule(
    $tenant: TenantData!
    $trainingProgramId: String!
    $moduleId: String!
  ) {
    deleteTrainingModule(
      tenant: $tenant
      trainingProgramId: $trainingProgramId
      moduleId: $moduleId
    )
  }
`;

// ========================================
// COURSE MUTATIONS
// ========================================

export const CREATE_TRAINING_COURSE = gql`
  mutation CreateTrainingCourse(
    $tenant: TenantData!
    $input: TrainingCourseInput!
  ) {
    createTrainingCourse(tenant: $tenant, input: $input) {
      tenantId
      trainingProgramId
      moduleId
      courseId
      title
      description
      estimatedDuration
      tags
      order
      contentItems {
        order
        type
        title
        description
        url
        fileSize
        mimeType
        estimatedDuration
        quizData
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TRAINING_COURSE = gql`
  mutation UpdateTrainingCourse(
    $tenant: TenantData!
    $trainingProgramId: String!
    $moduleId: String!
    $courseId: String!
    $input: TrainingCourseUpdateInput!
  ) {
    updateTrainingCourse(
      tenant: $tenant
      trainingProgramId: $trainingProgramId
      moduleId: $moduleId
      courseId: $courseId
      input: $input
    ) {
      tenantId
      trainingProgramId
      moduleId
      courseId
      title
      description
      estimatedDuration
      tags
      order
      contentItems {
        order
        type
        title
        description
        url
        fileSize
        mimeType
        estimatedDuration
        quizData
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TRAINING_COURSE = gql`
  mutation DeleteTrainingCourse(
    $tenant: TenantData!
    $trainingProgramId: String!
    $moduleId: String!
    $courseId: String!
  ) {
    deleteTrainingCourse(
      tenant: $tenant
      trainingProgramId: $trainingProgramId
      moduleId: $moduleId
      courseId: $courseId
    )
  }
`;
