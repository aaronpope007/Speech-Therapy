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
        text: ``,
      },
      4: {
        value: 4,
        text: ``,
      },
      3: {
        value: 3,
        text: ``,
      },
      2: {
        value: 2,
        text: ``,
      },
      1: {
        value: 1,
        text: ``,
      },
    },
  },
  {
    title: ``,
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
    },
  },
  {
    title: ``,
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
    },
  },
  {
    title: ``,
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
    },
  },
  {
    title: ``,
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
    },
  },
  {
    title: ``,
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
    },
  },
  {
    title: ``,
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
    },
  },
  {
    title: ``,
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
    },
  },
];

export default assessmentAreas;
