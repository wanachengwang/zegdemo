#pragma strict
private var menu : boolean = false;
private var itemMenu : boolean = true;
private var equipMenu : boolean = false;

var itemSlot : int[] = new int[16];
var itemQuantity : int[] = new int[16];
var equipment : int[] = new int[8];

var weaponEquip : int = 0;
var allowWeaponUnequip : boolean = false;
var armorEquip : int = 0;
var allowArmorUnequip : boolean = true;
var weapon : GameObject[] = new GameObject[1];

var player : GameObject;
var database : GameObject;
var fistPrefab : GameObject;

var cash : int = 500;

private var hover : String = ""; 

function Start () {
		if(!player){
			player = this.gameObject;
		}
	var dataItem : ItemData = database.GetComponent(ItemData);
	//Reset Power of Current Weapon & Armor
	player.GetComponent(Status).addAtk = 0;
	player.GetComponent(Status).addDef = 0;
	player.GetComponent(Status).addMatk = 0;
	player.GetComponent(Status).addMdef = 0;
	player.GetComponent(Status).weaponAtk = 0;
	player.GetComponent(Status).weaponMatk = 0;
	//Set New Variable of Weapon
	player.GetComponent(Status).weaponAtk += dataItem.equipment[weaponEquip].attack;
	player.GetComponent(Status).addDef += dataItem.equipment[weaponEquip].defense;
	player.GetComponent(Status).weaponMatk += dataItem.equipment[weaponEquip].magicAttack;
	player.GetComponent(Status).addMdef += dataItem.equipment[weaponEquip].magicDefense;
	//Set New Variable of Armor
	player.GetComponent(Status).weaponAtk += dataItem.equipment[armorEquip].attack;
	player.GetComponent(Status).addDef += dataItem.equipment[armorEquip].defense;
	player.GetComponent(Status).weaponMatk += dataItem.equipment[armorEquip].magicAttack;
	player.GetComponent(Status).addMdef += dataItem.equipment[armorEquip].magicDefense;
	player.GetComponent(Status).CalculateStatus();

}

function Update () {
	if (Input.GetKeyDown("i") || Input.GetKeyDown(KeyCode.Return) || Input.GetKeyDown(KeyCode.KeypadEnter)) {
		OnOffMenu();
		//AutoSortItem();
	}
}

function UseItem(id : int){
	var dataItem : ItemData = database.GetComponent(ItemData);
	player.GetComponent(Status).Heal(dataItem.usableItem[id].hpRecover , dataItem.usableItem[id].mpRecover);
	player.GetComponent(Status).atk += dataItem.usableItem[id].atkPlus;
	player.GetComponent(Status).def += dataItem.usableItem[id].defPlus;
	player.GetComponent(Status).matk += dataItem.usableItem[id].matkPlus;
	player.GetComponent(Status).mdef += dataItem.usableItem[id].mdefPlus;
	
	AutoSortItem();
	
}

