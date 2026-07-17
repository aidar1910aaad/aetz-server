export const CUSTOM_PERCENTAGES_GROUP_SLUG = 'shkafy-dlya-dop-komplektacii';

export function isCustomPercentagesGroup(groupSlug?: string | null): boolean {
  return groupSlug === CUSTOM_PERCENTAGES_GROUP_SLUG;
}
