"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cake, GraduationCap, Send, Folder, Share2, ChevronRight, Star, Github, Youtube, Instagram, MessageCircle, Sun, Moon, MapPin, Mail, Globe, Sparkles, TrendingUp, Clock, ExternalLink } from "lucide-react"

// --- MOCK DATA ---
const PROFILE_INFO = {
  images: ["/api/placeholder/128/128"],
  name: "Your Name",
  pronouns: "they/them",
  birthday: "January 1st",
  role: "Developer & Designer",
  location: "Tokyo, Japan",
  email: "hello@example.com",
  website: "yoursite.com",
  bio_texts: ["Building cool stuff", "Learning new things", "Creating experiences"]
};

const SNS_LINKS = [
  { id: 1, icon: Youtube, label: "YouTube", username: "@yourchannel", href: "https://youtube.com", isStatic: false, followers: "10.5K" },
  { id: 2, icon: Github, label: "GitHub", username: "@yourusername", href: "https://github.com", isStatic: false, followers: "2.3K" },
  { id: 3, icon: Instagram, label: "Instagram", username: "@yourhandle", href: "https://instagram.com", isStatic: false, followers: "5.8K" },
  { id: 4, icon: MessageCircle, label: "Discord", username: "username#0000", href: "#", isStatic: true, followers: "Online" },
];

const PROJECTS = [
  { id: 1, title: "Portfolio Website", status: "Completed", tech: "Next.js, TailwindCSS", description: "Modern portfolio with smooth animations", progress: 100, lastUpdate: "2 days ago" },
  { id: 2, title: "Task Manager App", status: "In Progress", tech: "React, TypeScript", description: "Productivity app with kanban boards", progress: 65, lastUpdate: "5 hours ago" },
  { id: 3, title: "Music Player", status: "Planning", tech: "React, Web Audio API", description: "Beautiful audio player interface", progress: 15, lastUpdate: "1 week ago" },
  { id: 4, title: "Chat Application", status: "Completed", tech: "WebSocket, Node.js", description: "Real-time messaging platform", progress: 100, lastUpdate: "1 month ago" },
];

const STATS = [
  { label: "Projects", value: "24", icon: Folder, color: "text-cyan-400" },
  { label: "Followers", value: "18.6K", icon: TrendingUp, color: "text-green-400" },
  { label: "Hours Coded", value: "1.2K", icon: Clock, color: "text-purple-400" },
];

