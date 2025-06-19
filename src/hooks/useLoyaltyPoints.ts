
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useLoyaltyPoints = () => {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);

  const userPointsKey = `user_points_${user?.id}`;

  useEffect(() => {
    if (user) {
      const storedPoints = localStorage.getItem(userPointsKey);
      setPoints(parseInt(storedPoints || "850"));
    }
  }, [user, userPointsKey]);

  const updatePoints = (newPoints: number) => {
    setPoints(newPoints);
    if (user) {
      localStorage.setItem(userPointsKey, newPoints.toString());
    }
  };

  const addPoints = (pointsToAdd: number) => {
    const newPoints = points + pointsToAdd;
    updatePoints(newPoints);
  };

  const deductPoints = (pointsToDeduct: number) => {
    const newPoints = Math.max(0, points - pointsToDeduct);
    updatePoints(newPoints);
  };

  return {
    points,
    updatePoints,
    addPoints,
    deductPoints
  };
};
