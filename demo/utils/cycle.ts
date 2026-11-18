export const nextInCycle = <T>(order: readonly T[], current: T): T =>
  order[(order.indexOf(current) + 1) % order.length];
