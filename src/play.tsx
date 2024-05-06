import React, { FC, useEffect, useState } from 'react';
import { Game, MeMe, Ticket } from './models';
import { claim_your_reward_or_return_deposit, play} from "./service"
import { get_my_tickets } from './utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import {  meme_str } from './memes';
import { active_main_counter, number_of_counters } from './distribution';



interface PlayProps {
    wallet: WalletContextState; 
    meme :MeMe;
}

const Play: FC<PlayProps> = ({ wallet, meme }) => {

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

    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);


    const handleNumberClick = (number: number) => {
        if (selectedNumbers.length < 6 && !selectedNumbers.includes(number)) {
          setSelectedNumbers([...selectedNumbers, number]);
        } else if (selectedNumbers.includes(number)) {
          // If the number is already selected, remove it
          setSelectedNumbers(selectedNumbers.filter((selected) => selected !== number));
        }
      };

      const handlePlay = async () => {

  
        await play(meme.mint,meme.token_program,meme.price_feed,number_of_counters,active_main_counter,
            selectedNumbers[0],selectedNumbers[1],selectedNumbers[2],selectedNumbers[3],selectedNumbers[4],selectedNumbers[5],wallet);
        };

    return (

        <div>
        <p>Selected Numbers: {selectedNumbers.join(', ')}</p>
        <p>Choose 6 numbers:</p>
        <div>
          {[...Array(48).keys()].map((number) => (
            <button
              key={number + 1}
              onClick={() => handleNumberClick(number + 1)}
              disabled={selectedNumbers.length === 6 && !selectedNumbers.includes(number + 1)}
            >
              {number + 1}
            </button>
          ))}
        </div>
          <button onClick={handlePlay} >Create Ticket</button>
        </div>

    );
};

export default Play;
