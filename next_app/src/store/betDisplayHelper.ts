import { Bet } from "./betStore";

export const combineBetData = (bet:Bet, showTest = true) => {
    return {
      ...bet,
  
      total_volume: showTest
        ? bet.real_volume + bet.test_volume
        : bet.real_volume,
  
      total_users: showTest
        ? bet.real_users + bet.test_users
        : bet.real_users,
  
      options: bet.options.map(o => ({
        ...o,
        display_count: showTest
          ? o.real_count + o.test_count
          : o.real_count,
      })),
    };
  };
  