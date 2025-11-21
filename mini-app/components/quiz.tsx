"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

type Animal = "cat" | "dog" | "fox" | "hamster" | "horse";

interface Option {
  text: string;
  animal: Animal;
}

interface Question {
  question: string;
  options: Option[];
}

const questions: Question[] = [
  {
    question: "What’s your favorite type of food?",
    options: [
      { text: "Fish", animal: "cat" },
      { text: "Bones", animal: "dog" },
      { text: "Berries", animal: "fox" },
      { text: "Seeds", animal: "hamster" },
      { text: "Grass", animal: "horse" },
    ],
  },
  {
    question: "Which activity do you enjoy most?",
    options: [
      { text: "Sleeping", animal: "cat" },
      { text: "Playing fetch", animal: "dog" },
      { text: "Hunting", animal: "fox" },
      { text: "Running in a wheel", animal: "hamster" },
      { text: "Racing", animal: "horse" },
    ],
  },
  {
    question: "What’s your personality like?",
    options: [
      { text: "Independent", animal: "cat" },
      { text: "Friendly", animal: "dog" },
      { text: "Clever", animal: "fox" },
      { text: "Curious", animal: "hamster" },
      { text: "Strong", animal: "horse" },
    ],
  },
  {
    question: "What’s your favorite environment?",
    options: [
      { text: "Indoor", animal: "cat" },
      { text: "Outdoor", animal: "dog" },
      { text: "Forest", animal: "fox" },
      { text: "Cage", animal: "hamster" },
      { text: "Pasture", animal: "horse" },
    ],
  },
  {
    question: "What’s your preferred mode of transport?",
    options: [
      { text: "Climbing", animal: "cat" },
      { text: "Running", animal: "dog" },
      { text: "Sneaking", animal: "fox" },
      { text: "Squeaking", animal: "hamster" },
      { text: "Galloping", animal: "horse" },
    ],
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Quiz() {
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Animal[]>([]);
  const [result, setResult] = useState<Animal | null>(null);

  useEffect(() => {
    const qs = questions.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    setShuffledQuestions(qs);
  }, []);

  const handleAnswer = (animal: Animal) => {
    setAnswers((prev) => [...prev, animal]);
    if (current + 1 === shuffledQuestions.length) {
      const counts: Record<Animal, number> = {
        cat: 0,
        dog: 0,
        fox: 0,
        hamster: 0,
        horse: 0,
      };
      answers.concat(animal).forEach((a) => {
        counts[a] += 1;
      });
      const maxAnimal = Object.entries(counts).reduce((a, b) =>
        b[1] > a[1] ? b : a
      )[0] as Animal;
      setResult(maxAnimal);
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const retake = () => {
    setCurrent(0);
    setAnswers([]);
    setResult(null);
  };

  if (result) {
    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-semibold">
          You are most like a {result}!
        </h2>
        <Image
          src={`/${result}.png`}
          alt={result}
          width={512}
          height={512}
          className="rounded-md"
        />
        <Share text={`I am a ${result}! ${url}`} />
        <Button variant="outline" onClick={retake}>
          Retake Quiz
        </Button>
      </div>
    );
  }

  const q = shuffledQuestions[current];
  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-xl font-medium">{q?.question}</h3>
      <div className="flex flex-col gap-2">
        {q?.options.map((opt) => (
          <Button
            key={opt.text}
            onClick={() => handleAnswer(opt.animal)}
            className="w-full"
          >
            {opt.text}
          </Button>
        ))}
      </div>
    </div>
  );
}
