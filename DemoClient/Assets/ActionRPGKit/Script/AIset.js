#pragma strict

enum AIState { Moving = 0, Pausing = 1 , Idle = 2 , Patrol = 3}

var mainModel : GameObject;
var followTarget : Transform;
var approachDistance  : float = 2.0f;
var detectRange : float = 15.0f;
var lostSight : float = 100.0f;
var speed  : float = 4.0f;
var movingAnimation : AnimationClip;
var idleAnimation : AnimationClip;
var attackAnimation : AnimationClip;
var hurtAnimation : AnimationClip;

@HideInInspector
var flinch : boolean = false;

var stability : boolean = false;

var freeze : boolean = false;

var bulletPrefab : Transform;
var attackPoint : Transform;

var attackCast : float = 0.3;
var attackDelay : float = 0.5;

private var followState : AIState;
private var distance : float = 0.0;
private var atk : int = 0;
private var matk : int = 0;
private var knock : Vector3 = Vector3.zero;
@HideInInspector
var cancelAttack : boolean = false;
private var attacking : boolean = false;
private var castSkill : boolean = false;
private var gos : GameObject[]; 

function Start () {
	gameObject.tag = "Enemy"; 
/*	if(!followTarget){
		followTarget = FindClosest().transform;
	}*/
	
	if(!attackPoint){
		attackPoint = this.transform;
	}
	
	if(!mainModel){
		mainModel = this.gameObject;
	}
	//Assign MainModel in Status Script
	GetComponent(Status).mainModel = mainModel;
		//Set ATK = Monster's Status
		atk = GetComponent(Status).atk;
		matk = GetComponent(Status).matk;
        
      	followState = AIState.Idle;
      	mainModel.GetComponent.<Animation>().Play(idleAnimation.name);
        mainModel.GetComponent.<Animation>()[hurtAnimation.name].layer = 10;

}

function GetDestination()
    {
        var destination : Vector3 = followTarget.position;
        destination.y = transform.position.y;
        return destination;
    }

function Update () {
	var stat : Status = GetComponent(Status);
	var controller : CharacterController = GetComponent(CharacterController);
	
	gos = GameObject.FindGameObjectsWithTag("Player"); 
    if (gos.Length > 0) {
			followTarget = FindClosest().transform;
	}
	
	if (flinch){
		controller.Move(knock * 6* Time.deltaTime);
		return;
	}
	
	if(freeze || stat.freeze){
		return;
	}

	if(!followTarget){
		return;
	}
	//-----------------------------------
	
		if (followState == AIState.Moving) {
            if ((followTarget.position - transform.position).magnitude <= approachDistance) {
                followState = AIState.Pausing;
                mainModel.GetComponent.<Animation>().CrossFade(idleAnimation.name, 0.2f);
                //----Attack----
                	Attack();
            }else if ((followTarget.position - transform.position).magnitude >= lostSight)
            {//Lost Sight
            	GetComponent(Status).health = GetComponent(Status).maxHealth;
                followState = AIState.Idle;
                mainModel.GetComponent.<Animation>().CrossFade(idleAnimation.name, 0.2f);  
            }else {
                var forward : Vector3 = transform.TransformDirection(Vector3.forward);
     			controller.Move(forward * speed * Time.deltaTime);
     			   
     			   var destiny : Vector3 = followTarget.position;
     			   destiny.y = transform.position.y;
  				   transform.LookAt(destiny);
            }
        }
        else if (followState == AIState.Pausing){
       			 var destinya : Vector3 = followTarget.position;
     			   destinya.y = transform.position.y;
  				   transform.LookAt(destinya);
  				   			   
            distance = (transform.position - GetDestination()).magnitude;
            if (distance > approachDistance) {
                followState = AIState.Moving;
                mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
            }
        }
        //----------------Idle Mode--------------
        else if (followState == AIState.Idle){
  			var destinyheight : Vector3 = followTarget.position;
     			destinyheight.y = transform.position.y - destinyheight.y;
     		var getHealth : int = GetComponent(Status).maxHealth - GetComponent(Status).health;
     			
            distance = (transform.position - GetDestination()).magnitude;
            if (distance < detectRange && Mathf.Abs(destinyheight.y) <= 4 || getHealth > 0){
                followState = AIState.Moving;
                mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
            }
        }
//-----------------------------------
}
    
