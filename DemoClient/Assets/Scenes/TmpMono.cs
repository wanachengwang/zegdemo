using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TmpMono : MonoBehaviour {

    List<byte[]> _mem;

	// Use this for initialization
	void Start () {
        _mem = new List<byte[]>();

    }
	
	// Update is called once per frame
	void Update () {
        if (Input.GetKeyDown(KeyCode.A)) {
            _mem.Add(new byte[1024 * 1024]);
        }
	}
}
