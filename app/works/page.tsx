'use client';

import { useState } from 'react';
import Link from 'next/link';
import WorkModal from '../components/WorkModal';

interface Work {
  id: string;
  title: string;
  description: string;
  gradient: string;
  file: string;
  emoji: string;
}

const works: Work[] = [
  {
    id: 'rhythmia',
    title: 'RHYTHMIA',
    description: 'リズムとパズルが融合したゲーム。ビートに合わせてブロックを積み、世界を攻略しよう。',
    gradient: 'from-[#FF6B9D] to-[#C44569]',
    file: 'rhythmia.html',
    emoji: '🎮',
  },
  {
    id: 'life-journey',
    title: 'Life Journey',
    description: '人生の7つの章を詩的に表現したインタラクティブ体験。誕生から継承まで。',
    gradient: 'from-[#FFE4E1] to-[#FFB6C1]',
    file: 'life-journey.html',
    emoji: '🌅',
  },
  {
    id: 'lachesism',
    title: 'LACHESISM - 70 Waves',
    description: '災害を求める魂へ。70の試練を生き延びるカオスサバイバルゲーム。',
    gradient: 'from-[#FF0844] to-[#8B0000]',
    file: 'rhythmia-lachesism.html',
    emoji: '🌋',
  },
  {
    id: 'expression-realnet',
    title: 'Expression RealNet',
    description: '表現構築型リアルネット。ビートを創造し、コミュニティと共有するプラットフォーム。',
    gradient: 'from-[#A855F7] to-[#7C3AED]',
    file: 'expression-realnet.html',
    emoji: '🎹',
  },
  {
    id: 'stable-happiness',
    title: '安定した幸せ',
    description: '創造と調和の旅路を表現したパーソナルポートフォリオ体験。',
    gradient: 'from-[#D4A574] to-[#8B7355]',
    file: 'personal-website.html',
    emoji: '✨',
  },
];

export default function WorksPage() {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
            🎨 Works Gallery
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            インタラクティブな作品を探索しよう
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <div
              key={work.id}
              onClick={() => setSelectedWork(work)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-zinc-200 dark:border-zinc-800"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${work.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
              />
              
              <div className="relative z-10">
                <div className="text-5xl mb-4">{work.emoji}</div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                  {work.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                  {work.description}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  <span>詳しく見る</span>
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-solid border-black/[.08] px-6 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            ← ホームに戻る
          </Link>
        </div>
      </div>

      <WorkModal
        isOpen={!!selectedWork}
        onClose={() => setSelectedWork(null)}
        workUrl={selectedWork ? `/works/${selectedWork.file}` : ''}
        title={selectedWork?.title || ''}
      />
    </div>
  );
}
