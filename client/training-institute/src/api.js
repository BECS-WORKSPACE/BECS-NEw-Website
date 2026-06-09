const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchCourses = async () => {
  const res = await fetch(`${API_URL}/courses`);
  if (!res.ok) throw new Error('Failed to fetch courses');
  return res.json();
};

export const createEnquiry = async (enquiryData) => {
  const res = await fetch(`${API_URL}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enquiryData),
  });
  if (!res.ok) throw new Error('Failed to submit enquiry');
  return res.json();
};