function EquipItem(id : int , slot : int){
	if(id == 0){
		return;
	}
	if(!player){
			player = this.gameObject;
		}
	var dataItem : ItemData = database.GetComponent(ItemData);
	//Backup Your Current Equipment before Unequip
	var tempEquipment : int = 0;
	
	if(dataItem.equipment[id].EquipmentType == dataItem.equipment[id].EqType.Weapon){
		//Weapon Type
		tempEquipment = weaponEquip;
		weaponEquip = id;
		if(dataItem.equipment[id].attackPrefab){
			player.GetComponent(AttackTrigger).attackPrefab = dataItem.equipment[id].attackPrefab.transform;
		}
		//Change Weapon Mesh
	if(dataItem.equipment[id].model && weapon){
		var allWeapon : int = weapon.length;
		var a : int = 0;
		if(allWeapon > 0 && dataItem.equipment[id].assignAllWeapon){
			while(a < allWeapon && weapon[a]){
					weapon[a].SetActiveRecursively(true);
				    var wea : GameObject = Instantiate(dataItem.equipment[id].model,weapon[a].transform.position,weapon[a].transform.rotation);
   					wea.transform.parent = weapon[a].transform.parent;
  					Destroy(weapon[a].gameObject);
  					weapon[a] = wea;
				a++;
			}
		}else if(allWeapon > 0){
			while(a < allWeapon && weapon[a]){
				if(a == 0){
					weapon[a].SetActiveRecursively(true);
				    wea = Instantiate(dataItem.equipment[id].model,weapon[a].transform.position,weapon[a].transform.rotation);
   					wea.transform.parent = weapon[a].transform.parent;
  					Destroy(weapon[a].gameObject);
  					weapon[a] = wea;
				}else{
					weapon[a].SetActiveRecursively(false);
				}
				a++;
			}
		}
	}
	}else{
		//Armor Type
		tempEquipment = armorEquip;
		armorEquip = id;
	}
	if(slot <= equipment.Length){
		equipment[slot] = 0;
	}
	//Assign Weapon Animation to PlayerAnimation Script
	AssignWeaponAnimation(id);
	//Reset Power of Current Weapon & Armor
	player.GetComponent(Status).addAtk = 0;
	player.GetComponent(Status).addDef = 0;
	player.GetComponent(Status).addMatk = 0;
	player.GetComponent(Status).addMdef = 0;
	player.GetComponent(Status).weaponAtk = 0;
	player.GetComponent(Status).weaponMatk = 0;
	//Set New Variable of Weapon
	player.GetComponent(Status).weaponAtk += dataItem.equipment[weaponEquip].attack;
	player.GetComponent(Status).addDef += dataItem.equipment[weaponEquip].defense;
	player.GetComponent(Status).weaponMatk += dataItem.equipment[weaponEquip].magicAttack;
	player.GetComponent(Status).addMdef += dataItem.equipment[weaponEquip].magicDefense;
	//Set New Variable of Armor
	player.GetComponent(Status).weaponAtk += dataItem.equipment[armorEquip].attack;
	player.GetComponent(Status).addDef += dataItem.equipment[armorEquip].defense;
	player.GetComponent(Status).weaponMatk += dataItem.equipment[armorEquip].magicAttack;
	player.GetComponent(Status).addMdef += dataItem.equipment[armorEquip].magicDefense;
	
	player.GetComponent(Status).CalculateStatus();
	AutoSortEquipment();
	AddEquipment(tempEquipment);

}

function RemoveWeaponMesh(){
			if(weapon){
				var allWeapon : int = weapon.length;
				var a : int = 0;
				if(allWeapon > 0){
					while(a < allWeapon && weapon[a]){
  							weapon[a].SetActiveRecursively(false);
  							//Destroy(weapon[a].gameObject);
							a++;
					}
				}
			}
}

function UnEquip(id : int){
	var dataItem : ItemData = database.GetComponent(ItemData);
	if(!player){
		player = this.gameObject;
	}
	if(dataItem.equipment[id].model && weapon){
			var full : boolean = AddEquipment(weaponEquip);
	}else{
			full = AddEquipment(armorEquip);
	}
	if(!full){
		if(dataItem.equipment[id].model && weapon){
			weaponEquip = 0;
			player.GetComponent(AttackTrigger).attackPrefab = fistPrefab.transform;
			if(weapon){
				var allWeapon : int = weapon.length;
				var a : int = 0;
				if(allWeapon > 0){
					while(a < allWeapon && weapon[a]){
  							weapon[a].SetActiveRecursively(false);
  							//Destroy(weapon[a].gameObject);
							a++;
					}
				}
			}
		}else{
			armorEquip = 0;
		}
	//Reset Power of Current Weapon & Armor
	player.GetComponent(Status).addAtk = 0;
	player.GetComponent(Status).addDef = 0;
	player.GetComponent(Status).addMatk = 0;
	player.GetComponent(Status).addMdef = 0;
	player.GetComponent(Status).weaponAtk = 0;
	player.GetComponent(Status).weaponMatk = 0;
	//Set New Variable of Weapon
	player.GetComponent(Status).weaponAtk += dataItem.equipment[weaponEquip].attack;
	player.GetComponent(Status).addDef += dataItem.equipment[weaponEquip].defense;
	player.GetComponent(Status).weaponMatk += dataItem.equipment[weaponEquip].magicAttack;
	player.GetComponent(Status).addMdef += dataItem.equipment[weaponEquip].magicDefense;
	//Set New Variable of Armor
	player.GetComponent(Status).weaponAtk += dataItem.equipment[armorEquip].attack;
	player.GetComponent(Status).addDef += dataItem.equipment[armorEquip].defense;
	player.GetComponent(Status).weaponMatk += dataItem.equipment[armorEquip].magicAttack;
	player.GetComponent(Status).addMdef += dataItem.equipment[armorEquip].magicDefense;
    	} 
}

