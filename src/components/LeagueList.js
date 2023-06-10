import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';

function LeagueList() {
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState(null);

    const leagues = [
        135, // Serie A
        140, // La Liga
    ];
    useEffect(() => {
        const fetchTeams = async () => {
          try {
            const allTeams = [];
            for (let i = 0; i < leagues.length; i++) {
              const response = await axios.get(`/teams?league=${leagues[i]}&season=2022`, {
                headers: { 'x-rapidapi-key': process.env.REACT_APP_API_KEY }
              });
              allTeams.push(...response.data.response);
            }
            setTeams(allTeams);
          } catch (error) {
            setError(error.message);
          }
        };
    
        fetchTeams();
      }, [leagues]);
    
      if (error) {
        return <div>Error: {error}</div>;
      }
    
      if (!teams.length) {
        return <div>Loading...</div>;
      }

    return(
        <div>
            <h1>Teams</h1>
                {teams.map((team, index) => (
                    <Card key={index} style={{ marginBottom: '10px' }}>
                        <CardContent>
                            <img 
                                src={team.logo} 
                                alt={`${team.name} logo`} 
                                style={{ width: '50px', marginRight: '10px' }}
                            />
            <Typography>{team.name}</Typography>
                        </CardContent>
                    </Card>
                ))}
        </div>
    );
}

export default LeagueList;