import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { cva, type VariantProps } from "class-variance-authority";
import { InputHTMLAttributes, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export type SearchInputOption = {
  label: string;
  value: any;
};

interface SearchInputRemoteDataConfig {
  debounceTime: number;
}

// eslint-disable-next-line @typescript-eslint/ban-types
const debounce = (fn: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

interface SearchInputType {
  label: string;
  options?: SearchInputOption[];
  size?: "lg" | "md" | "sm";
  disabled?: boolean;
  selectedValue?: string;
  fetchRemoteData?: (query: string) => Promise<SearchInputOption[]>;
  remoteDataConfig?: SearchInputRemoteDataConfig;
  setSelectedValue: (value: any) => void;
}

export type SearchInputVariantProps = VariantProps<typeof SearchInputVariants>;

export const SearchInputVariants = cva(
  "peer w-full rounded-lg border border-gray-100 px-8 text-md text-gray-900 outline-none hover:bg-gray-50 focus:border-primary-100",
  {
    variants: {
      size: {
        lg: "h-14",
        md: "h-12",
        sm: "h-11",
      },
    },
  },
);

interface SearchInputHTMLAttributes extends InputHTMLAttributes<HTMLInputElement> {}

export interface SearchInputProps
  extends Omit<SearchInputVariantProps, "size">,
    SearchInputType,
    Omit<SearchInputHTMLAttributes, "size" | "onChange"> {}

function SearchInput({
  options = [],
  size = "md",
  label,
  disabled = false,
  className,
  selectedValue = "",
  fetchRemoteData,
  remoteDataConfig = {
    debounceTime: 300,
  },
  setSelectedValue,
  ...rest
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [apiOptions, setApiOptions] = useState<SearchInputOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fetchRemoteData) {
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchRemoteData(query);
        setApiOptions(data);
      } finally {
        setLoading(false);
      }
    };

    const debouncedFetchData = debounce(fetchData, remoteDataConfig.debounceTime);

    debouncedFetchData();
  }, [query, fetchRemoteData]);

  let filteredOption: SearchInputOption[] = [];

  // Handles filtering options
  if (fetchRemoteData) {
    filteredOption = apiOptions;
  } else {
    if (query === "") {
      filteredOption = options;
    } else {
      filteredOption = options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase()),
      );
    }
  }

  const handleOptionClick = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <div className="relative flex items-center justify-center">
      <input
        type="text"
        placeholder={label}
        disabled={disabled}
        value={selectedValue}
        className={twMerge(SearchInputVariants({ size }), className)}
        {...rest}
        onChange={(e) => {
          setQuery(e.target.value);
          handleOptionClick(e.target.value);
        }}
      />
      {loading && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {/* Aqui você pode usar um ícone de carregamento, por exemplo, um spinner */}
          <div className="h-5 w-5 animate-spin rounded-full border-t-2 border-solid border-primary-500"></div>
        </div>
      )}
      {filteredOption.length > 0 ? (
        <ul className="absolute inset-x-0 top-full mt-1 flex max-h-52 flex-col rounded-lg border border-gray-100 bg-white opacity-0 peer-focus:opacity-100">
          {filteredOption.map((option) => (
            <div
              key={option.value}
              className="flex h-14 cursor-pointer items-center px-4 text-md text-gray-900 hover:bg-gray-50"
              onClick={() => {
                handleOptionClick(option.value);
              }}
            >
              {option.label}
            </div>
          ))}
        </ul>
      ) : (
        <div className="absolute inset-x-0 top-full mt-1 flex max-h-52 flex-col rounded-lg border border-gray-100 bg-white opacity-0 peer-focus:opacity-100">
          <div className="flex h-14 items-center px-4 text-md text-gray-900">
            {!loading ? "Nenhum resultado encontrado" : "Carregando..."}
          </div>
        </div>
      )}
      {selectedValue !== "" && (
        <XMarkIcon
          className="absolute right-2 h-5 w-5 cursor-pointer text-gray-500 peer-focus:text-gray-700"
          onClick={() => {
            handleOptionClick("");
            setQuery("");
          }}
          data-testid="clear-icon"
        />
      )}
      <MagnifyingGlassIcon className="absolute left-2 h-5 w-5 cursor-pointer text-gray-500 peer-focus:text-gray-700" />
    </div>
  );
}

export default SearchInput;
