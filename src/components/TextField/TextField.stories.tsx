import { XMarkIcon } from "@heroicons/react/24/solid";
import type { Meta, StoryObj } from "@storybook/react";

import TextField from "./TextField";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: "Example/Textfield",
  component: TextField,
  tags: ["autodocs"],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    label: "Label",
    placeholder: "Hello World",
    name: "name",
    disabled: false,
  },
};

export const WithIcon: Story = {
  args: {
    label: "Label",
    placeholder: "Hello World",
    leftIcon: XMarkIcon,
    name: "name",
    disabled: false,
  },
};