function OnGUI(){
	var dataItem : ItemData = database.GetComponent(ItemData);
	if(menu && itemMenu){
		GUI.Box (Rect (260,140,280,385), "Items");
		//Close Window Button
		if (GUI.Button (Rect (490,142,30,30), "X")) {
			OnOffMenu();
		}
		//GUI.Box (Rect (280,170,240,30), GUI.tooltip);
		//GUI.Box (Rect (280,205,240,30), "Recover 30 HP");
		//Items Slot
		if (GUI.Button (Rect (290,255,50,50), GUIContent (dataItem.usableItem[itemSlot[0]].icon, dataItem.usableItem[itemSlot[0]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[0]].description ))){
			UseItem(itemSlot[0]);
			if(itemQuantity[0] > 0){
				itemQuantity[0]--;
			}
			if(itemQuantity[0] <= 0){
				itemSlot[0] = 0;
				itemQuantity[0] = 0;
				AutoSortItem();
			}
		}
		if(itemQuantity[0] > 0){
			GUI.Label (Rect (330, 290, 20, 20), itemQuantity[0].ToString()); //Quantity
		}
		
		if (GUI.Button (Rect (350,255,50,50), GUIContent (dataItem.usableItem[itemSlot[1]].icon, dataItem.usableItem[itemSlot[1]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[1]].description ))){
			UseItem(itemSlot[1]);
			if(itemQuantity[1] > 0){
				itemQuantity[1]--;
			}
			if(itemQuantity[1] <= 0){
				itemSlot[1] = 0;
				itemQuantity[1] = 0;
				AutoSortItem();
			}
		}
		if(itemQuantity[1] > 0){
			GUI.Label (Rect (390, 290, 20, 20), itemQuantity[1].ToString()); //Quantity
		}
		
		if (GUI.Button (Rect (410,255,50,50), GUIContent (dataItem.usableItem[itemSlot[2]].icon, dataItem.usableItem[itemSlot[2]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[2]].description ))){
			UseItem(itemSlot[2]);
			if(itemQuantity[2] > 0){
				itemQuantity[2]--;
			}
			if(itemQuantity[2] <= 0){
				itemSlot[2] = 0;
				itemQuantity[2] = 0;
				AutoSortItem();
			}
		}
		if(itemQuantity[2] > 0){
			GUI.Label (Rect (450, 290, 20, 20), itemQuantity[2].ToString()); //Quantity
		}
		
		if (GUI.Button (Rect (470,255,50,50), GUIContent (dataItem.usableItem[itemSlot[3]].icon, dataItem.usableItem[itemSlot[3]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[3]].description ))){
			UseItem(itemSlot[3]);
			if(itemQuantity[3] > 0){
				itemQuantity[3]--;
			}
			if(itemQuantity[3] <= 0){
				itemSlot[3] = 0;
				itemQuantity[3] = 0;
				AutoSortItem();
			}
		}
		if(itemQuantity[3] > 0){
			GUI.Label (Rect (510, 290, 20, 20), itemQuantity[3].ToString()); //Quantity
		}
		
		//-----------------------------
		if (GUI.Button (Rect (290,315,50,50), GUIContent (dataItem.usableItem[itemSlot[4]].icon, dataItem.usableItem[itemSlot[4]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[4]].description ))){
			UseItem(itemSlot[4]);
			if(itemQuantity[4] > 0){
				itemQuantity[4]--;
			}
			if(itemQuantity[4] <= 0){
				itemSlot[4] = 0;
				itemQuantity[4] = 0;
				AutoSortItem();
			}
		}
		if(itemQuantity[4] > 0){
			GUI.Label (Rect (330, 350, 20, 20), itemQuantity[4].ToString()); //Quantity
		}
		
		if (GUI.Button (Rect (350,315,50,50), GUIContent (dataItem.usableItem[itemSlot[5]].icon, dataItem.usableItem[itemSlot[5]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[5]].description ))){
			UseItem(itemSlot[5]);
			if(itemQuantity[5] > 0){
				itemQuantity[5]--;
			}
			if(itemQuantity[5] <= 0){
				itemSlot[5] = 0;
				itemQuantity[5] = 0;
				AutoSortItem();
			}
		}
		if(itemQuantity[5] > 0){
			GUI.Label (Rect (390, 350, 20, 20), itemQuantity[5].ToString()); //Quantity
		}
		
		if (GUI.Button (Rect (410,315,50,50), GUIContent (dataItem.usableItem[itemSlot[6]].icon, dataItem.usableItem[itemSlot[6]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[6]].description ))){
			UseItem(itemSlot[6]);
			if(itemQuantity[6] > 0){
				itemQuantity[6]--;
			}
			if(itemQuantity[6] <= 0){
				itemSlot[6] = 0;
				itemQuantity[6] = 0;
				AutoSortItem();
			}
		}
		if(itemQuantity[6] > 0){
			GUI.Label (Rect (450, 350, 20, 20), itemQuantity[6].ToString()); //Quantity
		}
		
		if (GUI.Button (Rect (470,315,50,50), GUIContent (dataItem.usableItem[itemSlot[7]].icon, dataItem.usableItem[itemSlot[7]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[7]].description ))){
			UseItem(itemSlot[7]);
			if(itemQuantity[7] > 0){
				itemQuantity[7]--;
			}
			if(itemQuantity[7] <= 0){
				itemSlot[7] = 0;
				itemQuantity[7] = 0;
				AutoSortItem();
			}
		}
		if(itemQuantity[7] > 0){
			GUI.Label (Rect (510, 350, 20, 20), itemQuantity[7].ToString()); //Quantity
		}
		//-----------------------------
		if (GUI.Button (Rect (290,375,50,50), GUIContent (dataItem.usableItem[itemSlot[8]].icon, dataItem.usableItem[itemSlot[8]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[8]].description ))){
			UseItem(itemSlot[8]);
			if(itemQuantity[8] > 0){
				itemQuantity[8]--;
			}
			if(itemQuantity[8] <= 0){
				itemSlot[8] = 0;
				itemQuantity[8] = 0;
				AutoSortItem();
			}
		}
		if(itemQuantity[8] > 0){
			GUI.Label (Rect (330, 410, 20, 20), itemQuantity[8].ToString()); //Quantity
		}
		
		if (GUI.Button (Rect (350,375,50,50), GUIContent (dataItem.usableItem[itemSlot[9]].icon, dataItem.usableItem[itemSlot[9]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[9]].description ))){
			UseItem(itemSlot[9]);
			if(itemQuantity[9] > 0){
				itemQuantity[9]--;
			}
			if(itemQuantity[9] <= 0){
				itemSlot[9] = 0;
				itemQuantity[9] = 0;
				AutoSortItem();
			}
		}
		if(itemQuantity[9] > 0){
			GUI.Label (Rect (390, 410, 20, 20), itemQuantity[9].ToString()); //Quantity
		}
		
		if (GUI.Button (Rect (410,375,50,50), GUIContent (dataItem.usableItem[itemSlot[10]].icon, dataItem.usableItem[itemSlot[10]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[10]].description ))){
			UseItem(itemSlot[10]);
			if(itemQuantity[10] > 0){
				itemQuantity[10]--;
			}
			if(itemQuantity[10] <= 0){
				itemSlot[10] = 0;
				itemQuantity[10] = 0;
				AutoSortItem();
			}
		}
		if(itemQuantity[10] > 0){
			GUI.Label (Rect (450, 410, 20, 20), itemQuantity[10].ToString()); //Quantity
		}
		
		if (GUI.Button (Rect (470,375,50,50), GUIContent (dataItem.usableItem[itemSlot[11]].icon, dataItem.usableItem[itemSlot[11]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[11]].description ))){
			UseItem(itemSlot[11]);
			if(itemQuantity[11] > 0){
				itemQuantity[11]--;
			}
			if(itemQuantity[11] <= 0){
				itemSlot[11] = 0;
				itemQuantity[11] = 0;
				AutoSortItem();
			}
		}
		if(itemQuantity[11] > 0){
			GUI.Label (Rect (510, 410, 20, 20), itemQuantity[11].ToString()); //Quantity
		}
		//-----------------------------
		if (GUI.Button (Rect (290,435,50,50), GUIContent (dataItem.usableItem[itemSlot[12]].icon, dataItem.usableItem[itemSlot[12]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[12]].description ))){
			UseItem(itemSlot[12]);
			if(itemQuantity[12] > 0){
				itemQuantity[12]--;
			}
			if(itemQuantity[12] <= 0){
				itemSlot[12] = 0;
				itemQuantity[12] = 0;
				AutoSortItem();
			}
		}
		if(itemQuantity[12] > 0){
			GUI.Label (Rect (330, 470, 20, 20), itemQuantity[12].ToString()); //Quantity
		}
		
		if (GUI.Button (Rect (350,435,50,50), GUIContent (dataItem.usableItem[itemSlot[13]].icon, dataItem.usableItem[itemSlot[13]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[13]].description ))){
			UseItem(itemSlot[13]);
			if(itemQuantity[13] > 0){
				itemQuantity[13]--;
			}
			if(itemQuantity[13] <= 0){
				itemSlot[13] = 0;
				itemQuantity[13] = 0;
				AutoSortItem();
			}
		}
		if(itemQuantity[13] > 0){
			GUI.Label (Rect (390, 470, 20, 20), itemQuantity[13].ToString()); //Quantity
		}
		
		if (GUI.Button (Rect (410,435,50,50), GUIContent (dataItem.usableItem[itemSlot[14]].icon, dataItem.usableItem[itemSlot[14]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[14]].description ))){
			UseItem(itemSlot[14]);
			if(itemQuantity[14] > 0){
				itemQuantity[14]--;
			}
			if(itemQuantity[14] <= 0){
				itemSlot[14] = 0;
				itemQuantity[14] = 0;
				AutoSortItem();
			}
		}
		if(itemQuantity[14] > 0){
			GUI.Label (Rect (450, 470, 20, 20), itemQuantity[14].ToString()); //Quantity
		}
		
		if (GUI.Button (Rect (470,435,50,50), GUIContent (dataItem.usableItem[itemSlot[15]].icon, dataItem.usableItem[itemSlot[15]].itemName + "\n" + "\n" + dataItem.usableItem[itemSlot[15]].description ))){
			UseItem(itemSlot[15]);
			if(itemQuantity[15] > 0){
				itemQuantity[15]--;
			}
			if(itemQuantity[15] <= 0){
				itemSlot[15] = 0;
				itemQuantity[15] = 0;
				AutoSortItem();
			}
			
		}
		if(itemQuantity[15] > 0){
			GUI.Label (Rect (510, 470, 20, 20), itemQuantity[15].ToString()); //Quantity
		}
		GUI.Box (Rect (280,170,240,60), GUI.tooltip);
		//-----------------------------
		GUI.Label (Rect (280, 495, 150, 50), "$ " + cash.ToString());
		
		if (GUI.Button (Rect (210,245,50,100), "Item")) {
			//Switch to Item Tab
		}
		if (GUI.Button (Rect (210,365,50,100), "Equip")) {
			//Switch to Equipment Tab
			equipMenu = true;
			itemMenu = false;	
		}
		
	}
	
	//---------------Equipment Tab----------------------------
	if(menu && equipMenu){
		GUI.Box (Rect (260,140,280,385), "Equipment");
		//Close Window Button
		if (GUI.Button (Rect (490,142,30,30), "X")) {
			OnOffMenu();
		}
		//Item Name
		if (GUI.Button (Rect (210,245,50,100), "Item")) {
			//Switch to Item Tab
			itemMenu = true;
			equipMenu = false;
		}
		if (GUI.Button (Rect (210,365,50,100), "Equip")) {
			//Switch to Equipment Tab
		}
		GUI.Label (Rect (280, 495, 150, 50), "$ " + cash.ToString());
		
		//Weapon
		GUI.Label (Rect (280, 270, 150, 50), "Weapon");			
		if (GUI.Button (Rect (360,255,50,50), GUIContent (dataItem.equipment[weaponEquip].icon, dataItem.equipment[weaponEquip].itemName + "\n" + "\n" + dataItem.equipment[weaponEquip].description ))){
			if(!allowWeaponUnequip || weaponEquip == 0){
				return;
			}
			UnEquip(weaponEquip);
		}
		//Armor
		GUI.Label (Rect (280, 330, 150, 50), "Armor");
		if (GUI.Button (Rect (360,315,50,50), GUIContent (dataItem.equipment[armorEquip].icon, dataItem.equipment[armorEquip].itemName + "\n" + "\n" + dataItem.equipment[armorEquip].description ))){
			if(!allowArmorUnequip || armorEquip == 0){
				return;
			}
			UnEquip(armorEquip);
			
		}
		
		
		//--------Equipment Slot---------
		if (GUI.Button (Rect (290,375,50,50), GUIContent (dataItem.equipment[equipment[0]].icon, dataItem.equipment[equipment[0]].itemName + "\n" + "\n" + dataItem.equipment[equipment[0]].description ))){
			EquipItem(equipment[0] , 0);
		}
		
		if (GUI.Button (Rect (350,375,50,50), GUIContent (dataItem.equipment[equipment[1]].icon, dataItem.equipment[equipment[1]].itemName + "\n" + "\n" + dataItem.equipment[equipment[1]].description ))){
			EquipItem(equipment[1] , 1);
		}
		
		if (GUI.Button (Rect (410,375,50,50), GUIContent (dataItem.equipment[equipment[2]].icon, dataItem.equipment[equipment[2]].itemName + "\n" + "\n" + dataItem.equipment[equipment[2]].description ))){
			EquipItem(equipment[2] , 2);
		}
		
		if (GUI.Button (Rect (470,375,50,50), GUIContent (dataItem.equipment[equipment[3]].icon, dataItem.equipment[equipment[3]].itemName + "\n" + "\n" + dataItem.equipment[equipment[3]].description ))){
			EquipItem(equipment[3] , 3);
		}
		//-----------------------------
		if (GUI.Button (Rect (290,435,50,50), GUIContent (dataItem.equipment[equipment[4]].icon, dataItem.equipment[equipment[4]].itemName + "\n" + "\n" + dataItem.equipment[equipment[4]].description ))){
			EquipItem(equipment[4] , 4);
		}
		
		if (GUI.Button (Rect (350,435,50,50), GUIContent (dataItem.equipment[equipment[5]].icon, dataItem.equipment[equipment[5]].itemName + "\n" + "\n" + dataItem.equipment[equipment[5]].description ))){
			EquipItem(equipment[5] , 5);
		}
		
		if (GUI.Button (Rect (410,435,50,50), GUIContent (dataItem.equipment[equipment[6]].icon, dataItem.equipment[equipment[6]].itemName + "\n" + "\n" + dataItem.equipment[equipment[6]].description ))){
			EquipItem(equipment[6] , 6);
		}
		
		if (GUI.Button (Rect (470,435,50,50), GUIContent (dataItem.equipment[equipment[7]].icon, dataItem.equipment[equipment[7]].itemName + "\n" + "\n" + dataItem.equipment[equipment[7]].description ))){
			EquipItem(equipment[7] , 7);
		}
		GUI.Box (Rect (280,170,240,60), GUI.tooltip);
	
	}
	hover = GUI.tooltip;
}

