'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CatNamePage() {
  const router = useRouter();
  const [catName, setCatName] = useState('たま');

  const handleStart = () => {
    // 猫の名前を保存
    localStorage.setItem('catName', catName);
    router.push('/game');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <main className="max-w-2xl px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            猫の名前を決めましょう
          </h1>

          <div className="mb-8">
            <p className="text-gray-700 mb-4">
              あなたは猫を迎えることになりました。
            </p>
            <p className="text-gray-700 mb-6">
              猫の名前を教えてください:
            </p>

            <input
              type="text"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="猫の名前"
              className="w-full max-w-md mx-auto border-2 border-gray-300 rounded-lg px-4 py-3 text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={10}
            />
            <p className="text-sm text-gray-500 mt-2">
              デフォルト名: 「たま」
            </p>
          </div>

          <button
            onClick={handleStart}
            disabled={!catName.trim()}
            className="bg-blue-500 text-white text-lg font-bold px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            決定
          </button>

          <div className="mt-8 text-sm text-gray-600">
            <p>💡 ヒント: 呼びやすい短い名前がおすすめです</p>
          </div>
        </div>
      </main>
    </div>
  );
}
