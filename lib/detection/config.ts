/**
 * All leak / blockage detection tuning lives here so a farm manager can reason
 * about the rules without reading the detectors themselves.
 */
export const DETECTION = {
  /** Flow above this share of the expected rate, while the valve is closed, is a leak. */
  leakFlowRatio: 0.15,
  /** Absolute floor so a tiny sensor drift never raises a leak alert. */
  leakMinFlowLpm: 0.5,
  /** Pressure above this multiple of max_pressure hints at a downstream blockage. */
  blockagePressureRatio: 1.15,
  /** Flow below this share of expected, while pressurised, hints at a blockage. */
  blockageFlowRatio: 0.6,
  /** Pressure below this share of min_pressure indicates a supply-side drop. */
  pressureDropRatio: 0.8,
  /** Flow below this share of expected, with the valve open, means no water is moving. */
  noFlowRatio: 0.1,
  /** A zone with no reading for this long is considered offline. */
  offlineMinutes: 30,
  /** Suppress repeat alerts of the same type for this many minutes. */
  alertCooldownMinutes: 45,
} as const;
