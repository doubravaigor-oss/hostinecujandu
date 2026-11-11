import { expect, it } from "vitest";
import { aktuality } from "@/data/hostinec";

it("další pohárek má termín 21. listopadu 2026 v 18:45", () => {
  const turnaj = aktuality.find((a) => a.nadpis === "Nadějkovský pohárek");
  expect(turnaj?.datum.match(/\d+/g)?.map(Number)).toEqual([21, 11, 2026]);
  expect(turnaj?.text.match(/(\d{1,2}):(\d{2})/)?.slice(1).map(Number)).toEqual([18, 45]);
});