using UnityEngine;
using System;

public class Fireball : MonoBehaviour
{
	Vector3 _forward;
    Transform _tarTrans;
	float _vel;
    float _lifeTime;

	public void Reset(Vector3 curPos, Transform tarTrans, float vel){
		transform.position = curPos;
        _tarTrans = tarTrans;
        _vel = vel;
	}
    public void Reset(Vector3 curPos, Vector3 forward, float vel)
    {
        transform.position = curPos;
        _forward = forward;
        _tarTrans = null;
        _vel = vel;
    }

    void FixedUpdate(){
        _lifeTime -= Time.fixedDeltaTime;
        if(_lifeTime < 0)
        {
            Destroy(gameObject);
            return;
        }

        if (_tarTrans)
        {
            Vector3 offset = _tarTrans.position - transform.position;
            if (offset.sqrMagnitude <= (_vel * Time.fixedDeltaTime) * (_vel * Time.fixedDeltaTime))
            {
                Destroy(gameObject);
                return;
            }
            transform.position += offset.normalized * _vel * Time.fixedDeltaTime;
        }
        else
        {
            transform.position += _forward * _vel * Time.fixedDeltaTime;
        }        
    }
}

