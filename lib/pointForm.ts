export interface PointFormValues {
  name: string;
  code: string;
  crop_type: string;
  area_hectares: number;
  expected_flow_rate: number;
  min_pressure: number;
  max_pressure: number;
  start_time: string;
  duration_minutes: number;
  active_days: number[];
}

export interface PointFormState {
  error: string;
}

/** FormData â†’ plain object, including the repeated day checkboxes. */
export function parsePointFormData(formData: FormData): PointFormValues {
  return {
    name: String(formData.get("name") ?? "").trim(),
    code: String(formData.get("code") ?? "").trim().toUpperCase(),
    crop_type: String(formData.get("crop_type") ?? "").trim(),
    area_hectares: Number(formData.get("area_hectares")),
    expected_flow_rate: Number(formData.get("expected_flow_rate")),
    min_pressure: Number(formData.get("min_pressure")),
    max_pressure: Number(formData.get("max_pressure")),
    start_time: String(formData.get("start_time") ?? ""),
    duration_minutes: Number(formData.get("duration_minutes")),
    active_days: formData.getAll("active_days").map((value) => Number(value)),
  };
}

/** Returns the first problem with the submitted point, or null when valid. */
export function validatePointForm(values: PointFormValues): string | null {
  if (!values.name) return "Give the point a name.";
  if (!/^[A-Z0-9-]{2,16}$/.test(values.code)) {
    return "Use 2-16 letters, numbers or dashes for the code, e.g. PT-A.";
  }
  if (!values.crop_type) return "Enter the crop grown at this point.";
  if (!Number.isFinite(values.area_hectares) || values.area_hectares <= 0) {
    return "Area must be greater than zero hectares.";
  }
  if (!Number.isFinite(values.expected_flow_rate) || values.expected_flow_rate <= 0) {
    return "Expected flow must be greater than zero L/min.";
  }
  if (
    !Number.isFinite(values.min_pressure) ||
    !Number.isFinite(values.max_pressure) ||
    values.min_pressure < 0 ||
    values.max_pressure <= values.min_pressure
  ) {
    return "Maximum pressure must be above the minimum pressure.";
  }
  if (!/^\d{2}:\d{2}$/.test(values.start_time)) {
    return "Choose a start time.";
  }
  if (
    !Number.isFinite(values.duration_minutes) ||
    values.duration_minutes < 5 ||
    values.duration_minutes > 720
  ) {
    return "Run duration must be between 5 and 720 minutes.";
  }
  if (values.active_days.length === 0) {
    return "Select at least one irrigation day.";
  }
  return null;
}
