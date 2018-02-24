# -*- coding: utf-8 -*-
import KBEngine
import random
import GlobalConst
from KBEDebug import * 
#from skillbases.SObject import SObject
from skillbases.SCObject import SCObject
from skills.base.SkillTargetBase import SkillTargetBase
import GlobalConst

class SkillFireBall(SkillTargetBase):
	def __init__(self):
		SkillTargetBase.__init__(self)

	def onSkillCastOver_(self, caster, scObject):
		"""
		virtual method.
		法术施放完毕消耗MP\HP
		"""
		caster.addMP(-self.skillitem[8])
		
	def receive(self, caster, receiver):
		"""
		virtual method.
		可以对受术者做一些事情了
		"""
		receiver.recvDamage(caster.id, self.skillitem[0], 1, caster.MagicAtack)

