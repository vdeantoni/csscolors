export const SORT_BY_TYPES = ["AZ", "ZA", "LD", "DL", "HUE", "HUE_REV"] as const;
export type SortByType = (typeof SORT_BY_TYPES)[number];

export const GROUP_BY_TYPES = ["NONE", "COLOR_GROUP"] as const;
export type GroupByType = (typeof GROUP_BY_TYPES)[number];
