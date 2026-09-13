"use client";

import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

function CardPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-6 pb-24 md:pb-6"
    >
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-center flex-1">Cards</h1>
        <div className="w-6"></div>
      </div>

      <div className="relative mb-12">
        <div className="flex items-center justify-center gap-4">
          <div className="relative transform -rotate-12 hover:rotate-0 transition-transform duration-300">
            <Image
              src="/images/card-gold.png"
              alt="QFS Gold Card"
              width={200}
              height={300}
              className="rounded-xl shadow-2xl w-50 h-auto"
            />
          </div>

          <div className="relative transform rotate-12 hover:rotate-0 transition-transform duration-300">
            <Image
              src="/images/card-silver.png"
              alt="QFS Silver Card"
              width={200}
              height={300}
              className="rounded-xl shadow-2xl w-50 h-auto"
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        <Card className="bg-gray-300 dark:bg-gray-700 p-5 sm:p-8 border-0">
          <h2 className="text-black dark:text-white text-sm font-semibold mb-8">Choose Card</h2>

          <div className="flex flex-col space-y-4">
            <Link
              href="/card/silver"
              className="w-full text-center py-2 bg-gray-400 dark:bg-gray-800 text-sm font-semibold border-0 rounded-xl transition-all duration-300 hover:scale-[1.02] text-black dark:text-white"
            >
              Qauntum Secure Guard SILVER
            </Link>

            <Link
              href="/card/gold"
              className="w-full text-center py-2 bg-gray-400 dark:bg-gray-800 text-sm font-semibold border-0 rounded-xl transition-all duration-300 hover:scale-[1.02] text-black dark:text-white"
            >
              Qauntum Secure Guard GOLD
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default CardPage