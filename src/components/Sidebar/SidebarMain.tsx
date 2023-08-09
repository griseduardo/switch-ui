import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps, PropsWithChildren, useContext } from "react";
import { twMerge } from "tailwind-merge";

import { SidebarContext } from "./SidebarContext";

export interface SidebarProps extends PropsWithChildren, ComponentProps<"div"> {
  desktop?: true | false;
}

const SidebarVariants = cva("sidebar", {
  variants: {
    desktop: {
      true: "h-screen border-r border-gray-100 bg-white transition-all duration-500 ease-in-out",
      false: "w-screen border-b border-gray-100 bg-white",
    },
  },
  defaultVariants: {
    desktop: true,
  },
});

type SidebarVariantProps = VariantProps<typeof SidebarVariants>;

export interface SidebarVariant extends Omit<SidebarVariantProps, "desktop">, SidebarProps {}

const SidebarMain = ({ desktop = true, children, className, ...rest }: SidebarVariant) => {
  const { isOpen, setIsDesktop, isDesktop } = useContext(SidebarContext);
  setIsDesktop(desktop);

  if (isDesktop) {
    const style = isOpen ? "w-72" : "w-20";
    return (
      <div className={twMerge(style, SidebarVariants({ desktop }), className)} {...rest}>
        {children}
      </div>
    );
  } else {
    const style = isOpen ? "w-72" : "w-0";
    return (
      <div className={twMerge(style, SidebarVariants({ desktop }), className)} {...rest}>
        {children}
      </div>
    );
  }
};

export default SidebarMain;
