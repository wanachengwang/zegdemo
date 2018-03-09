#pragma strict
var autoLoad : boolean = false;
var player : GameObject;
private var menu : boolean = false;
private var lastPosition : Vector3;
private var mainCam : Transform;
var oldPlayer : GameObject;

function Start () {
	 if(!player){
    	player = GameObject.FindWithTag ("Player");
    }
    //If PlayerPrefs Loadgame = 10 That mean You Start with Load Game Menu.
	//If You Set Autoload = true It will LoadGame when you start.
     if(PlayerPrefs.GetInt("Loadgame") == 10 || autoLoad){
   		 LoadGame();
   		 if(!autoLoad){
   			 //If You didn't Set autoLoad then reset PlayerPrefs Loadgame to 0 after LoadGame.
   		 	PlayerPrefs.SetInt("Loadgame", 0);
   		 }
    }

}

function Update () {
	if (Input.GetKeyDown(KeyCode.Escape)) {
		//Open Save Load Menu
		OnOffMenu();
	}

}

function OnOffMenu(){
	//Freeze Time Scale to 0 if Window is Showing
	if(!menu && Time.timeScale != 0.0){
			menu = true;
			Time.timeScale = 0.0;
			Screen.lockCursor = false;
	}else if(menu){
			menu = false;
			Time.timeScale = 1.0;
			Screen.lockCursor = true;
	}
}

function OnGUI(){
	if(menu){
		GUI.Box (Rect (Screen.width / 2 - 110,230,220,200), "Menu");
		if (GUI.Button (Rect (Screen.width / 2 - 45,285,90,40), "Save Game")) {
			SaveData();
			OnOffMenu();
		}
		
		if (GUI.Button (Rect (Screen.width / 2 - 45,365,90,40), "Load Game")) {
			LoadData();
			OnOffMenu();
		}
		
		if (GUI.Button (Rect (Screen.width / 2 + 55,235,30,30), "X")) {
			OnOffMenu();
		}
	}

}


function SaveData(){
			PlayerPrefs.SetInt("PreviousSave", 10);
			PlayerPrefs.SetFloat("PlayerX", player.transform.position.x);
			PlayerPrefs.SetFloat("PlayerY", player.transform.position.y);
			PlayerPrefs.SetFloat("PlayerZ", player.transform.position.z);
			PlayerPrefs.SetInt("PlayerLevel", player.GetComponent(Status).level);
			PlayerPrefs.SetInt("PlayerATK", player.GetComponent(Status).atk);
			PlayerPrefs.SetInt("PlayerDEF", player.GetComponent(Status).def);
			PlayerPrefs.SetInt("PlayerMATK", player.GetComponent(Status).matk);
			PlayerPrefs.SetInt("PlayerMDEF", player.GetComponent(Status).mdef);
			PlayerPrefs.SetInt("PlayerEXP", player.GetComponent(Status).exp);
			PlayerPrefs.SetInt("PlayerMaxEXP", player.GetComponent(Status).maxExp);
			PlayerPrefs.SetInt("PlayerMaxHP", player.GetComponent(Status).maxHealth);
			PlayerPrefs.SetInt("PlayerHP", player.GetComponent(Status).health);
			PlayerPrefs.SetInt("PlayerMaxMP", player.GetComponent(Status).maxMana);
		//	PlayerPrefs.SetInt("PlayerMP", player.GetComponent(Status).mana);
			PlayerPrefs.SetInt("PlayerSTP", player.GetComponent(Status).statusPoint);
			
			PlayerPrefs.SetInt("Cash", player.GetComponent(Inventory).cash);
			var itemSize : int = player.GetComponent(Inventory).itemSlot.length;
			var a : int = 0;
			if(itemSize > 0){
				while(a < itemSize){
					PlayerPrefs.SetInt("Item" + a.ToString(), player.GetComponent(Inventory).itemSlot[a]);
					PlayerPrefs.SetInt("ItemQty" + a.ToString(), player.GetComponent(Inventory).itemQuantity[a]);
					a++;
				}
			}
			
			var equipSize : int = player.GetComponent(Inventory).equipment.length;
			a = 0;
			if(equipSize > 0){
				while(a < equipSize){
					PlayerPrefs.SetInt("Equipm" + a.ToString(), player.GetComponent(Inventory).equipment[a]);
					a++;
				}
			}
			PlayerPrefs.SetInt("WeaEquip", player.GetComponent(Inventory).weaponEquip);
			PlayerPrefs.SetInt("ArmoEquip", player.GetComponent(Inventory).armorEquip);
			//Save Quest
			var questSize : int = player.GetComponent(QuestStat).questProgress.length;
			PlayerPrefs.SetInt("QuestSize", questSize);
			a = 0;
			if(questSize > 0){
				while(a < questSize){
					PlayerPrefs.SetInt("Questp" + a.ToString(), player.GetComponent(QuestStat).questProgress[a]);
					a++;
				}
			}
			var questSlotSize : int = player.GetComponent(QuestStat).questSlot.length;
			PlayerPrefs.SetInt("QuestSlotSize", questSlotSize);
			a = 0;
			if(questSlotSize > 0){
				while(a < questSlotSize){
					PlayerPrefs.SetInt("Questslot" + a.ToString(), player.GetComponent(QuestStat).questSlot[a]);
					a++;
				}
			}
			//Save Skill Slot
			a = 0;
				while(a <= 2){
					PlayerPrefs.SetInt("Skill" + a.ToString(), player.GetComponent(SkillWindow).skill[a]);
					a++;
				}
			
			print("Saved");
}


