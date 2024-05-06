
import { WalletContextState } from '@solana/wallet-adapter-react';
import { deserialize } from 'borsh';
import { Dist, Game, GameSchema, Ticket } from './models';

import { program_id } from './accounts';
import { connection } from './connection';
import { current_lottery_no, get_distribution } from './distribution';
import { PublicKey } from '@solana/web3.js';
var BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
var bs58 = require('base-x')(BASE58);

export const get_ticket_by_lottery_no = async (wallet:WalletContextState,lottery_no:number) => {

    const lottery_no_str = bs58.encode([lottery_no]);

    const coupons_of_the_player = await connection.getProgramAccounts(
        program_id,
        {
          filters: [
            {
              dataSize: 47,
            },
            {
                memcmp: {
                  offset: 6, 
                  bytes: wallet.publicKey!.toString(),
                },
              },
              {
                memcmp: {
                  offset: 39, 
                  bytes: lottery_no_str
                },
              },
          ],
        }
      );

      return coupons_of_the_player[0].pubkey
  
}

export const get_my_tickets = async (wallet:WalletContextState) => {


    let tickets:Ticket[] = [];

    const coupons_of_the_player = await connection.getProgramAccounts(
        program_id,
        {
          filters: [
            {
              dataSize: 47,
            },
            {
                memcmp: {
                  offset: 6, 
                  bytes: wallet.publicKey!.toString(),
                },
              },
          ],
        }
      );
    for (let index = 0; index < coupons_of_the_player.length; index++) {

        const key = coupons_of_the_player[index].pubkey
        const data = coupons_of_the_player[index].account.data
        const coupon = deserialize(GameSchema,Game,data)
        const ticket = create_ticket(coupon,key)

        tickets.push(ticket)

      }
    return tickets

}


const check_matches = (game:Game,dist:Dist) => {

   const arr:number[] = [game.number1,game.number2,game.number3,game.number4,game.number5,game.number6,
   dist.lucky_number1,dist.lucky_number2,dist.lucky_number3,dist.lucky_number4,dist.lucky_number5,dist.lucky_number6] 

   const unique = new Set(arr);

   let matches = 0;
   let prize_amount = 0;

    if (unique.size == 6){
        matches = 6;
        prize_amount = dist.prize_amount_6
    }else if (unique.size == 7){
        matches = 5;
        prize_amount = dist.prize_amount_5
    }else if (unique.size == 8){
        matches = 4;
        prize_amount = dist.prize_amount_4
    }else if (unique.size == 9){
        matches = 3;
        prize_amount = dist.prize_amount_3
    }else{
        matches = 0;
        prize_amount = 0;
    }

    return [matches,prize_amount];

}

const create_ticket = (coupon:Game,key:PublicKey) => {

    const ticket = new Ticket()
    ticket.number1 = coupon.number1;
    ticket.number2 = coupon.number2;
    ticket.number3 = coupon.number3;
    ticket.number4 = coupon.number4;
    ticket.number5 = coupon.number5;
    ticket.number6 = coupon.number6;
    ticket.lottery_no = coupon.lottery_no;
    ticket.account_address = key;

    const distribution = get_distribution(coupon.lottery_no);

    const [matches,prize_amount] = check_matches(coupon,distribution)

    ticket.lucky_number1 = distribution.lucky_number1;
    ticket.lucky_number2 = distribution.lucky_number2;
    ticket.lucky_number3 = distribution.lucky_number3;
    ticket.lucky_number4 = distribution.lucky_number4;
    ticket.lucky_number5 = distribution.lucky_number5;
    ticket.lucky_number6 = distribution.lucky_number6;
    ticket.matches = matches;
    if (matches > 0){
        ticket.wins = true;
    }
    ticket.prize_amount = prize_amount;
    ticket.meme = distribution.meme;
    if (coupon.lottery_no<current_lottery_no){
        ticket.can_be_claimed = true;
    }else{
        ticket.can_be_claimed = false;
    }

    return ticket;

}

