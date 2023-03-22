import { useState, useEffect, useRef, Fragment } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import Button from "react-bootstrap/Button";
import { createTokenMetaData } from "../utils";

export default function Main() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const mintId = useRef();
  const name = useRef();
  const symbol = useRef();
  const uri = useRef();

  const create = () => {
    createTokenMetaData(wallet, mintId.current.value);
  };
  return (
    <Fragment>
      <input type="text" placeholder="Token mint ID" ref={mintId} />

      <Button onClick={create}>Submit</Button>
    </Fragment>
  );
}
