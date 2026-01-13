import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      <main className="flex flex-col items-center gap-12 px-8 py-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            AZURETIA.NET
          </h1>
          <p className="text-xl text-zinc-400">
            Multiplayer Rhythm Game Platform
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          
          {/* Host Card */}
          <a
            href="/app/RYTHMIA-NEXUS/host.html"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-2 border-cyan-500/20 p-8 transition-all hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20"
          >
            <div className="relative z-10">
              <div className="text-4xl mb-4">🎮</div>
              <h2 className="text-2xl font-bold text-white mb-2">Host Game</h2>
              <p className="text-zinc-400">
                Create a room and invite players to join
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          {/* Player Card */}
          <a
            href="/app/RYTHMIA-NEXUS/player.html"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/10 to-pink-500/5 border-2 border-pink-500/20 p-8 transition-all hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/20"
          >
            <div className="relative z-10">
              <div className="text-4xl mb-4">👥</div>
              <h2 className="text-2xl font-bold text-white mb-2">Join Game</h2>
              <p className="text-zinc-400">
                Enter a room code and start playing
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-8">
          
          <div className="text-center p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-time</h3>
            <p className="text-sm text-zinc-400">
              WebSocket powered multiplayer
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="text-3xl mb-3">🎵</div>
            <h3 className="text-lg font-semibold text-white mb-2">Rhythm Game</h3>
            <p className="text-sm text-zinc-400">
              Music-driven gameplay
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="text-lg font-semibold text-white mb-2">Up to 8 Players</h3>
            <p className="text-sm text-zinc-400">
              Play with friends worldwide
            </p>
          </div>
        </div>

        {/* Play Now Button */}
        <Link
          href="/game"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 p-1 mt-8"
        >
          <div className="relative z-10 rounded-xl bg-black px-8 py-4 transition-all group-hover:bg-transparent">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎮</span>
              <span className="text-xl font-bold text-white">Play RHYTHMIA Now!</span>
            </div>
          </div>
        </Link>

        {/* Footer */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-zinc-500 text-sm">
            Built with Next.js, TypeScript, and WebSockets
          </p>
          <div className="flex gap-4 justify-center text-sm">
            <Link
              href="/works"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Works
            </Link>
            <a
              href="https://github.com/azuretier"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
