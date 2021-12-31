import { Answer, Question, QuestionType } from "../types/type";
import { htmlStripper } from "./formatter";
import similarity from "string-similarity";

export const checkAnswer = (e: Answer, q: Question) => {
  //   const compiles: { [e: string]: Answer } = q.metadata.answers.reduce(
  //     (prev, curr) => {
  //       return { ...e, [curr.uuid]: curr };
  //     },
  //     {}
  //   );

  if (q.metadata?.type == QuestionType.Multi_choice) {
    return q.metadata.correctanswer == e.uuid ? 100 : 0;
  } else {
    const correctAnswer = q.metadata?.answers[0];

    const clean = htmlStripper(e.content?.toLowerCase() ?? "");
    const cleanCorrect = htmlStripper(
      correctAnswer?.content?.toLowerCase() ?? ""
    );

    return similarity.compareTwoStrings(clean, cleanCorrect) * 100;
  }
};

export const isCorrect = (e: number) => e > 70;
