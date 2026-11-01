import { SectionCard } from "@/components/ui/SectionCard";
import { FormField } from "@/components/ui/FormField";
import type { PointFormValues } from "@/lib/pointForm";

interface Props {
  initial?: Partial<PointFormValues>;
  errors?: Record<string, string[]>;
}

export function PointIdentitySection({ initial, errors }: Props) {
  return (
    <SectionCard
      title="Point identity"
      description="A named irrigation section fed from the smart tank."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Point name" htmlFor="name" required error={errors?.name}>
          <input
            id="name"
            name="name"
            className="form-input"
            defaultValue={initial?.name}
            placeholder="Point A"
            required
          />
        </FormField>

        <FormField
          label="Point code"
          htmlFor="code"
          required
          hint="Letters, numbers or dashes, e.g. PT-A."
          error={errors?.code}
        >
          <input
            id="code"
            name="code"
            className="form-input font-mono uppercase"
            defaultValue={initial?.code}
            placeholder="PT-A"
            required
          />
        </FormField>

        <FormField label="Crop" htmlFor="crop_type" required error={errors?.crop_type}>
          <input
            id="crop_type"
            name="crop_type"
            className="form-input"
            defaultValue={initial?.crop_type}
            placeholder="Tomatoes"
            required
          />
        </FormField>

        <FormField
          label="Area (hectares)"
          htmlFor="area_hectares"
          required
          error={errors?.area_hectares}
        >
          <input
            id="area_hectares"
            name="area_hectares"
            type="number"
            step="0.01"
            min="0.01"
            className="form-input"
            defaultValue={initial?.area_hectares ?? 1}
            required
          />
        </FormField>
      </div>
    </SectionCard>
  );
}
