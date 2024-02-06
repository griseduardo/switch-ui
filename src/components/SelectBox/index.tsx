import { Listbox, ListboxProps, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { cva, type VariantProps } from "class-variance-authority";
import { ElementType, Fragment, ReactNode, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type Options = {
  value: any;
  label: string;
};

interface SelectBoxType extends ListboxProps<any, any, any> {
  options: Options[];
  size?: "lg" | "md" | "sm";
  label: string;
  disabled?: boolean;
  supportText?: string;
  leftIcon?: ElementType;
  error?: boolean;
  placeholder?: string;
  multiple?: boolean;
  errorMsg?: string;
}

export type SelectBoxVariantProps = VariantProps<typeof selectBoxVariants>;

export const selectBoxVariants = cva(
  "rounded-plug-md  relative m-1 flex cursor-default select-none items-center pl-2 text-gray-500",
  {
    variants: {
      size: {
        lg: "h-14 py-3 text-md",
        md: "h-11 py-2 text-md",
        sm: "h-10 py-1 text-sm",
      },
      active: {
        true: "bg-gray-100",
        false: "text-gray-950 ",
      },
      selected: {
        true: "bg-gray-100",
        false: "",
      },
    },
  },
);

export const selectBoxButtonVariants = cva(
  "rounded-plug-md relative my-2 w-full cursor-default border pr-10 text-left text-gray-500 hover:bg-gray-100",
  {
    variants: {
      disabled: {
        true: "opacity-40",
        false: "opacity-100",
      },
      size: {
        lg: "x-1 h-14 text-md",
        md: "x-0.5 h-11 text-md",
        sm: "x h-10 text-sm",
      },
      open: {
        true: "border-primary-100",
        false: "border-gray-100",
      },
      error: {
        true: "border-error-600",
      },
    },
  },
);

export const dropdownIconVariant = cva("text-gray-500", {
  variants: {
    size: {
      lg: "h-6 w-6",
      md: "h-6 w-6",
      sm: "h-5 w-5",
    },
  },
});

export interface SelectBoxProps extends Omit<SelectBoxVariantProps, "size">, SelectBoxType {}

// Helper function to render the chevron icon based on the open state
const renderChevron = (open: boolean, size: any): ReactNode => {
  const icon = open ? (
    <ChevronUpIcon className={dropdownIconVariant({ size })} aria-hidden="true" />
  ) : (
    <ChevronDownIcon className={dropdownIconVariant({ size })} aria-hidden="true" />
  );
  return (
    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
      {icon}
    </span>
  );
};

// Helper function to find selected option labels for multiple selection
const findOption = (options: any[], selectedOption: string | any[]): string => {
  const selectedLabels = options
    .filter((option) => selectedOption.includes(option.value))
    .map((option) => option.label);

  return selectedLabels.join(", ");
};

function SelectBox({
  options,
  size = "md",
  label,
  disabled = false,
  className,
  supportText,
  leftIcon: LeftIcon,
  error = false,
  placeholder,
  multiple = false,
  onChange = () => {},
  errorMsg,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultValue, //deprecated
  value,
  ...rest
}: SelectBoxProps) {
  // Initialize selectedOption state based on multiple prop
  const [selectedOption, setSelectedOption] = useState<any>(multiple ? [] : -1);

  useEffect(() => {
    if (value != undefined && value != "") setSelectedOption(value);
  }, [value]);

  // Event handler for option selection change
  const handleOptionChange = (e: any) => {
    setSelectedOption(e);
    onChange(e);
  };

  return (
    <div>
      <Listbox
        multiple={multiple}
        value={selectedOption}
        onChange={handleOptionChange}
        {...rest}
        disabled={disabled}
      >
        {({ open }) => (
          <>
            <Listbox.Label className="text-sm font-medium text-gray-900">{label}</Listbox.Label>
            <div className="relative">
              <Listbox.Button
                className={twMerge(
                  selectBoxButtonVariants({ disabled, size, error, open }),
                  className,
                )}
              >
                <>
                  <span className="flex items-center gap-2 truncate pl-3">
                    {LeftIcon && <LeftIcon className="h-6 w-6 text-gray-500" />}
                    {multiple
                      ? selectedOption.length === 0
                        ? placeholder
                        : findOption(options, selectedOption)
                      : selectedOption === -1
                      ? placeholder
                      : options.find((option) => option.value === selectedOption)?.label}
                  </span>
                  {renderChevron(open, size)}
                </>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="appearence-none headlessui-listbox-option-:r1o:ring-primary-100 absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 shadow-md ring-1 ring-gray-100">
                  {options.map((option, index) => (
                    <Listbox.Option
                      key={index}
                      value={option.value}
                      className={({ active, selected }) =>
                        selectBoxVariants({ size, active, selected })
                      }
                    >
                      {({ selected }) => (
                        <span className="flex w-full items-center justify-between truncate text-gray-800">
                          {option.label}
                          {selected && <CheckIcon className="mr-3 h-5 w-5 text-gray-800" />}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
      {error && errorMsg ? (
        <span className="text-sm text-error-500">{errorMsg}</span>
      ) : (
        supportText && <span className="text-sm text-gray-600">{supportText}</span>
      )}
    </div>
  );
}

export default SelectBox;
