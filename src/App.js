import React, { useState } from 'react';
import './App.css';

function App() {
    const [players, setPlayers] = useState([]);
    const [matches, setMatches] = useState([]);
    const [round, setRound] = useState(1);
    const [inputValue, setInputValue] = useState("");
    const [teamSize, setTeamSize] = useState(2); // Standaard waarde voor duo's
    const [winners, setWinners] = useState([]);
    const [errorMessage, setErrorMessage] = useState(""); // Foutbericht state

    const addPlayer = () => {
        if (inputValue.trim() !== "") {
            setPlayers([...players, inputValue.trim()]);
            setInputValue("");  // Leegmaken van het invoerveld
        }
    };

    const removePlayer = (index) => {
        const updatedPlayers = players.filter((_, i) => i !== index);
        setPlayers(updatedPlayers);
    };

    const handleInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            addPlayer();  // Voeg speler toe bij enter
        }
    };

    const handleTeamSizeChange = (e) => {
        setTeamSize(Number(e.target.value));
    };

    const createTeams = () => {
        let shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
        let tempTeams = [];
        for (let i = 0; i < shuffledPlayers.length; i += teamSize) {
            tempTeams.push(shuffledPlayers.slice(i, i + teamSize));
        }
        createMatches(tempTeams);
    };

    const createMatches = (teams) => {
        let tempMatches = [];
        for (let i = 0; i < teams.length; i += 2) {
            if (teams[i + 1]) {
                tempMatches.push([teams[i], teams[i + 1]]);
            } else {
                tempMatches.push([teams[i], ["Waiting for opponent"]]);
            }
        }
        setMatches(tempMatches);
        setWinners([]);  // Reset winners for new round
    };

    const startTournament = () => {
        if (players.length % teamSize !== 0) {
            setErrorMessage(`Not enough players! You need ${teamSize - (players.length % teamSize)} more player(s) to form complete teams.`);
        } else {
            setErrorMessage(""); // Foutbericht wissen als alles goed is
            createTeams();
        }
    };

    const selectWinner = (matchIndex, winnerIndex) => {
        const winningTeam = matches[matchIndex][winnerIndex];

        // Controleren of de geselecteerde winnaar al eerder is geselecteerd
        if (winners.includes(winningTeam)) {
            // Als het al geselecteerd is, dan unselect het
            setWinners(prevWinners => prevWinners.filter(winner => winner !== winningTeam));
        } else {
            // Voeg de winnaar toe aan de lijst van winnaars
            setWinners(prevWinners => [...prevWinners, winningTeam]);
        }
    };

    const startNextRound = () => {
        if (winners.length === matches.length) {
            let updatedTeams = winners;
            setRound(round + 1);
            createMatches(updatedTeams);
        } else {
            alert("Selecteer een winnaar voor elke match!");
        }
    };

    const resetTournament = () => {
        setPlayers([]);
        setMatches([]);
        setRound(1);
        setInputValue("");
        setWinners([]);  
        setTeamSize(2);  
        setErrorMessage("");  // Reset foutbericht
    };

    const isTournamentFinished = () => {
        return matches.length === 1 && winners.length === 1;
    };

    return (
        <div className="App">
            <h1>Tournament Bracket</h1>

            {matches.length === 0 ? (
                <>
                    <input 
                        type="text" 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                        onKeyPress={handleInputKeyPress}
                        placeholder="Enter player name"
                        autoFocus
                    />
                    <button onClick={addPlayer}>Add Player</button>
                    
                    <label htmlFor="teamSize">Players per team:</label>
                    <select id="teamSize" value={teamSize} onChange={handleTeamSizeChange}>
                        <option value={1}>Solo</option>
                        <option value={2}>Duo</option>
                    </select>

                    <button onClick={startTournament} disabled={players.length < 2}>Start Tournament</button>

                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Foutbericht weergave */}

                    <ul>
                        {players.map((player, index) => (
                            <li key={index}>
                                {player} 
                                <button onClick={() => removePlayer(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <>
                    <h2>Round {round}</h2>
                    {matches.map((match, index) => (
                        <div key={index} className="match">
                            <p>{match[0].join(' & ')} vs {match[1].join(' & ')}</p>
                            <button 
                                onClick={() => selectWinner(index, 0)} 
                                style={{ backgroundColor: winners.includes(match[0]) ? 'blue' : 'white' }}
                            >
                                Winner: {match[0].join(' & ')}
                            </button>
                            {match[1][0] !== "Waiting for opponent" && (
                                <button 
                                    onClick={() => selectWinner(index, 1)} 
                                    style={{ backgroundColor: winners.includes(match[1]) ? 'blue' : 'white' }}
                                >
                                    Winner: {match[1].join(' & ')}
                                </button>
                            )}
                        </div>
                    ))}
                    {!isTournamentFinished() ? (
                        <button onClick={startNextRound} disabled={winners.length < matches.length}>
                            Start Next Round
                        </button>
                    ) : (
                        <h3>De winnaar is: {winners[0].join(' & ')}</h3>
                    )}
                </>
            )}

            {matches.length > 0 && (
                <button onClick={resetTournament}>Reset Tournament</button>
            )}
        </div>
    );
}

export default App;
