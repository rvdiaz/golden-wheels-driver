import { gql } from '@apollo/client';

export const GET_TRAINING_CATEGORY = gql`
  query GetTrainingCategory($categoryId: String!) {
    getTrainingCategory(categoryId: $categoryId) {
      tenantId
      categoryId
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_TRAINING_CATEGORIES = gql`
  query GetAllTrainingCategories($tenant: TenantData!) {
    getAllTrainingCategories(tenant: $tenant) {
      tenantId
      categoryId
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const GET_TRAINING_PROGRAM = gql`
  query GetTrainingProgram($trainingId: String!) {
    getTrainingProgram(trainingId: $trainingId) {
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

export const GET_ALL_TRAINING_PROGRAMS = gql`
  query GetAllTrainingPrograms($tenant: TenantData!, $categoryId: String) {
    getAllTrainingPrograms(tenant: $tenant, categoryId: $categoryId) {
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

export const GET_TRAINING_MODULE = gql`
  query GetTrainingModule($moduleId: String!) {
    getTrainingModule(moduleId: $moduleId) {
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

export const GET_ALL_TRAINING_MODULES = gql`
  query GetAllTrainingModules($tenant: TenantData!, $trainingProgramId: String!) {
    getAllTrainingModules(tenant: $tenant, trainingProgramId: $trainingProgramId) {
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

export const GET_TRAINING_COURSE = gql`
  query GetTrainingCourse($courseId: String!) {
    getTrainingCourse(courseId: $courseId) {
      tenantId
      trainingProgramId
      moduleId
      courseId
      title
      description
      htmlDescription
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
        thumbnailUrl
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_TRAINING_COURSES = gql`
  query GetAllTrainingCourses(
    $tenant: TenantData!
    $trainingProgramId: String!
    $moduleId: String!
  ) {
    getAllTrainingCourses(
      tenant: $tenant
      trainingProgramId: $trainingProgramId
      moduleId: $moduleId
    ) {
      tenantId
      trainingProgramId
      moduleId
      courseId
      title
      description
      htmlDescription
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
        thumbnailUrl
      }
      createdAt
      updatedAt
    }
  }
`;
