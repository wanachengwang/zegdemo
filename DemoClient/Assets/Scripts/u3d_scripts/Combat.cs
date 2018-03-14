using UnityEngine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections;

public class Combat {
    
	static GameObject _fireball;
	public static IEnumerator CastFireball(GameEntity caster, GameEntity target, float coolTime, float sclFire = 1.0f, float velFire = 1.0f){

        caster.GetComponent<CharacterMotorC>().inputMoveDirection = Vector3.zero;
        caster.graphics.GetComponent<Animation>().CrossFade("cast");       

        RaycastHit hit;
        float maxDist = 16;
        float velocity = 32;
        if (!target && Physics.SphereCast (caster.graphics.position, sclFire, caster.graphics.forward, out hit, maxDist))
        {
            GameObject hitGo = hit.collider.gameObject;
            target = hitGo.GetComponent<GameEntity>();
        }

        if (target)
        {
            if(caster.isPlayer)
            {
                int targetEntityID = GameEntity.GetEntityID(target.gameObject);
                KBEngine.Event.fireIn("useTargetSkill", (Int32)1, (Int32)targetEntityID);
            }
            yield return new WaitForSeconds(coolTime);

            // 表现
            if (!_fireball)
            {
                _fireball = Resources.Load("Fireball") as GameObject;
            }
            GameObject goFireball = GameObject.Instantiate(_fireball);
            Fireball fb = goFireball.GetComponent<Fireball>();
            fb.Reset(caster.graphics.position, target.transform, velocity);
        }
        else
        {
            // Failed to cast a fireball
            yield return new WaitForSeconds(coolTime);
        }
        caster.graphics.GetComponent<Animation>().CrossFade("idle");
	}

    public static void MeleeAttack(Vector3 casterPos, Vector3 casterForward, GameObject target)
    {
        if (target && target.name.IndexOf("terrain") == -1)
        {
            string[] s = target.name.Split(new char[] { '_' });
            if (s.Length > 0)
            {
                int targetEntityID = Convert.ToInt32(s[s.Length - 1]);
                KBEngine.Event.fireIn("useTargetSkill", (Int32)1, (Int32)targetEntityID);
            }
        }
        // 表现
    }
}