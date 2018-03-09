#pragma strict
var target : Transform;

function Start () {
	if(!target){
		yield WaitForSeconds(0.1);
    	target = GameObject.FindWithTag ("Player").transform;
    }

}

function Update () {
	if(!target){
    	return;
    }
  	transform.position = new Vector3(target.position.x ,transform.position.y ,target.position.z);
}

function FindTarget(){
	if(target){
		return;
	}
	var newTarget : Transform = GameObject.FindWithTag ("Player").transform;
	if(newTarget){
			target = newTarget;
	}
}