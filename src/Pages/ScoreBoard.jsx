import React, { useEffect } from 'react'
import axios from 'axios';
import {routes} from "../../routes"
function ScoreBoard() {
    const token=localStorage.getItem("UserCricBoxToken");
   const[scorecard,setScorecard]=React.useState(null);
    useEffect(()=>{
        const fetchData=async()=>{
            try {
                const resposne=await axios.get(`${routes.getScorecard}`,{
                    headers:{Authorization:`Bearer ${token}`}})
                    console.log(resposne.data);
                    setScorecard(resposne.data);
                    
            } catch (error) {
                console.error("Scorecard Fetch Error:",error);
            }
        }
        fetchData();
    },[token])
return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Score Board</h1>
        {scorecard?.map((match) => (
            <div key={match.matchId} style={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                margin: "15px auto",
                padding: "20px",
                maxWidth: "600px"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <h2 style={{ margin: 0, fontSize: "20px" }}>{match.teamA?.name} vs {match.teamB?.name}</h2>
                    <span style={{ backgroundColor: "#4CAF50", color: "white", padding: "5px 10px", borderRadius: "4px" }}>
                        {match.matchStatus}
                    </span>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                    <div style={{ textAlign: "center", padding: "10px", backgroundColor: "#e8f5e9", borderRadius: "4px" }}>
                        <h3 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>{match.teamA?.name}</h3>
                        <p style={{ margin: "5px 0", fontSize: "24px", fontWeight: "bold" }}>{match.teamA?.score}/{match.teamA?.wickets}</p>
                        <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>{match.teamA?.overs} overs</p>
                    </div>
                    
                    <div style={{ textAlign: "center", padding: "10px", backgroundColor: "#e3f2fd", borderRadius: "4px" }}>
                        <h3 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>{match.teamB?.name}</h3>
                        <p style={{ margin: "5px 0", fontSize: "24px", fontWeight: "bold" }}>{match.teamB?.score}/{match.teamB?.wickets}</p>
                        <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>{match.teamB?.overs} overs</p>
                    </div>
                </div>

                <div style={{ borderTop: "1px solid #eee", paddingTop: "10px", fontSize: "14px", color: "#666" }}>
                    <p style={{ margin: "5px 0" }}>Max Overs: {match.maxOvers}</p>
                    <p style={{ margin: "5px 0" }}>Target: {match.target}</p>
                    {match.winner && <p style={{ margin: "5px 0", fontWeight: "bold", color: "#4CAF50" }}>Winner: {match.winner}</p>}
                </div>
            </div>
        ))}
    </div>
)
}

export default ScoreBoard