function LoadData(){
		//oldPlayer = GameObject.FindWithTag ("Player");
		var respawn : GameObject = GameObject.FindWithTag ("Player");
	
		lastPosition.x = PlayerPrefs.GetFloat("PlayerX");
		lastPosition.y = PlayerPrefs.GetFloat("PlayerY");
		lastPosition.z = PlayerPrefs.GetFloat("PlayerZ");
		respawn.transform.position = lastPosition;
		//var respawn : GameObject = Instantiate(player, lastPosition , transform.rotation);
		respawn.GetComponent(Status).level = PlayerPrefs.GetInt("PlayerLevel");
		respawn.GetComponent(Status).atk = PlayerPrefs.GetInt("PlayerATK");
		respawn.GetComponent(Status).def = PlayerPrefs.GetInt("PlayerDEF");
		respawn.GetComponent(Status).matk = PlayerPrefs.GetInt("PlayerMATK");
		respawn.GetComponent(Status).mdef = PlayerPrefs.GetInt("PlayerMDEF");
		respawn.GetComponent(Status).mdef = PlayerPrefs.GetInt("PlayerMDEF");
		respawn.GetComponent(Status).exp = PlayerPrefs.GetInt("PlayerEXP");
		respawn.GetComponent(Status).maxExp = PlayerPrefs.GetInt("PlayerMaxEXP");
		respawn.GetComponent(Status).maxHealth = PlayerPrefs.GetInt("PlayerMaxHP");
		respawn.GetComponent(Status).health = PlayerPrefs.GetInt("PlayerHP");
		//respawn.GetComponent(Status).health = PlayerPrefs.GetInt("PlayerMaxHP");
		respawn.GetComponent(Status).maxMana = PlayerPrefs.GetInt("PlayerMaxMP");
		respawn.GetComponent(Status).mana = PlayerPrefs.GetInt("PlayerMaxMP");	
		respawn.GetComponent(Status).statusPoint = PlayerPrefs.GetInt("PlayerSTP");
		mainCam = GameObject.FindWithTag ("MainCamera").transform;
		mainCam.GetComponent(ARPGcamera).target = respawn.transform;
		//-------------------------------
		respawn.GetComponent(Inventory).cash = PlayerPrefs.GetInt("Cash");
		var itemSize : int = player.GetComponent(Inventory).itemSlot.length;
			var a : int = 0;
			if(itemSize > 0){
				while(a < itemSize){
					respawn.GetComponent(Inventory).itemSlot[a] = PlayerPrefs.GetInt("Item" + a.ToString());
					respawn.GetComponent(Inventory).itemQuantity[a] = PlayerPrefs.GetInt("ItemQty" + a.ToString());
					//-------
					a++;
				}
			}
			
			var equipSize : int = player.GetComponent(Inventory).equipment.length;
			a = 0;
			if(equipSize > 0){
				while(a < equipSize){
					respawn.GetComponent(Inventory).equipment[a] = PlayerPrefs.GetInt("Equipm" + a.ToString());
					a++;
				}
			}
			respawn.GetComponent(Inventory).weaponEquip = 0;
			respawn.GetComponent(Inventory).armorEquip = PlayerPrefs.GetInt("ArmoEquip");
		if(PlayerPrefs.GetInt("WeaEquip") == 0){
			respawn.GetComponent(Inventory).RemoveWeaponMesh();
		}else{
			respawn.GetComponent(Inventory).EquipItem(PlayerPrefs.GetInt("WeaEquip") , respawn.GetComponent(Inventory).equipment.Length + 5);
		}
			//----------------------------------
		Screen.lockCursor = true;
		
		 var mon : GameObject[]; 
  		 mon = GameObject.FindGameObjectsWithTag("Enemy"); 
  			 for (var mo : GameObject in mon) { 
  			 	if(mo){
  			 		mo.GetComponent(AIset).followTarget = respawn.transform;
  			 	}
  			 }
		
		//Load Quest
		respawn.GetComponent(QuestStat).questProgress = new int[PlayerPrefs.GetInt("QuestSize")];
		var questSize : int = respawn.GetComponent(QuestStat).questProgress.length;
			a = 0;
			if(questSize > 0){
				while(a < questSize){
					respawn.GetComponent(QuestStat).questProgress[a] = PlayerPrefs.GetInt("Questp" + a.ToString());
					a++;
				}
			}
			
		respawn.GetComponent(QuestStat).questSlot = new int[PlayerPrefs.GetInt("QuestSlotSize")];
		var questSlotSize : int = respawn.GetComponent(QuestStat).questSlot.length;
			a = 0;
			if(questSlotSize > 0){
				while(a < questSlotSize){
					respawn.GetComponent(QuestStat).questSlot[a] = PlayerPrefs.GetInt("Questslot" + a.ToString());
					a++;
				}
			}
			
			//Load Skill Slot
			a = 0;
			while(a <= 2){
				respawn.GetComponent(SkillWindow).skill[a] = PlayerPrefs.GetInt("Skill" + a.ToString());
				a++;
			}
			respawn.GetComponent(SkillWindow).AssignAllSkill();
		//---------------Set Target to Minimap--------------
  		var minimap : GameObject = GameObject.FindWithTag("Minimap");
  		if(minimap){
  			var mapcam : GameObject = minimap.GetComponent(MinimapOnOff).minimapCam;
  			mapcam.GetComponent(MinimapCamera).target = respawn.transform;
  		}
			
		player = GameObject.FindWithTag ("Player");
		/*if(oldPlayer){
			Destroy(gameObject);
		}*/
}

