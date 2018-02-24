# -*- coding: utf-8 -*-
import KBEngine
import random
import GlobalConst
from KBEDebug import * 
#from skillbases.SObject import SObject
from skillbases.SCObject import SCObject
from skills.base.SkillTargetBase import SkillTargetBase
import GlobalConst

class SkillHPMPBuffer(SkillTargetBase):
	def __init__(self):
		SkillTargetBase.__init__(self)
		self.allTime = 0.0
		self.verTime = 0.0
		self.nowTime = 0.0
		
	def cast(self, caster, scObject):
		"""
		virtual method.
		施放技能
		"""
		delay = 0.0
		type = 2
		#INFO_MSG("%i cast skill[%i] delay=%s." % (caster.id, self.id, delay))
		self.onArrived(caster, scObject)
		caster.generateFireLight(type, scObject.getID(), self.skillitem[0], delay)
		self.onSkillCastOver_(caster, scObject)

	def onSkillCastOver_(self, caster, scObject):
		"""
		virtual method.
		法术施放完毕消耗MP\HP
		"""
		#caster.addMP(-self.skillitem[8])
		pass
	def onBufferTick(self, delTime):
		#ERROR_MSG("skill::onBufferTick")
		self.nowTime +=delTime
		if(self.nowTime>=self.verTime):
			self.nowTime = 0.0
			self.caster.addHP(1)
			self.allTime -= self.verTime
			if self.allTime<=0.0:
				self.caster.removeDBuff(1)
		
	def receive(self, caster, receiver):
		"""
		virtual method.
		可以对受术者做一些事情了
		"""
		#receiver.recvDamage(caster.id, self.skillitem[0], 1, caster.MagicAtack)
		ERROR_MSG("skill::receive")
		self.allTime = 1.0
		self.verTime = 0.2
		self.caster = caster
		caster.addDBuff(1, self.onBufferTick)