function AddItem(id : int,quan : int) : boolean{
	var full : boolean = false;
	var geta : boolean = false;
		
	var pt : int = 0;
	while(pt < itemSlot.Length && !geta){
		if(itemSlot[pt] == id){
			itemQuantity[pt] += quan;
			geta = true;
		}else if(itemSlot[pt] == 0){
			itemSlot[pt] = id;
			itemQuantity[pt] = quan;
			geta = true;
		}else{
			pt++;
			if(pt >= itemSlot.Length){
				full = true;
				print("Full");
			}
		}
		
	}
	
	return full;

}

function AddEquipment(id : int) : boolean{
	var full : boolean = false;
	var geta : boolean = false;
	
	
	var pt : int = 0;
	while(pt < equipment.Length && !geta){
		if(equipment[pt] == 0){
			equipment[pt] = id;
			geta = true;
		}else{
			pt++;
			if(pt >= equipment.Length){
				full = true;
				print("Full");
			}
		}
		
	}
	
	return full;

}
//------------AutoSort----------
function AutoSortItem(){
		var pt : int = 0;
		var nextp : int = 0;
		var clearr : boolean = false;
	while(pt < itemSlot.Length){
		if(itemSlot[pt] == 0){
			nextp = pt + 1;
			while(nextp < itemSlot.Length && !clearr){
				if(itemSlot[nextp] > 0){
				//Fine Next Item and Set
					itemSlot[pt] = itemSlot[nextp];
					itemQuantity[pt] = itemQuantity[nextp];
					itemSlot[nextp] = 0;
					itemQuantity[nextp] = 0;
					clearr = true;
				}else{
					nextp++;
				}
			
			}
		//Continue New Loop
			clearr = false;
			pt++;
		}else{
			pt++;
		}
		
	}

}

