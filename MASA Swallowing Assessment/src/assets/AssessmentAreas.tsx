const assessmentAreas = [
  {
    title: "Alertness",
    description:
      "A general lack of awareness to environment and self, insensitivity to stimuli, difficulty focusing thought or attention",
    task: `Observe and evaluate patient's response to speech, movement, or pain. May incorporate information from medical or nursing staff`,
    grades: {
      10: { value: 10, text: "Alert", shortText: "Alert" },
      8: {
        value: 8,
        text: "Drowsy - fluctuating awareness/alert level",
        shortText: "Drowsy",
      },
      5: {
        value: 5,
        text: "Difficult to rouse by speech or movement",
        shortText: "Difficult to rouse",
      },
      2: {
        value: 2,
        text: "No response to speech or movement",
        shortText: "No response",
      },
    },
  },
  {
    title: "Cooperation",
    description: `Patient is able to direct his or her attention and interact in activity.`,
    task: `Gain patient's attention and attempt to initiate communication or activity`,
    grades: {
      10: {
        value: 10,
        text: `Cooperative - engages in some form of exchange (verbal/nonverbal)`,
        shortText: "Cooperative",
      },
      8: {
        value: 8,
        text: `Fluctuating cooperation - distracted by multiple simultaneous stimuli`,
        shortText: "Fluctuating",
      },
      5: { 
        value: 5, 
        text: `Reluctant - unwilling to permit interaction`,
        shortText: "Reluctant",
      },
      2: {
        value: 2,
        text: `Unable to cooperate with interaction or activity`,
        shortText: "Unable to cooperate",
      },
    },
  },
  {
    title: "Auditory Comprehension",
    description: `Ability to understand basic verbal communication`,
    task: `Informally engage patient in conversation; ask patient to follow single- and two-stage commands. Utilize both high- and low-probability instructions`,
    grades: {
      10: {
        value: 10,
        text: `No abnormality detected on screening`,
        shortText: "Normal",
      },
      8: {
        value: 8,
        text: `Follows ordinary conversation with little difficulty`,
        shortText: "Little difficulty",
      },
      6: {
        value: 6,
        text: `Follows simple conversation/instructions with repetition`,
        shortText: "Needs repetition",
      },
      4: {
        value: 4,
        text: `Occasional motor response if cued`,
        shortText: "Occasional response",
      },
      2: {
        value: 2,
        text: `No/minimal response to speech`,
        shortText: "No response",
      },
    },
  },
  {
    title: `Respiration`,
    description: `Status of the patient's respiratory/pulmonary system`,
    task: `Consult medical officer, physiotherapist, or nursing staff regarding the current condition of the patient's pulmonary system`,
    grades: {
      10: {
        value: 10,
        text: `Chest clear, no evidence of abnormality (clinical/radiographic)`,
        shortText: "Clear",
      },
      8: {
        value: 8,
        text: `Sputum in the upper airway or other respiratory condition, for example, asthma/bronchospasm, chronic obstructive airway disease`,
        shortText: "Sputum/condition",
      },
      6: {
        value: 6,
        text: `Fine basal crepitations/self-clearing`,
        shortText: "Fine crepitations",
      },
      4: {
        value: 4,
        text: `Coarse basal crepitations, receiving chest physiotherapy`,
        shortText: "Coarse crepitations",
      },
      2: {
        value: 2,
        text: `Frequent suctioning/chest physiotherapy/suspected infection/respirator dependent`,
        shortText: "Frequent suction",
      },
    },
  },
  {
    title: `Respiratory Rate for Swallow`,
    description: `Respiratory-swallow coordination`,
    task: `Observe respiratory rate at rest. Observe mode of breathing (nasal/oral). Observe the timing of patient's saliva swallows in relation to inhalation/exhalation. Note pattern of return from swallow. Ask patient to close mouth to breathe and then hold breath (comfortably); record duration.`,
    grades: {
      5: {
        value: 5,
        text: `Able to control breath rate for swallow. Patient returns to exhalation post-swallow and can comfortably hold breath 5 seconds`,
        shortText: "Good control",
      },
      3: {
        value: 3,
        text: `Some control/incoordination. Patient can achieve nasal breathing and breath hold for a short period. Patient returns to inhalation on occasion after swallow`,
        shortText: "Some control",
      },
      1: {
        value: 1,
        text: `No independent control. Patient mouth breathes predominantly. Patient is unable to hold breath comfortably. Rate of breath is variable`,
        shortText: "No control",
      },
    },
  },
  {
    title: `Dysphasia`,
    description: `General language impairment crossing different language modalities: speaking, listening, reading, writing`,
    task: `Informally assess the patient's verbal expression. This information is to be combined with auditory comprehension examination to determine rating for this item`,
    grades: {
      5: {
        value: 5,
        text: `No abnormality detected on screening`,
        shortText: "Normal",
      },
      4: {
        value: 4,
        text: `Mild difficulty finding words/expressing ideas`,
        shortText: "Mild difficulty",
      },
      3: {
        value: 3,
        text: `Expresses self in a limited manner/short phrases or words`,
        shortText: "Limited expression",
      },
      2: {
        value: 2,
        text: `No functional speech - sounds or undecipherable single words`,
        shortText: "No functional speech",
      },
      1: {
        value: 1,
        text: `Unable to assess`,
        shortText: "Unable to assess",
      },
    },
  },
  {
    title: `Dyspraxia`,
    description: `Impairment in the capacity to order the positioning of the speech musculature or sequence the movements for volitional production of speech. Not accompanied by weakness, slowness, or incoordination of these muscles in reflex or automatic acts`,
    task: `Informally assess as above. Include repetition of phrases of increasing syllabic length and performance of a range of oral movement to command. Record accuracy, agility, and spontaneous versus imitative productions`,
    grades: {
      5: {
        value: 5,
        text: `No abnormality detected on screening`,
        shortText: "Normal",
      },
      4: {
        value: 4,
        text: `Speech accurate after trial and error, minor searching movements`,
        shortText: "Minor searching",
      },
      3: {
        value: 3,
        text: `Speech crude/defective in accuracy or speed on command`,
        shortText: "Crude/defective",
      },
      2: {
        value: 2,
        text: `Significant groping/inaccuracy, partial or irrelevant responses`,
        shortText: "Groping/inaccurate",
      },
      1: {
        value: 1,
        text: `Unable to assess`,
        shortText: "Unable to assess",
      },
    },
  },
  {
    title: `Dysarthria`,
    description: `Impairment of articulation characterized by disturbance in muscular control over the speech musculature. Includes features such as paralysis, weakness, or incoordination of the speech musculature`,
    task: `Informally assess as above. Include articulation tasks of increasing length, that is, sentence repetition, reading, and monologue. Engage in conversation. Request patient count to 5, whispering and increasing volume`,
    grades: {
      5: {
        value: 5,
        text: `No abnormality detected on screening`,
        shortText: "Normal",
      },
      4: {
        value: 4,
        text: `Slow with occasional hesitation and slurring`,
        shortText: "Slow/hesitation",
      },
      3: {
        value: 3,
        text: `Speech intelligible but obviously defective in rate/range/strength/coordination`,
        shortText: "Intelligible/defective",
      },
      2: {
        value: 2,
        text: `Speech unintelligible`,
        shortText: "Unintelligible",
      },
      1: {
        value: 1,
        text: `Unable to assess`,
        shortText: "Unable to assess",
      },
    },
  },
  {
    title: `Saliva`,
    description: `Ability to manage oral secretions`,
    task: `Observe the patient's control of saliva. Note any escape of secretions from the side of mouth and check corners of mouth for wetness. Ask the patient if he or she has noticed undue saliva loss during the day, at night, or while side lying`,
    grades: {
      5: {
        value: 5,
        text: `No abnormality detected on screening`,
        shortText: "Normal",
      },
      4: {
        value: 4,
        text: `Frothy/expectorated into cup`,
        shortText: "Frothy",
      },
      3: {
        value: 3,
        text: `Drooling at times, during speech while side lying, when fatigued`,
        shortText: "Occasional drool",
      },
      2: {
        value: 2,
        text: `Some drool consistently`,
        shortText: "Consistent drool",
      },
      1: {
        value: 1,
        text: `Gross drooling. Unable to control drooling, open mouth posture, needing bib protection`,
        shortText: "Gross drooling",
      },
    },
  },
  {
    title: `Lip Seal`,
    description: `Ability to control labial movement and closure`,
    task: `Observe lips at rest. Note tone at corners of mouth. Ask patient to spread lips widely on the vowel /i/ and round for the vowel /u/. Ask patient to alternate lip movement between the two vowels. Observe patient's ability to close mouth around an empty spoon. Ask patient to blow air into cheeks and maintain closure`,
    grades: {
      5: {
        value: 5,
        text: `No abnormality detected on screening`,
        shortText: "Normal",
      },
      4: {
        value: 4,
        text: `Mild impairment, occasional leakage`,
        shortText: "Mild impairment",
      },
      3: {
        value: 3,
        text: `Unilaterally weak, poor maintenance, restricted movement`,
        shortText: "Unilateral weak",
      },
      2: {
        value: 2,
        text: `Incomplete closure, limited movement`,
        shortText: "Incomplete closure",
      },
      1: {
        value: 1,
        text: `No closure, unable to assess`,
        shortText: "No closure",
      },
    },
  },
  {
    title: `Tongue Movement`,
    description: `Lingual mobility in both anterior and posterior aspects`,
    task: `Anterior Aspect - Protrusion: Have patient extend tongue as far forward as possible and then retract similarly. Lateralization: Have patient touch each corner of the mouth, then repeat alternating lateral movements. With tongue, have patient attempt to clear out lateral sulci on each side of mouth. Elevation: With mouth wide open, have patient raise tongue tip to alveolar ridge. Alternate elevation and depression in this way. Posterior Aspect - Elevation: Have patient raise back of tongue to meet palate and hold the position`,
    grades: {
      10: {
        value: 10,
        text: `Full range of movement/no abnormality detected`,
        shortText: "Full range",
      },
      8: {
        value: 8,
        text: `Mild impairment in range`,
        shortText: "Mild impairment",
      },
      6: {
        value: 6,
        text: `Incomplete movement`,
        shortText: "Incomplete",
      },
      4: {
        value: 4,
        text: `Minimal movement`,
        shortText: "Minimal",
      },
      2: {
        value: 2,
        text: `No movement`,
        shortText: "No movement",
      },
    },
  },
  {
    title: `Tongue Strength`,
    description: `Bilateral lingual strength on resistance tasks`,
    task: `Have patient push laterally, against a tongue depressor or gloved finger. Have patient push anteriorly against a tongue depressor or gloved finger. Have patient push during elevation and depression of tongue. Ask patient to elevate back of tongue against a tongue depressor or gloved finger. Note tone and strength to resistance`,
    grades: {
      10: {
        value: 10,
        text: `No abnormality detected on screening`,
        shortText: "Normal",
      },
      8: {
        value: 8,
        text: `Minimal weakness`,
        shortText: "Minimal weakness",
      },
      5: {
        value: 5,
        text: `Obvious unilateral weakness`,
        shortText: "Unilateral weak",
      },
      2: {
        value: 2,
        text: `Gross weakness`,
        shortText: "Gross weakness",
      },
    },
  },
  {
    title: `Tongue Coordination`,
    description: `Ability to control lingual movement during serial repetitious activity or speech`,
    task: `Ask patient to lick around lips, slowly and then rapidly, touching all parts. Have patient rapidly repeat tongue tip alveolar syllables /ta/. Repeat a sentence including tongue tip alveolar consonants (e.g., Take Tim to tea). Ask patient to rapidly repeat velar syllables /ka/. Repeat a sentence including velar consonants (e.g., Can you keep Katie clean?)`,
    grades: {
      10: {
        value: 10,
        text: `No abnormality detected on screening`,
        shortText: "Normal",
      },
      8: {
        value: 8,
        text: `Mild incoordination`,
        shortText: "Mild incoordination",
      },
      5: {
        value: 5,
        text: `Gross incoordination`,
        shortText: "Gross incoordination",
      },
      2: {
        value: 2,
        text: `No movement/unable to assess`,
        shortText: "No movement",
      },
    },
  },
  {
    title: `Oral Preparation`,
    description: `Ability to break down food, mix with saliva, and form a cohesive bolus ready to swallow`,
    task: `Observe patient while eating or chewing. Ask to observe how bolus is prepared prior to swallowing. Check for loss from mouth, position of food bolus, spread throughout oral cavity, and loss of material into lateral or anterior sulci. Note chewing movements and fatigue`,
    grades: {
      10: {
        value: 10,
        text: `No abnormality detected on screening`,
        shortText: "Normal",
      },
      8: {
        value: 8,
        text: `Lip or tongue seal, bolus escape`,
        shortText: "Lip/tongue seal",
      },
      6: {
        value: 6,
        text: `Minimal chew/tongue thrust bolus projected forward/limited preparation gravity assisted/spread throughout mouth/compensatory head extension`,
        shortText: "Minimal chew",
      },
      4: {
        value: 4,
        text: `No bolus formation/no attempt`,
        shortText: "No bolus",
      },
      2: {
        value: 2,
        text: `Unable to assess`,
        shortText: "Unable to assess",
      },
    },
  },
  {
    title: `Gag`,
    description: `Reflex motor response triggered in response to noxious stimuli. It measures response of surface tactile receptors and afferent information travels by way of CN X (and possibly some portion of IX)`,
    task: `Using a laryngeal mirror (size 00) (introduction of cold is optional), contact the base of the tongue or posterior pharyngeal wall. Note any contraction of the pharyngeal wall or soft palate`,
    grades: {
      5: {
        value: 5,
        text: `No abnormality detected, strong symmetrical response/hyperreflexive`,
        shortText: "Strong/normal",
      },
      4: {
        value: 4,
        text: `Diminished bilaterally`,
        shortText: "Diminished bilateral",
      },
      3: {
        value: 3,
        text: `Diminished unilaterally`,
        shortText: "Diminished unilateral",
      },
      2: {
        value: 2,
        text: `Absent unilaterally`,
        shortText: "Absent unilateral",
      },
      1: {
        value: 1,
        text: `No gag response noted`,
        shortText: "No gag",
      },
    },
  },
  {
    title: `Palate`,
    description: `Function of the velum in speech and reflexively`,
    task: `Ask the patient to produce a strong /ah/ and sustain for several seconds. Ask the patient to repeat /ah/ several times. Note action of elevation. Observe any hypernasality from earlier speech tasks. Test palatal reflex-make contact with cold laryngeal mirror at juncture of hard and soft palates`,
    grades: {
      10: {
        value: 10,
        text: `No abnormality detected on screening`,
        shortText: "Normal",
      },
      8: {
        value: 8,
        text: `Slight asymmetry noted, mobile`,
        shortText: "Slight asymmetry",
      },
      6: {
        value: 6,
        text: `Unilaterally weak, inconsistently maintained`,
        shortText: "Unilateral weak",
      },
      4: {
        value: 4,
        text: `Minimal movement, nasal regurgitation, nasal air escape`,
        shortText: "Minimal movement",
      },
      2: {
        value: 2,
        text: `No spread or elevation`,
        shortText: "No elevation",
      },
    },
  },
  {
    title: `Bolus Clearance`,
    description: `Ability to move a bolus effectively through the oral cavity`,
    task: `Observe patient eating/swallowing a bolus. Check oral cavity for residue following a swallow`,
    grades: {
      10: {
        value: 10,
        text: `Bolus fully cleared from mouth`,
        shortText: "Fully cleared",
      },
      8: {
        value: 8,
        text: `Significant clearance, minimal residue`,
        shortText: "Minimal residue",
      },
      5: {
        value: 5,
        text: `Some clearance, residue`,
        shortText: "Some residue",
      },
      2: {
        value: 2,
        text: `No clearance`,
        shortText: "No clearance",
      },
    },
  },
  {
    title: `Oral Transit`,
    description: `Time from initiation of lingual movement until bolus head reaches point where lower edge of mandible crosses the tongue base. In clinical measurement, this duration must be timed from the initiation of lingual movement until the initiation of hyoid and laryngeal rise`,
    task: `The clinician will position a hand under the patient's chin, with fingers spread as per manual palpation method. Use only a light touch. Ask the patient to swallow. Compare time elapsed between the initiation of lingual movement until the initiation of hyoid and laryngeal rise. (Normal time for triggering of the pharyngeal swallow is approximately 1 second)`,
    grades: {
      10: {
        value: 10,
        text: `No abnormality detected on screening, triggers rapidly within 1 second`,
        shortText: "< 1 second",
      },
      8: {
        value: 8,
        text: `Delay greater than 1 second`,
        shortText: "> 1 second",
      },
      6: {
        value: 6,
        text: `Delay greater than 5 seconds`,
        shortText: "> 5 seconds",
      },
      4: {
        value: 4,
        text: `Delay greater than 10 seconds`,
        shortText: "> 10 seconds",
      },
      2: {
        value: 2,
        text: `No movement observed/unable to assess`,
        shortText: "No movement",
      },
    },
  },
  {
    title: `Cough Reflex`,
    description: `Spontaneous cough in response to an irritant`,
    task: `Information about the effectiveness of the patient's reflex cough should be assessed in combination with the physiotherapist or other allied health or nursing staff. Observe any spontaneous coughing during the examination. Cough may be elicited in combination with a respiratory or physical therapist`,
    grades: {
      5: {
        value: 5,
        text: `No abnormality detected on screening, strong reflexive cough`,
        shortText: "Strong reflex",
      },
      3: {
        value: 3,
        text: `Weak reflexive cough`,
        shortText: "Weak reflex",
      },
      1: {
        value: 1,
        text: `None observed/unable to assess`,
        shortText: "None observed",
      },
    },
  },
  {
    title: `Voluntary Cough`,
    description: `Cough response to command`,
    task: `Ask the patient to cough as strongly as possible. Observe strength and clarity of cough`,
    grades: {
      10: {
        value: 10,
        text: `No abnormality detected on screening, strong clear cough`,
        shortText: "Strong/clear",
      },
      8: {
        value: 8,
        text: `Cough attempted but bovine, hoarse in quality`,
        shortText: "Bovine/hoarse",
      },
      5: {
        value: 5,
        text: `Attempt inadequate`,
        shortText: "Inadequate",
      },
      2: {
        value: 2,
        text: `No attempt/unable to assess`,
        shortText: "No attempt",
      },
    },
  },
  {
    title: `Voice`,
    description: `Evaluation of laryngeal functioning with specific emphasis on vocal quality`,
    task: `Ask the patient to prolong an /ah/ sound for as long as possible. Ask the patient to slide up and down a scale. Ask the patient to prolong /s/ and /z/. Observe clarity of production, pitch, phonation breaks, huskiness, uneven progression, uncontrolled volume, and voice deterioration`,
    grades: {
      10: {
        value: 10,
        text: `No abnormality detected on screening`,
        shortText: "Normal",
      },
      8: {
        value: 8,
        text: `Mild impairment, slight huskiness`,
        shortText: "Slight husky",
      },
      6: {
        value: 6,
        text: `Hoarse, difficulty with pitch/volume control`,
        shortText: "Hoarse",
      },
      4: {
        value: 4,
        text: `Wet/gurgling vocal quality`,
        shortText: "Wet/gurgling",
      },
      2: {
        value: 2,
        text: `Aphonic/unable to assess`,
        shortText: "Aphonic",
      },
    },
  },
  {
    title: `Trache`,
    description: `Tracheostomy tube to provide ventilatory support, facilitate aspiration of tracheobronchial secretions, and/or to bypass a respiratory obstruction`,
    task: `Observe the presence of tracheostomy tube; identify reason for insertion. Information may be gathered from pulmonary physician, medical officer, physiotherapist, or nursing staff`,
    grades: {
      10: {
        value: 10,
        text: `No trache required`,
        shortText: "No trache",
      },
      5: {
        value: 5,
        text: `Fenestrated trache in situ or uncuffed`,
        shortText: "Uncuffed",
      },
      1: {
        value: 1,
        text: `Cuffed trache in situ (including those with periods of cuff deflation)`,
        shortText: "Cuffed",
      },
    },
  },
  {
    title: `Pharyngeal Phase`,
    description: `Integrity of pharyngeal function from triggering of swallow until bolus passes through cricopharyngeal sphincter. It is clinically identified by hyolaryngeal movement`,
    task: `Observe hyoid and laryngeal movement using manual palpation method. Note smoothness of excursion and maximal elevation point. Following swallow, ask patient to phonate /ah/ for several seconds. Note vocal quality. Ask patient to pant following swallow then vocalize. Ask patient to turn head to each side and vocalize. Ask patient to lift chin and vocalize`,
    grades: {
      10: {
        value: 10,
        text: `Immediate laryngeal elevation and complete clearance of material`,
        shortText: "Immediate/complete",
      },
      8: {
        value: 8,
        text: `Laryngeal elevation mildly restricted, slow initiation of rise, incomplete clearance of material`,
        shortText: "Mildly restricted",
      },
      5: {
        value: 5,
        text: `Incomplete laryngeal elevation, jerking incoordinated progression, pooling/gurgling on phonation`,
        shortText: "Incomplete/pooling",
      },
      2: {
        value: 2,
        text: `No swallow initiated/unable to assess`,
        shortText: "No swallow",
      },
    },
  },
  {
    title: `Pharyngeal Response`,
    description: `Control of the bolus through the pharyngeal region and management and response to stasis of materials`,
    task: `Observe vocal quality and coughing as a result of swallow. To be completed in association with other assessment tasks`,
    grades: {
      10: {
        value: 10,
        text: `No abnormality detected on screening`,
        shortText: "Normal",
      },
      5: {
        value: 5,
        text: `Coughing before/during/after the swallow has triggered`,
        shortText: "Coughing",
      },
      1: {
        value: 1,
        text: `Not coping, gurgling`,
        shortText: "Not coping",
      },
    },
  },
];

export default assessmentAreas;