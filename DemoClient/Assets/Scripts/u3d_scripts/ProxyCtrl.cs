using KBEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ProxyCtrl : MonoBehaviour {

    public float MinSpdToRun = 0.2f;
    GameEntity _entity;
    Vector3 _latestPos;

    // Method2: Use Physics.RayCast
    private void Start()
    {
        _entity = GetComponent<GameEntity>();
        _latestPos = transform.position;
    }
    // Update is called once per frame
    void Update () {
        Vector3 deltaPos = transform.position - _latestPos;
        deltaPos.y = 0;
        float speed = deltaPos.magnitude/Time.deltaTime;
        _latestPos = transform.position;
        if (speed > MinSpdToRun)
        {
            _entity.graphics.GetComponent<Animation>().CrossFade("run");
            transform.forward = deltaPos.normalized;
        }
        else
        {
            _entity.graphics.GetComponent<Animation>().CrossFade("idle");
        }
    }
}
