import React, { FC, useEffect, useState } from 'react';
import { Game, Ticket } from './models';
import { claim_your_reward_or_return_deposit} from "./service"
import { get_my_tickets } from './utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import {  meme_str, memes } from './memes';



interface BuySellProps {
    wallet: WalletContextState; 
}

const BuySell: FC<BuySellProps> = ({ wallet }) => {

    const [data, setData] = useState<Ticket[] | null>(null); 

    useEffect(() => {

        const getAccounts = async () => {
            try {
                const nfts = await get_my_tickets(wallet);
                if (Array.isArray(nfts)) {
                    setData(nfts);
                } else {
                    setData([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setData([]);
            }
        };

        getAccounts();
        
    }, [data]);


    const handleClaimRewardorReturnDeposit = async (ticket:Ticket) => {
        const meme = memes[ticket.meme]
        claim_your_reward_or_return_deposit(meme.mint,meme.token_program,ticket.account_address,ticket.lottery_no,wallet)
    };

    return (
        <div>
            <h1>New Page</h1>
            {data !== null ? (
                data.length > 0 ? (
                    <div>
                        {data.map((ticket: Ticket, index) => (
                            <div key={index} className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Ticket</h5>
                                    <p>lucky_number_1: {ticket.lucky_number1}</p>
                                    <p>lucky_number_2: {ticket.lucky_number2}</p>
                                    <p>lucky_number_3: {ticket.lucky_number3}</p>
                                    <p>lucky_number_4: {ticket.lucky_number4}</p>
                                    <p>lucky_number_5: {ticket.lucky_number5}</p>
                                    <p>lucky_number_6: {ticket.lucky_number6}</p>
                                    <p>number_1: {ticket.number1}</p>
                                    <p>number_2: {ticket.number2}</p>
                                    <p>number_3: {ticket.number3}</p>
                                    <p>number_4: {ticket.number4}</p>
                                    <p>number_5: {ticket.number5}</p>
                                    <p>number_6: {ticket.number6}</p>
                                    <p>matches: {ticket.matches}</p>
                                    <p>meme: {meme_str[ticket.meme]}</p>
                                    <p>prize_amount: {ticket.prize_amount}</p>
                                    {ticket.can_be_claimed ?(
                                    <div>
                                        {ticket.wins ?(
                                        <div>
                                           <button disabled={false} onClick={() => handleClaimRewardorReturnDeposit(ticket)}>claim reward</button>
                                        </div>):
                                           (
                                        <div>
                                           <button disabled={false} onClick={() => handleClaimRewardorReturnDeposit(ticket)}>return deposit</button>
                                        </div>)}
                                    </div>):
                                    (<div>
                                        <button disabled={true} onClick={() => handleClaimRewardorReturnDeposit(ticket)}>Wait for the countdown</button>
                                    </div>)}
     
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>There is no ticket</p>
                )
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default BuySell;
