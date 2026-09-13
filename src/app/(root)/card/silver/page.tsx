import { Card } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

function Silver() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-300 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link href="/card" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-semibold text-center flex-1">Silver Card</h1>
        <div className="w-6"></div>
      </div>

      {/* Card Image */}
      <div className="flex justify-center py-8">
        <Image
          src="/images/card-silver.png"
          alt="QFS NESARA Silver Card"
          width={300}
          height={400}
          className="w-75 h-auto max-w-full"
        />
      </div>

      {/* Card Details */}
      <div className="px-4 space-y-6">
        <Card className="w-full bg-white dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Qauntum Secure Guard SILVER CARD</h2>

            {/* Note Section */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h3 className="font-bold text-yellow-700 dark:text-yellow-500 mb-3">Important Note</h3>
              <div className="space-y-3 text-xs text-yellow-700 dark:text-yellow-300">
                <div className="flex gap-2">
                  <span className="font-bold">*</span>
                  <span>This is the first QFS CARD, designed for everyone.</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold">1.</span>
                  <span>$30,000 Minimum Required on QFS account balance.</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold">2.</span>
                  <span>Fast/Regular Withdrawal Process is Guaranteed.</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold">3.</span>
                  <span>The SILVER CARD Earns you 5% of your QFS Total Balance every 10 days.</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-yellow-500 font-bold">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Standard rewards program</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-500 font-bold">✓</span>
                <span className="text-gray-700 dark:text-gray-300">24/7 customer support</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-500 font-bold">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Exclusive card benefits</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Activate Button */}
        <Link
          href="/card/apply?card-type=silver"
          className="block w-full py-4 px-6 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-semibold text-center transition-colors shadow-md"
        >
          Activate Silver Card
        </Link>
      </div>
    </div>
  )
}

export default Silver;