# -*- coding: utf-8 -*-
import KBEngine
import random
import GlobalConst
from KBEDebug import * 
#from skillbases.SObject import SObject
import skillbases.SCObject as SCObject
from skills.base.SkillBase import SkillBase
import GlobalConst

class SkillTargetBase(SkillBase):
	def __init__(self):
		SkillBase.__init__(self)
		self.scobject = None

	def canUse(self, caster, scObject):
		"""
		virtual method.
		可否使用 
		@param caster: 使用技能者
		@param receiver: 受技能影响者
		"""
		dis = scObject.distToSCObject(caster.position)
		#if(dis>self.skillitem[11]):
		if(dis>1000.0):
			return GlobalConst.GC_SKILL_DISTANCE_NOT_ENGOUH
		if self.isCD ==1:
			return GlobalConst.GC_SKILL_IS_CD
		if(self.skillitem[8]>caster.getMP()):
			return GlobalConst.GC_SKILL_MP_NOT_ENGOUH
		return GlobalConst.GC_OK
		
	def OverFly(self, caster):
		self.onArrived(caster, self.scobject)
		
	def use(self, caster, scObject):
		"""
		virtual method.
		使用技能
		@param caster: 使用技能者
		@param receiver: 受技能影响者
		"""
		self.cast(caster, scObject)
		return GlobalConst.GC_OK
		
	def cast(self, caster, scObject):
		"""
		virtual method.
		施放技能
		"""
		delay = self.distToDelay(caster, scObject)
		type = self.skillitem[16]
		#INFO_MSG("%i cast skill[%i] delay=%s." % (caster.id, self.id, delay))
		if delay <= 0.1:
			self.onArrived(caster, scObject)
		else:
			#INFO_MSG("%i add castSkill:%i. delay=%s." % (caster.id, self.id, delay))
			caster.addCastSkill(self, scObject, delay)
		caster.generateFireLight(type, scObject.getID(), self.skillitem[0], delay)
		self.onSkillCastOver_(caster, scObject)
		
	def distToDelay(self, caster, scObject):
		"""
		"""
		return scObject.distToDelay(self.getSpeed(), caster.position)

	def onSkillCastOver_(self, caster, scObject):
		"""
		virtual method.
		法术施放完毕通知
		"""
		caster.addMP(-self.skillitem[8])
		
	#new Designe at 2015
	def spellSkillRequest(self, caster, targetID):
		"""
		virtual method.
		技能释放请求
		"""
		target = KBEngine.entities.get(targetID)
		skillID = self.skillitem[0]
		if target is None:
			ERROR_MSG("Spell::spellTarget(%i):targetID=%i not found" % (caster.id, targetID))
			caster.client.onSpellSkillResponse(GlobalConst.GC_SKILL_ENTITY_NOT_EXIST, skillID)
			return
		
		scobject = SCObject.createSCEntity(target)
		self.scobject = scobject
		ret = self.canUse(caster, scobject)
		if ret != GlobalConst.GC_OK:
			ERROR_MSG("Spell::spellTarget(%i): cannot spell skillID=%i, targetID=%i, code=%i" % (caster.id, self.skillitem[0], targetID, ret))
			caster.client.onSpellSkillResponse(ret, skillID)
			return
		self.setCD()
		caster.skillCDDic[skillID] = self.skillitem[5]
		caster.allClients.onSpellSkillResponse(GlobalConst.GC_OK, skillID)
		#施法前摇定时
		spellTime = self.getspelltime()
		if(spellTime<0.05):
			self.use(caster, scobject)
			return
		caster.skillSpellDic.clear()
		caster.skillSpellDic[skillID] = spellTime
		
	def receive(self, caster, receiver):
		"""
		virtual method.
		可以对受术者做一些事情了
		"""
		#receiver.recvDamage(caster.id, self.getID(), 1, caster.MagicAtack)
		pass

