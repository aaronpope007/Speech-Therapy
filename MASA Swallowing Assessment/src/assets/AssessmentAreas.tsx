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
];

export default assessmentAreas;
