﻿using UnityEngine;
using System.Collections;

public class SaveLoadC : MonoBehaviour {
	public bool  autoLoad = false;
	public GameObject player;
	private bool  menu = false;
	private Vector3 lastPosition;
	private Transform mainCam;
	public GameObject oldPlayer;
	
	void  Start (){
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
	
	void  Update (){
		if (Input.GetKeyDown(KeyCode.Escape)) {
			//Open Save Load Menu
			OnOffMenu();
		}
		
	}
	
	void  OnOffMenu (){
		//Freeze Time Scale to 0 if Window is Showing
		if(!menu && Time.timeScale != 0.0f){
			menu = true;
			Time.timeScale = 0.0f;
			Screen.lockCursor = false;
		}else if(menu){
			menu = false;
			Time.timeScale = 1.0f;
			Screen.lockCursor = true;
		}
	}
	
	void  OnGUI (){
		if(menu){
			GUI.Box ( new Rect(Screen.width / 2 - 110,230,220,200), "Menu");
			if (GUI.Button ( new Rect(Screen.width / 2 - 45,285,90,40), "Save Game")) {
				SaveData();
				OnOffMenu();
			}
			
			if (GUI.Button ( new Rect(Screen.width / 2 - 45,365,90,40), "Load Game")) {
				LoadData();
				OnOffMenu();
			}
			
			if (GUI.Button ( new Rect(Screen.width / 2 + 55,235,30,30), "X")) {
				OnOffMenu();
			}
		}
		
	}
	
	
	void  SaveData (){
		PlayerPrefs.SetInt("PreviousSave", 10);
		PlayerPrefs.SetFloat("PlayerX", player.transform.position.x);
		PlayerPrefs.SetFloat("PlayerY", player.transform.position.y);
		PlayerPrefs.SetFloat("PlayerZ", player.transform.position.z);
		PlayerPrefs.SetInt("PlayerLevel", player.GetComponent<StatusC>().level);
		PlayerPrefs.SetInt("PlayerATK", player.GetComponent<StatusC>().atk);
		PlayerPrefs.SetInt("PlayerDEF", player.GetComponent<StatusC>().def);
		PlayerPrefs.SetInt("PlayerMATK", player.GetComponent<StatusC>().matk);
		PlayerPrefs.SetInt("PlayerMDEF", player.GetComponent<StatusC>().mdef);
		PlayerPrefs.SetInt("PlayerEXP", player.GetComponent<StatusC>().exp);
		PlayerPrefs.SetInt("PlayerMaxEXP", player.GetComponent<StatusC>().maxExp);
		PlayerPrefs.SetInt("PlayerMaxHP", player.GetComponent<StatusC>().maxHealth);
		PlayerPrefs.SetInt("PlayerHP", player.GetComponent<StatusC>().health);
		PlayerPrefs.SetInt("PlayerMaxMP", player.GetComponent<StatusC>().maxMana);
		//	PlayerPrefs.SetInt("PlayerMP", player.GetComponent<StatusC>().mana);
		PlayerPrefs.SetInt("PlayerSTP", player.GetComponent<StatusC>().statusPoint);
		
		PlayerPrefs.SetInt("Cash", player.GetComponent<InventoryC>().cash);
		int itemSize = player.GetComponent<InventoryC>().itemSlot.Length;
		int a = 0;
		if(itemSize > 0){
			while(a < itemSize){
				PlayerPrefs.SetInt("Item" + a.ToString(), player.GetComponent<InventoryC>().itemSlot[a]);
				PlayerPrefs.SetInt("ItemQty" + a.ToString(), player.GetComponent<InventoryC>().itemQuantity[a]);
				a++;
			}
		}
		
		int equipSize = player.GetComponent<InventoryC>().equipment.Length;
		a = 0;
		if(equipSize > 0){
			while(a < equipSize){
				PlayerPrefs.SetInt("Equipm" + a.ToString(), player.GetComponent<InventoryC>().equipment[a]);
				a++;
			}
		}
		PlayerPrefs.SetInt("WeaEquip", player.GetComponent<InventoryC>().weaponEquip);
		PlayerPrefs.SetInt("ArmoEquip", player.GetComponent<InventoryC>().armorEquip);
		//Save Quest
		int questSize = player.GetComponent<QuestStatC>().questProgress.Length;
		PlayerPrefs.SetInt("QuestSize", questSize);
		a = 0;
		if(questSize > 0){
			while(a < questSize){
				PlayerPrefs.SetInt("Questp" + a.ToString(), player.GetComponent<QuestStatC>().questProgress[a]);
				a++;
			}
		}
		int questSlotSize = player.GetComponent<QuestStatC>().questSlot.Length;
		PlayerPrefs.SetInt("QuestSlotSize", questSlotSize);
		a = 0;
		if(questSlotSize > 0){
			while(a < questSlotSize){
				PlayerPrefs.SetInt("Questslot" + a.ToString(), player.GetComponent<QuestStatC>().questSlot[a]);
				a++;
			}
		}
		//Save Skill Slot
		a = 0;
		while(a <= 2){
			PlayerPrefs.SetInt("Skill" + a.ToString(), player.GetComponent<SkillWindowC>().skill[a]);
			a++;
		}
		
		print("Saved");
	}
	
	
	void  LoadData (){
		//oldPlayer = GameObject.FindWithTag ("Player");
		GameObject respawn = GameObject.FindWithTag ("Player");
		
		lastPosition.x = PlayerPrefs.GetFloat("PlayerX");
		lastPosition.y = PlayerPrefs.GetFloat("PlayerY");
		lastPosition.z = PlayerPrefs.GetFloat("PlayerZ");
		respawn.transform.position = lastPosition;
		//GameObject respawn = Instantiate(player, lastPosition , transform.rotation) as GameObject;
		respawn.GetComponent<StatusC>().level = PlayerPrefs.GetInt("PlayerLevel");
		respawn.GetComponent<StatusC>().atk = PlayerPrefs.GetInt("PlayerATK");
		respawn.GetComponent<StatusC>().def = PlayerPrefs.GetInt("PlayerDEF");
		respawn.GetComponent<StatusC>().matk = PlayerPrefs.GetInt("PlayerMATK");
		respawn.GetComponent<StatusC>().mdef = PlayerPrefs.GetInt("PlayerMDEF");
		respawn.GetComponent<StatusC>().mdef = PlayerPrefs.GetInt("PlayerMDEF");
		respawn.GetComponent<StatusC>().exp = PlayerPrefs.GetInt("PlayerEXP");
		respawn.GetComponent<StatusC>().maxExp = PlayerPrefs.GetInt("PlayerMaxEXP");
		respawn.GetComponent<StatusC>().maxHealth = PlayerPrefs.GetInt("PlayerMaxHP");
		respawn.GetComponent<StatusC>().health = PlayerPrefs.GetInt("PlayerHP");
		//respawn.GetComponent<StatusC>().health = PlayerPrefs.GetInt("PlayerMaxHP");
		respawn.GetComponent<StatusC>().maxMana = PlayerPrefs.GetInt("PlayerMaxMP");
		respawn.GetComponent<StatusC>().mana = PlayerPrefs.GetInt("PlayerMaxMP");	
		respawn.GetComponent<StatusC>().statusPoint = PlayerPrefs.GetInt("PlayerSTP");
		mainCam = GameObject.FindWithTag ("MainCamera").transform;
		mainCam.GetComponent<ARPGcameraC>().target = respawn.transform;
		//-------------------------------
		respawn.GetComponent<InventoryC>().cash = PlayerPrefs.GetInt("Cash");
		int itemSize = player.GetComponent<InventoryC>().itemSlot.Length;
		int a = 0;
		if(itemSize > 0){
			while(a < itemSize){
				respawn.GetComponent<InventoryC>().itemSlot[a] = PlayerPrefs.GetInt("Item" + a.ToString());
				respawn.GetComponent<InventoryC>().itemQuantity[a] = PlayerPrefs.GetInt("ItemQty" + a.ToString());
				//-------
				a++;
			}
		}
		
		int equipSize = player.GetComponent<InventoryC>().equipment.Length;
		a = 0;
		if(equipSize > 0){
			while(a < equipSize){
				respawn.GetComponent<InventoryC>().equipment[a] = PlayerPrefs.GetInt("Equipm" + a.ToString());
				a++;
			}
		}
		respawn.GetComponent<InventoryC>().weaponEquip = 0;
		respawn.GetComponent<InventoryC>().armorEquip = PlayerPrefs.GetInt("ArmoEquip");
		if(PlayerPrefs.GetInt("WeaEquip") == 0){
			respawn.GetComponent<InventoryC>().RemoveWeaponMesh();
		}else{
			respawn.GetComponent<InventoryC>().EquipItem(PlayerPrefs.GetInt("WeaEquip") , respawn.GetComponent<InventoryC>().equipment.Length + 5);
		}
		//----------------------------------
		Screen.lockCursor = true;
		
		GameObject[] mon; 
		mon = GameObject.FindGameObjectsWithTag("Enemy"); 
		foreach(GameObject mo in mon) { 
			if(mo){
				mo.GetComponent<AIsetC>().followTarget = respawn.transform;
			}
		}
		
		//Load Quest
		respawn.GetComponent<QuestStatC>().questProgress = new int[PlayerPrefs.GetInt("QuestSize")];
		int questSize = respawn.GetComponent<QuestStatC>().questProgress.Length;
		a = 0;
		if(questSize > 0){
			while(a < questSize){
				respawn.GetComponent<QuestStatC>().questProgress[a] = PlayerPrefs.GetInt("Questp" + a.ToString());
				a++;
			}
		}
		
		respawn.GetComponent<QuestStatC>().questSlot = new int[PlayerPrefs.GetInt("QuestSlotSize")];
		int questSlotSize = respawn.GetComponent<QuestStatC>().questSlot.Length;
		a = 0;
		if(questSlotSize > 0){
			while(a < questSlotSize){
				respawn.GetComponent<QuestStatC>().questSlot[a] = PlayerPrefs.GetInt("Questslot" + a.ToString());
				a++;
			}
		}
		
		//Load Skill Slot
		a = 0;
		while(a <= 2){
			respawn.GetComponent<SkillWindowC>().skill[a] = PlayerPrefs.GetInt("Skill" + a.ToString());
			a++;
		}
		respawn.GetComponent<SkillWindowC>().AssignAllSkill();
		//---------------Set Target to Minimap--------------
		GameObject minimap = GameObject.FindWithTag("Minimap");
		if(minimap){
			GameObject mapcam = minimap.GetComponent<MinimapOnOffC>().minimapCam;
			mapcam.GetComponent<MinimapCameraC>().target = respawn.transform;
		}
		
		player = GameObject.FindWithTag ("Player");
		/*if(oldPlayer){
			Destroy(gameObject);
		}*/
	}
	
	//Function LoadGame is unlike the Function LoadData.
	//This Function will not spawn new Player.
	void  LoadGame (){
		player.GetComponent<StatusC>().level = PlayerPrefs.GetInt("PlayerLevel");
		player.GetComponent<StatusC>().atk = PlayerPrefs.GetInt("PlayerATK");
		player.GetComponent<StatusC>().def = PlayerPrefs.GetInt("PlayerDEF");
		player.GetComponent<StatusC>().matk = PlayerPrefs.GetInt("PlayerMATK");
		player.GetComponent<StatusC>().mdef = PlayerPrefs.GetInt("PlayerMDEF");
		player.GetComponent<StatusC>().mdef = PlayerPrefs.GetInt("PlayerMDEF");
		player.GetComponent<StatusC>().exp = PlayerPrefs.GetInt("PlayerEXP");
		player.GetComponent<StatusC>().maxExp = PlayerPrefs.GetInt("PlayerMaxEXP");
		player.GetComponent<StatusC>().maxHealth = PlayerPrefs.GetInt("PlayerMaxHP");
		player.GetComponent<StatusC>().health = PlayerPrefs.GetInt("PlayerMaxHP");
		player.GetComponent<StatusC>().maxMana = PlayerPrefs.GetInt("PlayerMaxMP");
		player.GetComponent<StatusC>().mana = PlayerPrefs.GetInt("PlayerMaxMP");	
		player.GetComponent<StatusC>().statusPoint = PlayerPrefs.GetInt("PlayerSTP");
		//mainCam = GameObject.FindWithTag ("MainCamera").transform;
		//mainCam.GetComponent<ARPGcamera>().target = respawn.transform;
		//-------------------------------
		player.GetComponent<InventoryC>().cash = PlayerPrefs.GetInt("Cash");
		int itemSize = player.GetComponent<InventoryC>().itemSlot.Length;
		int a = 0;
		if(itemSize > 0){
			while(a < itemSize){
				player.GetComponent<InventoryC>().itemSlot[a] = PlayerPrefs.GetInt("Item" + a.ToString());
				player.GetComponent<InventoryC>().itemQuantity[a] = PlayerPrefs.GetInt("ItemQty" + a.ToString());
				//-------
				a++;
			}
		}
		
		int equipSize = player.GetComponent<InventoryC>().equipment.Length;
		a = 0;
		if(equipSize > 0){
			while(a < equipSize){
				player.GetComponent<InventoryC>().equipment[a] = PlayerPrefs.GetInt("Equipm" + a.ToString());
				a++;
			}
		}
		player.GetComponent<InventoryC>().weaponEquip = 0;
		player.GetComponent<InventoryC>().armorEquip = PlayerPrefs.GetInt("ArmoEquip");
		if(PlayerPrefs.GetInt("WeaEquip") == 0){
			player.GetComponent<InventoryC>().RemoveWeaponMesh();
		}else{
			player.GetComponent<InventoryC>().EquipItem(PlayerPrefs.GetInt("WeaEquip") , player.GetComponent<InventoryC>().equipment.Length + 5);
		}
		//----------------------------------
		Screen.lockCursor = true;
		
		GameObject[] mon; 
		mon = GameObject.FindGameObjectsWithTag("Enemy"); 
		foreach(GameObject mo in mon) { 
			if(mo){
				mo.GetComponent<AIsetC>().followTarget = player.transform;
			}
		}
		
		//Load Quest
		player.GetComponent<QuestStatC>().questProgress = new int[PlayerPrefs.GetInt("QuestSize")];
		int questSize = player.GetComponent<QuestStatC>().questProgress.Length;
		a = 0;
		if(questSize > 0){
			while(a < questSize){
				player.GetComponent<QuestStatC>().questProgress[a] = PlayerPrefs.GetInt("Questp" + a.ToString());
				a++;
			}
		}
		
		player.GetComponent<QuestStatC>().questSlot = new int[PlayerPrefs.GetInt("QuestSlotSize")];
		int questSlotSize = player.GetComponent<QuestStatC>().questSlot.Length;
		a = 0;
		if(questSlotSize > 0){
			while(a < questSlotSize){
				player.GetComponent<QuestStatC>().questSlot[a] = PlayerPrefs.GetInt("Questslot" + a.ToString());
				a++;
			}
		}
		
		//Load Skill Slot
		a = 0;
		while(a <= 2){
			player.GetComponent<SkillWindowC>().skill[a] = PlayerPrefs.GetInt("Skill" + a.ToString());
			a++;
		}
		player.GetComponent<SkillWindowC>().AssignAllSkill();
		
		print("Loaded");
		
	}
}