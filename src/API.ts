import { shuffleArray } from "./utils";

export type Question = {
    category: string;
    correct_answer: string;
    difficulty: string;
    question: string;
    type: string;
    incorrect_answers: string[]
}

export type QuestionState = Question & { answers: string[] };

export enum Difficulty{
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}

export const fetchQuizQuestions = async (amount: number, difficulty: Difficulty): Promise<QuestionState[]> => {
    try {
        const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`;
        const response = await new Promise<Response>((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const res = await fetch(endpoint);
                    resolve(res);
                } catch (err) {
                    reject(err);
                }
            }, 1000); // delay of 1 second
        });
        const data = await response.json();
        return data.results.map((question: Question) => ({
            ...question,
            answers: shuffleArray([...question.incorrect_answers, question.correct_answer])
        }));
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch quiz questions.");
    }
};
