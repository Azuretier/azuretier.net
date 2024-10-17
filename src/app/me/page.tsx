'use client'

import Image from "next/image";
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-slate-900">
      <motion.div
        initial={{ opacity: 0 }} // 初期状態
        animate={{ opacity: 1 }} // アニメーション後の状態
        transition={{ duration: 2 }} // アニメーションの持続時間
      >
        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
          <div className="shrink-0">
            {isLoading && (
              <div className="w-24 h-24 bg-gray-300 animate-pulse rounded-full" />
            )}
            <Image
              className="size-24"
              src="/azure.png"
              width={800}
              height={800}
              quality={75}
              alt="Azure Logo"
              onLoadingComplete={() => setIsLoading(false)} // 読み込み完了時にローディング解除
            />
          </div>
          <div>
            <div className="text-xl font-medium text-black">Azure</div>
            <p className="text-slate-500">You have a new message!</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
