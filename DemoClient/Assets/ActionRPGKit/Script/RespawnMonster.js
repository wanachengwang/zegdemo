#pragma strict
var enemy : Transform;
//var point = 10;
var pointName : String = "SpawnPoint";
var delay : float = 3.0;
var randomPoint : float = 10.0;

function Start () {
	var spawnpoints : GameObject[] = GameObject.FindGameObjectsWithTag (pointName);
	var spawnpoint : Transform = spawnpoints[Random.Range(0, spawnpoints.length)].transform;
	
	yield WaitForSeconds (delay);
	var ranPos : Vector3 = spawnpoint.position; //Slightly Random x y position from respawn point.
	ranPos.x += Random.Range(0.0,randomPoint);
	ranPos.z += Random.Range(0.0,randomPoint);
	Instantiate(enemy, ranPos , spawnpoint.rotation);
	Destroy (gameObject, 1);
}