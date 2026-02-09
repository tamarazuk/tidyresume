const updatedAtFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export function formatUpdatedAt(timestamp: number) {
  return updatedAtFormatter.format(new Date(timestamp))
}
