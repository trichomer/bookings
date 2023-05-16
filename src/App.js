import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';


function App() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/teams?league=140&season=2022', {
          headers: { 'x-rapidapi-key': process.env.REACT_APP_API_KEY }
        });
        setTeams(response.data.response);
        console.log(response.data.response);

        const playerPromises = response.data.response.map(async (team) => {
          const playerResponse = await axios.get(`/players?team=${team.team.id}&season=2022`, {
            headers: { 'x-rapidapi-key': process.env.REACT_APP_API_KEY }
          });
          return playerResponse.data.response;
        });

        const allPlayers = await Promise.all(playerPromises);
        setPlayers(allPlayers.flat());
        console.log(allPlayers.flat());
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const calculateYellowCardPrice = (yellowCards, minutes) => {
    return (yellowCards / (minutes / 90)).toFixed(2);
  };

  const rows = players.map(player => ({
    id: player.player.id,
    playerName: player.player.name,
    teamName: player.statistics[0].team.name,
    position: player.statistics[0].games.position,
    age: player.player.age,
    nationality: player.player.nationality,
    minutes: player.statistics[0].games.minutes,
    yellowCards: player.statistics[0].cards.yellow,
    yellowCardPrice: calculateYellowCardPrice(player.statistics[0].cards.yellow, player.statistics[0].games.minutes),
  }));

  const columns = [
    {
      field: 'name',
      headerName: 'Player',
      width: 200,
      valueGetter: (params) =>
        params.row.player ? params.row.player.name : 'N/A',
    },
    {
      field: 'team',
      headerName: 'Team',
      width: 200,
      valueGetter: (params) =>
        params.row.statistics[0].team ? params.row.statistics[0].team.name : 'N/A',
    },
    {
      field: 'games',
      headerName: 'GP',
      width: 200,
      valueGetter: (params) =>
        params.row.statistics[0].games ? params.row.statistics[0].games.appearences : 'N/A',
    },
    {
      field: 'yellowCards',
      headerName: 'YC',
      width: 200,
      valueGetter: (params) =>
        params.row.statistics[0].cards ? params.row.statistics[0].cards.yellow : 'N/A',
    },
    {
      field: 'minutes',
      headerName: 'Mins',
      width: 200,
      valueGetter: (params) =>
        params.row.statistics[0].games ? params.row.statistics[0].games.minutes : 'N/A',
    },
    {
      field: 'yellowCardPrice',
      headerName: 'YC Price',
      width: 200,
      valueGetter: (params) => 
        params.row.statistics[0].cards && params.row.statistics[0].games
          ? (1/(params.row.statistics[0].cards.yellow / (params.row.statistics[0].games.minutes / 90))).toFixed(2)
          : 'N/A',
    },
  ];
  
  
  const dataGridTheme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            '& .MuiDataGrid-columnsContainer': {
              backgroundColor: '#f5f5f5',
            },
            '& .MuiDataGrid-iconSeparator': {
              display: 'none',
            },
            '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
              borderRight: '1px solid rgba(224, 224, 224, 1)',
            },
          },
        },
      },
    },
  });
  

  return (
    <div style={{ height: 1200, width: '90%' }}>
      <h1>La Liga</h1>
      <ThemeProvider theme={dataGridTheme}>
        <DataGrid
          rows={players.map((player) => ({ ...player, id: player.player.id }))}
          columns={columns}
          pageSize={10}
          components={{
            Toolbar: GridToolbar,
          }}
          checkboxSelection={false}
          disableSelectionOnClick
        />
      </ThemeProvider>
    </div>
  );
}

export default App;
