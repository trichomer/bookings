import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme, alpha } from '@mui/material/styles';
import axios from 'axios';
import PlayerHistory from './PlayerHistory';

const FixtureDetails = () => {
  const [details, setDetails] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const { id } = useParams();
  const theme = useTheme();
  const getGridBorderColor = () => {
    return theme.palette.mode === 'dark' ? alpha(theme.palette.divider, 0.7) : theme.palette.divider;
  };

  const handleRowClick = (param) => {
    setSelectedPlayer(param.id);
  };

  const fetchAllPlayers = async (team, season) => {
    let page = 1;
    let players = [];
    let hasMore = true;

    while (hasMore) {
      const res = await axios.get(`/players?team=${team}&season=${season}&page=${page}`, {
        headers: {
          'x-rapidapi-key': process.env.REACT_APP_API_KEY,
        },
      });

      players = [...players, ...res.data.response];

      hasMore = res.data.response.length > 0;
      page++;
    }

    return players;
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

        const homeTeamPlayers = await fetchAllPlayers(homeTeam, 2022);
        const awayTeamPlayers = await fetchAllPlayers(awayTeam, 2022);

        const combinedStats = [...homeTeamPlayers, ...awayTeamPlayers].map((player) => {
          const yellowCardPrice = player.statistics[0].cards.yellow === 0
            ? '-'
            : (1 / (player.statistics[0].cards.yellow / (player.statistics[0].games.minutes / 90))).toFixed(2);
      
          return {
            player: player.player,
            teamLogo: player.statistics[0].team.logo,
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
    { 
      field: 'teamLogo', 
      headerName: 'Team', 
      width: 50,
      renderCell: (params) => (
        <img src={params.value} alt="Team logo" style={{ width: '20px', marginRight: '10px' }}/>
      )
    },
    { field: 'playerName', headerName: 'Player', width: 200 },
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
      teamLogo: item.teamLogo,
    };
  });

  return (
    <div style={{ height: 900, width: '100%' }}>
      <DataGrid 
        rows={rows} 
        columns={columns} 
        pageSize={10}
        onRowClick={handleRowClick}
        style={{
          borderColor: getGridBorderColor(),
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }} 
      />
      {selectedPlayer && <PlayerHistory playerId={selectedPlayer} open={!!selectedPlayer} onClose={() => setSelectedPlayer(null)} />}
    </div>
  );
};

export default FixtureDetails;