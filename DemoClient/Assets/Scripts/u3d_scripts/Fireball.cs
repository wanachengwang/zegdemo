using UnityEngine;
using System;

public class Fireball : MonoBehaviour
{
	Vector3 _tarPos;
	float _leftTime;

	public void Reset(Vector3 curPos, Vector3 tarPos, float time){
		transform.position = curPos;
		_tarPos = tarPos;
		_leftTime = time;
	}

	void FixedUpdate(){
		//_leftTime -= 
	}
}

