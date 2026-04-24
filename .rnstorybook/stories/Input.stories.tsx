// components/input.stories.tsx
import { Meta, StoryObj } from "@storybook/react-native";
import { Input } from "./Input";

const meta = {
  component: Input,
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    label: "Nombre",
    placeholder: "Rodrigo",
  },
};

export const Error: Story = {
  args: {
    label: "Correo",
    error: "Correo requerido",
    disabled: false,
    placeholder: "ejemplo@ejemplo.com",
  },
};