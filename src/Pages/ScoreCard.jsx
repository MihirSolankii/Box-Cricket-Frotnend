import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { routes } from '../../routes.js'; 
import socket from '../Socket.js';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    Trophy, UserPlus, CircleDot, Activity, ArrowLeft, Crown, 
    Settings, AlertTriangle, PlayCircle, SlidersHorizontal 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ActiveBatsmanRow = ({ name, stats, isStrike }) => {
    if (!name) return (
        <tr className="border-b border-border">
            <td className="py-3 text-muted-foreground italic text-sm">Empty Spot</td>
            <td colSpan="5"></td>
        </tr>
    );
    return (
        <tr className={`border-b border-border ${isStrike ? 'bg-accent/50' : ''}`}>
            <td className="py-3 font-medium flex items-center gap-2 text-foreground">
                {name} {isStrike && <CircleDot size={12} className="text-primary animate-pulse"/>}
            </td>
            <td className="text-right font-bold text-foreground">{stats?.runs || 0}</td>
            <td className="text-right text-muted-foreground">{stats?.balls || 0}</td>
            <td className="text-right text-muted-foreground hidden md:table-cell">{stats?.fours || 0}</td>
            <td className="text-right text-muted-foreground hidden md:table-cell">{stats?.sixes || 0}</td>
            <td className="text-right text-primary font-mono">{stats?.strikeRate || 0}</td>
        </tr>
    );
};

