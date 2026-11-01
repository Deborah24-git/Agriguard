import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import type { PointFormValues } from "@/lib/pointForm";

interface Props {
  initial?: Partial<PointFormValues>;
  errors?: Record<string, string[]>;
}

/**
 * These three numbers are the detection baseline. Everything AgriGuard
 * decides is measured against them, so the hints spell that out.
 */
export function PointHydraulicsSection({ initial, errors }: Props) {
  return (
    <SectionCard
      title="Hydraulic baseline"
      description="What a healthy line looks like. Detection compares every reading to these values."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField
          label="Expected flow (L/min)"
          htmlFor="expected_flow_rate"
          required
          hint="Measured when the point runs clean."
          error={errors?.expected_flow_rate}
        >
          <input
            id="expected_flow_rate"
            name="expected_flow_rate"
            type="number"
            step="0.1"
            min="0.1"
            className="form-input"
            defaultValue={initial?.expected_flow_rate ?? 40}
            required
          />
        </FormField>

        <FormField
          label="Minimum pressure (kPa)"
          htmlFor="min_pressure"
          required
          hint="Below this the line is under-pressurised."
          error={errors?.min_pressure}
        >
          <input
            id="min_pressure"
            name="min_pressure"
            type="number"
            step="1"
            min="0"
            className="form-input"
            defaultValue={initial?.min_pressure ?? 120}
            required
          />
        </FormField>

        <FormField
          label="Maximum pressure (kPa)"
          htmlFor="max_pressure"
          required
          hint="Above this a blockage is likely."
          error={errors?.max_pressure}
        >
          <input
            id="max_pressure"
            name="max_pressure"
            type="number"
            step="1"
            min="0"
            className="form-input"
            defaultValue={initial?.max_pressure ?? 220}
            required
          />
        </FormField>
      </div>
    </SectionCard>
  );
}
