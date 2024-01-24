
import './App.css';
import {useState} from 'react';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, clusterApiUrl, sendAndConfirmTransaction } from '@solana/web3.js';
import {Buffer} from 'buffer';




function App() {

  const [keypair,setkeypair]=useState();
  const [connection,setConnection]=useState();
  const [fromkey,setFromKey]=useState();
  const [tokey,setToKey]=useState();

  const Create = async () =>
  {   
    // generating a new keypair
      const keypair=Keypair.generate();
      setkeypair(keypair);
      setFromKey(keypair.publicKey.toString());
      console.log("KeyPair generated Successfully");
      console.log("KeyPair_Publickey :",fromkey);

      try
      {
          const connection=new Connection(clusterApiUrl('devnet','confirmed'));
          setConnection(connection);
          // console.log(connection);
          // Airdrop 2 sol 
           await connection.requestAirdrop(
           new PublicKey(keypair.publicKey),
          LAMPORTS_PER_SOL * 2 
          );
          
          console.log(" Airdropped 2 sol to ",fromkey);
          
      }catch(err)
      {
        console.error(err);
      }
  }

  const Connect = async () =>
  {
    const { solana } = window;

    if (solana) {
      try {
        const response = await solana.connect();
        setToKey(response.publicKey.toString());
        console.log(" Phantom PublicKey : ",response.publicKey.toString());
      } catch (err) {
        console.log(err);
        alert(err);
      }
    }
  }


  const Transfer =async () =>
  {
    console.log("Transaction onging ..........");
    window.Buffer=Buffer;
    try
    {
        const transaction =new Transaction();
        const instruction= SystemProgram.transfer({
          fromPubkey:new PublicKey(keypair.publicKey),
          toPubkey: new PublicKey(tokey),
          lamports:LAMPORTS_PER_SOL*1
        });

        transaction.add(instruction);

        const signature= await sendAndConfirmTransaction(
          connection,
          transaction,
          [keypair]
    );

     

        console.log("signatue : ",signature);

    }catch(err)
    {
      console.error(err);
    }
  }

  return (
    <div className="App"> 
        <button onClick={Create}>Create a new Solana account</button><br></br><br></br>
        <button onClick={Connect}>Connect to Phantom Wallet</button><br></br><br></br>
        <button onClick={Transfer}>Transfer SOL to New Wallet</button>
    
    </div>
  );
}

export default App;
