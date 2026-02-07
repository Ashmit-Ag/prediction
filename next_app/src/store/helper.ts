export function normalizeBet(bet: any) {
    return {
      ...bet,
      users: bet.real_users + bet.test_users,
      volume: bet.real_volume + bet.test_volume,
      options: bet.options.map((o: any) => ({
        ...o,
        user_count: o.real_count + o.test_count,
      })),
    };
  }
  