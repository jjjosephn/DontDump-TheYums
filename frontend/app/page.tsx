"use client"
import Image from "next/image";
import { useAddUsersMutation } from "./state/api";

export default function Home() {
  const [ addUser ] = useAddUsersMutation();
  const handleClick = async () => {
    await addUser({id: "2"}).unwrap();
  }
  return (
    <div>
      <button onClick={ handleClick }>Add User</button>
    </div>
  );
}
