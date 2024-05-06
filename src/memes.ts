import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { bonk_mint, bonk_price_feed, wen__price_feed, wen_mint, wif__price_feed, wif_mint } from "./accounts"
import { MeMe } from "./models"


export const bonk:MeMe = {
  mint: bonk_mint,
  token_program: TOKEN_PROGRAM_ID,
  price_feed: bonk_price_feed
}

export const wen:MeMe = {
  mint: wen_mint,
  token_program: TOKEN_PROGRAM_ID,
  price_feed: wen__price_feed
}

export const wif:MeMe = {
  mint: wif_mint,
  token_program: TOKEN_PROGRAM_ID,
  price_feed: wif__price_feed
}


export const memes:MeMe[]=[bonk,wen,wif]

export const meme_str:string[] = ["bonk","wen","wif"]