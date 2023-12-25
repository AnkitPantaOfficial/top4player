import "./team.css";
import React, { useState, useEffect } from 'react';

const Teamh2h = () => {
    const [Fulldata1, setFulldata1] = useState([]);
    const [Rest, setRest] = useState([]);
    const [First, setFirst] = useState([]);
    const [teamData, setTeamData] = useState([]);

   
  
    
  useEffect(() => {
    // Fetch data from the Google Apps Script endpoint
    fetch('https://script.google.com/macros/s/AKfycbz_-_5VFES00VsB2Ad3eKetjDhOOg1lAvd9ppHUvAhAJkQzvzA0mgqB87Pmsy5ZMS32/exec')
      .then(response => response.json())
      .then(data => setFulldata1(data.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []); // Empty dependency array means this effect will run only once
  
  useEffect(() => {
    const Data = localStorage.getItem('tRMS');
    const Data1 = localStorage.getItem('tFMS');
  
    if (Data) {
      setFirst(JSON.parse(Data1));
      setRest(JSON.parse(Data));
    }
  }, []);

  const [TopTeam, setTopTeam] = useState([]);

  
  
  
  useEffect(() => {
    // Fetch data from the Google Apps Script endpoint
    fetch('https://script.google.com/macros/s/AKfycbxv7J0k67Ftg-ydzCigNVDzR77YkhRTrDQr8D2vTKjQKCTGwUYoCfCidUD-eSe-Ov4G/exec')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const dataArray = Array.from(data.data);

        const processData = (data) => {
          const teamsMap = new Map();

          // Iterate through the data and group players by team name
          data.forEach((item) => {
            const teamName = item["TeamName"];
            if (!teamsMap.has(teamName)) {
              teamsMap.set(teamName, {
                "TeamName": teamName,
                "TeamLogo": item["TeamLogo"],
                "TeamFlag": item["TeamFlag"],
                "TeamKills": item["TeamKills"],
                "TeamPosition": item["TeamPosition"],
                "TotalPoints": item["TotalPoint"],
                "WWCD": item["Chicken"],
                "Flag": item["TeamFlag"],
                "Rank": item["Rank"],
                Players: [],
              });
            }

            teamsMap.get(teamName).Players.push({
              "PlayerName": item["PlayerName"],
              "Kills": item["Kills"],
              "Contribution": item["Contribution"]
            });
          });

          // Convert the Map to an array of teams
          const teams = Array.from(teamsMap.values());

          // Create the final object structure
          const formattedData = {
            "Teams": teams,
          };

          return formattedData;
        };

        // Process and format the data
        const formattedData = processData(dataArray);
        console.log(formattedData);
        formattedData.Teams.sort((a, b) => {
          if (a.TotalPoints !== b.TotalPoints) {
            return b.TotalPoints - a.TotalPoints;
          } else {
            // If TotalPoints are the same, continue sorting by TeamPosition
            if (a.WWCD !== b.WWCD) {
              return b.WWCD - a.WWCD; // Sort by TeamPosition in ascending order
            } else {
            // If TotalPoints are the same, continue sorting by TeamPosition
            if (a.TeamPosition !== b.TeamPosition) {
              return b.TeamPosition - a.TeamPosition; // Sort by TeamPosition in ascending order
            } else {
              // If TeamPosition is the same, continue sorting by Kills
              if (a.TeamKills !== b.TeamKills) {
                return b.TeamKills - a.TeamKills; // Sort by TeamKills in descending order
              } else {
                // If all criteria are the same, sort by the order of appearance
                const earliestA = teamData.findIndex((team) => team.TeamName === a.TeamName);
                const earliestB = teamData.findIndex((team) => team.TeamName === b.TeamName);
                return earliestA - earliestB; // Sort by the order of appearance
              }
            }
          }
          }
        });

        let FirstTeam = formattedData.Teams[0]; // Change index to 0 for the first team
        let RestTeam = formattedData.Teams.slice(0, 3);

        console.log(FirstTeam, 'first');
        console.log(RestTeam, 'rest');
        setFirst(FirstTeam);
        setRest(RestTeam);
        localStorage.setItem('tFMS', JSON.stringify(FirstTeam));
        localStorage.setItem('tRMS', JSON.stringify(RestTeam));

        // Fix: Set the teamData state
        setTeamData(formattedData.Teams);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

const [Photo, setPhoto] = useState([]);

useEffect(() => {
    // Function to fetch player photos
    const fetchPlayerPhotos = () => {
      fetch('https://script.google.com/macros/s/AKfycbyZSdI3NyI_AiPlRIMDi9AdmukDSfVcnANvANCI_v1T2fzbCEUqKMV-uQwAt_a7S3G-/exec') // Replace with your actual Google Apps Script URL
        .then(response => {
          if (!response.ok) {
            throw new Error("Could not fetch player photos");
          }
          return response.json();
        })
        .then(data => {
          console.log(data.data);
          setPhoto(data.data);
        })
        .catch((error) => {
          console.error("Error fetching player photos:", error);
        });
    };

    // Call the function to fetch player photos
    fetchPlayerPhotos();

    // Optional: Set up an interval to periodically fetch player photos
    const intervalId = setInterval(fetchPlayerPhotos, 2000);

// Clean up the interval when the component unmounts
return () => clearInterval(intervalId);

  }, []); // Empty dependency array to run the effect only once

  const getPlayerPhotoUrl = (playerName) => {
  const player = Photo.find((p) => p.Name === playerName);
  const defaultImageUrl = 'https://media.discordapp.net/attachments/1043905461193285702/1177634952439930971/black.png?ex=65733904&is=6560c404&hm=ce8e11d29ac48de2a7cf75484719eeaccd45b62fe807645437c732d9235580a7&=&format=webp&width=671&height=671';
  return player && player.Photo ? player.Photo : defaultImageUrl;
}; 
const [primaryColor, setPrimaryColor] = useState('rgba(0, 0, 0, 0.5)');
const [secondaryColor, setSecondaryColor] = useState('rgba(0, 0, 0, 0.5)');

useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbz5MaS11pgUeKkrXBXricCRDD71zmPapnT0yeeq75mcTpW7ivy_sVGSK9uf9fajK79T/exec');
        const data = await response.json();

        const primaryColorItem = data.data.find(item => item.MATCH === 'Primary Color');
        const secondaryColorItem = data.data.find(item => item.MATCH === 'Secondary Color');

        if (primaryColorItem) {
          setPrimaryColor(primaryColorItem.MAP);
        }

        if (secondaryColorItem) {
          setSecondaryColor(secondaryColorItem.MAP);
        }
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    };

    fetchDataFromApi();
  }, []);


  return (
    <div className="ph2h">
         { Fulldata1.length > 0 && Fulldata1[1] && (
         <div key={Fulldata1[1].TournamentName}>       
             <div className="head1">
            <div className="matchheadtohead">TEAM HEAD TO  HEAD</div>
            <img className="tournamentlogo" alt="" src={Fulldata1[1]?.TournamentLogo} />
            </div>
             <div className="det">
          <div className="matchinfo">
          <div className="head-to-head">HEAD TO HEAD</div>
          <img
              className="background-2-icon"
              alt=""
              src="https://media.discordapp.net/attachments/1180813422594625536/1184839391764549725/background.png?ex=6596a92c&is=6584342c&hm=d6ef32cda9c1de6860868a376b62327a7b28ff847fb35c3971abec14aa8569cf&=&format=webp&quality=lossless&width=1105&height=621"
          />
          <div className="match-1-erangle">POST-{Fulldata1[1]?.Match}</div>
          </div>    
          <div className="elimination-wrapper"style={{ backgroundColor: primaryColor, }}>
          <div className="elimination">ELIMINATION</div>
          </div>
          <div className="contribution-wrapper"style={{ backgroundColor:secondaryColor }}>
          <div className="contribution">TOTAL POINT</div>
          </div>
          <div className="kd-wrapper"style={{ backgroundColor: primaryColor }}>
          <div className="kd">CHICKEN</div>
          </div>
          <div className="ranking-wrapper"style={{ backgroundColor:secondaryColor }}>
          <div className="ranking">RANKING</div>
          </div>
          
            </div>
        </div>
 )}


      <div className="all">
      {Rest.slice(1, 2).map((team, index) => (
            <div>
          <div className="points1">
          <div className="div4">{team.TeamKills}</div>
          <div className="div55">{team.TotalPoints}</div>
          <div className="div6">{team.WWCD}</div>
          <div className="div7">#1</div>
          </div>
            <div className="teamphoto1">
                <img className="team-1-icon" alt="" src={team.TeamLogo}/>
            </div>
            <div className="playerdete">
                <div className="playername"style={{ backgroundColor:secondaryColor }}>
                <div className="playername-text">{team.TeamName}</div>
                <img className="bangadesh-1-icon" alt="" src={team.TeamFlag}  />
                </div>
                <img className="teamlogo1" alt="" src={team.TeamLogo} />
            </div>
            </div>
      ))}
      {Rest.slice(2, 3).map((team, index) => (
            <div>
            <div className={"teamphoto11"}>
                <img className="team-1-icon2" alt="" src={team.TeamLogo} />
            </div>
            <div className="playerdete1">
                <div className="playername1"style={{ backgroundColor:secondaryColor }}>
                <img className="teamlogo2" alt="" src={team.TeamFlag} />
                </div>
                <div className="playername-text1">{team.TeamName}</div>
                <img className="a1nb-2-icon" alt="" src={team.TeamLogo} />
            </div>
            <div className="points11">
            <div className="div4">{team.TeamKills}</div>
          <div className="div55">{team.TotalPoints}</div>
          <div className="div6">{team.WWCD}</div>
          <div className="div7">#2</div>
          </div>
            </div>
      ))}
      </div>
    </div>
  );
};

export default Teamh2h;
