const assessmentAreas = [
  {
    title: "Alertness",
    description:
      "A general lack of awareness to environment and self, insensitivity to stimuli, difficulty following thought or attention",
    task: `Observe and evaluate patient's response to speech, movement, or pain. May incorporate information from medical or nursing staff`,
    grades: {
      10: { value: 10, text: "Alert" },
      8: { value: 8, text: "Drowsy - fluctuating awareness/alert level" },
      5: { value: 5, text: "Difficult to rouse by speech or movement" },
      2: { value: 2, text: "No response to speech or movement" },
    },
  },
  {
    title: "Cooperation",
    description: `Patient is able to direct his or her attention and interact in activity.`,
    task: `Gain patient's attention and attempt to initiate communication or activity`,
    grades: {
      10: {
        value: 10,
        text: `Cooperative - engages in some form of exchange (verbal/nonverbal).`,
      },
      8: {
        value: 8,
        text: `Fluctuating cooperation - distracted by multiple simultaneous stimuli.`,
      },
      5: { value: 5, text: `Reluctant - unwilling to permit interaction.` },
      2: {
        value: 2,
        text: `Unable to cooperate with interaction or activity.`,
      },
    },
  },
  {
    title: "Auditory Comprehension",
    description: `Ability to understand basic verbal communication`,
    task: `Gain patient's attention and attempt to initiate communication or activity`,
    grades: {
      10: {
        value: 10,
        text: `No abnormality detected on screening`,
      },
      8: {
        value: 8,
        text: `Follows ordinary conversation with little difficulty`,
      },
      6: {
        value: 6,
        text: `Follows simple conversation/introductions with repetition`,
      },
      4: {
        value: 4,
        text: `Occasional motor response if cued`,
      },
      2: {
        value: 2,
        text: `No/minimal response to speech`,
      },
    },
  },
  {
    title: `Respiration`,
    description: `Status of the patient's respiratory/pulmonary sytem`,
    task: `Consult a medical officer, physiotherapist or nursing staff regarding the current condition of the patient's pulmonary system`,
    grades: {
      10: {
        value: 10,
        text: `Chest clear, no evidence of abnormality (clinical/radiographic)`,
      },
      8: {
        value: 8,
        text: `Sputum in the upper airway or other respiratory condition, for example, asthma/bronchospasm, chronic obstructive airway disease`,
      },
      6: {
        value: 6,
        text: `Fine basal crepitations/self-clearing`,
      },
      4: {
        value: 4,
        text: `Coarse basal crepitations, receiving chest physiotherapy`,
      },
      2: {
        value: 2,
        text: `Frequent suctioning/chest physiotherapy/suspected infection/respirator dependent`,
      },
    },
  },
  {
    title: `Respiratory Rate for Swallow`,
    description: `Respiratory - swallow coordination`,
    task: `Observe respiratory rate at rest. Observe mode of breathing (nasal/oral). Observe the timing of patient's saliva swallows in relation to inhalation/exhalation. Note pattern of return from swallow, that is, return to exhalation or not. Observe timing of cough (if persistent) in relation to swallow. Ask patient to close motuh to breathe and then hold breath (comfortably); record duration.`,
    grades: {
      5: {
        value: 5,
        text: `Able to control breath rate for swallow. Patient returns to exhalation post-swallow and can comfortably hold breath 5 seconds.`,
      },
      3: {
        value: 3,
        text: `Some control/incoordination. Patient can achieve nasal breathing and breath hold for a short period. Patient returns to inhalation on occasion after swallow.`,
      },
      1: {
        value: 1,
        text: `No independent control. Patient mouth breathes predominantly. Patient is unable to hold breath comfortably. Rate of breath is variable.`,
      },
    },
  },
  {
    title: `Dysphagia`,
    description: `Impairment in the capacity to order the positioning of the speech musculature or sequence the movements for volitional production of speech. Not accompanied by weakness, slowness, or incoordination of these muscles in reflex or automatic acts.`,
    task: `Informally assess as above. Include repetition of phrases of increasing syllabic length and performance of a range of oral movement to command. Record accuracy, agility and spontaneous versus imitative productions.`,
    grades: {
      5: {
        value: 5,
        text: `No abnormality detected on screening`,
      },
      4: {
        value: 4,
        text: `Mild difficulty finding words/expressing ideas`,
      },
      3: {
        value: 3,
        text: `Expresses self in a limited manner/short phrases or words`,
      },
      2: {
        value: 2,
        text: `No functional speech - sounds or undecipherable single words`,
      },
      1: {
        value: 1,
        text: `Unable to assess`,
      },
    },
  },
  {
    title: `Dyspraxia`,
    description: `Impairment in the capacity to order the positioning of the speech musculature or sequence the movements for volitional production of speech. Not accompanied by weakness, slowness, or incoordination of these muscles in reflex or automatic acts.`,
    task: `Informally assess as above. Include repetition of phrases of increasing syllabic length and performance of a range of oral movement to command. Record accuracy, agility, and spontaneous versus imitative productions.`,
    grades: {
      5: {
        value: 5,
        text: `No abnormality detected on screening`,
      },
      4: {
        value: 4,
        text: `Speech accurate after trial and error, minor searching movements`,
      },
      3: {
        value: 3,
        text: `Speech crude/defective in accuracy or speed on command`,
      },
      2: {
        value: 2,
        text: `Significant groping/iaccuracy, partial or irrelevant responses`,
      },
      1: {
        value: 1,
        text: `Unable to assess`,
      },
    },
  },
  {
    title: `Saliva`,
    description: `Ability to manage oral secretions`,
    task: `Observe the patient's control of saliva. Note any escape of secretions from the side of mouth and check corners of mouth for wetness. Ask the patient if he or she has noticed undue saliva loss during the day, at night, or while side lying.`,
    grades: {
      5: {
        value: 5,
        text: `No abnormality detected on screening`,
      },
      4: {
        value: 4,
        text: `Frothy/expectorated into cup`,
      },
      3: {
        value: 3,
        text: `Drooling at times, during speech while side lying, when fatigued`,
      },
      2: {
        value: 2,
        text: `Some drool consistently`,
      },
      1: {
        value: 1,
        text: `Gross drooling. Unable to control drooling, open mouth posture, needing bib protection`,
      },
    },
  },
  {
    title: `Lip Seal`,
    description: `Ability to control labial movement and closure`,
    task: ``,
    grades: {
      5: {
        value: 5,
        text: `No abnormality detected on screening`,
      },
      4: {
        value: 4,
        text: `Mild impairment, occasional leakage`,
      },
      3: {
        value: 3,
        text: `Unilaterally weak, poor mainenance, restricted movement`,
      },
      2: {
        value: 2,
        text: `Incomplete closure, limited movement`,
      },
      1: {
        value: 1,
        text: `No closure, unable to assess`,
      },
    },
  },
  {
    title: `Tongue Movement`,
    description: `Lingual mobility in both anterior and posterior aspects`,
    // TODO, figure out how to italicize Anterior Aspect and Posterior Aspect
    task: `Anterior Aspect - Protrusion: Have patient extend tongue as far forward as possible and then retract similarly.  Lateralization: Have patient touch each corner of the mouth, then repeat alternating lateral movements. With tongue, have patient attempt to clear out lateral sulci on each side of the mouth. Elevation: With mouth wide open, have patient raise tongue tip to alveolar ridge. Alternate elevation and depression in this way. Posterior Aspect - Elevation: Have patient raise back of tongue to meet palate and hold the position.`,
    grades: {
      10: {
        value: 10,
        text: `Full range of movement/no abnormality detected`,
      },
      8: {
        value: 8,
        text: `Mild impairment in range`,
      },
      6: {
        value: 6,
        text: `Incomplete movement`,
      },
      4: {
        value: 4,
        text: `Minimal movement`,
      },
      2: {
        value: 2,
        text: `No movement`,
      },
    },
  },
  {
    title: `Tongue Strength`,
    description: `Bilateral lingual strength on resistance tasks`,
    task: `Have patient push laterally, against a tongue depressor or gloved finger. Have patient push anteriorly against a tongue depressor or gloved finger. Have patient push during eleveation and depression of tongue. Ask patient to elevate back of tongue against a tongue depressor or gloved finger. Note tone and strength to resistance.`,
    grades: {
      10: {
        value: 10,
        text: `No abnormality detected on screening`,
      },
      8: {
        value: 8,
        text: `Minimal weakness`,
      },
      5: {
        value: 5,
        text: `Obvious unilateral weakness`,
      },
      2: {
        value: 2,
        text: `Gross weakness`,
      },
    },
  },
  {
    title: `Tongue Coordination`,
    description: `Ability to control lingual movement during serial repetitious activity or speech`,
    task: `Ask patient to lick around lips, slowly and then rapidly, touching all parts. Have patient rapidly repeat tongue tip alveolar syllables /ta/. Repeat a sentence including tongue tip alveolar consonants (e.g., Take Tim to tea). Ask patient to rapidly repeat velar syllables /ka/. Repeat a sentence including velar consonants (e.g., Can you keep Katie clean?).`,
    grades: {
      10: {
        value: 10,
        text: `No abnormality detected on screening`,
      },
      8: {
        value: 8,
        text: `Mild incoordination`,
      },
      5: {
        value: 5,
        text: `Gross incoordination`,
      },
      2: {
        value: 2,
        text: `No movement/unable to assess`,
      },
    },
  },
  {
    title: `Oral Preparation`,
    description: `Ability to break down food, mix with saliva, and form a cohesive bolus ready to swallow`,
    task: `Observe patient while eating or chewing. Ask to observe how bolus is prepared prior to swallowing. Check for loss from mouth, position of food bolus, spread throughout oral cavity, and loss of material into lateral or anterior sulci. Note chewing movements and fatigue.`,
    grades: {
      10: {
        value: 10,
        text: `No abnormality detected on screening`,
      },
      8: {
        value: 8,
        text: `Lip or tongue seal, bolus escape`,
      },
      6: {
        value: 6,
        text: `Minimal chew/tongue thrust bolus projected forward/limited preparation gravityassisted/spread throughout mouth/compensatory head extension`,
      },
      4: {
        value: 4,
        text: `No bolus formation / no attempt`,
      },
      2: {
        value: 2,
        text: `Unable to assess`,
      },
    },
  },
  {
    title: `Gag`,
    description: `Reflex motor response triggered in response to noxious stimuli. It measures response of surface tactile receptors and afferent information travels by way of CN X (and possibly some portion of IX).`,
    task: `Using a laryngeal mirror (size 00) (introduction of cold is optional), contact the base of the tongue or posterior pharyngeal wall. Note any contraction of the pharyngeal wall or soft palate.`,
    grades: {
      5: {
        value: 5,
        text: `No abnormality detected, strong symmetrical response / hyperreflexive`,
      },
      4: {
        value: 4,
        text: `Diminished bilaterally`,
      },
      3: {
        value: 3,
        text: `Diminished unilaterally`,
      },
      2: {
        value: 2,
        text: `Absent unilaterally`,
      },
      1: {
        value: 1,
        text: `No gag response noted`,
      },
    },
  },
  {
    title: `Palate`,
    description: ``,
    task: ``,
    grades: {
      10: {
        value: 10,
        text: ``,
      },
      8: {
        value: 8,
        text: ``,
      },
      6: {
        value: 6,
        text: ``,
      },
      4: {
        value: 4,
        text: ``,
      },
      2: {
        value: 2,
        text: ``,
      },
    },
  },
  {
    title: `Bolus Clearance`,
    description: ``,
    task: ``,
    grades: {
      10: {
        value: 10,
        text: ``,
      },
      8: {
        value: 8,
        text: ``,
      },
      6: {
        value: 6,
        text: ``,
      },
      4: {
        value: 4,
        text: ``,
      },
      2: {
        value: 2,
        text: ``,
      },
    },
  },
  {
    title: `Oral Transit`,
    description: ``,
    task: ``,
    grades: {
      10: {
        value: 10,
        text: ``,
      },
      8: {
        value: 8,
        text: ``,
      },
      6: {
        value: 6,
        text: ``,
      },
      4: {
        value: 4,
        text: ``,
      },
      2: {
        value: 2,
        text: ``,
      },
    },
  },
  {
    title: `Cough Reflex`,
    description: ``,
    task: ``,
    grades: {
      10: {
        value: 10,
        text: ``,
      },
      8: {
        value: 8,
        text: ``,
      },
      6: {
        value: 6,
        text: ``,
      },
      4: {
        value: 4,
        text: ``,
      },
      2: {
        value: 2,
        text: ``,
      },
    },
  },
  {
    title: `Voluntary Cough`,
    description: ``,
    task: ``,
    grades: {
      10: {
        value: 10,
        text: ``,
      },
      8: {
        value: 8,
        text: ``,
      },
      6: {
        value: 6,
        text: ``,
      },
      4: {
        value: 4,
        text: ``,
      },
      2: {
        value: 2,
        text: ``,
      },
    },
  },
  {
    title: `Voice`,
    description: ``,
    task: ``,
    grades: {
      10: {
        value: 10,
        text: ``,
      },
      8: {
        value: 8,
        text: ``,
      },
      6: {
        value: 6,
        text: ``,
      },
      4: {
        value: 4,
        text: ``,
      },
      2: {
        value: 2,
        text: ``,
      },
    },
  },
  {
    title: `Trache`,
    description: ``,
    task: ``,
    grades: {
      10: {
        value: 10,
        text: ``,
      },
      8: {
        value: 8,
        text: ``,
      },
      6: {
        value: 6,
        text: ``,
      },
      4: {
        value: 4,
        text: ``,
      },
      2: {
        value: 2,
        text: ``,
      },
    },
  },
  {
    title: `Pharyngeal Phase`,
    description: ``,
    task: ``,
    grades: {
      10: {
        value: 10,
        text: ``,
      },
      8: {
        value: 8,
        text: ``,
      },
      6: {
        value: 6,
        text: ``,
      },
      4: {
        value: 4,
        text: ``,
      },
      2: {
        value: 2,
        text: ``,
      },
    },
  },
  {
    title: `Pharyngeal Response`,
    description: ``,
    task: ``,
    grades: {
      10: {
        value: 10,
        text: ``,
      },
      8: {
        value: 8,
        text: ``,
      },
      6: {
        value: 6,
        text: ``,
      },
      4: {
        value: 4,
        text: ``,
      },
      2: {
        value: 2,
        text: ``,
      },
    },
  },
];

export default assessmentAreas;
