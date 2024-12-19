import { Chat } from "../components/chat";
import Head from "next/head";


export default function ChatPage() {
  return (
    <>
      <Head>
        <title>BEAM AI</title>
      </Head>
      <Chat />
    </>
  );
}