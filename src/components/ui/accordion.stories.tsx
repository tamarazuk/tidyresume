import type { Meta, StoryObj } from '@storybook/react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const meta = {
  title: 'UI/Accordion',
  component: Accordion,
} satisfies Meta<typeof Accordion>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Accordion defaultValue={['summary']}>
      <AccordionItem value="summary">
        <AccordionTrigger>Professional Summary</AccordionTrigger>
        <AccordionContent>
          Product-minded engineer with a focus on reliable, user-friendly UI.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="experience">
        <AccordionTrigger>Experience</AccordionTrigger>
        <AccordionContent>Senior Software Engineer at Stripe.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