function AutoSortEquipment(){
		var pt : int = 0;
		var nextp : int = 0;
		var clearr : boolean = false;
	while(pt < equipment.Length){
		if(equipment[pt] == 0){
			nextp = pt + 1;
			while(nextp < equipment.Length && !clearr){
				if(equipment[nextp] > 0){
				//Fine Next Item and Set
					equipment[pt] = equipment[nextp];
					equipment[nextp] = 0;
					clearr = true;
				}else{
					nextp++;
				}
			
			}
		//Continue New Loop
			clearr = false;
			pt++;
		}else{
			pt++;
		}
		
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

function AssignWeaponAnimation(id : int){
	var dataItem : ItemData = database.GetComponent(ItemData);
	var playerAnim : PlayerAnimation = player.GetComponent(PlayerAnimation);
	
	//Assign All Attack Combo Animation of the weapon from Database
	if(dataItem.equipment[id].attackCombo && dataItem.equipment[id].EquipmentType == dataItem.equipment[id].EqType.Weapon){
  			var allPrefab : int = dataItem.equipment[id].attackCombo.length;
  			player.GetComponent(AttackTrigger).attackCombo = new AnimationClip[allPrefab];
  
  			var a : int = 0;
  			if(allPrefab > 0){
   				while(a < allPrefab){
    				player.GetComponent(AttackTrigger).attackCombo[a] = dataItem.equipment[id].attackCombo[a];
    				player.GetComponent(AttackTrigger).mainModel.GetComponent.<Animation>()[dataItem.equipment[id].attackCombo[a].name].layer = 15;
    				a++;
   				}
  			}
  			player.GetComponent(AttackTrigger).whileAttack = parseInt(dataItem.equipment[id].whileAttack);
  			//Assign Attack Speed
  			player.GetComponent(AttackTrigger).attackSpeed = dataItem.equipment[id].attackSpeed;
  			player.GetComponent(AttackTrigger).atkDelay1 = dataItem.equipment[id].attackDelay;
 		}
		
	if(dataItem.equipment[id].idleAnimation){
		player.GetComponent(PlayerAnimation).idle = dataItem.equipment[id].idleAnimation;
	}
	if(dataItem.equipment[id].runAnimation){
		playerAnim.run = dataItem.equipment[id].runAnimation;
	}
	if(dataItem.equipment[id].rightAnimation){
		playerAnim.right = dataItem.equipment[id].rightAnimation;
	}
	if(dataItem.equipment[id].leftAnimation){
		playerAnim.left = dataItem.equipment[id].leftAnimation;
	}
	if(dataItem.equipment[id].backAnimation){
		playerAnim.back = dataItem.equipment[id].backAnimation;
	}
	if(dataItem.equipment[id].jumpAnimation){
		player.GetComponent(PlayerAnimation).jump = dataItem.equipment[id].jumpAnimation;
	}
	playerAnim.AnimationSpeedSet();

}