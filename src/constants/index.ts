export const TPM: Record<string, Record<string, number>> = {
  empty: { empty: 0.7, moderate: 0.3, congested: 0.0 },
  moderate: { empty: 0.2, moderate: 0.6, congested: 0.2 },
  congested: { empty: 0.0, moderate: 0.3, congested: 0.7 },
};
