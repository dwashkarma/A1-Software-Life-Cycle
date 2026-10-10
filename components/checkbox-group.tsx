"use client";

export interface CheckboxOption {
    value: string;
    label: string;
}

interface CheckboxGroupProps {
    legend: string;
    options: CheckboxOption[];
    selected: string[];
    onChange: (selected: string[]) => void;
    emptyMessage?: string;
}

/**
 * A list of tick boxes where several values can be selected.
 * It keeps no state of its own: the parent owns the selected values.
 */
export default function CheckboxGroup({
    legend,
    options,
    selected,
    onChange,
    emptyMessage = "Nothing to choose from yet.",
}: CheckboxGroupProps) {
    const toggle = (value: string) => {
        onChange(
            selected.includes(value)
                ? selected.filter((item) => item !== value)
                : [...selected, value],
        );
    };

    return (
        <fieldset>
            <legend className="mb-2 text-sm font-semibold text-[#1A1F24]">
                {legend}
            </legend>

            {options.length === 0 ? (
                <p className="text-sm text-[#636E75]">{emptyMessage}</p>
            ) : (
                <div className="grid max-h-48 gap-2 overflow-y-auto sm:grid-cols-2">
                    {options.map((option) => (
                        <label
                            key={option.value}
                            className="flex items-center gap-2 text-sm text-[#1A1F24]"
                        >
                        <input
                            type="checkbox"
                            checked={selected.includes(option.value)}
                            onChange={() => toggle(option.value)}
                            className="h-4 w-4 accent-[#0A786E]"
                        />
                            {option.label}
                        </label>
                    ))}
                </div>
            )}
        </fieldset>
    );
}