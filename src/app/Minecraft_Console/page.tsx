"use client";

import { useEffect, useRef, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { collection, query, orderBy, getDocs, setDoc, doc } from "firebase/firestore";
import { VoxelEngine, BlockType } from "@/lib/VoxelEngine";
import styles from "@/styles/Home.module.css"; // Import CSS Module

const BLOCK_SIZE = 10;
const COLORS: Record<string, string> = {
  grass: '#567d46', dirt: '#5d4037', stone: '#757575',
  wood: '#4e342e', brick: '#8d6e63', leaves: '#2e7d32',
  water: '#40a4df', obsidian: '#1a1a1a'
};
const HOTBAR_ITEMS: BlockType[] = ['grass', 'dirt', 'stone', 'wood', 'brick', 'leaves', 'water', 'obsidian'];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'title' | 'worlds' | 'game' | 'loading'>('title');
  const [worlds, setWorlds] = useState<any[]>([]);
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState("Initializing...");
  const [modalCreate, setModalCreate] = useState(false);
  const [newWorldName, setNewWorldName] = useState("New World");
  
  const [showPreGame, setShowPreGame] = useState(false);
  const [paused, setPaused] = useState(false);
  const [coords, setCoords] = useState("0, 0, 0");
  const [selectedSlot, setSelectedSlot] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<VoxelEngine | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else signInAnonymously(auth);
    });
    return () => unsub();
  }, []);

  const fetchWorlds = async () => {
    if (!user) return;
    setLoadingMsg("Fetching Worlds...");
    setView('loading');
    
    const path = `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/users/${user.uid}/worlds`;
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setWorlds(list);
    setView('worlds');
  };

  const createWorld = async () => {
    if (!user || !newWorldName.trim()) return;
    setModalCreate(false);
    setLoadingMsg("Generating Terrain...");
    setView('loading');

    try {
      const newId = `world_${Date.now()}`;
      const basePath = `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/users/${user.uid}/worlds`;
      
      await setDoc(doc(db, basePath, newId), {
        name: newWorldName, createdBy: user.uid, createdAt: Date.now()
      });

      const promises = [];
      for(let x=-8; x<8; x++){
        for(let z=-8; z<8; z++){
          const bid = `${x}_0_${z}`;
          promises.push(setDoc(doc(db, `${basePath}/${newId}/blocks`, bid), {
            x: x*BLOCK_SIZE, y: -BLOCK_SIZE, z: z*BLOCK_SIZE, type: 'grass'
          }));
        }
      }
      loadGame(newId);
    } catch (e: any) {
      alert("Error: " + e.message);
      setView('worlds');
    }
  };

  const loadGame = (worldId: string) => {
    if (!user) return;
    setLoadingMsg("Entering Dimension...");
    setView('loading');
    
    setTimeout(() => {
      if (engineRef.current) engineRef.current.dispose();
      
      const worldPath = `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/users/${user.uid}/worlds/${worldId}`;
      
      if (containerRef.current) {
        engineRef.current = new VoxelEngine(containerRef.current, worldPath, (x, y, z) => {
          setCoords(`${x}, ${y}, ${z}`);
        });
        
        (window as any).__SELECTED_BLOCK__ = HOTBAR_ITEMS[selectedSlot];
        
        setView('game');
        setShowPreGame(true);
        setPaused(false);
      }
    }, 500);
  };

  const enterWorld = () => {
    setShowPreGame(false);
    if (engineRef.current) {
      engineRef.current.isRunning = true;
      document.body.requestPointerLock();
    }
  };

  const quitGame = () => {
    if (engineRef.current) {
      engineRef.current.dispose();
      engineRef.current = null;
    }
    document.exitPointerLock();
    setView('title');
  };

  useEffect(() => {
    const handleLock = () => {
      if (document.pointerLockElement === document.body) {
        setPaused(false);
        if (engineRef.current) engineRef.current.isPaused = false;
      } else {
        if (view === 'game' && !showPreGame) {
          setPaused(true);
          if (engineRef.current) engineRef.current.isPaused = true;
        }
      }
    };
    document.addEventListener('pointerlockchange', handleLock);
    return () => document.removeEventListener('pointerlockchange', handleLock);
  }, [view, showPreGame]);

  useEffect(() => {
    (window as any).__SELECTED_BLOCK__ = HOTBAR_ITEMS[selectedSlot];
  }, [selectedSlot]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if(e.code.startsWith("Digit")) {
        const idx = parseInt(e.key) - 1;
        if(idx >= 0 && idx < HOTBAR_ITEMS.length) setSelectedSlot(idx);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);


  return (
    <main className={styles.fullScreen}>
      
      {/* 3D CONTAINER */}
      <div ref={containerRef} className={styles.fullScreen} style={{ zIndex: 0 }} />

      {/* --- TITLE SCREEN --- */}
      {view === 'title' && (
        <div className={`${styles.fullScreen} ${styles.flexCenter} ${styles.bgDirt}`}>
          <h1 className={styles.title}>VOXEL VERSE</h1>
          <p className={styles.subtitle}>{user ? `Connected: ${user.uid.substring(0,5)}` : 'Connecting...'}</p>
          <button disabled={!user} onClick={fetchWorlds} className={`${styles.btn} ${styles.btnPrimary}`}>PLAY GAME</button>
        </div>
      )}

      {/* --- LOADING --- */}
      {view === 'loading' && (
        <div className={`${styles.fullScreen} ${styles.flexCenter} ${styles.bgLoading}`}>
          <div className={styles.spinner}></div>
          <h2 className={styles.heading}>{loadingMsg}</h2>
        </div>
      )}

      {/* --- WORLD SELECT --- */}
      {view === 'worlds' && (
        <div className={`${styles.fullScreen} ${styles.flexCenter} ${styles.bgDirt}`}>
          <h1 className={styles.heading}>SELECT WORLD</h1>
          <div className={styles.listContainer}>
            {worlds.length === 0 && <div style={{textAlign:'center', marginTop: 100, color:'#888'}}>No worlds found.</div>}
            {worlds.map(w => (
              <div key={w.id} 
                   onClick={() => setSelectedWorldId(w.id)}
                   className={`${styles.worldRow} ${selectedWorldId === w.id ? styles.worldRowSelected : ''}`}>
                <span style={{fontWeight: 'bold'}}>{w.name}</span>
                <span style={{fontSize: '0.8rem', color:'#aaa'}}>{new Date(w.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
          <div className={styles.row}>
            <button onClick={() => setModalCreate(true)} className={`${styles.btn} ${styles.btnPrimary}`}>CREATE NEW</button>
            <button disabled={!selectedWorldId} onClick={() => loadGame(selectedWorldId!)} className={styles.btn}>LOAD SELECTED</button>
          </div>
          <button onClick={() => setView('title')} className={`${styles.btn} ${styles.btnDanger}`} style={{marginTop: 20}}>BACK</button>
        </div>
      )}

      {/* --- CREATE MODAL --- */}
      {modalCreate && (
        <div className={`${styles.fullScreen} ${styles.flexCenter} ${styles.bgOverlay}`}>
          <div className={styles.modalBox}>
            <h2 className={styles.heading}>NAME WORLD</h2>
            <input 
              value={newWorldName}
              onChange={(e) => setNewWorldName(e.target.value)}
              className={styles.input}
            />
            <div className={styles.row}>
              <button onClick={createWorld} className={`${styles.btn} ${styles.btnPrimary}`} style={{width: 130}}>CREATE</button>
              <button onClick={() => setModalCreate(false)} className={`${styles.btn} ${styles.btnDanger}`} style={{width: 130}}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* --- PRE-GAME --- */}
      {view === 'game' && showPreGame && (
        <div className={`${styles.fullScreen} ${styles.flexCenter} ${styles.bgOverlay}`}>
          <h1 className={styles.heading} style={{color: '#4CAF50'}}>WORLD READY!</h1>
          <p style={{color: '#aaa', marginBottom: 30}}>Click button below to capture mouse.</p>
          <button onClick={enterWorld} className={`${styles.btn} ${styles.btnPrimary}`} style={{width: 400, height: 80, fontSize: '2rem'}}>ENTER WORLD</button>
          <button onClick={quitGame} className={`${styles.btn} ${styles.btnDanger}`}>ABORT</button>
        </div>
      )}

      {/* --- PAUSE MENU --- */}
      {view === 'game' && paused && !showPreGame && (
        <div className={`${styles.fullScreen} ${styles.flexCenter} ${styles.bgOverlay}`}>
          <h1 className={styles.heading}>PAUSED</h1>
          <button onClick={() => document.body.requestPointerLock()} className={`${styles.btn} ${styles.btnPrimary}`}>RESUME</button>
          <button onClick={quitGame} className={`${styles.btn} ${styles.btnDanger}`}>SAVE & QUIT</button>
        </div>
      )}

      {/* --- HUD --- */}
      {view === 'game' && !showPreGame && (
        <div className={`${styles.fullScreen} ${styles.hudLayer}`}>
          <div className={styles.crosshair}></div>
          <div className={styles.coords}>{coords}</div>

          <div className={styles.hotbar}>
            {HOTBAR_ITEMS.map((item, idx) => (
              <div key={item} 
                   onClick={() => setSelectedSlot(idx)}
                   className={`${styles.slot} ${selectedSlot === idx ? styles.slotActive : ''}`}
                   style={{ backgroundColor: COLORS[item] }}
                   title={item}
              />
            ))}
          </div>
        </div>
      )}

    </main>
  );
}