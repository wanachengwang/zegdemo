#pragma strict
private var start : boolean = true;
var skillDistance : float = 4.5;
var skillDelay : float = 5.5;

var skillPrefab : Transform;
var skillAnimation : AnimationClip;

var attackCast : float = 0.3;
var attackDelay : float = 0.5;

function Start () {
		yield WaitForSeconds(1.4);
		var ai : AIset = GetComponent(AIset);
	   while (start == true) {
	   		yield WaitForSeconds(skillDelay);
	   			ai.UseSkill(skillPrefab ,attackCast, attackDelay , skillAnimation.name , skillDistance);
	   		
	   }
	   
}


@script RequireComponent (AIset)