
import { WalletAdapterNetwork, WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@solana/wallet-adapter-react-ui/lib/types/Button';

import '../src/css/bootstrap.css'
import {

    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SolflareWalletAdapter,

} from '@solana/wallet-adapter-wallets';


import { clusterApiUrl, Transaction, SystemProgram, Keypair, LAMPORTS_PER_SOL, PublicKey, Connection } from '@solana/web3.js';
import React, { FC, ReactNode, useMemo, useCallback, useState } from 'react';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MyTickets from './mytickets';
import Play from './play';
import { memes } from './memes';
import BuySell from './buy_sell';



require('./App.css');
require('@solana/wallet-adapter-react-ui/styles.css');


const App: FC = () => {

    return (
      <Router>
        <Context>
          <Content />
        </Context>
      </Router>
    );
};
export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {

    const network = WalletAdapterNetwork.Testnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
        () => [
            new LedgerWalletAdapter(),
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter({ network }),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const Content: FC = () => {

    const wallet = useWallet();

    const connection = new Connection(clusterApiUrl("testnet"))
    const { publicKey, sendTransaction } = useWallet();


    return (
      <div className="App">
          <li><WalletMultiButton /></li>
          <nav>
              <Link to="/mytickets">My Tickets</Link>
              <Link to="/play">Play with Bonk</Link>
              <Link to="/play">Play with Wen</Link>
              <Link to="/play">Play with Wif</Link>
              <Link to="/buy_sell">Buy sell tokens</Link>
          </nav>
  
          <Routes>
              <Route path="/play" element={<MyTickets wallet={wallet} />} />
              <Route path="/buy_sell" element={<BuySell wallet={wallet} />} />
              {useMemo(() => (
                  <>
                      <Route path="/play" element={<Play wallet={wallet} meme={memes[0]} />} />
                      <Route path="/play" element={<Play wallet={wallet} meme={memes[1]} />} />
                      <Route path="/play" element={<Play wallet={wallet} meme={memes[2]} />} />
                  </>
              ), [wallet, memes])}
          </Routes>
      </div>
  );
};