//Function LoadGame is unlike the Function LoadData.
//This Function will not spawn new Player.
function LoadGame(){
		player.GetComponent(Status).level = PlayerPrefs.GetInt("PlayerLevel");
		player.GetComponent(Status).atk = PlayerPrefs.GetInt("PlayerATK");
		player.GetComponent(Status).def = PlayerPrefs.GetInt("PlayerDEF");
		player.GetComponent(Status).matk = PlayerPrefs.GetInt("PlayerMATK");
		player.GetComponent(Status).mdef = PlayerPrefs.GetInt("PlayerMDEF");
		player.GetComponent(Status).mdef = PlayerPrefs.GetInt("PlayerMDEF");
		player.GetComponent(Status).exp = PlayerPrefs.GetInt("PlayerEXP");
		player.GetComponent(Status).maxExp = PlayerPrefs.GetInt("PlayerMaxEXP");
		player.GetComponent(Status).maxHealth = PlayerPrefs.GetInt("PlayerMaxHP");
		player.GetComponent(Status).health = PlayerPrefs.GetInt("PlayerMaxHP");
		player.GetComponent(Status).maxMana = PlayerPrefs.GetInt("PlayerMaxMP");
		player.GetComponent(Status).mana = PlayerPrefs.GetInt("PlayerMaxMP");	
		player.GetComponent(Status).statusPoint = PlayerPrefs.GetInt("PlayerSTP");
		//mainCam = GameObject.FindWithTag ("MainCamera").transform;
		//mainCam.GetComponent(ARPGcamera).target = respawn.transform;
		//-------------------------------
		player.GetComponent(Inventory).cash = PlayerPrefs.GetInt("Cash");
		var itemSize : int = player.GetComponent(Inventory).itemSlot.length;
			var a : int = 0;
			if(itemSize > 0){
				while(a < itemSize){
					player.GetComponent(Inventory).itemSlot[a] = PlayerPrefs.GetInt("Item" + a.ToString());
					player.GetComponent(Inventory).itemQuantity[a] = PlayerPrefs.GetInt("ItemQty" + a.ToString());
					//-------
					a++;
				}
			}
			
			var equipSize : int = player.GetComponent(Inventory).equipment.length;
			a = 0;
			if(equipSize > 0){
				while(a < equipSize){
					player.GetComponent(Inventory).equipment[a] = PlayerPrefs.GetInt("Equipm" + a.ToString());
					a++;
				}
			}
			player.GetComponent(Inventory).weaponEquip = 0;
			player.GetComponent(Inventory).armorEquip = PlayerPrefs.GetInt("ArmoEquip");
		if(PlayerPrefs.GetInt("WeaEquip") == 0){
			player.GetComponent(Inventory).RemoveWeaponMesh();
		}else{
			player.GetComponent(Inventory).EquipItem(PlayerPrefs.GetInt("WeaEquip") , player.GetComponent(Inventory).equipment.Length + 5);
		}
			//----------------------------------
		Screen.lockCursor = true;
		
		 var mon : GameObject[]; 
  		 mon = GameObject.FindGameObjectsWithTag("Enemy"); 
  			 for (var mo : GameObject in mon) { 
  			 	if(mo){
  			 		mo.GetComponent(AIset).followTarget = player.transform;
  			 	}
  			 }
  		
  		//Load Quest
		player.GetComponent(QuestStat).questProgress = new int[PlayerPrefs.GetInt("QuestSize")];
		var questSize : int = player.GetComponent(QuestStat).questProgress.length;
			a = 0;
			if(questSize > 0){
				while(a < questSize){
					player.GetComponent(QuestStat).questProgress[a] = PlayerPrefs.GetInt("Questp" + a.ToString());
					a++;
				}
			}
			
		player.GetComponent(QuestStat).questSlot = new int[PlayerPrefs.GetInt("QuestSlotSize")];
		var questSlotSize : int = player.GetComponent(QuestStat).questSlot.length;
			a = 0;
			if(questSlotSize > 0){
				while(a < questSlotSize){
					player.GetComponent(QuestStat).questSlot[a] = PlayerPrefs.GetInt("Questslot" + a.ToString());
					a++;
				}
			}
			
			//Load Skill Slot
			a = 0;
			while(a <= 2){
				player.GetComponent(SkillWindow).skill[a] = PlayerPrefs.GetInt("Skill" + a.ToString());
				a++;
			}
			player.GetComponent(SkillWindow).AssignAllSkill();

		print("Loaded");
	
}