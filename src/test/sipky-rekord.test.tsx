import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Sipky } from "@/components/Sipky";

vi.mock("@/lib/zvuky", () => ({ zvukCvak: vi.fn(), zvukZastaveni: vi.fn(), zvukVyhra: vi.fn() }));

afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); localStorage.clear(); });

it("rekord ze tří šipek přežije otevření hry a horší skóre ho nepřepíše", () => {
  vi.useFakeTimers();
  vi.stubGlobal("requestAnimationFrame", () => 1);
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  const prvni = render(<Sipky />);
  for (let i = 0; i < 3; i++) {
    fireEvent.click(screen.getByRole("button", { name: /^Hodit šipku$/ }));
    act(() => { vi.advanceTimersByTime(300); });
  }
  expect(localStorage.getItem("jandu-sipky-rekord")).toBe("60");
  prvni.unmount();
  const dalsi = render(<Sipky />);
  expect(dalsi.container.querySelector(".sipky-skore span:last-of-type b")?.textContent).toBe("60");
  const terc = screen.getByRole("button", { name: "Hodit šipku na terč" });
  vi.spyOn(terc, "getBoundingClientRect").mockReturnValue({ x: 0, y: 0, left: 0, top: 0, right: 480, bottom: 480, width: 480, height: 480, toJSON: () => ({}) });
  for (let i = 0; i < 3; i++) {
    const event = new Event("pointerdown", { bubbles: true });
    Object.assign(event, { pointerType: "touch", clientX: 240, clientY: 10 });
    fireEvent(terc, event);
    fireEvent.click(screen.getByRole("button", { name: /^Hodit šipku$/ }));
    act(() => { vi.advanceTimersByTime(300); });
  }
  expect(dalsi.container.querySelector(".sipky-skore span:first-child b")?.textContent).toBe("0");
  expect(localStorage.getItem("jandu-sipky-rekord")).toBe("60");
});