const express = require("express");
const app = express();
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

app.use(express.json());
let db = null;

const initializeDbAndServer = async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  app.listen(3001, () => {
    console.log("server is running");
  });
};

initializeDbAndServer();

app.get("/players/", async (request, response) => {
  const getPlayerQuery = `
    SELECT
        *
    FROM
        cricket_team;
    ORDER BY
    player_id;`;
  const playerArray = await db.all(getPlayerQuery);
  const ans = (eachObject) => {
    return {
      playerId: eachObject.player_id,
      playerName: eachObject.player_name,
      jerseyNumber: eachObject.jersey_number,
      role: eachObject.role,
    };
  };
  response.send(playerArray.map((eachElement) => ans(eachElement)));
});

module.exports = app;

// add book details

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
  INSERT INTO
     cricket_team(player_name, jersey_number, role)
  VALUES
   (
      "${playerName}",
       ${jerseyNumber},
      "${role}"
    );`;
  await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

module.exports = app;

// get particular book

app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT
        *
    FROM
        cricket_team;
    WHERE
        player_id = ${playerId};`;
  const playerObject = await db.get(getPlayerQuery);
  const ans = (eachObject) => {
    return {
      playerId: eachObject.player_id,
      playerName: eachObject.player_name,
      jerseyNumber: eachObject.jersey_number,
      role: eachObject.role,
    };
  };
  response.send(ans(playerObject));
});

//update player details

app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;

  const { playerName, jerseyNumber, role } = playerDetails;

  const updateQuery = `
    UPDATE 
        cricket_team
    SET
        player_name = "${playerName}",
        jersey_number = ${jerseyNumber},
        role = "${role}";
    WHERE
        player_id = ${playerId}`;
  await db.run(updateQuery);
  response.send("Player Details Updated");
});

// delete book details

app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `
    DELETE FROM
        cricket_team
    WHERE
        player_id = ${playerId};`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});
