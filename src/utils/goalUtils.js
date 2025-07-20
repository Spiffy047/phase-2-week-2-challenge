// src/utils/goalUtils.js
import { differenceInDays, isPast, isBefore, parseISO } from 'date-fns';

export const getDaysRemaining = (deadline) => {
  if (!deadline) return Infinity; // Or handle as error/N/A
  const today = new Date();
  const deadlineDate = parseISO(deadline); // Safely parse ISO 8601 string (YYYY-MM-DD)

  if (isNaN(deadlineDate.getTime())) { // Check for invalid date
    console.warn("Invalid deadline date provided to getDaysRemaining:", deadline);
    return Infinity;
  }

  // If the deadline is today or in the future
  if (!isPast(deadlineDate) || differenceInDays(deadlineDate, today) === 0) {
    return differenceInDays(deadlineDate, today);
  }
  return 0; // If it's in the past
};

export const getGoalStatus = (goal) => {
  const { savedAmount, targetAmount, deadline } = goal;

  if (savedAmount >= targetAmount) {
    return "Completed";
  }

  if (!deadline) {
    return "No Deadline"; // Or another appropriate status
  }

  const today = new Date();
  const deadlineDate = parseISO(deadline);

  if (isNaN(deadlineDate.getTime())) {
    console.warn("Invalid deadline date provided to getGoalStatus:", deadline);
    return "Invalid Deadline";
  }

  const daysRemaining = differenceInDays(deadlineDate, today);

  if (isPast(deadlineDate) && !isBefore(deadlineDate, today)) {
    
    if (savedAmount < targetAmount) {
      return "Overdue";
    }
  } else if (isPast(deadlineDate) && isBefore(deadlineDate, today)) {
     
    if (savedAmount < targetAmount) {
      return "Overdue";
    }
  }


  if (daysRemaining <= 7 && daysRemaining > 0) {
    return "Warning"; 
  } else if (daysRemaining <= 0 && savedAmount < targetAmount) {
    return "Overdue";
  }

  return "On Track"; 
};