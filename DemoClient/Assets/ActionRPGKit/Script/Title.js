#pragma strict
var tip : Texture2D;
var goToScene : String = "Field1";

private var page : int = 0;
private var presave : int = 0;

function Awake (){
		presave = PlayerPrefs.GetInt("PreviousSave");
}

function OnGUI () {
	if(page == 0){
	//Menu
		if (GUI.Button (Rect (Screen.width - 300,180 ,220 ,80), "Start Game")) {
			PlayerPrefs.SetInt("Loadgame", 0);
			Application.LoadLevel (goToScene);
		}
		if (GUI.Button (Rect (Screen.width - 300,300 ,220 ,80), "Load Game")) {
			//Check for previous Save Data
			print(presave);
			if(presave == 10){
				PlayerPrefs.SetInt("Loadgame", 10);
				Application.LoadLevel (goToScene);
			}
		}
		if (GUI.Button (Rect (Screen.width - 300,420 ,220 ,80), "How to Play")) {
			page = 1;
		}
	}
	
	if(page == 1){
	//Help
		GUI.Box (Rect (Screen.width /2 -250,85,500,400), tip);
		
		if (GUI.Button (Rect (Screen.width - 180, Screen.height -110,120 ,60), "Back")) {
			page = 0;
		}
	}

}