import { describe, expect, it } from "vitest";
import { bodNaTerci, vyhodnotHod } from "@/lib/sipky";

describe("Bodování šipek", () => {
  it("trojitá dvacítka dává 60 bodů a pohárek", () => {
    expect(vyhodnotHod(240, 134)).toEqual({ body: 60, popis: "3 × 20", poharek: true });
  });
  it("přesný střed dává 50 bodů a pohárek", () => {
    expect(vyhodnotHod(240, 240)).toEqual({ body: 50, popis: "BULL · 50", poharek: true });
  });
  it("vnější střed nedává pohárek", () => {
    expect(vyhodnotHod(240, 252)).toEqual({ body: 25, popis: "25", poharek: false });
  });
  it("dvojitá dvacítka a jiný triple nedávají pohárek", () => {
    expect(vyhodnotHod(240, 65)).toEqual({ body: 40, popis: "2 × 20", poharek: false });
    const [x, y] = bodNaTerci(106, 18);
    expect(vyhodnotHod(x, y)).toEqual({ body: 3, popis: "3 × 1", poharek: false });
  });
  it("mimo terč je nula", () => {
    expect(vyhodnotHod(240, 10).body).toBe(0);
  });
  it("všech 20 nakreslených polí odpovídá bodování", () => {
    const body = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
    body.forEach((n, i) => {
      const [x, y] = bodNaTerci(70, i * 18);
      expect(vyhodnotHod(x, y).body).toBe(n);
    });
  });
});