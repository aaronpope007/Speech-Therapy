// Define an array of objects
const assessmentAreas = [
  {
    title: "Alertness",
    description:
      "A general lack of awareness to environment and self, insensitivity to stimuli, difficulty following thought or attention",
    task: `Observe and evaluate patient's response to speech, movement, or pain. May incorporate information from medical or nursing staff`,
    grades: {
      A: { value: 10, text: "Alert" },
      B: { value: 8, text: "Drowsy - fluctuating awareness/alert level" },
      C: { value: 5, text: "Difficult to rouse by speech or movement" },
      D: { value: 2, text: "No response to speech or movement" },
    },
  },
  {
    title: "Cooperation",
    description: `Patient is able to direct his or her attention and interact in activity.`,
    task: `Gain patient's attention and attempt to initiate communication or activity`,
    grades: {
      A: {
        value: 10,
        text: `Cooperative - engages in some form of exchange (verbal/nonverbal).`,
      },
      B: {
        value: 8,
        text: `Fluctuating cooperation - distracted by multiple simultaneous stimuli.`,
      },
      C: { value: 5, text: `Reluctant - unwilling to permit interaction.` },
      D: {
        value: 2,
        text: `Unable to cooperate with interaction or activity.`,
      },
    },
  },
  {
    title: "Third Object",
    description: "Description of the third object",
    task: "asdf",
    grades: {
      A: { value: 10, text: "textA" },
      B: { value: 8, text: "textB" },
      C: { value: 6, text: "textC" },
    },
  },
];

export default assessmentAreas;
