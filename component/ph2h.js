import "./Ph2h.css";
import React, { useState, useEffect } from 'react';

const Ph2h = () => {
    const [Fulldata1, setFulldata1] = useState([]);
    const [Rest, setRest] = useState([]);
    const [First, setFirst] = useState([]);
    

   
  
    
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

  const [TopPlayers, setTopPlayers] = useState([]);

  
  
  
  useEffect(() => {
    // Function to fetch and process Excel data
    const fetchData = () => {
        // Fetch MVPMatch data
        fetch('https://script.google.com/macros/s/AKfycbxv7J0k67Ftg-ydzCigNVDzR77YkhRTrDQr8D2vTKjQKCTGwUYoCfCidUD-eSe-Ov4G/exec')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Could not fetch MVPMatch data");
                }
                return response.json();
            })
            .then(data => {
              
                console.log(data.data);
                           const player = data.data;
                            localStorage.setItem('player2', JSON.stringify(player));
                            data.data.shift();
                            // Sort the players by kills and team kills
                            const sortedPlayers = data.data.sort((a, b) => {
                                if (a["Kills"] > b["Kills"]) {
                                    return -1;
                                } else if (a["Kills"] < b["Kills"]) {
                                    return 1;
                                } else {
                                    // If kills are tied, compare team kills
                                    return b["TeamKills"] - a["TeamKills"];
                                }
                            });

                            // Get the top 4 players
                            const top4Players = sortedPlayers.slice(0, 2);

                            console.log(top4Players);
                            setTopPlayers(top4Players);
                            localStorage.setItem('OTopfraggers', JSON.stringify(top4Players));
             

                }
            )
            .catch((error) => {
                console.error("Error fetching MVPMatch data:", error);
            });
    };

    fetchData();

    const intervalIdMVPMatch = setInterval(fetchData, 2000);

    // Clean up the interval when the component unmounts
    return () => {
        clearInterval(intervalIdMVPMatch);
    };
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
            <div className="matchheadtohead">PLAYER HEAD TO HEAD</div>
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
          <div className="contribution">CONTRIBUTION</div>
          </div>
          <div className="kd-wrapper"style={{ backgroundColor: primaryColor }}>
          <div className="kd">K.D</div>
          </div>
          <div className="ranking-wrapper"style={{ backgroundColor:secondaryColor }}>
          <div className="ranking">RANKING</div>
          </div>
          
            </div>
        </div>
 )}


      <div className="all">
      {TopPlayers.slice(0,1).map((player, index) => (
            <div>
          <div className="points1">
          <div className="div4">{player.Kills}</div>
          <div className="div5">{player.Contribution}%</div>
          <div className="div6">{player.KD}%</div>
          <div className="div7">#{player.Rank}</div>
          </div>
            <div className="playerphoto1">
                <img className="black-1-icon" alt="" src={getPlayerPhotoUrl(player.PlayerName)}/>
            </div>
            <div className="playerdete">
                <div className="playername"style={{ backgroundColor:secondaryColor }}>
                <div className="playername-text">{player.PlayerName}</div>
                <img className="bangadesh-1-icon" alt="" src={player.TeamFlag}  />
                </div>
                <img className="teamlogo1" alt="" src={player.TeamLogo} />
            </div>
            </div>
      ))}
      {TopPlayers.slice(1,2).map((player, index) => (
            <div>
            <div className={"playerphoto11"}>
                <img className="black-1-icon2" alt="" src={getPlayerPhotoUrl(player.PlayerName)} />
            </div>
            <div className="playerdete1">
                <div className="playername1"style={{ backgroundColor:secondaryColor }}>
                <img className="teamlogo2" alt="" src={player.TeamFlag} />
                </div>
                <div className="playername-text1">{player.PlayerName}</div>
                <img className="a1nb-2-icon" alt="" src={player.TeamLogo} />
            </div>
            <div className="points11">
            <div className="div4">{player.Kills}</div>
          <div className="div5">{player.Contribution}%</div>
          <div className="div6">{player.KD}%</div>
          <div className="div7">#{player.Rank}</div>
          </div>
            </div>
      ))}
      </div>
    </div>
  );
};

export default Ph2h;
