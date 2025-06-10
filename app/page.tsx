"use client"
import { BarcodeScanner } from "@/components/barcodescanner";
import Image from "next/image";

export default function Home() {
  return <div>
    <BarcodeScanner/>
  </div>;
}
