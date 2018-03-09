using KBEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerCtrl : MonoBehaviour {
    public float _maxDistFireball = 10.0f;
    public float _maxDistMelee = 2.0f;
    public float _coolTimeFireball = 0.75f;
    public float _coolTimeMelee = 0.05f;
    public float CameraDif;
    Transform _graphics;
    Transform _attackPt;
    Vector3 _mousePos;
    Vector3 _lookPos;
    float _coolTime = -1.0f;

    GameEntity _target;

    void OnEnable()
    {
        EasyJoystick.On_JoystickMoveStart += OnJoystickMoveStart;
        EasyJoystick.On_JoystickMove += OnJoystickMove;
        EasyJoystick.On_JoystickMoveEnd += OnJoystickMove;
    }
    void OnDisable()
    {
        EasyJoystick.On_JoystickMoveStart -= OnJoystickMoveStart;
        EasyJoystick.On_JoystickMove -= OnJoystickMove;
        EasyJoystick.On_JoystickMoveEnd -= OnJoystickMove;
    }

    // Method2: Use Physics.RayCast
    private void Start()
    {
        _graphics = transform.Find("Graphics");
        _attackPt = transform.Find("AttackPoint");
        Vector3 distToCam = Camera.main.transform.position - _graphics.transform.position;
        distToCam.y = 0;
        CameraDif = Vector3.Magnitude(distToCam);
    }
    // Update is called once per frame
    void Update () {
        if(_coolTime > 0.0f)
        {
            _coolTime -= Time.deltaTime;
            return;
        }
        //UpdateMove();
    }

    string strSpaceId = "1";
    private void OnGUI()
    {
        GUI.Label(new Rect(80, 90, 320, 20), "MousePos=" + _mousePos.ToString());
        GUI.Label(new Rect(80, 110, 320, 20), "LookPos=" + _lookPos.ToString());

        strSpaceId = GUI.TextField(new Rect(80, 130, 45, 24), strSpaceId);
        if (GUI.Button(new Rect(130, 130, 60, 24), "传送"))
        {
            byte spaceId;
            if (byte.TryParse(strSpaceId, out spaceId))
            {
                KBEngine.Avatar avatar = (KBEngine.Avatar)KBEngineApp.app.player();
                if (avatar != null)
                {
                    avatar.teleport(spaceId);
                }
            }
        }

        UnityEngine.GameObject obj = UnityEngine.GameObject.Find("player(Clone)");
        if (obj != null)
        {
            GUI.Label(new Rect(240, 20, 400, 100), "id=" + KBEngineApp.app.entity_id + ", position=" + obj.transform.position.ToString());
            if (GUI.Button(new Rect(Screen.width - 160, Screen.height - 260, 100, 80), "技能0") && _coolTime <= 0.0f)
            {
                Attack0();
            }
            else if (GUI.Button(new Rect(Screen.width - 160, Screen.height - 160, 100, 80), "技能1") && _coolTime <= 0.0f)
            {
                Attack1();
            }

            Camera.main.fieldOfView = GUI.VerticalSlider(new Rect(Screen.width - 80, 20, 100, 400), Camera.main.fieldOfView, 90.0f, 10.0f);
        }
    }

    // Using mouse
    private void UpdateMove()
    {
#if false
        _mousePos = new Vector3(Input.mousePosition.x, Input.mousePosition.y, CameraDif);
        _lookPos = Camera.main.ScreenToWorldPoint(_mousePos);
        _lookPos.y = _graphics.position.y;
        _graphics.LookAt(_lookPos);
#else
        RaycastHit hitInfo;
        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        CharacterMotorC motor = GetComponent<CharacterMotorC>();
        if (Physics.Raycast(ray, out hitInfo, 100, LayerMask.GetMask("Terrain")))
        {
            if (Input.GetMouseButton(0))
            {
                RunToPos(hitInfo.point);
                _graphics.GetComponent<Animation>().CrossFade("run");
                Vector3 movDir = _lookPos - _graphics.transform.position;
                if (movDir.magnitude > motor.movement.maxForwardSpeed)
                {
                    movDir = movDir.normalized * motor.movement.maxForwardSpeed;
                }
                motor.inputMoveDirection = movDir;
            }
            else
            {
                _lookPos = hitInfo.point;
                _lookPos.y = _graphics.position.y;
                _graphics.LookAt(_lookPos);
                motor.inputMoveDirection = Vector3.zero;
                _graphics.GetComponent<Animation>().CrossFade("idle");
            }
        }
#endif
    }

    void OnJoystickMoveStart(MovingJoystick move)
    {
        //  在这里的名字new joystick 就是上面所说的很重要的名字，在上面图片中joystickName的你修改了什么名字，这里就要写你修改的好的名字（不然脚本不起作用）。
        if (move.joystickName != "New joystick")
            return;

        StopAllCoroutines();
    }
    //  此函数是摇杆移动中所要处理的事
    void OnJoystickMove(MovingJoystick move)
    {
        //  在这里的名字new joystick 就是上面所说的很重要的名字，在上面图片中joystickName的你修改了什么名字，这里就要写你修改的好的名字（不然脚本不起作用）。
        if (move.joystickName != "New joystick")
            return;

        float PositionX = move.joystickAxis.x;       //   获取摇杆偏移摇杆中心的x坐标
        float PositionY = move.joystickAxis.y;      //    获取摇杆偏移摇杆中心的y坐标
        CharacterMotorC motor = GetComponent<CharacterMotorC>();
        if (PositionY != 0 || PositionX != 0)
        {
            //  设置控制角色或物体方块的朝向（当前坐标+摇杆偏移量）
            _lookPos = new Vector3(_graphics.transform.position.x + PositionX, _graphics.transform.position.y, _graphics.transform.position.z + PositionY);
            _graphics.LookAt(_lookPos);
            //  移动角色或物体的位置（按其所朝向的位置移动）
            //_graphics.transform.Translate(Vector3.forward * Time.deltaTime * 25);
            Vector3 movDir = (_lookPos - _graphics.transform.position) * motor.movement.maxForwardSpeed;
            _graphics.GetComponent<Animation>().CrossFade("run");
            motor.inputMoveDirection = movDir;
        }
        else
        {
            _graphics.GetComponent<Animation>().CrossFade("idle");
            motor.inputMoveDirection = Vector3.zero;
        }
    }

    private void GetTarget(float radius, out GameEntity target, out float dist)
    {
        dist = radius;
        target = null;
        GameEntity[] entities = FindObjectsOfType<GameEntity>();
        foreach (GameEntity e in entities)
        {
            if (e.gameObject == gameObject)
                continue;

            float curdist = (e.transform.position - transform.position).magnitude;
            if (curdist < dist)
            {
                dist = curdist;
                target = e;
            }
        }
    }

    private void RunToPos(Vector3 pos)
    {
        _lookPos = pos;
        _lookPos.y = _graphics.position.y;
        _graphics.LookAt(_lookPos);
        _graphics.GetComponent<Animation>().CrossFade("run");
        Vector3 movDir = _lookPos - _graphics.transform.position;
        CharacterMotorC motor = GetComponent<CharacterMotorC>();
        if (movDir.magnitude > motor.movement.maxForwardSpeed)
        {
            movDir = movDir.normalized * motor.movement.maxForwardSpeed;
        }
        motor.inputMoveDirection = movDir;
    }
    private void Attack0()
    {
        float dist;
        GetTarget(20.0f, out _target, out dist);
        StartCoroutine(ExAttack0());
    }
    private IEnumerator ExAttack0()
    {
        while (_target)
        {
            Vector3 dist = _target.transform.position - _graphics.transform.position;
            if (dist.magnitude < _maxDistFireball)
            {
                _lookPos = _target.transform.position;
                _lookPos.y = _graphics.position.y;
                _graphics.LookAt(_lookPos);
                break;
            }
            RunToPos(_target.transform.position);
            yield return 0;
        }
        GetComponent<CharacterMotorC>().inputMoveDirection = Vector3.zero;
        _graphics.GetComponent<Animation>().CrossFade("cast");
        _coolTime = _coolTimeFireball;
        yield return new WaitForSeconds(_coolTime);
        Combat.CastFireball(_attackPt.transform.position, _graphics.transform.forward, _target!=null ? _target.gameObject : null);
        _graphics.GetComponent<Animation>().CrossFade("idle");
    }
    private void Attack1()
    {
        float dist;
        GetTarget(20.0f, out _target, out dist);
        StartCoroutine(ExAttack1());
    }
    private IEnumerator ExAttack1()
    {
        while (_target)
        {
            Vector3 dist = _target.transform.position - _graphics.transform.position;
            if (dist.magnitude < _maxDistMelee)
                break;
            RunToPos(_target.transform.position);
            yield return 0;
        }
        GetComponent<CharacterMotorC>().inputMoveDirection = Vector3.zero;
        _graphics.GetComponent<Animation>().CrossFade("attack");
        _coolTime = _coolTimeMelee;
        yield return new WaitForSeconds(_coolTime);
        Combat.MeleeAttack(_attackPt.transform.position, _graphics.transform.forward, _target != null ? _target.gameObject : null);
        _graphics.GetComponent<Animation>().CrossFade("idle");
    }
}