function ScoreCard() {
    const navigate = useNavigate();
    
    // --- State ---
    const [isAdmin, setIsAdmin] = useState(false);
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [settlementMembers, setSettlementMembers] = useState([]); 
    
    // --- Modals State ---
    const [showAddPlayer, setShowAddPlayer] = useState(false);
    const [showSetPlayers, setShowSetPlayers] = useState(false);
    const [showWicketModal, setShowWicketModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false); // NEW MODAL

    // --- Forms ---
    const [newPlayerId, setNewPlayerId] = useState(""); 
    const [newPlayerTeam, setNewPlayerTeam] = useState("A");

    // Match Settings Form
    const [maxOversInput, setMaxOversInput] = useState(10);
    const [battingFirstInput, setBattingFirstInput] = useState("A");

    // Set Players Form
    const [selectedStriker, setSelectedStriker] = useState("");
    const [selectedNonStriker, setSelectedNonStriker] = useState("");
    const [selectedBowler, setSelectedBowler] = useState("");

    // Wicket Form
    const [wicketType, setWicketType] = useState("Bowled");
    const [whoDismissed, setWhoDismissed] = useState("striker");

    const tokenRef = useRef(localStorage.getItem("UserCricBoxToken"));
    const settlementIdRef = useRef(localStorage.getItem("SettlementId"));
    const [matchId, setMatchId] = useState(localStorage.getItem("MatchId"));

    // --- INIT ---
    useEffect(() => {
        const init = async () => {
            if (!settlementIdRef.current) return;
            try {
                const adminRes = await axios.get(`${routes.isAdmin}/${settlementIdRef.current}`, {
                    headers: { Authorization: `Bearer ${tokenRef.current}` }
                });
                setIsAdmin(adminRes.data.isAdmin);

                const membersRes = await axios.get(`${routes.getMembers}/${settlementIdRef.current}`, {
                    headers: { Authorization: `Bearer ${tokenRef.current}` }
                });
                if (membersRes.data) {
                    const nicknames = membersRes.data.map(p => p.nickname);
                    setSettlementMembers(nicknames);
                }

                if (adminRes.data.isAdmin) {
                    const matchRes = await axios.post(`${routes.createMatch}`, {
                        settlementId: settlementIdRef.current
                    }, { headers: { Authorization: `Bearer ${tokenRef.current}` } });
                    if(matchRes.data.matchId) {
                        setMatchId(matchRes.data.matchId);
                        localStorage.setItem("MatchId", matchRes.data.matchId);
                    }
                } else {
                    const matchRes = await axios.get(`${routes.viewMatchId}/${settlementIdRef.current}`, {
                        headers: { Authorization: `Bearer ${tokenRef.current}` }
                    });
                    if(matchRes.data.matchId) {
                        setMatchId(matchRes.data.matchId);
                        localStorage.setItem("MatchId", matchRes.data.matchId);
                    }
                }
            } catch (error) { console.error("Init Error:", error); 
                 toast.error("Failed to load match data");
            }
        };
        init();
    }, []);

    // --- SOCKET ---
    useEffect(() => {
        if (!matchId) return;
        socket.emit("joinMatch", { matchId });
        socket.on("updateMatch", (data) => {
            setMatch(data);
            setLoading(false);
            // Sync local state with DB state
            setMaxOversInput(data.maxOvers);
        });
          socket.on("notification", (data) => {
            console.log("🔔 Notification:", data);
            
            // Display toast based on type
            switch (data.type) {
                case "wicket":
                    toast.error(data.message, { // Red toast for wickets
                        style: { border: '1px solid #ef4444', color: '#ef4444' }
                    });
                    break;
                case "win":
                    toast.success(data.message, { // Green toast for wins
                        duration: 5000,
                        icon: '🏆'
                    });
                    break;
                case "over":
                    toast.info(data.message, { icon: '🔄' });
                    break;
                case "error":
                    toast.error(data.message);
                    break;
                case "break":
                    toast(data.message, { icon: '☕' });
                    break;
                default:
                    toast(data.message); 
            }
        });
        return () => { socket.off("updateMatch"); socket.off("notification"); };
    }, [matchId]);

    // --- HANDLERS ---
    const handleUpdateSettings = () => {
        socket.emit("updateMatchSettings", {
            matchId,
            maxOvers: maxOversInput,
            battingFirst: battingFirstInput
        });
        setShowSettingsModal(false);
    };

    const handleAddPlayer = (e) => {
        e.preventDefault();
        if (!newPlayerId) return;
        socket.emit("addPlayer", { matchId, playerName: newPlayerId, team: newPlayerTeam });
        setNewPlayerId(""); setShowAddPlayer(false);
    };

    const handleSetPlayers = (e) => {
        e.preventDefault();
        socket.emit("setCurrentPlayers", {
            matchId,
            striker: selectedStriker || null,
            nonStriker: selectedNonStriker || null,
            bowler: selectedBowler || null
        });
        setShowSetPlayers(false);
    };

    const handleWicketSubmit = () => {
        socket.emit("recordBall", {
            matchId,
            ballData: { runs: 0, isWide: false, isNoBall: false, isWicket: true, wicketType, whoDismissed }
        });
        setShowWicketModal(false); setWicketType("Bowled"); setWhoDismissed("striker");
    };

    const handleRecordBall = (runs, isWide, isNoBall) => {
        socket.emit("recordBall", { matchId, ballData: { runs, isWide, isNoBall, isWicket: false } });
    };

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary"><Activity className="animate-spin mr-2" /> Loading...</div>;
    if (!match) return <div className="min-h-screen bg-background flex items-center justify-center">Match not found</div>;

    const currentInnings = match.currentInnings;
    const currentTeam = currentInnings === "A" ? match.teamA : match.teamB;
    const bowlingTeam = currentInnings === "A" ? match.teamB : match.teamA;
    
    const isSecondInnings = !!match.target; 
    const runsNeeded = isSecondInnings ? (match.target - currentTeam.score) : 0;
    const ballsRemaining = (match.maxOvers * 6) - currentTeam.balls;

    const battingSquad = currentTeam.players;
    const bowlingSquad = bowlingTeam.players;

    return (
        <div className="min-h-screen bg-secondary/30 text-foreground p-4 md:p-6 font-sans">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* --- HEADER --- */}
                <div className="flex justify-between items-center">
                    <button onClick={() => navigate(-1)} className="p-2 bg-card rounded-full border border-border hover:bg-muted transition">
                        <ArrowLeft size={20} />
                    </button>
                    {isAdmin && (
                        <button onClick={() => setShowSettingsModal(true)} className="p-2 bg-primary/10 text-primary rounded-full border border-primary/20 hover:bg-primary/20 transition">
                            <SlidersHorizontal size={20} />
                        </button>
                    )}
                </div>

                {/* --- SCORECARD CARD --- */}
                <div className="card-turf bg-card p-6 border border-border relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <h2 className="text-muted-foreground text-xs font-bold tracking-[0.2em] uppercase">
                            {match.matchStatus === 'completed' ? 'RESULT' : 'LIVE'} ({match.maxOvers} Ov)
                        </h2>
                        {isSecondInnings && <div className="text-xs bg-muted px-2 py-1 rounded text-foreground font-mono">Target: {match.target}</div>}
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-baseline gap-4">
                            <h1 className="text-6xl md:text-7xl font-bold text-foreground tracking-tighter">
                                {currentTeam.score}/{currentTeam.wickets}
                            </h1>
                            <div className="text-xl text-primary font-mono">
                                {currentTeam.overs} <span className="text-sm text-muted-foreground font-sans">overs</span>
                            </div>
                        </div>
                        <p className="mt-2 text-lg">
                            <span className="font-semibold text-foreground">{currentTeam.name}</span> vs <span className="text-muted-foreground">{bowlingTeam.name}</span>
                        </p>
                        {isSecondInnings && match.matchStatus !== 'completed' && (
                            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10 inline-block">
                                <p className="text-sm font-medium text-primary">Need <span className="font-bold">{runsNeeded}</span> runs in <span className="font-bold">{ballsRemaining}</span> balls</p>
                            </div>
                        )}
                        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                            <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">THIS OVER:</span>
                            {match.currentOverHistory?.map((ball, i) => (
                                <div key={i} className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold shadow-sm border ${ball.includes('W') ? 'bg-destructive text-destructive-foreground border-destructive' : ball.includes('4')||ball.includes('6') ? 'bg-success text-success-foreground border-success' : 'bg-muted text-muted-foreground border-border'}`}>{ball}</div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- ADMIN ACTIONS --- */}
                {isAdmin && (
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setShowAddPlayer(true)} className="flex items-center justify-center gap-2 p-3 bg-card border border-border rounded-xl font-bold text-sm shadow-sm hover:bg-secondary transition">
                            <UserPlus size={18} className="text-primary" /> Add Squad
                        </button>
                        <button onClick={() => setShowSetPlayers(true)} className="flex items-center justify-center gap-2 p-3 bg-card border border-border rounded-xl font-bold text-sm shadow-sm hover:bg-secondary transition">
                            <PlayCircle size={18} className="text-primary" /> Set Crease
                        </button>
                    </div>
                )}

                {/* --- ADMIN SCORING --- */}
                {isAdmin && match.matchStatus !== 'completed' && (
                    <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
                        <div className="grid grid-cols-6 gap-2 mb-4">
                            {[0, 1, 2, 3, 4, 6].map((run) => (
                                <button key={run} onClick={() => handleRecordBall(run, false, false)} className="aspect-square rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground font-bold text-lg text-foreground transition border border-border shadow-sm">{run}</button>
                            ))}
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <button onClick={() => handleRecordBall(1, true, false)} className="py-3 rounded-lg bg-secondary text-warning-foreground border border-border font-bold hover:bg-muted">WD</button>
                            <button onClick={() => handleRecordBall(1, false, true)} className="py-3 rounded-lg bg-secondary text-warning-foreground border border-border font-bold hover:bg-muted">NB</button>
                            <button onClick={() => setShowWicketModal(true)} className="py-3 rounded-lg bg-destructive text-destructive-foreground font-bold shadow-md hover:bg-destructive/90">OUT</button>
                        </div>
                    </div>
                )}

                {/* --- TABLES --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-card rounded-xl p-5 border border-border shadow-sm">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-muted-foreground text-xs uppercase tracking-wider text-right border-b border-border">
                                    <th className="text-left py-2 font-medium">Batter</th><th className="py-2">R</th><th className="py-2">B</th><th className="py-2">4s</th><th className="py-2">6s</th><th className="py-2">SR</th>
                                </tr>
                            </thead>
                            <tbody>
                                <ActiveBatsmanRow name={match.striker} stats={match.batsmen?.[match.striker]} isStrike={true} />
                                <ActiveBatsmanRow name={match.nonStriker} stats={match.batsmen?.[match.nonStriker]} isStrike={false} />
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-card rounded-xl p-5 border border-border shadow-sm text-center">
                        <h3 className="text-muted-foreground text-xs font-bold uppercase mb-4">Current Bowler</h3>
                        {match.bowler ? (
                            <div>
                                <p className="text-lg font-bold text-foreground">{match.bowler}</p>
                                <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                                    <div className="bg-secondary p-2 rounded border border-border"><div>Ov</div><div className="font-bold text-primary">{match.bowlers?.[match.bowler]?.overs}</div></div>
                                    <div className="bg-secondary p-2 rounded border border-border"><div>Run</div><div className="font-bold text-foreground">{match.bowlers?.[match.bowler]?.runs}</div></div>
                                    <div className="bg-secondary p-2 rounded border border-border"><div>Wkt</div><div className="font-bold text-destructive">{match.bowlers?.[match.bowler]?.wickets}</div></div>
                                </div>
                            </div>
                        ) : <div className="text-muted-foreground italic text-sm">No bowler active</div>}
                    </div>
                </div>
            </div>

            {/* --- MODAL: MATCH SETTINGS --- */}
            <AnimatePresence>
                {showSettingsModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-card w-full max-w-sm rounded-xl shadow-2xl p-6 border border-border">
                            <h3 className="text-lg font-bold text-foreground mb-4">Match Settings</h3>
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Max Overs</label>
                                <input type="number" value={maxOversInput} onChange={(e) => setMaxOversInput(e.target.value)} className="w-full bg-secondary border border-border p-3 rounded-lg text-foreground outline-none focus:ring-2 ring-primary" />
                            </div>
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Batting First</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => setBattingFirstInput("A")} className={`p-3 rounded-lg border font-bold text-sm transition ${battingFirstInput === "A" ? "bg-primary text-white border-primary" : "bg-secondary text-muted-foreground"}`}>{match.teamA.name}</button>
                                    <button onClick={() => setBattingFirstInput("B")} className={`p-3 rounded-lg border font-bold text-sm transition ${battingFirstInput === "B" ? "bg-primary text-white border-primary" : "bg-secondary text-muted-foreground"}`}>{match.teamB.name}</button>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setShowSettingsModal(false)} className="flex-1 p-3 rounded-lg bg-secondary text-foreground font-bold">Cancel</button>
                                <button onClick={handleUpdateSettings} className="flex-1 p-3 rounded-lg bg-primary text-primary-foreground font-bold">Save Settings</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            {/* OTHER MODALS (Add Player, Set Players, Wicket) remain identical to previous version, just ensure they are included in the return block... */}
             {/* --- MODAL: ADD PLAYER TO SQUAD --- */}
            <AnimatePresence>
                {showAddPlayer && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card w-full max-w-sm rounded-xl shadow-2xl overflow-hidden border border-border">
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-foreground mb-4">Add Player to Squad</h3>
                                <select className="w-full bg-secondary border border-border p-3 rounded-lg text-foreground mb-4 outline-none"
                                    value={newPlayerId} onChange={(e) => setNewPlayerId(e.target.value)}>
                                    <option value="">Select Settlement Member</option>
                                    {settlementMembers.map(nickname => (
                                        <option key={nickname} value={nickname}>{nickname}</option>
                                    ))}
                                </select>
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <button onClick={() => setNewPlayerTeam("A")} className={`p-2 rounded-lg border font-bold text-sm ${newPlayerTeam==="A" ? "bg-primary text-white border-primary" : "bg-secondary text-muted-foreground"}`}>{match.teamA.name}</button>
                                    <button onClick={() => setNewPlayerTeam("B")} className={`p-2 rounded-lg border font-bold text-sm ${newPlayerTeam==="B" ? "bg-primary text-white border-primary" : "bg-secondary text-muted-foreground"}`}>{match.teamB.name}</button>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setShowAddPlayer(false)} className="flex-1 p-3 rounded-lg bg-secondary text-foreground font-bold">Cancel</button>
                                    <button onClick={handleAddPlayer} className="flex-1 p-3 rounded-lg bg-primary text-primary-foreground font-bold">Add</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- MODAL: SET CURRENT PLAYERS --- */}
            <AnimatePresence>
                {showSetPlayers && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card w-full max-w-sm rounded-xl shadow-2xl p-6 border border-border">
                            <h3 className="text-lg font-bold text-foreground mb-4">Set Crease & Bowler</h3>
                            
                            <label className="text-xs font-bold text-muted-foreground uppercase">Striker</label>
                            <select className="w-full bg-secondary border border-border p-2 rounded mb-3 text-foreground" value={selectedStriker} onChange={e=>setSelectedStriker(e.target.value)}>
                                <option value="">Select Striker</option>
                                {battingSquad.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>

                            <label className="text-xs font-bold text-muted-foreground uppercase">Non-Striker</label>
                            <select className="w-full bg-secondary border border-border p-2 rounded mb-3 text-foreground" value={selectedNonStriker} onChange={e=>setSelectedNonStriker(e.target.value)}>
                                <option value="">Select Non-Striker</option>
                                {battingSquad.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>

                            <label className="text-xs font-bold text-muted-foreground uppercase">Bowler</label>
                            <select className="w-full bg-secondary border border-border p-2 rounded mb-6 text-foreground" value={selectedBowler} onChange={e=>setSelectedBowler(e.target.value)}>
                                <option value="">Select Bowler</option>
                                {bowlingSquad.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>

                            <div className="flex gap-2">
                                <button onClick={() => setShowSetPlayers(false)} className="flex-1 p-3 rounded-lg bg-secondary text-foreground font-bold">Cancel</button>
                                <button onClick={handleSetPlayers} className="flex-1 p-3 rounded-lg bg-primary text-primary-foreground font-bold">Update</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- MODAL: WICKET TYPE --- */}
            <AnimatePresence>
                {showWicketModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card w-full max-w-sm rounded-xl shadow-2xl p-6 border border-border">
                            <div className="flex items-center gap-2 mb-4 text-destructive">
                                <AlertTriangle size={24} />
                                <h3 className="text-lg font-bold text-foreground">Wicket Details</h3>
                            </div>
                            
                            <label className="text-xs font-bold text-muted-foreground uppercase">Type</label>
                            <select className="w-full bg-secondary border border-border p-3 rounded mb-4 text-foreground outline-none" value={wicketType} onChange={e=>setWicketType(e.target.value)}>
                                <option value="Bowled">Bowled</option>
                                <option value="Caught">Caught</option>
                                <option value="LBW">LBW</option>
                                <option value="Run Out">Run Out</option>
                                <option value="Stumped">Stumped</option>
                            </select>

                            {/* Run Out Specific: Who got out? */}
                            {wicketType === "Run Out" && (
                                <div className="mb-4 bg-secondary/50 p-3 rounded border border-border">
                                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-2">Who is out?</label>
                                    <div className="flex gap-2">
                                        <button onClick={() => setWhoDismissed("striker")} className={`flex-1 py-2 text-sm rounded font-bold border ${whoDismissed === "striker" ? "bg-destructive text-white border-destructive" : "bg-card text-foreground border-border"}`}>
                                            Striker ({match.striker})
                                        </button>
                                        <button onClick={() => setWhoDismissed("nonStriker")} className={`flex-1 py-2 text-sm rounded font-bold border ${whoDismissed === "nonStriker" ? "bg-destructive text-white border-destructive" : "bg-card text-foreground border-border"}`}>
                                            Non-Striker ({match.nonStriker})
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button onClick={() => setShowWicketModal(false)} className="flex-1 p-3 rounded-lg bg-secondary text-foreground font-bold">Cancel</button>
                                <button onClick={handleWicketSubmit} className="flex-1 p-3 rounded-lg bg-destructive text-destructive-foreground font-bold">Confirm Out</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ScoreCard;