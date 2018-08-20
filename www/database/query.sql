/*Find game winners (1st,2nd,3rd):*/
SELECT name, min(playtime) as playtime FROM Table WHERE category = 'BkP_qtrh6Q_' and leaderboard = '1' GROUP BY name order by playtime;

/*Find total games played & # games played by each unique device:*/
SELECT device_id, COUNT(device_id) FROM Table where short_code = 'BkP_qtrh6Q_' and leaderboard = '0' group by device_id

/*Get associated columns when using with a GROUP BY*/
SELECT b.name,b.playtime AS realtime,a.time,a.category,a.short_code,a.profile_url FROM TABLE a JOIN 
(SELECT name, min(playtime) as playtime FROM TABLE WHERE time > ? AND leaderboard = 1 GROUP BY name)
AS b ON a.name = b.name AND a.playtime = b.playtime WHERE time > ? AND leaderboard = 1 
GROUP BY name ORDER BY realtime ASC LIMIT 100
