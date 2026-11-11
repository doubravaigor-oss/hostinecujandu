import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Stamgast } from "@/components/Stamgast";

const zvuky = vi.hoisted(() => ({ zvukPivo: vi.fn(), zvukPanak: vi.fn(), zvukPlac: vi.fn() }));
vi.mock("@/lib/zvuky", () => zvuky);

afterEach(() => { cleanup(); vi.useRealTimers(); vi.clearAllMocks(); });

describe("Štamgast", () => {
  it.each([
    ["Kup mu pivo", "pivo", 4200, zvuky.zvukPivo],
    ["Kup mu panáka zelený", "zelena", 1800, zvuky.zvukPanak],
  ] as const)("%s spustí reakci, zvuk a návrat", (tlacitko, reakce, trvani, zvuk) => {
    vi.useFakeTimers();
    const { container } = render(<Stamgast />);
    fireEvent.click(screen.getByRole("button", { name: new RegExp(tlacitko) }));
    expect(container.querySelector("[data-reakce]")?.getAttribute("data-reakce")).toBe(reakce);
    expect(zvuk).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /Nech ho na suchu/ })).toBeDisabled();
    act(() => { vi.advanceTimersByTime(trvani); });
    expect(container.querySelector("[data-reakce]")?.getAttribute("data-reakce")).toBe("ceka");
    expect(screen.getByRole("button", { name: /Kup mu pivo/ })).toBeEnabled();
  });

  it("na suchu pláče se zvukem a lze ho znovu pohostit", () => {
    const { container } = render(<Stamgast />);
    fireEvent.click(screen.getByRole("button", { name: /Nech ho na suchu/ }));
    expect(container.querySelector("[data-reakce]")?.getAttribute("data-reakce")).toBe("sucho");
    expect(zvuky.zvukPlac).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: /Kup mu pivo/ }));
    expect(container.querySelector("[data-reakce]")?.getAttribute("data-reakce")).toBe("pivo");
  });
});