﻿using UnityEngine;
using System.Collections;

[RequireComponent (typeof (BulletStatusC))]

public class HealingSkillC : MonoBehaviour {
	
	public int hpRestore = 0;
	public int variance = 15;
	public Transform Popup;
	
	public enum buff{
		None = 0,
		Barrier = 1,
		MagicBarrier = 2,
		Brave = 3,
		Faith = 4
	}
	public buff buffs = buff.None;
	public int statusAmount = 0;
	public float statusDuration = 5.5f;
	
	public string shooterTag = "Player";
	public GameObject hitEffect;
	private GameObject target;
	
	void  Start (){
		target = GetComponent<BulletStatusC>().shooter;
		ApplyEffect();
	}
	
	void  ApplyEffect (){
		if(hpRestore > 0){
			if(variance >= 100){
				variance = 100;
			}
			if(variance <= 1){
				variance = 1;
			}
			int varMin = 100 - variance;
			int varMax = 100 + variance;
			hpRestore = hpRestore * Random.Range(varMin ,varMax) / 100;
			
			target.GetComponent<StatusC>().Heal(hpRestore , 0);
			//Healing PopUp
			GameObject popAmount = Instantiate(Popup.gameObject, target.transform.position , transform.rotation) as GameObject;
			popAmount.GetComponent<DamagePopupC>().damage = hpRestore;
		}
		if(hitEffect){
			Instantiate(hitEffect, target.transform.position , hitEffect.transform.rotation);
		}
		
		//Call Function ApplyBuff in Status Script
		if(buffs != buff.None){
			target.GetComponent<StatusC>().ApplyBuff((int)buffs ,statusDuration , statusAmount);
		}
		Destroy(gameObject);
	}

}