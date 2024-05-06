import { Dist } from "./models"

export const current_lottery_no = 1;
export const number_of_counters = 10;
export const active_main_counter = 1;
export const meme_of_the_week = 1;

export const get_distribution = (lottery_no:number) => {
  //get distribution data by lottery no
  const dist = new Dist()

  return dist
}