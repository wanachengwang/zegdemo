using UnityEngine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

public class Combat {
    
	static GameObject _fireball;
	public static void CastFireball(Vector3 casterPos, Vector3 casterForward, GameObject target, float sclFire = 1.0f, float velFire = 1.0f){

        RaycastHit hit;
        float maxDist = 16;
        float velocity = 32;
		if (!target && Physics.SphereCast (casterPos, sclFire, casterForward, out hit, maxDist)) {
            target = hit.collider.gameObject;			
		}
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
        if (!_fireball)
        {
            _fireball = Resources.Load("Fireball") as GameObject;
        }
		GameObject goFireball = GameObject.Instantiate (_fireball);
		Fireball fb = goFireball.GetComponent<Fireball> ();
        if (target)
        {
            fb.Reset(casterPos, target.transform, velocity);
        }
        else
        {
            fb.Reset(casterPos, casterForward, maxDist, velocity);
        }		
	}
    public static void CastFireball(Vector3 casterPos, Vector3 casterForward, GameObject target, float sclFire = 1.0f, float velFire = 1.0f)
    {
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