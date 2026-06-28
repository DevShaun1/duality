export type RatingTone = {
  label: string;
  description: string;
};

export function getSleepTone(value: number): RatingTone {
  if (value < 6) {
    return {
      label: 'Very short',
      description: 'You slept less than most adults typically need.',
    };
  }

  if (value < 7) {
    return {
      label: 'A little short',
      description: 'Slightly below the recommended range for most adults.',
    };
  }

  if (value <= 9) {
    return {
      label: 'Recommended range',
      description: 'Within the recommended duration for most healthy adults.',
    };
  }

  return {
    label: 'Long sleep',
    description: 'Longer than most adults typically need. Consider how rested you felt today.',
  };
}

export function getEnergyTone(value: number): RatingTone {
  if (value <= 2) {
    return { label: 'Very low', description: 'You felt mostly drained today.' };
  }
  if (value <= 4) {
    return { label: 'Low', description: 'You had limited energy today.' };
  }
  if (value <= 6) {
    return { label: 'Steady', description: 'Your energy felt fairly balanced.' };
  }
  if (value <= 8) {
    return { label: 'Good', description: 'You felt energised for much of the day.' };
  }
  return { label: 'Very high', description: 'You felt highly energised today.' };
}

export function getMoodTone(value: number): RatingTone {
  if (value <= 2) {
    return { label: 'Very low', description: 'Your mood felt heavy or difficult.' };
  }
  if (value <= 4) {
    return { label: 'Low', description: 'Your mood was on the lower side.' };
  }
  if (value <= 6) {
    return { label: 'Neutral', description: 'Your mood felt fairly balanced.' };
  }
  if (value <= 8) {
    return { label: 'Positive', description: 'Your mood was mostly positive.' };
  }
  return { label: 'Very positive', description: 'Your mood felt especially positive.' };
}

export function getStressTone(value: number): RatingTone {
  if (value <= 2) {
    return { label: 'Very relaxed', description: 'You felt calm and under little pressure.' };
  }
  if (value <= 4) {
    return {
      label: 'Manageable',
      description: 'You noticed some pressure, but it felt manageable.',
    };
  }
  if (value <= 6) {
    return { label: 'Moderate', description: 'Stress was present, but not overwhelming.' };
  }
  if (value <= 8) {
    return { label: 'High', description: 'You felt under noticeable pressure.' };
  }
  return { label: 'Very high', description: 'You felt highly stressed or overwhelmed.' };
}
