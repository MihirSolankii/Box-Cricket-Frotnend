// // --- SUB COMPONENTS ---

// const ActiveBatsmanRow = ({ name, stats, isStrike }) => {
//   if (!name) return (
//     <tr>
//       <td colSpan="6" className="py-3 text-slate-600 italic text-center">Empty Slot</td>
//     </tr>
//   );

//   return (
//     <tr className={`transition-colors ${isStrike ? "bg-emerald-900/10" : ""}`}>
//       <td className="py-2 text-white font-medium flex items-center gap-1">
//         {name} {isStrike && <span className="text-emerald-400 text-lg leading-none">*</span>}
//       </td>
//       <td className="text-right font-bold text-slate-200">{stats?.runs || 0}</td>
//       <td className="text-right text-slate-400">{stats?.balls || 0}</td>
//       <td className="text-right text-slate-400">{stats?.fours || 0}</td>
//       <td className="text-right text-slate-400">{stats?.sixes || 0}</td>
//       <td className="text-right text-slate-400">{stats?.strikeRate || 0}</td>
//     </tr>
//   );
// };

// const FullBatsmanTable = ({ players, batsmenData }) => {
//   return (
//     <div>
//        <h4 className="text-slate-500 text-xs font-bold uppercase mb-2">Batting Scorecard</h4>
//        <div className="overflow-x-auto">
//          <table className="w-full text-sm">
//            <thead className="bg-slate-900/50 text-slate-400">
//              <tr>
//                <th className="text-left p-2 rounded-l-lg">Batter</th>
//                <th className="text-left p-2">Dismissal</th>
//                <th className="text-right p-2">R</th>
//                <th className="text-right p-2">B</th>
//                <th className="text-right p-2">4s</th>
//                <th className="text-right p-2">6s</th>
//                <th className="text-right p-2 rounded-r-lg">SR</th>
//              </tr>
//            </thead>
//            <tbody className="divide-y divide-slate-700/30">
//              {players.map(player => {
//                const data = batsmenData[player];
//                if (!data && !batsmenData[player]?.runs) return null; // Don't show if they haven't batted (optional logic)
               
//                // Or show everyone in list:
//                const stats = data || { runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false, wicketInfo: "Did not bat" };
               
//                return (
//                  <tr key={player} className="hover:bg-slate-700/20">
//                    <td className="p-2 font-medium text-slate-200">{player}</td>
//                    <td className="p-2 text-xs text-slate-400">
//                      {stats.isOut ? <span className="text-red-400">{stats.wicketInfo}</span> : "Not Out"}
//                    </td>
//                    <td className="p-2 text-right font-bold text-white">{stats.runs}</td>
//                    <td className="p-2 text-right text-slate-400">{stats.balls}</td>
//                    <td className="p-2 text-right text-slate-500">{stats.fours}</td>
//                    <td className="p-2 text-right text-slate-500">{stats.sixes}</td>
//                    <td className="p-2 text-right text-slate-500">{stats.strikeRate}</td>
//                  </tr>
//                );
//              })}
//            </tbody>
//          </table>
//        </div>
//     </div>

//        </div>   