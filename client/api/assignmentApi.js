import { API_BASE_URL } from './config';

export const fetchAssignments = async (coachId) => {
  const response = await fetch(`${API_BASE_URL}/assigned_courses/?coach_id=${coachId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch assignments');
  }
  return response.json();
};

export const updateAssignmentStatus = async (assignmentId, status) => {
  const response = await fetch(`${API_BASE_URL}/assigned_courses/${assignmentId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update assignment status');
  }
  return response.json();
};
