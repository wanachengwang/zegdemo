#pragma strict
private var show : boolean = false;
var textStyle : GUIStyle;
var textStyle2 : GUIStyle;

//Icon for Buffs
var braveIcon : Texture2D;
var barrierIcon : Texture2D;
var faithIcon : Texture2D;
var magicBarrierIcon : Texture2D;

function Update () {
	if(Input.GetKeyDown("c")){
		ShowWindow();
	}
}

function OnGUI(){
	var stat : Status = GetComponent(Status);
	if(show){
		GUI.Box (Rect (180,140,240,320), "Status");
		GUI.Label (Rect (200, 180, 100, 50), "Level" , textStyle);
		GUI.Label (Rect (200, 210, 100, 50), "ATK" , textStyle);
		GUI.Label (Rect (200, 240, 100, 50), "DEF" , textStyle);
		GUI.Label (Rect (200, 270, 100, 50), "MATK" , textStyle);
		GUI.Label (Rect (200, 300, 100, 50), "MDEF" , textStyle);
		GUI.Label (Rect (200, 360, 100, 50), "EXP" , textStyle);
		GUI.Label (Rect (200, 390, 100, 50), "Next LV" , textStyle);
		GUI.Label (Rect (200, 420, 120, 50), "Status Point" , textStyle);
		//Close Window Button
		if (GUI.Button (Rect (380,145,30,30), "X")) {
			ShowWindow();
		}
		//Status
		var lv : int = stat.level;
		var atk : int = stat.atk;
		var def : int = stat.def;
		var matk : int = stat.matk;
		var mdef : int = stat.mdef;
		var exp : int = stat.exp;
		var next : int = stat.maxExp - exp;
		var stPoint : int = stat.statusPoint;
		
		GUI.Label (Rect (210, 180, 100, 50), lv.ToString() , textStyle2);
		GUI.Label (Rect (250, 210, 100, 50), atk.ToString() , textStyle2);
		GUI.Label (Rect (250, 240, 100, 50), def.ToString() , textStyle2);
		GUI.Label (Rect (250, 270, 100, 50), matk.ToString() , textStyle2);
		GUI.Label (Rect (250, 300, 100, 50), mdef.ToString() , textStyle2);
		GUI.Label (Rect (275, 360, 100, 50), exp.ToString() , textStyle2);
		GUI.Label (Rect (275, 390, 100, 50), next.ToString() , textStyle2);
		GUI.Label (Rect (275, 420, 100, 50), stPoint.ToString() , textStyle2);
		
		if (GUI.Button (Rect (380,210,25,25), "+") && stPoint > 0) {
			GetComponent(Status).atk += 1;
			GetComponent(Status).statusPoint -= 1;
			GetComponent(Status).CalculateStatus();
		}
		if (GUI.Button (Rect (380,240,25,25), "+") && stPoint > 0) {
			GetComponent(Status).def += 1;
			GetComponent(Status).maxHealth += 5;
			GetComponent(Status).statusPoint -= 1;
			GetComponent(Status).CalculateStatus();
		}
		if (GUI.Button (Rect (380,270,25,25), "+") && stPoint > 0) {
			GetComponent(Status).matk += 1;
			GetComponent(Status).maxMana += 3;
			GetComponent(Status).statusPoint -= 1;
			GetComponent(Status).CalculateStatus();
		}
		if (GUI.Button (Rect (380,300,25,25), "+") && stPoint > 0) {
			GetComponent(Status).mdef += 1;
			GetComponent(Status).statusPoint -= 1;
			GetComponent(Status).CalculateStatus();
		}
	}
	
	//Show Buffs Icon
	if(stat.brave){
		GUI.DrawTexture(Rect(30,200,60,60), braveIcon);
	}
	if(stat.barrier){
		GUI.DrawTexture(Rect(30,260,60,60), barrierIcon);
	}
	if(stat.faith){
		GUI.DrawTexture(Rect(30,320,60,60), faithIcon);
	}
	if(stat.mbarrier){
		GUI.DrawTexture(Rect(30,380,60,60), magicBarrierIcon);
	}
}

function ShowWindow(){
	//Freeze Time Scale to 0 if Status Window is Showing
	if(!show && Time.timeScale != 0.0){
			show = true;
			Time.timeScale = 0.0;
			Screen.lockCursor = false;
	}else if(show){
			show = false;
			Time.timeScale = 1.0;
			Screen.lockCursor = true;
	}
}

@script RequireComponent (Status)