const Main = () => {
  const [activeTab, setActiveTab] = useState<'sns' | 'projects'>('sns');
  const [displayedText, setDisplayedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [typing, setTyping] = useState(true);
  const [selectedSns, setSelectedSns] = useState(0);
  const [selectedProject, setSelectedProject] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let timeout: any;
    const texts = PROFILE_INFO.bio_texts;
    if (typing) {
      if (displayedText.length < texts[textIndex].length) {
        timeout = setTimeout(() => setDisplayedText(texts[textIndex].slice(0, displayedText.length + 1)), 100);
      } else {
        timeout = setTimeout(() => setTyping(false), 1500);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => setDisplayedText(displayedText.slice(0, -1)), 50);
      } else {
        setTyping(true);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayedText, typing, textIndex]);

  const handleSnsScroll = (e: React.WheelEvent) => {
    if (e.deltaY > 0 && selectedSns < SNS_LINKS.length - 1) {
      setSelectedSns(selectedSns + 1);
    } else if (e.deltaY < 0 && selectedSns > 0) {
      setSelectedSns(selectedSns - 1);
    }
  };

  const handleProjectScroll = (e: React.WheelEvent) => {
    if (e.deltaY > 0 && selectedProject < PROJECTS.length - 1) {
      setSelectedProject(selectedProject + 1);
    } else if (e.deltaY < 0 && selectedProject > 0) {
      setSelectedProject(selectedProject - 1);
    }
  };

  return (
    <main className={`relative grid grid-cols-12 grid-rows-8 items-center justify-center min-h-screen overflow-hidden p-6 ${isDark ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-950' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'}`}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${isDark ? 'bg-white/20' : 'bg-purple-300/30'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Top Status Bar */}
      <div className="col-span-12 row-span-1 flex items-center justify-between z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 ${isDark ? 'bg-white/5' : 'bg-white/50'} backdrop-blur-xl px-6 py-3 rounded-2xl border ${isDark ? 'border-white/10' : 'border-white/30'} shadow-2xl`}
        >
          <Sparkles className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'} animate-pulse`} size={20} />
          <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Welcome back!</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`flex items-center gap-6 ${isDark ? 'bg-white/5' : 'bg-white/50'} backdrop-blur-xl px-6 py-3 rounded-2xl border ${isDark ? 'border-white/10' : 'border-white/30'} shadow-2xl`}
        >
          <div className={`text-sm font-mono ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <button 
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-xl ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} transition-all`}
          >
            {isDark ? <Sun className="text-yellow-400" size={18} /> : <Moon className="text-indigo-600" size={18} />}
          </button>
        </motion.div>
      </div>

      {/* --- PROFILE SIDEBAR --- */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className={`row-start-2 col-start-2 row-span-6 col-span-3 h-full`}
      >
        <div className={`h-full ${isDark ? 'bg-white/5' : 'bg-white/60'} backdrop-blur-2xl rounded-3xl border ${isDark ? 'border-white/10' : 'border-white/30'} shadow-2xl p-8 flex flex-col`}>
          {/* Profile Image with glow */}
          <div className="relative mb-6 w-32 h-32 mx-auto">
            <div className={`absolute inset-0 rounded-full ${isDark ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gradient-to-r from-pink-400 to-purple-400'} blur-xl opacity-50 animate-pulse`}></div>
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
              <img
                src={PROFILE_INFO.images[0]}
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Name & Title */}
          <div className="text-center mb-6">
            <h1 className={`text-3xl font-black tracking-tight mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {PROFILE_INFO.name}
            </h1>
            <p className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
              {PROFILE_INFO.pronouns}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`${isDark ? 'bg-white/5' : 'bg-white/40'} backdrop-blur-sm rounded-2xl p-3 text-center border ${isDark ? 'border-white/10' : 'border-white/30'}`}
              >
                <stat.icon className={`${stat.color} mx-auto mb-1`} size={16} />
                <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                <p className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Info Section */}
          <div className={`space-y-3 text-sm font-medium ${isDark ? 'text-white/90' : 'text-gray-800'}`}>
            <div className="flex items-center gap-3">
              <Cake className="text-pink-400 shrink-0" size={18} />
              <span>{PROFILE_INFO.birthday}</span>
            </div>
            <div className="flex items-center gap-3">
              <GraduationCap className="text-cyan-400 shrink-0" size={18} />
              <span>{PROFILE_INFO.role}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-green-400 shrink-0" size={18} />
              <span>{PROFILE_INFO.location}</span>
            </div>
          </div>

          {/* Typing Effect */}
          <div className={`mt-6 p-4 ${isDark ? 'bg-white/5' : 'bg-white/40'} backdrop-blur-sm rounded-2xl border ${isDark ? 'border-white/10' : 'border-white/30'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Send className="text-purple-400 shrink-0" size={16} />
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status</span>
            </div>
            <div className="flex">
              <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{displayedText}</span>
              <span className="text-purple-400 animate-pulse ml-1">|</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-auto pt-6 flex gap-2">
            <button className={`flex-1 flex items-center justify-center gap-2 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white/40 hover:bg-white/60'} backdrop-blur-sm rounded-xl py-2 border ${isDark ? 'border-white/10' : 'border-white/30'} transition-all group`}>
              <Mail className={`${isDark ? 'text-white/60 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'} transition-colors`} size={16} />
            </button>
            <button className={`flex-1 flex items-center justify-center gap-2 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white/40 hover:bg-white/60'} backdrop-blur-sm rounded-xl py-2 border ${isDark ? 'border-white/10' : 'border-white/30'} transition-all group`}>
              <Globe className={`${isDark ? 'text-white/60 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'} transition-colors`} size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* --- CONTENT HUB --- */}
      <div className="grid grid-rows-7 grid-cols-9 row-start-2 col-start-6 row-span-6 col-span-6 h-full gap-4">
        
        {/* SWITCHER BAR */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-9 row-span-1 flex items-center justify-center"
        >
          <div className={`flex ${isDark ? 'bg-white/5' : 'bg-white/50'} backdrop-blur-xl p-1.5 rounded-2xl border ${isDark ? 'border-white/10' : 'border-white/30'} shadow-2xl`}>
            <button 
              onClick={() => setActiveTab('sns')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'sns' ? (isDark ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-gradient-to-r from-pink-400 to-purple-400 text-white') + ' shadow-lg' : (isDark ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-white/30')}`}
            >
              <Share2 size={16} /> 
              <span>SOCIAL</span>
            </button>
            <button 
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'projects' ? (isDark ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white') + ' shadow-lg' : (isDark ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-white/30')}`}
            >
              <Folder size={16} /> 
              <span>PROJECTS</span>
            </button>
          </div>
        </motion.div>

        {/* DYNAMIC CAROUSEL */}
        <AnimatePresence mode="wait">
          {activeTab === 'sns' ? (
            <motion.div 
              key="sns-carousel"
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="col-span-9 row-span-6 relative"
              onWheel={handleSnsScroll}
            >
              <div className="relative h-full flex items-center justify-center">
                {SNS_LINKS.map((sns, index) => {
                  const offset = index - selectedSns;
                  const isSelected = index === selectedSns;
                  
                  return (
                    <div
                      key={sns.id}
                      className="absolute transition-all duration-300 ease-out cursor-pointer"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translateX(-50%) translateY(calc(-50% + ${offset * 140}px)) scale(${isSelected ? 1 : 0.85})`,
                        opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.3,
                        zIndex: 100 - Math.abs(offset),
                        pointerEvents: Math.abs(offset) > 2 ? 'none' : 'auto',
                      }}
                      onClick={() => setSelectedSns(index)}
                    >
                      <SnsWidget {...sns} isSelected={isSelected} isDark={isDark} />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="projects-carousel"
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="col-span-9 row-span-6 relative"
              onWheel={handleProjectScroll}
            >
              <div className="relative h-full flex items-center justify-center">
                {PROJECTS.map((project, index) => {
                  const offset = index - selectedProject;
                  const isSelected = index === selectedProject;
                  
                  return (
                    <div
                      key={project.id}
                      className="absolute transition-all duration-300 ease-out cursor-pointer"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translateX(-50%) translateY(calc(-50% + ${offset * 140}px)) scale(${isSelected ? 1 : 0.85})`,
                        opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.3,
                        zIndex: 100 - Math.abs(offset),
                        pointerEvents: Math.abs(offset) > 2 ? 'none' : 'auto',
                      }}
                      onClick={() => setSelectedProject(index)}
                    >
                      <ProjectWidget {...project} isSelected={isSelected} isDark={isDark} />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

const SnsWidget = ({ href, icon: Icon, label, username, isStatic, isSelected, isDark, followers }: any) => {
  const brandStyles: Record<string, { gradient: string; glowColor: string }> = {
    YouTube: { gradient: "from-red-500 to-red-600", glowColor: "shadow-red-500/50" },
    GitHub: { gradient: "from-gray-700 to-gray-900", glowColor: "shadow-gray-500/50" },
    Instagram: { gradient: "from-purple-500 via-pink-500 to-orange-500", glowColor: "shadow-pink-500/50" },
    Discord: { gradient: "from-indigo-500 to-blue-600", glowColor: "shadow-blue-500/50" },
  };

  const activeBrand = brandStyles[label] || { gradient: "from-gray-500 to-gray-700", glowColor: "shadow-gray-500/50" };

  const content = (
    <div className={`
      w-[650px] h-32 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden
      ${isSelected 
        ? `border-white bg-gradient-to-r shadow-2xl ${activeBrand.glowColor}` 
        : 'border-white/20 bg-gradient-to-r'
      } ${activeBrand.gradient}
    `}>
      {/* Animated shine effect */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />
      )}
      
      <div className="relative h-full flex items-center px-8 gap-5 backdrop-blur-sm bg-black/40 rounded-2xl">
        <div className={`w-1.5 h-20 rounded-full bg-white ${isSelected ? 'opacity-100' : 'opacity-50'} transition-opacity`}></div>
        
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${isSelected ? 'bg-white/30 shadow-lg' : 'bg-white/20'} backdrop-blur-sm transition-all`}>
          <Icon size={28} className="text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-2xl truncate mb-1">{label}</h3>
          <p className="text-white/80 text-sm truncate mb-1">{username}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-white/60 text-xs font-medium">{followers} followers</span>
          </div>
        </div>

        {isSelected && (
          <div className="flex flex-col items-end gap-2">
            <ExternalLink className="w-5 h-5 text-white/80" />
            <ChevronRight className="w-6 h-6 text-white animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );

  return isStatic ? content : (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  );
};

const ProjectWidget = ({ title, status, tech, description, isSelected, isDark, progress, lastUpdate }: any) => {
  const statusColors: Record<string, { gradient: string; glowColor: string; statusBg: string }> = {
    'In Progress': { gradient: 'from-yellow-500 to-orange-500', glowColor: 'shadow-orange-500/50', statusBg: 'bg-orange-400/20 text-orange-300' },
    'Completed': { gradient: 'from-green-500 to-emerald-500', glowColor: 'shadow-green-500/50', statusBg: 'bg-green-400/20 text-green-300' },
    'Planning': { gradient: 'from-purple-500 to-pink-500', glowColor: 'shadow-purple-500/50', statusBg: 'bg-purple-400/20 text-purple-300' },
  };

  const statusStyle = statusColors[status] || { gradient: 'from-cyan-500 to-blue-600', glowColor: 'shadow-cyan-500/50', statusBg: 'bg-cyan-400/20 text-cyan-300' };

  return (
    <div className={`
      w-[650px] h-32 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden
      ${isSelected 
        ? `border-white bg-gradient-to-r shadow-2xl ${statusStyle.glowColor}` 
        : 'border-white/20 bg-gradient-to-r'
      } ${statusStyle.gradient}
    `}>
      {isSelected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />
      )}
      
      <div className="relative h-full flex items-center px-8 gap-5 backdrop-blur-sm bg-black/40 rounded-2xl">
        <div className={`w-1.5 h-20 rounded-full bg-white ${isSelected ? 'opacity-100' : 'opacity-50'} transition-opacity`}></div>
        
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${statusStyle.statusBg} border border-white/20`}>
              {status}
            </span>
            <span className="text-white/50 text-xs font-medium">{lastUpdate}</span>
          </div>
          
          <h3 className="text-white font-bold text-2xl truncate">{title}</h3>
          <p className="text-white/70 text-xs truncate">{tech}</p>
          
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-bold">{progress}%</span>
          </div>
          {isSelected && (
            <ChevronRight className="w-6 h-6 text-white animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;