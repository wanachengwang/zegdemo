using UnityEngine;
using System.Collections;

[RequireComponent (typeof (AIsetC))]

public class MonsterSkillC : MonoBehaviour {
	
	private bool  start = true;
	public float skillDistance = 4.5f;
	public float skillDelay = 5.5f;

	public Transform skillPrefab;
	public AnimationClip skillAnimation;

	public float attackCast = 0.3f;
	public float attackDelay = 0.5f;
	
	void  Start (){
		StartCoroutine(AiUseSkill());
		
	}

	IEnumerator AiUseSkill(){
		yield return new WaitForSeconds(1.4f);
		AIsetC ai = GetComponent<AIsetC>();
		while (start == true) {
			yield return new WaitForSeconds(skillDelay);
			//ai.ActivateSkill(skillPrefab ,attackCast, attackDelay , skillAnimation.name , skillDistance);
			ai.ActivateSkill(skillPrefab ,attackCast, attackDelay , skillAnimation.name , skillDistance);
		}
	}


}