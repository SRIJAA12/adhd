// Helper to sync points with backend
export const syncPointsToBackend = async (userId, points) => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${userId}/points`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points }),
    });
    
    if (!response.ok) {
      console.error('Failed to sync points to backend');
    }
    return response.ok;
  } catch (error) {
    console.error('Error syncing points:', error);
    return false;
  }
};

export const addPointsToBackend = async (userId, pointsToAdd) => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${userId}/points/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points: pointsToAdd }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.points; // Return updated total points
    }
    return null;
  } catch (error) {
    console.error('Error adding points:', error);
    return null;
  }
};
