import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';
import { fn } from 'storybook/test';

import { Button } from './Button';

const meta = {
  title: 'Botón',
  component: Button,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: { onPress: fn() },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Principal: Story = {
  args: {
    primary: true,
    label: 'Botón',
  },
};

export const Secundario: Story = {
  args: {
    label: 'Botón',
  },
};
