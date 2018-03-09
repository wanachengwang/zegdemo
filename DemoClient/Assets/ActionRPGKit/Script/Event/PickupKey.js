#pragma strict
var mainGate : GameObject;
function OnTriggerEnter (other : Collider) {
		//Pick up Item
	if (other.gameObject.tag == "Player") {
 		mainGate.GetComponent(Gate_).key += 1;
 		Destroy(gameObject);
      }
  }