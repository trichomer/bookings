import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme, alpha } from '@mui/material/styles';
import axios from 'axios';

const FixtureDetails = () => {
  const [details, setDetails] = useState([]);
  const { id } = useParams();
  const theme = useTheme();
  const getGridBorderColor = () => {
    return theme.palette.mode === 'dark' ? alpha(theme.palette.divider, 0.7) : theme.palette.divider;
  };

  useEffect(() => {
    const fetchDetails = async () => {
      const fixtureRes = await axios.get(`/fixtures/?id=${id}`, {
        headers: {
          'x-rapidapi-key': process.env.REACT_APP_API_KEY,
        },
      });

      const fixtureDetails = fixtureRes?.data?.response?.[0];
    
      if (fixtureDetails) {
        const homeTeam = fixtureDetails.teams.home.id;
        const awayTeam = fixtureDetails.teams.away.id;

        const homeTeamRes = await axios.get(`/players?team=${homeTeam}&season=2022`, {
          headers: {
            'x-rapidapi-key': process.env.REACT_APP_API_KEY,
          },
        });

        const awayTeamRes = await axios.get(`/players?team=${awayTeam}&season=2022`, {
          headers: {
            'x-rapidapi-key': process.env.REACT_APP_API_KEY,
          },
        });

        const homeTeamPlayers = homeTeamRes.data.response;
        const awayTeamPlayers = awayTeamRes.data.response;

        const combinedStats = [...homeTeamPlayers, ...awayTeamPlayers].map((player) => {
          const yellowCardPrice = player.statistics[0].cards.yellow === 0
            ? '-'
            : (1 / (player.statistics[0].cards.yellow / (player.statistics[0].games.minutes / 90))).toFixed(2);
      
          return {
            player: player.player,
            combinedStatistics: {
              ...player.statistics[0].games,
              ...player.statistics[0].cards,
              yellowCardPrice,
            }
          };
        });
      
        setDetails(combinedStats);
      }
    };

    fetchDetails();
  }, [id]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70, hide: true },
    { field: 'playerName', headerName: 'Player', width: 200 },
    { field: 'teamName', headerName: 'Team', width: 150 },
    { field: 'position', headerName: 'Pos', width: 130 },
    { field: 'minutes', headerName: 'Mins', width: 180 },
    { field: 'yellow', headerName: 'YC', width: 150 },
    { field: 'yellowred', headerName: 'YRC', width: 150 },
    { field: 'red', headerName: 'RC', width: 130 },
    { field: 'yellowCardPrice', headerName: 'YC Price', width: 200 },
  ];
    
  const rows = details.map((item, index) => {
    return {
      id: item.player.id, 
      ...item.combinedStatistics,
      playerName: item.player.name,
    };
  });

  return (
    <div style={{ height: 900, width: '100%' }}>
      <DataGrid 
        rows={rows} 
        columns={columns} 
        pageSize={10}
        style={{
          borderColor: getGridBorderColor(),
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }} 
      />
    </div>
  );
};

export default FixtureDetails;
