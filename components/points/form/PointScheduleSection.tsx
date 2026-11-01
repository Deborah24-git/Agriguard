import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import type { PointFormValues } from "@/lib/pointForm";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Props {
  initial?: Partial<PointFormValues>;
  errors?: Record<string, string[]>;
}

export function PointScheduleSection({ initial, errors }: Props) {
  const selected = initial?.active_days ?? [1, 2, 3, 4, 5, 6];

  return (
    <SectionCard
      title="Irrigation schedule"
      description="When the pump should be running. Flow while shut off is treated as a leak."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Start time" htmlFor="start_time" required error={errors?.start_time}>
          <input
            id="start_time"
            name="start_time"
            type="time"
            className="form-input"
            defaultValue={initial?.start_time ?? "05:30"}
            required
          />
        </FormField>

        <FormField
          label="Run duration (minutes)"
          htmlFor="duration_minutes"
          required
          error={errors?.duration_minutes}
        >
          <input
            id="duration_minutes"
            name="duration_minutes"
            type="number"
            min="5"
            max="720"
            step="5"
            className="form-input"
            defaultValue={initial?.duration_minutes ?? 45}
            required
          />
        </FormField>
      </div>

      <fieldset className="mt-4">
        <legend className="text-sm font-medium">Irrigation days</legend>
        {errors?.active_days && (
          <p className="mt-1 text-xs font-medium text-destructive">
            {errors.active_days[0]}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          {DAYS.map((day, index) => (
            <label
              key={day}
              className="cursor-pointer select-none rounded-md border border-input px-3 py-1.5 text-xs font-medium transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground"
            >
              <input
                type="checkbox"
                name="active_days"
                value={index}
                defaultChecked={selected.includes(index)}
                className="sr-only"
              />
              {day}
            </label>
          ))}
        </div>
      </fieldset>
    </SectionCard>
  );
}
