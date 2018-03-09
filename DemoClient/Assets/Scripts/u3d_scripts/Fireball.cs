using UnityEngine;
using System;

public class Fireball : MonoBehaviour
{
    Transform _tarTrans;
	float _vel;
    float _maxDist;
	Vector3 _forward;

	public void Reset(Vector3 curPos, Transform tarTrans, float vel){
		transform.position = curPos;
        _tarTrans = tarTrans;
        _vel = vel;
    }
    public void Reset(Vector3 curPos, Vector3 forward, float maxDist, float vel)
    {
        transform.position = curPos;
        _forward = forward;
        _maxDist = maxDist;
        _tarTrans = null;
        _vel = vel;
    }

    void Update(){        
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
            float deltaDist = Time.deltaTime * _vel;
            _maxDist -= deltaDist;
            if (_maxDist < 0)
            {
                Destroy(gameObject);
                return;
            }

            transform.position += _forward * deltaDist;
        }        
    }
}

