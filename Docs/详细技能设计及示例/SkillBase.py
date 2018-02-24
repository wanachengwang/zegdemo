# -*- coding: utf-8 -*-
import KBEngine
import random
import GlobalConst
from KBEDebug import * 
#from skillbases.SObject import SObject
from skillbases.SCObject import SCObject
import GlobalConst

class SkillBase:
	def __init__(self):
		self.skillitem=None
		self.cdLeftTime = 0.0
		self.isCD = 0

	def loadFromSkillItem(self, skillitem):
		self.skillitem = skillitem
		
	def onAddSkill(self, entity):
		pass
		
	def getRangeMin(self, caster):
		"""
		virtual method.
		"""
		return self.skillitem[10]

	def getRangeMax(self, caster):
		"""
		virtual method.
		"""
		return self.skillitem[11]
		
	def getspelltime(self):
		return self.skillitem[20];
	
	def ClearCD(self):
		self.isCD = 0
	
	def setCD(self):
		self.isCD = 1
		

	def getIntonateTime(self, caster):
		"""
		virtual method.
		"""
		return self.skillitem[20]
		
	def getCastMaxRange(self, caster):
		return self.getRangeMax(caster)

	def getSpeed(self):
		#return self.speed 10f
		return self.skillitem[9]

	def isRotate(self):
		return self.__isRotate

	def getMaxReceiverCount(self):
		return self.skillitem[13]
		
	def OverSpell(self, caster):
		self.cast(caster, self.scobject)

	def canUse(self, caster, scObject):
		"""
		virtual method.
		可否使用 
		@param caster: 使用技能者
		@param receiver: 受技能影响者
		"""
		return GlobalConst.GC_OK
		
	def use(self, caster, scObject):
		"""
		virtual method.
		使用技能
		@param caster: 使用技能者
		@param receiver: 受技能影响者
		"""
		return GlobalConst.GC_OK
		
	def onArrived(self, caster, scObject):
		"""
		virtual method.
		到达了目标
		"""
		self.receive(caster, scObject.getObject())
		
	def receive(self, caster, receiver):
		"""
		virtual method.
		可以对受术者做一些事情了
		"""
		pass

	def onSkillCastOver_(self, caster, scObject):
		"""
		virtual method.
		法术施放完毕通知
		"""
		pass
		
	#new Designe at 2015
	def spellSkillRequest(self, caster, targetID):
		"""
		virtual method.
		技能释放请求
		"""
		pass

