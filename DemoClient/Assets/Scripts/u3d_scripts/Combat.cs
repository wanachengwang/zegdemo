using UnityEngine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

public class Combat {
    
	static GameObject _fireball;
	public static void CastFireball(GameObject caster, float sclFire = 1.0f, float velFire = 1.0f){
		RaycastHit hit; 
		UnityEngine.GameObject tarGo = null;
		if (Physics.SphereCast (caster.transform.position, sclFire, caster.transform.forward, out hit)) {
			tarGo = hit.collider.gameObject;
			if(tarGo.name.IndexOf("terrain") == -1)
			{
				string[] s = tarGo.name.Split(new char[]{'_' });						
				if(s.Length > 0)
				{
					int targetEntityID = Convert.ToInt32(s[s.Length - 1]);
					KBEngine.Event.fireIn("useTargetSkill", (Int32)1, (Int32)targetEntityID);	
				}	
			}
		}

        // ╠Мож
		GameObject goFireball = GameObject.Instantiate (_fireball);
		Fireball fb = goFireball.GetComponent<Fireball> ();
		fb.Reset (caster.transform.position, tarGo ? tarGo.transform : null, 10);
	}

}