function Flinch(dir : Vector3){
	if(stability){
		return;
	}
	cancelAttack = true;
	if(followTarget){
			var look : Vector3 = followTarget.position;
     			   look.y = transform.position.y;
  				   transform.LookAt(look);
  		}
	knock = transform.TransformDirection(Vector3.back);
		//knock = dir;
		KnockBack();
		mainModel.GetComponent.<Animation>().PlayQueued(hurtAnimation.name, QueueMode.PlayNow);
		followState = AIState.Moving;
		mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
	
}

function KnockBack(){
	flinch = true;
	yield WaitForSeconds(0.2);
	flinch = false;
}

function Attack(){
	cancelAttack = false;
	if(flinch || GetComponent(Status).freeze || freeze || attacking){
		return;
	}
		freeze = true;
		attacking = true;
		mainModel.GetComponent.<Animation>().Play(attackAnimation.name);
		yield WaitForSeconds(attackCast);
		if(flinch){
			freeze = false;
			attacking = false;
			return;
		}
		//attackPoint.transform.LookAt(followTarget);
		if(!cancelAttack){
			var bulletShootout : Transform = Instantiate(bulletPrefab, attackPoint.transform.position , attackPoint.transform.rotation);
			bulletShootout.GetComponent(BulletStatus).Setting(atk , matk , "Enemy" , this.gameObject);
		}

		yield WaitForSeconds(attackDelay);
		freeze = false;
		attacking = false;
		mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
		CheckDistance();
	
}

function CheckDistance(){
	if(!followTarget){
		mainModel.GetComponent.<Animation>().CrossFade(idleAnimation.name, 0.2f);  
		followState = AIState.Idle;
		return;
	}
	var distancea : float = (followTarget.position - transform.position).magnitude;
	if (distancea <= approachDistance){
			var destinya : Vector3 = followTarget.position;
     		 destinya.y = transform.position.y;
  			 transform.LookAt(destinya);
              Attack();
     }else{
          followState = AIState.Moving;
          mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
       }
}


function FindClosest() : GameObject { 
    // Find Closest Player   
   // var gos : GameObject[]; 
    gos = GameObject.FindGameObjectsWithTag("Player"); 
    if(!gos){
    	return;
    }
    var closest : GameObject; 
    
    var distance : float = Mathf.Infinity; 
    var position : Vector3 = transform.position; 

    for (var go : GameObject in gos) { 
       var diff : Vector3 = (go.transform.position - position); 
       var curDistance : float = diff.sqrMagnitude; 
       if (curDistance < distance) { 
       //------------
         closest = go; 
         distance = curDistance; 
       } 
    } 
  //  var target = closest;
    return closest; 
}

function UseSkill(skill : Transform , castTime : float , delay : float , anim : String , dist : float){
	cancelAttack = false;
	if(flinch || !followTarget || (followTarget.position - transform.position).magnitude >= dist || GetComponent(Status).silence || GetComponent(Status).freeze  || castSkill){
		return;
	}
	
		freeze = true;
		castSkill = true;
		mainModel.GetComponent.<Animation>().Play(anim);
		yield WaitForSeconds(castTime);
		if(flinch){
			freeze = false;
			castSkill = false;
			return;
		}
		//attackPoint.transform.LookAt(followTarget);
		if(!cancelAttack){
			var bulletShootout : Transform = Instantiate(skill, attackPoint.transform.position , attackPoint.transform.rotation);
			bulletShootout.GetComponent(BulletStatus).Setting(atk , matk , "Enemy" , this.gameObject);
		}

		yield WaitForSeconds(delay);
		freeze = false;
		castSkill = false;
		mainModel.GetComponent.<Animation>().CrossFade(movingAnimation.name, 0.2f);
	
}

@script RequireComponent (Status)
@script RequireComponent (CharacterMotor)