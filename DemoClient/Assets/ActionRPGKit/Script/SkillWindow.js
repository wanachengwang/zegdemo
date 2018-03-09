#pragma strict
var player : GameObject;
var database : GameObject;

var skill : int[] = new int[3];
var skillListSlot : int[] = new int[9];

private var menu : boolean = false;
private var shortcutPage : boolean = true;
private var skillListPage : boolean = false;
private var skillSelect : int = 0;

function Start () {
		if(!player){
			player = this.gameObject;
		}
		//AssignAllSkill();

}

function Update () {
	if (Input.GetKeyDown("k")) {
		OnOffMenu();
	}

}

function OnOffMenu(){
	//Freeze Time Scale to 0 if Window is Showing
	if(!menu && Time.timeScale != 0.0){
			menu = true;
			skillListPage = false;
			shortcutPage = true;
			Time.timeScale = 0.0;
			Screen.lockCursor = false;
	}else if(menu){
			menu = false;
			Time.timeScale = 1.0;
			Screen.lockCursor = true;
	}
}

function OnGUI(){
	var dataItem : SkillData = database.GetComponent(SkillData);
	if(menu && shortcutPage){
		GUI.Box (Rect (180,160,360,185), "Skill");
		//Close Window Button
		if (GUI.Button (Rect (490,162,30,30), "X")) {
			OnOffMenu();
		}
		
		//Skill Shortcut
		if (GUI.Button (Rect (210,205,80,80), dataItem.skill[skill[0]].icon)) {
			skillSelect = 0;
			skillListPage = true;
			shortcutPage = false;
		}
		GUI.Label (Rect (250, 305, 20, 20), "1");
		if (GUI.Button (Rect (310,205,80,80), dataItem.skill[skill[1]].icon)) {
			skillSelect = 1;
			skillListPage = true;
			shortcutPage = false;
		}
		GUI.Label (Rect (350, 305, 20, 20), "2");
		if (GUI.Button (Rect (410,205,80,80), dataItem.skill[skill[2]].icon)) {
			skillSelect = 2;
			skillListPage = true;
			shortcutPage = false;
		}
		GUI.Label (Rect (450, 305, 20, 20), "3");
	}
	//---------------Skill List----------------------------
	if(menu && skillListPage){
		GUI.Box (Rect (160,160,380,385), "Skill");
		//Close Window Button
		if (GUI.Button (Rect (500,162,30,30), "X")) {
			OnOffMenu();
		}
		if (GUI.Button (Rect (210,215,80,80), dataItem.skill[skillListSlot[0]].icon)) {
			AssignSkill(skillSelect , 0);
			shortcutPage = true;
			skillListPage = false;		
		}
		if (GUI.Button (Rect (310,215,80,80), dataItem.skill[skillListSlot[1]].icon)) {
			AssignSkill(skillSelect , 1);
			shortcutPage = true;
			skillListPage = false;		
		}
		if (GUI.Button (Rect (410,215,80,80), dataItem.skill[skillListSlot[2]].icon)) {
			AssignSkill(skillSelect , 2);
			shortcutPage = true;
			skillListPage = false;		
		}
		//-----------------
		if (GUI.Button (Rect (210,315,80,80), dataItem.skill[skillListSlot[3]].icon)) {
			AssignSkill(skillSelect , 3);
			shortcutPage = true;
			skillListPage = false;		
		}
		if (GUI.Button (Rect (310,315,80,80), dataItem.skill[skillListSlot[4]].icon)) {
			AssignSkill(skillSelect , 4);
			shortcutPage = true;
			skillListPage = false;		
		}
		if (GUI.Button (Rect (410,315,80,80), dataItem.skill[skillListSlot[5]].icon)) {
			AssignSkill(skillSelect , 5);
			shortcutPage = true;
			skillListPage = false;		
		}
		//-----------------
		if (GUI.Button (Rect (210,415,80,80), dataItem.skill[skillListSlot[6]].icon)) {
			AssignSkill(skillSelect , 6);
			shortcutPage = true;
			skillListPage = false;		
		}
		if (GUI.Button (Rect (310,415,80,80), dataItem.skill[skillListSlot[7]].icon)) {
			AssignSkill(skillSelect , 7);
			shortcutPage = true;
			skillListPage = false;		
		}
		if (GUI.Button (Rect (410,415,80,80), dataItem.skill[skillListSlot[8]].icon)) {
			AssignSkill(skillSelect , 8);
			shortcutPage = true;
			skillListPage = false;		
		}
	}
	
}

function AssignSkill(id : int , sk : int){
	var dataSkill : SkillData = database.GetComponent(SkillData);
	player.GetComponent(AttackTrigger).manaCost[id] = dataSkill.skill[skillListSlot[sk]].manaCost;
	player.GetComponent(AttackTrigger).skillPrefab[id] = dataSkill.skill[skillListSlot[sk]].skillPrefab;
	player.GetComponent(AttackTrigger).skillAnimation[id] = dataSkill.skill[skillListSlot[sk]].skillAnimation;
	
	player.GetComponent(AttackTrigger).mainModel.GetComponent.<Animation>()[dataSkill.skill[skillListSlot[sk]].skillAnimation.name].layer = 16;
	
	player.GetComponent(AttackTrigger).skillIcon[id] = dataSkill.skill[skillListSlot[sk]].icon;
	skill[id] = skillListSlot[sk];
	print(sk);

}

function AssignAllSkill(){
		/*AssignSkill(0 , skill[0]);
		AssignSkill(1 , skill[1]);
		AssignSkill(2 , skill[2]);*/
	if(!player){
			player = this.gameObject;
		}
	var n : int = 0;
	var dataSkill : SkillData = database.GetComponent(SkillData);
	while(n <= 2){
		player.GetComponent(AttackTrigger).manaCost[n] = dataSkill.skill[skill[n]].manaCost;
		player.GetComponent(AttackTrigger).skillPrefab[n] = dataSkill.skill[skill[n]].skillPrefab;
		player.GetComponent(AttackTrigger).skillAnimation[n] = dataSkill.skill[skill[n]].skillAnimation;
	
		player.GetComponent(AttackTrigger).mainModel.GetComponent.<Animation>()[dataSkill.skill[skill[n]].skillAnimation.name].layer = 16;
	
		player.GetComponent(AttackTrigger).skillIcon[n] = dataSkill.skill[skill[n]].icon;
		n++;
	}

}