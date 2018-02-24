# -*- coding: utf-8 -*-
import KBEngine
import skills
import GlobalConst
import SCDefine
from KBEDebug import * 
import skillbases.SCObject as SCObject
import d_skills
from skills.NormalAttack import NormalAttack
from skills.NormalAttack2 import NormalAttack2
from skills.NormalAttack4 import NormalAttack4
from skills.SkillAttack1 import SkillAttack1
from skills.SkillAttack2 import SkillAttack2
from skills.SkillAttack3 import SkillAttack3
from skills.SkillAttack4 import SkillAttack4
from skills.SkillAttack5 import SkillAttack5
from skills.SkillAttack6 import SkillAttack6
from skills.SkillAttack7 import SkillAttack7
from skills.SkillFireBall import SkillFireBall
from skills.SkillHPMPBuffer import SkillHPMPBuffer
from SKILLITEM import SKILLITEM_INFOS
import skillbases.SCObject as SCObject

class SkillManager:
	TIMER_SKILL_CD_TICK = 100
	TIMER_SKILL_SPELL_TICK = 101
	TIMER_SKILL_FLY_TICK = 102
	TIMER_TYPE_BUFF_TICK = 103
	def __init__(self):
		#self.addTimer(1,1,SCDefine.TIMER_TYPE_BUFF_TICK)
		self.skillDic = {}
		self.skillCDDic = {}
		self.skillSpellDic = {}
		self.buffersDic = {}
		#self.skillSpellID = None
		self.skillFlyDic = {}
		self.skills = []
		if len(self.skills) == 0:
			for key, datas in d_skills.datas.items():
				item = SKILLITEM_INFOS()
				temp = datas
				item.extend([key, temp['name'], temp["descr"], 0, 1, d_skills.skillLevelInfos[key][1]['coldTime'], d_skills.skillLevelInfos[key][1]['needExp'], d_skills.skillLevelInfos[key][1]['HP'], d_skills.skillLevelInfos[key][1]['MP'], d_skills.skillLevelInfos[key][1]['speed'], d_skills.skillLevelInfos[key][1]['rangeMin'], d_skills.skillLevelInfos[key][1]['rangeMax'], d_skills.skillLevelInfos[key][1]['cast_rangMax'], d_skills.skillLevelInfos[key][1]['maxReceiverCount'], temp["icon"], temp["proffession"], temp["type"], temp["lightID"], temp["script"], 0, temp["spellTime"]])
				self.skills.append(item)
		for v in self.skills:
			self.onAddSkill(v)
		#技能定时器
		self.addTimer( 2, 0.5, SkillManager.TIMER_SKILL_CD_TICK )
		self.addTimer( 2, 0.1, SkillManager.TIMER_SKILL_SPELL_TICK )
		self.addTimer( 2, 0.1, SkillManager.TIMER_SKILL_FLY_TICK )
		self.addTimer( 2, 0.1, SCDefine.TIMER_TYPE_BUFF_TICK )
		
	def addDBuff(self, buffID, tickFunc):
		"""
		defined method.
		添加buff
		"""
		self.buffersDic[buffID] = tickFunc
		pass

	def removeDBuff(self, buffID):
		"""
		defined method.
		删除buff
		"""
		if self.buffersDic.get(buffID, None)!=None:
			self.buffersDic.pop(buffID)
		pass
		
	def onBuffTick(self, tid, tno):
		"""
		buff的tick
		"""
		DEBUG_MSG("onBuffTick:%i" % tid)
		for k,v in self.buffersDic.items():
			v(0.1)
	
	def intonate(self, skill, scObject):
		"""
		吟唱技能
		"""
		pass
		
	def onSkillCDTick(self, tid, tno):
		"""
		buff的tick
		"""
		DEBUG_MSG("onSkillCDTick:%i" % tid)
		dellist = []
		if tno == SkillManager.TIMER_SKILL_CD_TICK:
			for k in self.skillCDDic.keys():
				self.skillCDDic[k] -=0.5
				if(self.skillCDDic[k]<0.1):
					#self.skillCDDic.pop(k)
					dellist.append(k)
					skill = self.skillDic.get(k, None)
					if skill is None:
						continue
					skill.ClearCD()
			for v in dellist:
				self.skillCDDic.pop(v)
					
	def onSkillSpellTick(self, tid, tno):
		"""
		buff的tick
		"""
		DEBUG_MSG("onSkillSpellTick:%i" % tid)
		dellist = []
		if tno == SkillManager.TIMER_SKILL_SPELL_TICK:
			for k in self.skillSpellDic.keys():
				self.skillSpellDic[k] -=0.1
				if(self.skillSpellDic[k]<0.05):
					dellist.append(k)
					skill = self.skillDic.get(k, None)
					if skill is None:
						continue
					skill.OverSpell(self)
			for v in dellist:
				self.skillSpellDic.pop(v)
					
	def onSkillFlyTick(self, tid, tno):
		DEBUG_MSG("onSkillSpellTick:%i" % tid)
		dellist = []
		if tno == SkillManager.TIMER_SKILL_FLY_TICK:
			for k in self.skillFlyDic.keys():
				self.skillFlyDic[k] -=0.1
				if(self.skillFlyDic[k]<0.05):
					dellist.append(k)
					skill = self.skillDic.get(k, None)
					if skill is None:
						continue
					skill.OverFly(self)
			for v in dellist:
				self.skillFlyDic.pop(v)
					
	def onAddSkill(self, skillitem):
		skillinst = eval(skillitem[18])()
		skillinst.loadFromSkillItem(skillitem)
		self.skillDic[skillitem[0]] = skillinst
		skillinst.onAddSkill(self)
		
	def spellTarget(self, skillID, targetID):
		"""
		defined.
		对一个目标entity施放一个技能
		"""
		DEBUG_MSG("Spell::spellTarget(%i):skillID=%i, targetID=%i" % (self.id, skillID, targetID))
		
		skill = self.skillDic.get(skillID, None)
		if skill is None:
			ERROR_MSG("Spell::spellTarget(%i):skillID=%i not found" % (self.id, skillID))
			self.client.onSpellSkillResponse(GlobalConst.GC_SKILL_SKILL_NOT_EXIST, skillID)
			return
			
		#请求技能释放：
		skill.spellSkillRequest(self, targetID)
		
	def addCastSkill(self, skill, scObject, delay):
		self.skillFlyDic[skill.skillitem[0]] = delay
	
	def spellPosition(self, position):
		pass
		
	def generateFireLight(self, type, targetID, skillID, time):
		self.allClients.onGenerateFireLight(type, targetID, skillID, time)
		
	def requestPull(self, exposed):
		"""
		exposed
		"""
		if self.id != exposed:
			return
		
		DEBUG_MSG("SkillBox::requestPull: %i skills=%i" % (self.id, len(self.skills)))
		for skillItem in self.skills:
			self.client.onAddSkill(skillItem)
			
	def addSkill(self, skillID):
		"""
		defined method.
		"""
		self.skills.append(skillID)
		self.onAddSkill(skillID)

	def removeSkill(self, skillID):
		"""
		defined method.
		"""
		self.skills.remove(skillID)

	def hasSkill(self, skillID):
		"""
		"""
		return skillID in self.skills
		
	def useTargetSkill(self, srcEntityID, skillID, targetID):
		"""
		exposed.
		对一个目标entity施放一个技能
		"""
		if srcEntityID != self.id:
			return
		
		self.spellTarget(skillID, targetID)
		
SkillManager._timermap = {}
SkillManager._timermap[SCDefine.TIMER_TYPE_BUFF_TICK] = SkillManager.onBuffTick
SkillManager._timermap[SkillManager.TIMER_SKILL_SPELL_TICK] = SkillManager.onSkillSpellTick
SkillManager._timermap[SkillManager.TIMER_SKILL_CD_TICK] = SkillManager.onSkillCDTick
SkillManager._timermap[SkillManager.TIMER_SKILL_FLY_TICK] = SkillManager.onSkillFlyTick